# Sequential Consistency In Practice

If you a software engineer today concurrency is everywhere.

On the front-end it manifests as asynchronous web requests, the backend as service-to-service communication, and in systems programming as SMP and thread safety.

With the ubiquity of programming with the 4th dimension in mind its valuable to expand on the building blocks.

One of these blocks comes in the form of consistency models: specific rules which govern concurrent access to shared resources. 

With a focus on sequential consistency I'd like to show you have this model is used in practice with distributed systems.

## Sequential Consistency

A conversation with an ex-colleague and friend, centered around the topic, influenced him to write up a nice explanation of sequential consistency. 

You can check out that article [here](http://space.af/blog/2020/07/16/sequential-consistency-described-by-viotti-and-vukolic/), I will expand on it a bit.

In the article referenced above it's explained that in sequential consistency a processor may view writes of other processors in any interleaving, as long as those interleavings remain in the same order. 

In short recap:
```
          Proc-1   Proc-2
           W(x)     W(y)
           W(z)


  Valid:  W(x),W(z),W(y)
          W(y),W(z),W(y)

Invalid:  W(x),W(Y),W(z)
```

The invalid interleaving is such due to Proc-1's writes happening out of program order.

## Expanding On Sequential Consistency

While the provided definition of sequential consistency is easy to follow for two processors it gets a bit more interesting when we model a distributed system.

In our distributed system two proceses will be issuing writes to a shared register and two other processes will be observing those writes and then issuing a read.

Each process is to obey sequential consistency. 

```
          Proc-1      Proc-2
           W(x)        W(y)
           W(z)


 Proc-3 Observes: W(x),W(z),W(y), R() => y

 Proc-4 Observes: W(y),W(x),W(z), R() => z
```

Here we notice that Proc-3 and Proc-4 do not agree on the shared register's value, yet this is legal in sequentially consistency.

As you can imagine, in practice this is not the desired behavior.

## Sequential Consistency In Practice

In order for sequential consistency to be useful in a distributed system another mechanism must be provided to ensure all processes see the **same** interleaving of operations.

A slide from Martin Kleppmann's great [talk](https://www.youtube.com/watch?v=D5iCl12MuRw&feature=youtu.be) provides one such mechanism.

![async writes in sequential system](/martin-klepmann-sequential-consistency.png)

This slide shows that all writes are feed through a "transaction processor" to create one consistent interleaving of sequential operations.

Due to network delay each processor may "lag" behind, seeing older or newer writes then the others. 

However each processor will **always** observe a totally ordered sequential list of operations.

Therefore per the consistency model:
* the second processor may read the N-1 write until the network delivers write N.
* no processor who has received write N will read write N-1.
* every process will observe a sequentially consistent total ordered history of operations.


## In Conclusion

In the practice of designing distributed systems sequential consistency requires some mechanism to obtain a consistent read of a shared register across processes.

When "sequential consistency" is mentioned in regards to a distributed system what is usually being expressed is the ability for processors to "lag" behind observing changes, but eventually seeing all changes in a well defined total order.

A secondary mechanism, whether a dedicated process, vector clocks, fence id, must be present to enforce each process sees a totally ordered sequence of events.
