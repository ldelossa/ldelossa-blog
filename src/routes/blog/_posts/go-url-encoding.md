# The Good with The Bad: Go's net/url.URL and JSON

A rather common task presented itself while working on [Clair](https://github.com/quay/clair) this week.

A URL needed to be generated in one service and communicated to another one.
Like most would, JSON was to be used as the encoding and HTTP as the transport mechanism.
A common task in most languages but a caveat exists in Go.

Logically a net/url.URL would be encoded as a string and transported in JSON as such data type.
Looking at the net/url.URL source code we see no implementations for json.Marshaler/json.Unmarshaller nor encoding.TextMarshaller/encoding.TextUnmarshaller.

It becomes the programmer's responsibility to implement this behavior.

## The Solution

Several ways exist to solve the problem.
The way chosen in Clair is as follows.

```go
// Webhook holds the details for clients to call back the Notifier
// and receive notifications.
type Webhook struct {
	NotificationID uuid.UUID `json:"notification_id"`
	Callback       url.URL   `json:"callback"`
}

func (wh Webhook) MarshalJSON() ([]byte, error) {
	var m = map[string]string{
		"notification_id": wh.NotificationID.String(),
		"callback":        wh.Callback.String(),
	}
	return json.Marshal(m)
}

func (wh *Webhook) UnmarshalJSON(b []byte) error {
	var m = make(map[string]string, 2)
	err := json.Unmarshal(b, &m)
	if err != nil {
		return err
	}
	if _, ok := m["notification_id"]; !ok {
		return fmt.Errorf("json unmarshal failed. webhook requires a \"notificaiton_id\" field")
	}
	if _, ok := m["callback"]; !ok {
		return fmt.Errorf("json unmarshal failed. webhook requires a \"callback\" field")
	}

	uid, err := uuid.Parse(m["notification_id"])
	if err != nil {
		return fmt.Errorf("json unmarshal failed. malformed notification uuid: %v", err)
	}
	cbURL, err := url.Parse(m["callback"])
	if err != nil {
		return fmt.Errorf("json unmarshal failed. malformed callback url: %v", err)
	}

	(*wh).NotificationID = uid
	(*wh).Callback = *cbURL
	return nil
}
```

Implementing the MarshalJSON and UnmarshalJSON methods for the entire struct was feasible since it's small and maps nicely into a `go map[string]string` data structure.

If the struct were larger or consisted of heterogeneous field types one may decide implementing a custom type is simpler.

The downside to the former approach appears in forced type conversions littering the code.

## So... Why

An obvious question is likely rattling around your brain right now.

Why did the stdlib developers not implement the basic interface methods aligning with the most common use cases?

The source code holds a clue:
```go
// Marshaling interface implementations.
// Would like to implement MarshalText/UnmarshalText but that will change the JSON representation of URLs.

func (u *URL) MarshalBinary() (text []byte, err error) {
    return []byte(u.String()), nil
}
```

The reason lies in Go's strict backwards compatibility promise.

In a hypothetical, lets say the appropriate marshalling methods were introduced in Go 1.14.

Two services exist A and B which communicate a "net/url.URL" structure via JSON/HTTP and no custom marshalling methods were implemented like above.

Service A is rebuilt in Go 1.14.

When service A receives the "net/url.URL" it will receive json similar to:
```json
"url": {"Scheme":"http","Opaque":"","User":null,"Host":"www.google.com","Path":"","RawPath":"","ForceQuery":false,"RawQuery":"","Fragment":""}
```

When service B receives the "net/url.URL" it will receive json similar to:
```json
{"url": "http://www.google.com"}
```

In both cases the Unmarshal will fail due to the data structures not aligning correctly.

This breaks the ability for an older service, B to talk to a new service A.

## The Good with the Bad

Many developers will read this post, look at the portion of code required to achieve a common and mundane task, and write Go off as inconvenient.

While I sympathize, and to a degree agree, I also see a valuable principal being adhered to.

Many languages suffer from compatibility issues which not only cripple productivity but also lose real money when downtime incurs.

Knowing the Go team is making full effort to avoid these scenarios is a good thing.
