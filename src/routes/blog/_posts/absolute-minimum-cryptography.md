# The Absolute Minimum Every Software Engineer Must Know About Cryptographic Authentication and Encryption

# Introduction

It's common to hear engineers muttering "cryptography is scary" or "oh no its a cert problem."

The topic is a dense one full of maths, mailing lists, and vulnerabilities which quite literally shock the world.
It's understandable how a lot of engineers put learning about the topics to another day.

In my career I have been asked to build two different certificate signing backends for IoT purposes.
These tasks provided the opportunity to work with authentication, encryption, and cryptography at a lower level then typical.

This post will outline the bare minimum engineers should understand before working with authentication and encryption systems.

## Part 1: Conceptual Overview

This section will provide a gentle introduction to authentication and encryption.
These topics are to be read as a conceptual overview and not as literal implementation details.

### Authentication and Encryption

Cryptography can lend itself to many utilities but as software developers our usage centers around authentication and encryption.

Authentication is the act of identification.
Cryptography can guarantee authentication and thus provide trust that the subject you are communicating with is indeed who they say they are.
Authentication is implemented by cryptographic signing.

Encryption is the act of concealing communications from unintended audiences.
When a communication is encrypted it is guaranteed to be viewable only by the intended party.

Authentication and encryption are used together to device a notion of trust in our applications and on the internet.

### Cryptographic Signing

Cryptographically signing a message proves authentication in a single direction. It works like so:

  * Sender: constructs a message to be sent.
  * Sender: constructs a key to sign the message with.
  * Sender: uses a signing algorithm to sign the bits of the message with the constructed keys.
  * Sender: sends message along with signature to client.
  * Receiver: receives the message and signature.
  * Receiver: retrieves the sender's key.
  * Receiver: uses the sender's key to sign the received message.
  * Receiver: compares the sender's signature with the one computed by the receiver itself.

If the receiver sees both signatures as equal and knows it can trust the key used to create the signature, the receiver can trust the message is from the sender.

The various ways to securely transfer the sender's key to the receiver will be covered a bit later in the post.

Typical signing algorithms are:
  * HS256 - HMAC with SHA256
  * RSA256 - RSA Signature with SHA256

### Cryptographic Encryption

While similar in procedure, cryptographic encryption serves a separate purpose. It works like so:

  * Sender: constructs a key
  * Sender: construct a message to send
  * Sender: run the message bits and the key through an encryption algorithm, producing unintelligible ciphertext.
  * Sender: sends cipher text message to receiver.
  * Receiver: receives the message
  * Receiver: retrieves the sender's key
  * Receiver: runs the message's ciphertext and the retrieved key through the same encryption algorithm, producing an intelligible message.

In the above scenario the key is being utilized on every message to encrypt the message and conceal its contents.

Typical encryption algorithms are:
  * DES & 3DES
  * RSA
  * Blowfish
  * AES

## Part 2: Applied Technologies

Several widely used technologies apply signing and encryption in practice. We will cover the following:

  * Private Key Infrastructure And x509 Certificates
  * TLS (SSL)
  * JSON Web Tokens / JSON Web Signatures

### Private Key Infrastructure And x509 Certificates

Private key infrastructure, or PKI for short, is a grouping of technologies, protocols, and policies.
This grouping can be used in tandem to ensure both authentication and encryption and securely transfer keys between parties.

PKI is based on a private/public key model.
In this model a private key is used for signing or encryption while the public key is used for verification or decryption.

*aside: Often the terms "asymmetric" and "symmetric" encryption come up. When the same key is used to encrypt and decrypt a message, this is known as "symmetric" encryption. When a key is used to encrypt a message as a different key is used to decrypt the message, this is known as "asymmetric" encryption. Public/Private key encryption is considered "asymmetric".

The private key is kept secret and used to sign data while the public key can verify what the private key signs.
The public key can never be used to derive the private key and this is mathematically proven.

*aside: PKI infrastructure will typically use RSA public and private keys. We dig into this more later in the post.*

