# A Minimal Home Network Pt 2

In [Part 1](/blog/94297015-acc4-4089-b438-eeb566ce9c17) of this series I explain the desire to create a minimal home network running on containers, the stack being used to accomplish this, and how name resolution will work.

This post will cover how services running as containers are routed.

## Application Routing

While it's possible to port-forward every application container running on "ct-host" we run into an issue DNS alone is not capable of routing host-names to particular ports.
We cannot say in DNS “map x.ldelossa.net => 192.168.1.100:8080”.

We need a mechanism to forward host-names to ports.

A diagram will express what I'm going for.

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

* A workstation makes a request for "prom.ldelossa.net"
* Our CoreDNS container answers the request with the ip address of "ct-host"
* Our app router is listening on port 80 and 443, the default ports a web browser will use when connecting to a web address.
* When the app router receives the request for the hostname "prom.ldelossa.net" it will forward this to the prometheus container running inside the container network.
* The request will be routed back through the app router and returned to the Workstation.

The app router will also provide us with a redirection mechanism.
This comes in handy when we want to route traffic to the app router, but instead of routing the traffic to a container in the virtual container network, it will redirect the request to a port exported on the local lan network.

## Traefik

I've chosen to use Traefik as the application routing.

Personally, I don't have any experience running Traefik in production and this post isn't necessarily a plug for the application.

However, I choose it because it uses a modern configuration syntax, provides the routing feature set I wanted, has a pretty good UI, and comprehendable documentation.

I also enjoy giving projects written in Go a try as it helps me design my own in the long run.

### Configuration

I won't echo the architecture of Traefik because their documentation is great.
If you are interested in using it checkout their site.

Instead, I will share my Traefik config and explain the functionality it provides to the home lab.

Traefik is split into two configs: static and dynamic.

The dynamic config is watched by Traefik for changes during runtime allowing you to edit the files and have those changes take effect soon after.

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

The static configuration sets up a listening socket on port :80 and this port is port-forwarded on "ct-host" making it available to the network.
It also defines the dynamic configuration for Traefik to watch.

The dynamic configuration defines our routers, middleware, and services.
We define host-name routing rules mapping "prom.ldelossa.net" to the "service" prom.
We define a "service" which will forward traffic to the prom container inside the container network.

We also use the middleware features to redirect requests for "ct-host.ldelossa.net" and "traefik.ldelossa.net" to a monitoring solution and the traefik UI respectively.
Both services being redirected have their ports forwarded on "ct-host" making them directly available on the local lan network.

## Deployment

The Traefik container is deployed in a container using podman and is managed via systemd in the same fashion explained in part 1 of this series.

```console
$ podman run -dt --network ct-host --name traefik -p 192.168.185.10:8080:8080 -p 192.168.185.10:80:80 -v /etc/containers/etc.d/traefik:/etc/traefik traefik:latest
```

Make note that we forward the ports 8080 (web-ui) and 80 (application routing entry point) onto "ct-host" exposing it to the local lan network.

We also map the configuration files directly from the host.
This allows us to easily edit those files on the host machine and the changes to take effect soon after within the container.

## Conclusion

By introducing application routing into the home lab we created an easy way to map host-names to services running as containers and redirect hostnames to forwarded ports on "ct-host".

We solved the issue where DNS could not provide this port mapping by deploying Traefik.
