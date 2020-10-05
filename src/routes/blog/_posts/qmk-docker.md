# Flashing QMK Firmware With The Help Of Docker

DIY keyboard enthusiasts enjoy soldering switches, compiling firmware, and flashing their own keyboards. 
[QMK](https://beta.docs.qmk.fm) provides open-source firmware and tooling to make this process transparent and easy.

While working on my own keyboard project I ran into a road block. 
Fedora 32 is my operating system of choice and ships with GCC 10 by default.

QMK requires AVR-GCC and GCC verion 8 to successfully flash a keyboard. 
By default the Fedora RPM repos do not provide a down-grade path and you'd probably not want to do this anyway.

Instead we can use a Docker container with the correct dependencies as our build environment.

## GCC 8 Container

GCC containers are published on [Docker Hub](https://hub.docker.com/_/gcc). 
Looking over the tags reveal a `gcc:8` tag suitable for our build environment.

## Dockerfile

The base `gcc:8` container will need additional dependencies and setup.

The following Dockerfile demonstrates what is necessary.

```shell
FROM gcc:8

RUN apt-get update && export PATH=$PATH:/root/.local/bin
RUN apt install -y gcc-arm-none-eabi gcc-avr avrdude dfu-programmer dfu-util

RUN curl https://bootstrap.pypa.io/get-pip.py -o /tmp/get-pip.py && python3 /tmp/get-pip.py
RUN python3 -m pip install qmk
RUN qmk setup -y

ENTRYPOINT /bin/bash
```

We can build this container with the following command:
```shell
$ docker build -t qmk:latest .
```
The above command should be ran while your shell is in the same directory of the Dockerfile.

## Running The Container

The plan is to build the firmware in our container, where the necessary dependencies exist, get the hex file on our workstation, and flash the usb keyboard outside of the container.

In order to do this we must mount a directory from our workstation into the QMK container. 

```shell
$ mkdir ~/qmk-mnt
$ docker run -it -v /home/ldelossa/qmk-mnt:/mnt quay.io/ldelossa/qmk:latest
```

The above command creates a qmk-mnt folder in my home directory and bind mounts this into the container at /mnt.
Any files moved or copied to /mnt in the container will be accessable at ~/qmk-mnt on the host workstation.

## Building Your Firmware

Once inside the container we can build the firwmare and copy it to /mnt. 

I personally have an OLKB Preonic keyboard and will use the default keymap as an example.

Inside the container run the following command:

```
qmk compile -kb preonic/rev1 -km default
```

The above command compiles the default keymap and writes the resulting elf and hex binaries to:
```
./root/qmk_firmware/.build/
```

For the preonic keyboard I am using we want to copy the ".hex" file to /mnt inside the container.
This will make it accessable from ~/qmk-mnt on the host workstation.

```shell
$ cp /root/qmk_firmware/.build/preonic_rev1_default.hex /mnt/
```

## Flashing The Keyboard

Now that the firmware exists on the host workstation its possible to flash our keyboard.

The preonic keyboard will need "dfu-programmer" to write the hex file to the keyboard's micro-controller.
Luckily this package is readily available on both Fedora and Ubuntu along with other distributions.

With the keyboard plugged into the host and placed in "flash" mode the following commands are issued:

```shell
$ sudo dfu-programmer atmega32u4 erase
$ sudo dfu-programmer atmega32u4 flash ~/qmk-mnt/preonic_rev1_default.hex
$ sudo dfu-programmer atmega32u4 reset
```
The commands erase the current firmware, flash the new one, and restarts the keyboard.

## Building A Keymap

From here you can use the QMK container to build your own keymaps. 

By copying the default keymaps to the /mnt folder inside the container its possible to edit the file on the host. 
Once edited simply copy it back to the original keymap folder and use QMK to compile it to a ".hex" file. 

For full details check out the [getting started tutorial](https://beta.docs.qmk.fm/tutorial). 
Moving the examples here into the demonstrated container workflow should be straight forward.

## Saving Your Container

It is possible to "commit" the build environment if any changes are made to QMK's configuration.

To do this you can perform a Docker commit command:

```shell
$ docker commit stoic_nash qmk:custom-config

```
The command above will create a new container called `qmk:custom-config` based on the currently running container `stoic-nash`, a random name picked by Docker for our qmk container.

## Conclusion

With this short guide we make it possible to build QMK firmware in a self-contained environment.
We remove any need to install or downgrade versions of GCC and other dependencies on your host machine. 
