# Linux Foundation's LFD420 Review

The low level details of operating systems are fascinating but often hard to acquire.
Books on the topic usually cover only user space systems programming leaving out kernel native development all together.
When material is discovered on the topic it's often out of date as the kernel moves quickly in development.

Seeking a deeper understanding I asked my current employer Red Hat if they would assist.
Generously they agreed to enroll me in the Linux Foundation's Linux Kernel Internals and Development (LFD420) course.

I want to provide the community with an honest review of this course so others can determine if it's right for them.

## My Background

Before jumping into the course details I'd like to share my background.

At the start of my career I worked in performance, systems, and network engineering.
In these positions I wrote little code but I worked on low level system details.
It was not rare for my teams to be tuning kernel parameters, adjusting virtual host numa localities, squeezing performance out of routing infrastructure, and so on.

Over the years my interest has evolved further into software development but the affinity for systems has not lessened.
As of today I am a full time software engineer.

I do not write production C code but know enough to get by.

## The Course

The course is closed source and proprietary.
For this reason I will provide overviews and not specifics.
The course outline can be seen here:
https://training.linuxfoundation.org/training/linux-kernel-internals-and-development/

## Attendance

Attendance is via teleconference.
A physical copy of the course material is mailed to you before the course begins.
This material is identical to the slides the instructor will use during the course.
Zoom was used, which I am not a fan of, but luckily the browser functionalities worked fine and a desktop client was not required.

## Workstation Setup

It is your choice whether you'd like to use a VM the foundation provides, your own native machine, a cloud machine, or a VM you provide on your own.
There is no requirement on the distribution used.
A script is provided to you to ensure the correct packages are installed on your machine to complete the course.
Oddly, the package list it installed was pretty large and I'm confident most of it is unnecessary.

I started the course on a bare metal laptop running Fedora 32.
While working through labs I found my kernel becoming tainted (from loading out of tree modules), permanent run-time leaks from forgetting k-free, and crashing kernel modules quite regularly.

After the first day I decided a VM is definitely the way to go for this course.
I suggest anyone enrolled in the course to work on a virtual machine and one you do not mind throwing away at the end of the course.
I'll go over my VM setup a little later in this post.

## Structure

Each day covers about 3-5 chapters.
The instructor will walk you through the material in each chapter.
My instructor was very receptive to questions, which I made sure to ask a ton.
It was not unordinary for me to ask a question, not quite understand the answer, and begin a whiteboard session to clarify.

When reaching the end of chapter labs are presented.
It is your choice whether to attempt the labs without guidance, look at the examples just for reference, or simply compile the examples and review the written code to understand how it works.

I typically found myself starting a lab with no reference but opening the reference code to see which libraries should be included.
The labs, in my opinion, were well thought out and focused on the chapter's concepts.
Each lab allowed you to go about them in your own way, deciding whether to compile-time or run-time allocate dependencies, use a mutex or a spin lock, etc...
I did not feel rushed during the labs and we generally had enough time to complete each one.

I did have difficulty finding which libraries macros and functions were defined in when referenced in examples.
We were introduced to several kernel cross referencing tools in later chapters which made this easier in the long run.

## Material

I won't go too specific into the material of the course for reasons mentioned earlier.

What can be said however is the material is up-to-date and is a rare corpus of real world examples of native kernel development.
Techniques for writing syscalls without having to re-compile the kernel each time were examples of modern and practical knowledge presented to you.

You will write kernel modules, compile your own kernel, work closely with critical data structures in the kernel, understand low level cpu details such as disabling and enable interupts, and write memory allocation procedures all from kernel space.

## Worth It?

For me, the course was completely worth it for one reason alone, the ability to *ask questions*.
I've read a lot of material on the kernel, hacked up a lot of toy syscalls and kernel modules, but there is no equivalent to simply being able to present a question to an expert and having it clarified.
Often we simply have the wrong mental model about a topic or concept and a whiteboard explanation is invaluable.

That being said, it becomes apparent that this course is *only* worth it if you *have* questions to ask.
For this reason the course being labeled as “intermediate” is correct in my opinion.

If you have not dabbled in at least a few of the topics in the course material, stirring up your own questions, you may feel this course is just a regurgitation of the written material.
In order to get the most of this class you must know what you want from it, formulate questions ahead of time, don't be shy, and ask your instructor to whiteboard.

My prior work in systems along with my current work software left me with a wealth of unresolved conceptions on the topic.
I can honestly say a lot of these questions were resolved by this course.

## Tips

A few tips for the course if you decide to enroll.

Use a VM.
You will be potentially crashing your machine, tainting the kernel, causing leaks and deadlocks in kernel space.
You probably don't want to do this all on your work or personal laptop.

Download and compile the linux mainline kernel before the course begins.
If you know how to compile a kernel already, do so and use ccache initially.
Ccache will cache your object files making rebuilds much quicker allowing for more time for labs.
I used these instructions: http://nickdesaulniers.github.io/blog/2018/06/02/speeding-up-linux-kernel-builds-with-ccache/

Personally, I used sshfs to mount my VM's filesystem into my host's.
This allowed me to use my Vim setup which has ctags, fzf searching, man lookup, etc... on my host machine while editing code on the VM.
I would have two terminal windows open, one on my host editing code, and another with a ssh session in the VM.
The ssh session in the VM is where I would compile the code.
SSHFS is probably available in your distro's package manager and even available for MacOS as a FUSE.
