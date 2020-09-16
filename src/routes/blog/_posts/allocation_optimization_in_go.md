# Optimizing PGX Allocations in Golang with Pprof.

Performance tuning is one of those programming rituals that gets oddly addicting. 
Seems like humans have a fundamental impulse to make a graph plot in their desired direction. 
This can be seen in a wide assortment of fields.
Day traders watch metrics focused on their net earnings, nutritionists keep their calorie counts logged, and programmers focusing on performance obsess over memory allocations.

After spending sometime obessing myself I found myself making large allocation improvements with some tricks in the popular [PGX](https://github.com/jackc/pgx) library.

I'd like to shout out *Kale Blanekship* and *Eric Chlebek* from the performance channel in #gophers slack. They provided the clues used in this post.

## The code

The code that's being profiled is a new distributed lock implementation for [ClairCore](https://github.com/quay/claircore/). 
Postgres is the only required infrastructure for ClairCore by design.
While it's not the best mechanim for a distributed lock [advisory locks](https://www.postgresql.org/docs/9.1/explicit-locking.html) can be utilized to get *mostly* there.

You can view the distlock implementation [here](https://github.com/ldelossa/distlock)

## Reducing channel allocations

Our distlock implementation utilizes the request/response channel-of-channel pattern.
A request object with a response channel is pushed onto a request channel. 
When the receiver gets the request it writes to the response channel, unblocking any client listening.

This pattern is useful but will also alloc a lot of channels resulting in bloating the heap.

To demonstrate this a benchmark will be taken that profiles lock acquisition and lock return. 

```shell
$ go test -benchtime "1m"  -run xxx -bench . -memprofile memprofile.out -cpuprofile cpuprofile.out
```
The command above runs a 1 minute benchmark profiling both memory and cpu.

Next lets start an interactive pprof session over the memory profile and drill into the function where the channel allocations are occuring.

```shell
$ go tool pprof distlock.test memprofile.out

(pprof) list \.Lock
Total: 194.36MB
ROUTINE ======================== github.com/ldelossa/distlock.(*Manager).Lock in /home/louis/git/go/distlock/manager.go
      20MB       20MB (flat, cum) 10.29% of Total
         .          .     78:	}
         .          .     79:
         .          .     80:	req := request{
         .          .     81:		t:        Lock,
         .          .     82:		key:      key,
   13.50MB    13.50MB     83:		respChan: make(chan response),
         .          .     84:	}
         .          .     85:
         .          .     86:	// guaranteed to return
         .          .     87:	resp := m.g.request(req)
         .          .     88:
         .          .     89:	if !resp.ok {
         .          .     90:		return resp.ctx, func() {}
         .          .     91:	}
         .          .     92:
         .          .     93:	m.propagateCancel(ctx, resp.ctx, key)
         .          .     94:
    6.50MB     6.50MB     95:	return resp.ctx, func() {
         .          .     96:		m.unlock(key)
         .          .     97:	}
         .          .     98:}
         .          .     99:
         .          .    100:func (m *Manager) propagateCancel(parent context.Context, child context.Context, key string) {
```

Above illustrates 13.50MB of heap memory is spent on allocating request objects and their response channels. 

We can introduce an object pool to promote the reuse of these channels. 

```go
type reqPool struct {
	c chan request
}

func NewReqPool(seed int) *reqPool {
	c := make(chan request, seed*2)
	for i := 0; i < seed; i++ {
		r := request{respChan: make(chan response)}
		select {
		case c <- r:
		default:

		}
	}
	return &reqPool{c}
}

func (p *reqPool) Get() request {
	select {
	case r := <-p.c:
		return r
	default:
		return request{respChan: make(chan response)}
	}
}

func (p *reqPool) Put(r request) {
	select {
	case <-r.respChan:
	default:
	}
	r.key = ""
	r.t = Invalid
	select {
	case p.c <- r:
	}
}
```

The above illustrates a simple channel implemented pool.
The first implementation was a sync.Pool.
After further profiling however implementing our own proved to be easier on the heap.

After plumbing the requst pool into the rest of the code pprof reports a much nicer result.

```
(pprof) list \.Lock
Total: 80.06MB
ROUTINE ======================== github.com/ldelossa/distlock.(*Manager).Lock in /home/louis/git/go/distlock/manager.go
       1MB        1MB (flat, cum)  1.25% of Total
         .          .     89:		return resp.ctx, func() {}
         .          .     90:	}
         .          .     91:
         .          .     92:	m.propagateCancel(ctx, resp.ctx, key)
         .          .     93:
       1MB        1MB     94:	return resp.ctx, func() {
         .          .     95:		m.unlock(key)
         .          .     96:	}
         .          .     97:}
         .          .     98:
         .          .     99:func (m *Manager) propagateCancel(parent context.Context, child context.Context, key string) {

```

## A PGX Trick

Removing the cost of the response-request model was a good win but there is still more to tune.

Lets generate a graph of our call stack and associated allocations.
```
❯ go tool pprof -svg distlock.test memprofile.out
```

![photo of high PGX allocations](/profile001.png)

The above diagram is showing a large amount of allocations in PGX's getRows method. 
Its not rare for methods dealing with serialization to and from the database to allocate heavily.
But it would be nice if we could eliminate this.

Getting a session pg advisory lock typically looks like this.
```
SELECT pg_try_advisory_lock($1);
SELECT pg_advisory_unlock($1);
```

Both lock functions return a table expression resulting in a true or a false. 

An optimization we can make is changing these queries to only return a row if the lock function returns true.
Our application logic can then simply check whether any rows are returned and not read the contents. 

First lets fix our queries.
```
SELECT lock FROM pg_try_advisory_lock($1) lock WHERE lock = true;
SELECT lock FROM pg_advisory_unlock($1) lock WHERE lock = true;
```

A slight modification allows us to only return rows if the lock function returns true.

The next step is to short circuit the PGX library from reading the rows. 
This took a bit of library spelunking but I eventually discovered this...

```go
rr := m.conn.PgConn().ExecParams(ctx,
    trySessionUnlock,
    [][]byte{
        keyify(key),
    },
    nil,
    []int16{1},
    nil)
tag, err := rr.Close()
if err != nil {
    return response{false, nil, err}
}
if tag.RowsAffected() == 0 {
    return response{false, nil, fmt.Errorf("unlock of key %s returned false", key)}
}
```

By using the lower level PgConn object we can exec our queries, get a response writer, and immediately close it to obtain the command tag.
The command tag tells us if any rows were affected by the exec. This effectively tells us whether the lock was obtained or not in a somewhat indirect way.

Let's take a new 1 minute memory profile to see how this effects our heap.

![photo of high PGX allocations](/profile002.png)

Notice the large improvement achieved.

We can also compare the benchmark output.

```
85149            890605 ns/op            1288 B/op         21 allocs/op
```
Where PGX was reading the rows.

```
58051           1238353 ns/op             517 B/op         11 allocs/op
```

By eliminating the reading of rows we perform many more cycles and cut our allocation in roughly half.

## Disclaimer on optimization

Is it worth to dig this deep into your allocations? Depends.
If you know the code you are writing will be in the "hot-path" its empowering to know what your allocation profile looks like.
Learning the skills to performance tune is addicting and powerful but writing code that can be read and easily maintained should always be the first goal.
That being said I do think every engineer should go down the rabbit hole at least once. Its a lot of fun.

