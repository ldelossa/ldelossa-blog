# A Minimal Home Network Pt 2

In [Part 1](/blog/home-network-pt1) of this series I explain the desire to create a minimal home network running on containers, the stack being used to accomplish this, and how name resolution will work.

This post will cover how services running as containers are routed.

## Application Routing

While it's possible to port-forward every application container running on "ct-host" an issue exists with this approach. 
DNS alone is not capable of routing hostnames to particular ports.
In other words asking DNS to “map x.ldelossa.net => 192.168.1.100:8080” is not possible.

An application routing mechanism is required for this.

```
         +-----------------------------------------------------------------------+
         |container network                                                      |
         |  10.89.0.0/24                                                         |
         |                                                    +------------+     |
         |                               +--------------------> Prometheus |     |
         |                               |                    +------------+     |
         |                               |                         :80           |
         |                               |                          ^            |
         |                               |                          |            |
         |                           +---+-----+                    |            |
         |   +-----------+           |         |              +-----+------+     |
         +---+  CoreDNS  <-----------+ CT-Host +--------------> App Router +-----+
             +-----------+           |         |              +------------+
           192.168.185.10:53         +---------+             192.168.185.10:80
                   ^                                                ^
                   |                                                |
                   |                                                |
                   |                +-----------+                   |
                   |                |           |                   |
                   +----------------+Workstation+-------------------+
                DNS Query           |           |              Route Mapping
prom.ldelossa.net => 192.168.185.10 +-----------+   prom.ldelossa.net => prometheus:80
```
In the following diagram:

* A workstation makes a request for "prom.ldelossa.net"
* Our CoreDNS container answers the request with the ip address of "ct-host"
* Our app router is listening on port 80 and 443, the default ports a web browser will use when connecting to a web address.
* When the app router receives the request for the hostname "prom.ldelossa.net" it will forward this to the prometheus container running inside the container network.
* The request will be routed back through the app router and returned to the Workstation.

The app router will also provide a redirection mechanism allowing hostnames to be mapped to forwarded ports on "ct-host".

## Traefik

Traefik will be the application routing mechanism.

Personally, I don't have any experience running Traefik in production and this post isn't necessarily a plug for the application.

However, it uses a modern configuration syntax, provides path routing and redirecting, has a pretty good UI, and comprehendable documentation.

Traefik being written in Go is an added benefit as playing with Go projects help me design my own in the long run.

### Configuration

It won't do much good echoing the already great documentation at [Traefik's](https://docs.containo.us/) site.
If you are interested in using Traefik check out their documentation.

The following shows this lab's configuration.

static configuration:
```toml
[api]
  insecure = true
  dashboard = true
  debug = true

[entryPoints]
  [entryPoints.web]
    address = ":80"

[providers]
  [providers.file]
    filename = "/etc/traefik/dyn.toml"
    watch = true
```

dynamic configuration:
```toml
[http]
  [http.routers]
    [http.routers.prom]
      rule = "Host(`prom.ldelossa.net`)"
      service = "prom"

    [http.routers.ct-host]
      rule = "Host(`ct-host.ldelossa.net`)"
      middlewares = ["netdata-redirect"]
      service = "dummy"

    [http.routers.traefik]
      rule = "Host(`traefik.ldelossa.net`)"
      middlewares = ["traefik-redirect"]
      service = "dummy"

  [http.middleware]
    [http.middlewares.netdata-redirect.redirectRegex]
      regex = "^http://ct-host.ldelossa.net(.*)"
      replacement = "http://ct-host.ldelossa.net:19999"

    [http.middlewares.traefik-redirect.redirectRegex]
      regex = "^http://traefik.ldelossa.net(.*)"
      replacement = "http://traefik.ldelossa.net:8080"

  [http.services]
    [http.services.dummy.loadBalancer]
    [http.services.prom.loadBalancer]
      [[http.services.prom.loadBalancer.servers]]
        url = "http://prom:9090"
```

Traefik is split into two configs: static and dynamic.

The static configuration sets up a listening socket on port :80 and this port is exposed on "ct-host".
The dynamic configuration that Traefik will watch during runtime is defined as well.

Dynamic configuration defines our routers, middleware, and services.
Hostname routing rules are defined mapping "prom.ldelossa.net" to the "service" prom.
A "service" will forward traffic to the specified address, in this case the prometheus container.

Middleware features are used to redirect requests for "ct-host.ldelossa.net" and "traefik.ldelossa.net" to ports forwarded on "ct-host".
A dummy "service" is created for the redirection as no traffic will be forwarded.

## Deployment

The Traefik container is deployed in a container using Podman and is managed via Systemd in the same fashion explained in part 1 of this series.

```console
$ podman run -dt --network ct-host --name traefik -p 192.168.185.10:8080:8080 -p 192.168.185.10:80:80 -v /etc/containers/etc.d/traefik:/etc/traefik traefik:latest
```

Make note that pots 8080 and 80 are exposed on "ct-host" directly, allowing devices on the local lan to access.
The configuration files are also mapped from the host allowing for easy maintenance from "ct-host".

## Conclusion

By introducing appliation routing into the lab several goals are achieved.
* Containers do not need to expose ports on the local lan to be accessed.
* Containers can be accessed by a hostname.
* Hostnames can be redirected to containers exposed directly on "ct-host".

