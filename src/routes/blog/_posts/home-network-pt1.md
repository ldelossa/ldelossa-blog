# A Minimal Home Network Pt 1

*Checkout [Part 2](/blog/home-network-pt2) For Application Routing*

It's common to set up a network, a few virtual hosts, and fundamental network services at home as a way to learn how these technologies interact.

While moving apartments in Brooklyn I discovered a Thinkpad laptop just collecting dust.
The laptop had good specs and a 1TB ssd.
I wanted to put this bad boy to use.

Soon the idea of creating a modern lab based on containers, free of noisy and expensive equipment, took hold.

This post introduces network topology, components which make up the network, and how name resolution is achieved.

## The Stack

* Podman - a daemonless container runtime that works well with SystemD
* CoreDNS - a DNS server that uses a ton of plugins to implement name resolution.
* NetData - a C monitoring daemon which scraps /proc for every metric you can think of.
* Traefik - a service routing solution which supports path routing, redirects, and load balancing.
* Fedora32 - good ol' fedora linux as a host operating system (shameless plug).

Above is the software stack used in the lab.

## The Network

A typical home network consists of a modem, a router with a built in switch and WiFi, and devices which connect to a local LAN.
This lab will introduce an additional host for creating and exposing containers.

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
The network will look like this.

CT-HOST is a Fedora32 laptop running Podman and will manage container lifecycles.
The host resides on two networks: LAN (192.168.185.0/24) where devices communicate and CONTAINER-LAN (10.89.0.0/24) where containers communicate.
The CONTAINER-LAN is virtual and created by the linux kernel.

Containers may be exposed on "ct-host" to devices on LAN by port-forwarding the container's port onto the hosts.
Not every container needs to have their ports forwarded but to achieve name resolution this is required.

## Name Resolution

Name resolution provides mapping from a hostname to a service.
This is encountered every time "www.google.com" is typed into a browser.
The name "www.google.com" is resolved to an IP address where web servers provide this service.
This lab creates the `ldelossa.net` local domain.

Personally, I don't want to write RFC 1035 zone files, host ancient bind servers, or deal with cryptic configs.
There is a certain beauty in the syntax of a hosts file.
A simple text file which maps a hostname to an IP address suits my needs well.
The answer was found in [CoreDNS](https://coredns.io/) and its [hosts](https://coredns.io/plugins/hosts/) plugin.

On top of a terse syntax the "hosts" plugin provides dynamic reloading.
Changes to the file holding your hostname mappings will reload the server, the changes taking effect soon after.

### Podman
Podman is the container runtime used in this lab.

Podman and Systemd play along nicely.
Systemd services can be generated directly from Podman.
These service files can be used to start the container on boot, restart it on failure, create dependencies between containers, or other facilities Systemd offers.

### CoreDNS Container

configuration:
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

CoreDNS with the host plugin uses two configuration files: "Corefile" and "hosts" file.

The "Corefile" configures Coredns to forward requests not destined for `ldelossa.net` to Google's DNS and cache the results for a bit.
Any requests for `ldelossa.net` are forwarded to the "hosts" plugin, using the file `/etc/coredns/hosts`.

The "hosts" defines hostname mappings.
For each entry in this file Coredns will return an A record mapping the hostname to the IP address.

```console
$ podman create --network ct-host --name coredns -dt -p 192.168.185.10:53:53/tcp -p 192.168.185.10:53:53/udp -v /etc/containers/etc.d/coredns:/etc/coredns coredns/coredns -conf /etc/coredns/Corefile
```
Above shows the podman command used to create the container.

A few things to note
* Port 53(udp/tcp) is exposed to other devices on LAN via port-forwarding
* Configuration files are mapped from `/etc/containers/etc.d/coredns` to `/etc/coredns` inside the container.
* Editing the "hosts" file on "ct-host" will reload Coredns without having to restart the container.

```console
$ podman generate systemd --name coredns > /etc/systemd/system/coredns-container.service
$ systemctl daemon-reload
$ systemctl enable coredns-container
$ systemctl start coredns-container
```
A SystemD service can be generated and enabled with the commands above.

### Configuring Devices

A typical approach to configuring devices to utilize a custom DNS server would be DHCP.
Unfortunately my router does not allow the configuration of DHCP (poo-poo to you ampliFi).
However, devices can "opt-in" by setting their DNS server to `192.168.185.10:53`.

As new services come onto the network simply editing `/etc/containers/etc.d/coredns/hosts` on "ct-host" will provide immediate resolution for devices configured with this DNS.

## Conclusion

Home labs are a great way to learn new technologies.
By utilizing Podman and CoreDNS a solution for name resolution was devised.
Mapping configuration files from the host into containers provides a fast and dynamic way to update DNS in the lab.

In [Part 2](/blog/home-network-pt2) a mechanism for routing hostnames to specific containerized services is introduced.
