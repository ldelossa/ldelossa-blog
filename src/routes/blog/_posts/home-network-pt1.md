# A Minimal Home Network Pt 1

*Checkout [Part 2](/blog/33ccf895-d158-43c6-ba1e-5f45596db9ad) For Application Routing*

When I first started my career I would create pretty large "lab" environments at home.
I used to work in systems/network engineering where setting up a network, a few virtual hosts, and fundamental network services like DNS was a valuable way to learn.

While moving apartments in Brooklyn I found a thinkpad that was just collecting dust.
The box has decent specs and a 1TB ssd.
I wanted to put this bad boy to use.

I decided to create another "lab" but with some modern touches and one that didn't rack up my electricity bill.
I also wanted to do it all with containers.

## The Stack
I'll give you a quick rundown of the tech stack we will use to set up this home network.

* Podman - a daemonless container runtime that works well with SystemD
* CoreDNS - a DNS server that uses a ton of plugins to implement name resolution.
* NetData - a C monitoring daemon which scraps /proc for every metric you can think of.
* Traefik - a service routing solution which supports path routing, redirects, and load balancing.
* Fedora32 - good ol' fedora linux as a host operating system (shameless plug).

We'll talk about these in each section.

## The Network

I have a typical home network.

A modem, a router with a built in switch and WiFi, and this laptop we will call "ct-host", short for container host.
The plan is to host services on "ct-host" in containers and access them via hostnames.
We will get to the hostnames in a bit.

The network will look like this:

```console
+----------+  +--------+
|  Laptop  |  | Iphone |
+-----+----+  +---+----+
      |           |
      |           |
      |           |
      |           |
+-----+-----------+----+                    +------------------------------+
|                      |                    |                              |
| LAN 192.168.185.0/24 |                    |  CONTAINER-LAN 10.89.0.0/24  |
|                      |                    |                              |
+---------+------------+                    +-------+----------------------+
          |                                         |
          |                                         |
          | port forward +-----------+              |
          +--------------+ CONTAINER +--------------+
          |              +-----^-----+              |
          |                    | podman run         |
          |              +-----+-----+              |
          |              |           |              |
          +--------------+  CT-HOST  +--------------+
                         |           |
                         +-----------+
```

Let's dissect this a bit.

CT-Host lives on two networks, the LAN where all our normal devices live, and an internal or "virtual" network created by the linux kernel to forward traffic between containers.
We are able to port-forward containers onto the local LAN if we want to, exposing the application within the container to all our other devices on the local lan.
We don't need to do this for everything of course as some containers may only need to talk to other containers.

## Name Resolution

I've had too many jobs where you'd have to open a giant ass spread sheet to find the IP addresses of services on the network.
That sucked and even for a lab we can do better.

I want to create the `ldelossa.net` local domain.

A problem tho... I'm also lazy.
I don't want to write RFC 1035 zone files, host ancient bind servers, or deal with cryptic configs.
To me, there is beauty in the syntax of a hosts file.
A simple text file which maps a hostname to an ip address suits my needs well.

This led me to find CoreDNS and its `hosts` plugin.
https://coredns.io/plugins/hosts/

An extra-nice feature is the plugin picks up on changes to the hosts file, meaning you can hack on the file in place, and your dns server will automatically serve the new A records.

So let me run through how I went about setting this up.

### Podman Container
I'm using podman to host containers.

One nice thing is Podman and SystemD play along nicely. You can set up a container, use podman cli to generate a SystemD service unit file, and run your containers just like systemd services. Allowing for automatic start on boot, restarts on failure, and start/stop dependencies on other containers or services.

Because I want to take advantage of the "hot-reload" that CoreDNS "hosts" plugin provides, I decided to place my CoreDNS configuration files on "ct-host" and mount them into the container.I created the directory `/etc/containers/etc.d/coredns` and wrote out following two files:

```console
$ cat Corefile
.:53 {
  cache 10
  forward . 8.8.8.8 9.9.9.9
  log
  errors
}

ldelossa.net {
  cache 10
  hosts /etc/coredns/hosts {
  }
}
$ cat hosts
192.168.185.10 traefik.ldelossa.net
192.168.185.10 ct-host.ldelossa.net
192.168.185.10 prom.ldelossa.net
```

The first file `Corefile` does two things.
First it forwards any DNS requests *not* for `ldelossa.net` to google's dns servers and caches the results for 10 seconds.
Second it configures the "hosts" plugin to load and "watch" the file `/etc/coredns/hosts` for changes.

The second file `hosts` defines the A records the CoreDNS server will return when queried for the mapped hostname.
Right now they are all the same, they all point to "ct-host" which has a static ip of `192.168.185.10`.
More on this later.

Now I'll show you exactly how we create and run the CoreDNS server.

```console
$ podman run --network ct-host --name coredns -dt -p 192.168.185.10:53:53/tcp -p 192.168.185.10:53:53/udp -v /etc/containers/etc.d/coredns:/etc/coredns coredns/coredns -conf /etc/coredns/Corefile
```

What this command is doing is creating a container that runs CoreDNS, mapping the internal port 53 (both udp and tcp) to the local-lan port 53, and mounting our configuration files into the container.

Once you have this up and working, you can stop the container, and generate a SystemD service and enable it on boot:

```console
$ podman generate systemd --name coredns > /etc/systemd/system/coredns-container.service
$ systemctl daemon-reload
$ systemctl enable coredns-container
```

### Configuring Devices

You will notice no mention of DHCP in this post.
Unfortunately I have a router which does not allow me to set my own DHCP server (poo-poo to you ampliFi).
That's fine tho as my devices can just "opt-in" and set their DNS server to `192.168.185.10:53`.

After doing this my devices can perform hostname resolution for any mappings found in the `hosts` file mentioned above.
As new services come onto the network we can simply edit `/etc/containers/etc.d/coredns/hosts`, adding any mappings we'd like, and CoreDNS will serve the new A records.

## Conclusion

This is part 1 where I introduce you to the lab idea and set up basic hostname resolution.

In [Part 2](/blog/33ccf895-d158-43c6-ba1e-5f45596db9ad) we will set up Traefik to redirect and route specific hostnames to containers running on "ct-host", allowing us to only port-forward critical services to the local network.