In our examples above the sender would sign a message with its private key, make its public key available to the receiver, and the receiver would verify the message utilizing the sender's public key.

PKI is called an 'infrastructure' because it provides a trust policy in addition to authentication and encryption.

In PKI the trust policy takes the form of a tree.
At the root of the tree is the "root CA", where CA is short for certificate authority.
The root can create one or more "intermediate CA(s)" by creating and signing their certificate with its own private key, providing authenticity that the intermediate CA was created by the root.
This creates a chain of trust as I can confirm an intermediate is signed by its root by obtaining the root's public key and verifying the certificate's signature.

The intermediate CA is then kept online while the root CA is kept offline.
This is for security purposes, if the intermediate CA private keys are compromised they can be revoked and the collateral damage can be managed.
If the root CA's key is compromised all certificates created by any CA in the tree must be revoked.

A diagram can help provide a visual aide.

![pki hierarchy diagram](./pki_hierarchy_diagram.png)

Each node in the chain has both a private key and a certificate.

PKI utilizes a standardized certificate model specified in [rfc-2459](https://tools.ietf.org/html/rfc2459).

A certificate is an envelope containing metadata and the public key of the owner. It may be used as follows:

  * Sender: Signs a message with it's private key.
  * Sender: Sends message to receiver.
  * Receiver: Receives message.
  * Receiver: Obtains the sender's certificate.
  * Receiver: Verifies the certificate's authenticity by following the certificate trust chain.
  * Receiver: Extracts public key from certificate and verifies message.

Note that it is not enough to simply extract the public key and verify the message.
The receiver must verify the encountered certificate was indeed signed by the issuer's private key.
This is typically performed by the receiver having a local copy of popular root and intermediate certificates, extracting the public key from the one matching the issuer of the encountered certificate, and verifying the signature.

It is worthwhile to take a pragmatic look at setting up a root CA, intermediate, and signing client certificates.
A wonderful tutorial can be found [here](https://jamielinux.com/docs/openssl-certificate-authority/)

### TLS

TLS utilizes PKI to implement encryption over HTTP also known as "HTTPS".
TLS guarantees that every bit of data between two HTTP clients is encrypted and unintelligible to any other parties which may route the traffic.

TLS is a protocol which exchanges asymmetric keys, generates symmetric keys, and uses the symmetric keys to encrypt data between parties.

When a browser connects to an HTTPS website a handshake occurs.
Within this handshake the server's certificate is verified and a set of symmetric keys are crafted.
All communication on this secure channel is now encrypted and decrypted with the symmetric keys.

The reason symmetric keys are used is for performance.
Encrypting and decrypting with a private/public key can be expensive due to key size.
Encryption and decryption can occur quicker with smaller symmetric keys.

TLS also provides authentication.

Each https server is assigned a client certificate.
From our PKI diagram, client certificates are the leafs.
When a user requests information from a server, the user's browser will check the server's certificate.
If the browser cannot prove the certificate was created by a trusted root or intermediate CA the connection will fail.

*aside: if you ever had to install a certificate bundle to a server because ssl was failing you are installing a well known set of trusted root and intermediate certificates. This is used in the above verification process.*

With TLS comes maintenance.
TLS certificates expire over time and must be kept up to date.
Traditionally a server TLS certificate would be purchased from a well known root CA such as DigiTrust.
Today, "let's encrypt" has paved the way for free certificates, albeit these certs expire much sooner then ones you can purchase from a trusted root ca.

### JSON Web Tokens and JSON Web Encryption

JSON Web Tokens or JWT for short has become a popular form of authentication in modern web applications.
When coupled with JSON Web Encryption both authentication and encryption can be utilized.

The ubiquity of JWT and JSE is due to it's simplicity and ease of use.
Both specifications use JSON to transfer a signed and optionally encrypted token between parties.

This token can optionally contain claims, key/value information potentially useful for the receiving party along with several other "sections" which are base64 encoded and signed.
The full details of generating a token can be viewed [here](https://jwt.io/introduction/).

The flow of jwt interaction follows:

  * Sender: generates the header and the payload for the JWT.
  * Sender: generate the signature for the JWT utilizing a key.
  * Sender: places the token in an "authorization" http header.
  * Receiver: parses the "authorization" header and retrieves the token.
  * Receiver: retrieves the sender's key.
  * Receiver: verifies the signature portion with the sender's key.

JWT alone provides no key transfer facilities and the token's data is in plain text.
However, with JSON Web Encryption (JWE) it becomes possible to piggyback off PKI and retrieve public keys via the public key infrastructure.

More than a high level overview is further then this post would like to go.
If you are interested in further details on JWT and JWE I suggest checking out the [JWT RFC](https://tools.ietf.org/html/rfc7519) and [JWE RFC](https://tools.ietf.org/html/rfc7516) directly.

Understanding this post will lend itself to utilizing JWT and JWE without much difficulty, as their components build on the fundamentals.

## Part 2: Encodings

The following topics will describe the ubiquitous encoding formats encountered in modern authentication and encryption applications.

### It All Starts With ASN.1

ASN.1 is a language for **describing** encodings.

A user of ASN.1 can write out ASN.1 data types.

A consumer of ASN.1 definitions program how these objects will serialize to disk or a network wire.
This is referred to as an "encoding" of ASN.1 types.

For example an ASN.1 definition may describe a data structure comprised of two integer fields, an array of integers field, and a string field in a similar fashion as a structure in Go.

```go
type Obj struct {
  X int
  Y int
  Values []int
  Name string
}
```

Just as we can take any Go struct with public members and encode it into JSON, ASN.1 provides a common language to define structures and encode it into several forms.

ASN.1 is heavily used in the telecommunication industry and remains popular due to its extensibility.

#### DER

DER specifies a set of rules for encoding ASN.1 objects into binary.

Any objects described in ASN.1 can be encoded into DER and serialized as binary.

Libraries will often return DER encoded keys and certificates when crafting cryptographic primitives.
It can be convenient for applications to work with DER as any penalty for marshalling/unmarshalling the binary to ASCII is not present.

#### PEM

PEM is simply the base64 encoded DER data surrounded by a block of ASCII text.
Since DER can encode several ASN.1 formats and PEM simply holds a base64 representation of this data, PEM can hold multiple ASN.1 described formats transitively.

PEM is the encoding public keys, private keys, and certificates are typically transported in, as they are human readable and can be instantly recognized.

A PEM private key follows:
```
-----BEGIN RSA PRIVATE KEY-----
MIIEpQIBAAKCAQEA3Tz2mr7SZiAMfQyuvBjM9Oi..Z1BjP5CE/Wm/Rr500P
RK+Lh9x5eJPo5CAZ3/ANBE0sTK0ZsDGMak2m1g7..3VHqIxFTz0Ta1d+NAj
wnLe4nOb7/eEJbDPkk05ShhBrJGBKKxb8n104o/..PdzbFMIyNjJzBM2o5y
5A13wiLitEO7nco2WfyYkQzaxCw0AwzlkVHiIyC..71pSzkv6sv+4IDMbT/
XpCo8L6wTarzrywnQsh+etLD6FtTjYbbrvZ8RQM..Hg2qxraAV++HNBYmNW
s0duEdjUbJK+ZarypXI9TtnS4o1Ckj7POfljiQI..IBAFyidxtqRQyv5KrD
kbJ+q+rsJxQlaipn2M4lGuQJEfIxELFDyd3XpxP..Un/82NZNXlPmRIopXs
2T91jiLZEUKQw+n73j26adTbteuEaPGSrTZxBLR..yssO0wWomUyILqVeti
6AkL0NJAuKcucHGqWVgUIa4g1haE0ilcm6dWUDo..fd+PpzdCJf1s4NdUWK
YV2GJcutGQb+jqT5DTUqAgST7N8M28rwjK6nVMI..BUpP0xpPnuYDyPOw6x
4hBt8DZQYyduzIXBXRBKNiNdv8fum68/5klHxp6..4HRkMUL958UVeljUsT
BFQlO9UCgYEA/VqzXVzlz8K36VSTMPEhB5zBATV..PRiXtYK1YpYV4/jSUj
vvT4hP8uoYNC+BlEMi98LtnxZIh0V4rqHDsScAq..VyeSLH0loKMZgpwFEm
bEIDnEOD0nKrfT/9K9sPYgvB43wsLEtUujaYw3W..Liy0WKmB8CgYEA34xn
1QlOOhHBn9Z8qYjoDYhvcj+a89tD9eMPhesfQFw..rsfGcXIonFmWdVygbe
6Doihc+GIYIq/QP4jgMksE1ADvczJSke92ZfE2i..fitBpQERNJO0BlabfP
ALs5NssKNmLkWS2U2BHCbv4DzDXwiQB37KPOL1c..kBHfF2/htIs20d1UVL
+PK+aXKwguI6bxLGZ3of0UH+mGsSl0mkp7kYZCm..OTQtfeRqP8rDSC7DgA
kHc5ajYqh04AzNFaxjRo+M3IGICUaOdKnXd0Fda..QwfoaX4QlRTgLqb7AN
ZTzM9WbmnYoXrx17kZlT3lsCgYEAm757XI3WJVj..WoLj1+v48WyoxZpcai
uv9bT4Cj+lXRS+gdKHK+SH7J3x2CRHVS+WH/SVC..DxuybvebDoT0TkKiCj
BWQaGzCaJqZa+POHK0klvS+9ln0/6k539p95tfX..X4TCzbVG6+gJiX0ysz
Yfehn5MCgYEAkMiKuWHCsVyCab3RUf6XA9gd3qY..fCTIGtS1tR5PgFIV+G
engiVoWc/hkj8SBHZz1n1xLN7KDf8ySU06MDggB..hJ+gXJKy+gf3mF5Kmj
DtkpjGHQzPF6vOe907y5NQLvVFGXUq/FIJZxB8k..fJdHEm2M4=
-----END RSA PRIVATE KEY-----
```

Because the base64 value can be several ASN.1 descriptions the PEM encoding wraps the base64 data with some header information.
This is helpful for libraries which parse and decode these files.

#### PKCS8 and PKIX

PKCS8 and PKIX are formats specifically utilized for encoding a private key and a public key respectively.
The former is part of a larger set of [PKCS protocols](https://en.wikipedia.org/wiki/PKCS) defined by the RSA organization.
The latter is defined by the Public Key Infrastructure working in [rfc-5280 section4.1](https://tools.ietf.org/html/rfc5280#section-4.1):
```
SubjectPublicKeyInfo  ::=  SEQUENCE  {
     algorithm            AlgorithmIdentifier,
     subjectPublicKey     BIT STRING  }
```

Both these formats are expressed in ASN.1 notation, therefore they can be DER encoded and subsequently PEM encoded.

These formats support password protection utilizing symmetric keys where both DER and PEM do not.

### RSA Keys And Certificates

RSA keys are often used with x.509 certificates. As a reminder certificates are used to prove authenticity.

The certificate has a public key and enough information to prove this key is from who the receiver thinks it is.

A certificate is yet another ASN.1 described object defined in the [rfc-5280](https://tools.ietf.org/html/rfc5280) and can be marshalled to DER and PEM just like the others.

## Part 3: An example

Generate a RSA Key Pair.

```go
f, err := os.Open("/dev/random")
if err != nil {
    log.Fatal(err)
}
private, err := rsa.GenerateKey(f, 4096)
```

The above uses "/dev/random" as a random seed source and creates a 4096 bit key pair.

The public key can be extracted from the private.

```go
public := private.Public()
```

Both `private` and `public` variables hold a language specific key object with fields specific to the RSA algorithm.

We want to transport the public key, both PKCS1 and PKIX are formats that can accomplish this. Since we covered PKIX in this post lets use that format.

```
der, err := x509.MarshalPKIXPublicKey(public)
```

This marshal function will take the language specific public key object, marshall it into the ASN.1 PKIX description, and then encode this ASN.1 description into binary.
The `der` variable holds a byte slice containing the DER encoding of the private key.

If the goal is to simply store a public key in a database the binary DER encoding fulfills this use case.
However, if the key must transit a transport that is not byte safe such as a network or email system we must PEM encoded the byte slice.

In order to PEM encode our DER encoded PKIX public key we need to create a PEM block.

```
type Block struct {
    Type    string            // The type, taken from the preamble (i.e. "RSA PRIVATE KEY").
    Headers map[string]string // Optional headers.
    Bytes   []byte            // The decoded bytes of the contents. Typically a DER encoded ASN.1 structure.
}
```

The structure defines a few fields.

`Type` is ASCII text which defines the binary data being encoded.
For a PKIX public key this should be "PUBLIC KEY".

Headers allow for further details about the binary we are encoding, we will not use this.

Finally the `Bytes` field contains the binary data we are going to base64 encode into ASCII.
Remember a PEM is simply the base64 encoded binary data with some ASCII type and header information heading and footing the results.

```go
block := pem.Block{
    Type:  "PUBLIC KEY",
    Bytes: der,
}
pem := pem.EncodeToMemory(block)
```

The above defines the block and encodes our binary PKIX key into an ASCII PEM format.

At this point we can print the pem encoded key and see a familiar sight.

```go
fmt.Print(string(pem))
```

```
-----BEGIN PUBLIC KEY-----
MIICCgKCAgEAsWQmmNw+gBRR2vq59w2LyUtJ/E3kKiatjGYmpTuSlrzbIiXNL3qz
xWGUhgux6UYJlEReT6eCwIfVJvVGJVRl/cL5ji3FCg+PAUqkn9BIFODx1MHWyWDe
4/nQpfNpW7NjPW90M2yYR3YVKscyupidpJS3o99Iay3KmYn1xJ6HBaFTx3WXo9xG
vqDY8uVGzcawUiTe3S2FUaKwi5SWU2bb98gzrQ1vTLej01Wh8mH6w+rrnZy5l+nz
grRqVbVwP7Q2LbcrbJGj8P3RT+3RafuP4S0Xf9X6IbNsAFYLFDarMwlB9cnVda3v
CgHuGPqwBWU9KaXT1XRhdnvqX7dBi48GFOKyiD0jULY50sxLbGHCoWno0OUHFuZ4
36kRAtTJOVTMt0yuUT9rfIfthdo8sCcQxamTmE3AFZs1/aKu8/wKJn6XfXSQjBPD
hHXi1k9v1pMIjqUPWIo6JVtuuctX6ypTq3Q8PbJ4XCybIDemA7juKG3idyruUXS+
09cCQkQ6sylVDHwmaskowcC5H5G87xdrXl8NyAkh+oq3hVBSG0lCQeDWVvsua8L5
gxHQwz9xDtXKDXkZk7ovyVGISAKBpW7o4VBnE3zkpOQGluH/QfUWjX/fiD6cazz6
msBtiBSSjM6yL+CosTSarhgd1qB0y3/ZgwDTRL+Ax2vvmiz06mfSjsUCAwEAAQ==
-----END PUBLIC KEY-----
```

## Conclusion

A novice's view of cryptography is clouded by unfamiliar terminology and acronyms.
This often leads to engineers avoiding the subject all together.

This post makes it apparent that working with cryptography in a pragmatic sense has parallels with json or protobuf.
At the end of the day, we describe a machine agnostic definition of an object (ASN.1), specify a way to encode this description (DER), and optionally modify the binary encoding to be network and email friendly (PEM).

With this new perspective tasks dealing with certificates, ssl, authentication, and encryption should be demystified enough to tackle.
