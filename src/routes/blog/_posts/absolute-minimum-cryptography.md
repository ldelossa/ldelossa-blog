# The Absolute Minimum Every Software Engineer Must Know About Cryptographic Authentication and Encryption

# Introduction

Cryptography is scary. It is a deep topic full of puzzling maths and delphic names. However, the day to day application of the topic is far more approachable.

This post will introduce each topic necessary to understand the subject, at a high level and with a pragmatic focus. 

## Part 1: Concepts and Technologies

### Authentication and Encryption

Cryptography can lend itself to many utilities but as software developers our usage centers around authentication and encryption. 

Authentication is the act of identification. 
Cryptography can guarentee authentication and thus provide trust that the subject you are communicating with is indeed who they say they are. 
Authentication is implemented by crypographic signing. 

Encryption is the act of concealing communications from unintended audiences. 
When a communication is encrypted it is gaureteed to be viewable only by the intended party. 

Authentication and encryption are used together to device a notion of trust in our applications and on the internet.

### Cryptographic Signing

Cryptographically signing a message proves authentication in a single direction. It works like so:

  * Sender: constructs a message to be sent.
  * Sender: constructs a key to sign the message with.
  * Sender: uses a signing algorithm to sign the bits of the message with the constructed keys.
  * Sender: sends message along with signature to client.
  * Receiver: receives the message and signature
  * Receiver: retrieves the sender's key
  * Receiver: uses the sender's key to sign the received message
  * Receiver: compares the sender's signature with the one just previously computed.

If the receiver sees both signatures as equal and knowns it can trust the key used to create the signature, the receiver can trust the message is from the sender.

We will touch upon the various ways to perform this key tranfer in just a bit.

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

### Applied Signing and Encryption

Several widely used technologies apply signing and encryption in practice. We will cover the following:

  * Private Key Infrastructure
  * TLS (previously SSL)
  * JSON Web Tokens / JSON Web Signatures

### Private Key Infrastructure

Private key infrastructure, or PKI for short, is a grouping of technologies and protocols. 
This grouping can be used in tandem to ensure authentication and encryption and solve the boostrap issue we face with key distribution.

PKI is based on a private/public key model. 
The private key is kept secret and used to sign data while the public key can verify what the private key signs. 
The public key can never be used to derive the private key and this is mathematically proven.

*aside: PKI infrastructure will typically use RSA public and private keys. We dig into this more later in the post.*

In our examples above the sender would sign a message with its private key, make it's public key available to the receiver, and the receiver would verify the message utilizing the sender's public key.

PKI is called an 'infrastructure' because it provides a trust policy in addition to authentication and encryption.

In PKI the trust policy takes the form of a tree. 
At the root of the tree is the "root CA", where CA is short for certificate authority. 
The root can create one or more "intermediate CA(s)" by creating and signing their certificate with it's own private key, providing authenticity that the intermediate CA was created by the root.

The intermediate CA is then kept online while the root CA is kept offline. 
This is for security purposes, if the intermediate CA private keys are compromised they can be revoked and the collateral damage can be managed. 
If the root CA's key is compromised all certificates created by any CA in the tree must be revoked.

A diagram expresses this hierarchy below.

![pki hierarchy diagram](./pki_hierarchy_diagram.png)

Each node in the chain has both a private key and a certificate. 

A certificate is an envelope containing meta data and the public key of the owner. It may be used as follows:

  * Sender: Signs a message with it's private key
  * Sender: Sends message to receiver
  * Receiver: Receives message
  * Receiver: Obtains the sender's certificate
  * Receiver: Verifies the certificate's authenticity
  * Receiver: Extracts public key from certificate and verifies message

Note that it is not enough to simply extract the public key and verify the message. 
The PKI libraries must utilize the meta data inside the certificate to verify the trust hierarchy. 
In other words, it must be proved that the certificate in focus was indeed signed by the intermediate or root CA it claims to be.

It is worthwhile to take a pragmatic look at setting up a root CA, intermediate, and signing client certificates. 
A wonderful tutorial can be found [here](https://jamielinux.com/docs/openssl-certificate-authority/)

### TLS

TLS utilizes PKI to implement encryption over http also known as "https". 
TLS gaurentees that every bit of data between two http clients is encrypted and unintelligible to any other parties which may route the traffic.

TLS is a protocol which exchanges asymmetric keys, generates symmetric keys, and uses the symetric keys to encrypt data between parties.

Symmetric keys can be thought of as the sender and receiver having the same key used to sign or encrypt data. 
Asymmetric keys in contrast use a particular key for encrypting and a different key for decrypting. 

When a browser connects to an https website a handshake occurs. 
Within this handshake the server's certificate is verified and a set of symmetric keys are crafted. 
All communication on this secure channel is now encrypted and decrypted with the symmetric keys.

The reason symmetric keys are used is for performance. 
Encrypting and decrypting with a private/public key can be expensive due to key size. 
Encryption and decryption can occur quicker with smaller symmetric keys.

TLS also provides authentication. 

Each https server is assigned a client certificate. 
From our diagram above, client certificates are the leafs. 
When a user requests information from a server, the user's browser will check the server's certificate.
If the browser cannot prove the certificate was created by a trusted root or intermediate CA the connection will fail.

*aside: if you ever had to install a certificate bundle to a server because ssl was failing you are installing a well known set of trusted root and intermedaite certificates. This is used in the above verification process.*

With TLS comes maintenance. 
TLS certificates expire over time and must be kept up to date. 
Traditionally a server TLS certificate would be purchased from a well known root CA such as DigiTrust. 
Today, "let's encrypt" has paved the way for free certificates, albiet these certs expire much sooner then ones you can purchase from a trusted root ca.

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
  * Receiver: parses the "authorization" header and retreives the token.
  * Receiver: retrieves the sender's key.
  * Receiver: verifies the signature portion with the sender's key.

JWT alone provides no key transfer facilities and the token's data is in plain text. 
However, with JSON Web Encryption (JWE) it becomes possible to piggy back off PKI and retrieve public keys via the public key infrastructure. 

More then a high level overview is further then this post would like to go. 
If you are interested in further details on JWT and JWE I suggest checking out the [JWT RFC](https://tools.ietf.org/html/rfc7519) and [JWE RFC](https://tools.ietf.org/html/rfc7516) directly. 
Both are not difficult reads.

## Part 2: Crytographic Formats and Primitives 

With knowledge of what authentication and encryption is along with the common mechanisms that implement it, lets turn our attention to actually working with these primitives in code.

### The Simplest Key

The term "key" has been used interchangeably all over this post. That is not in error. 

A "key" takes the shape of a plain text string, a RSA cryptographic private or public key, or a sha256 of some binary data. 
To a signing algorithm its all the same.
The key is simply a byte array used as an input to create ciphertext or a signature of a message.

*aside: the key is actually used by a "key derivation function" which performs a hash over the provided key to create keyPrime used for encryption or signing*

### Pre-Shared Keys

A pre-shared key is what most of us think about when we use authentication systems. 
A pre-shared key is known to both the sender of a message and a receiver of a message. 

If encryption is being performed, this is a form of symmetric encryption as both sides use the same key to encrypt or sign data. 

This is often where developers will start when implementing an authentication system.

Typically libraries will take a pre-shared key as an arbitrary byte array. 

### RSA Keys

RSA keys are the cononical form of the public/private key model. 

This is where things get interesting...

RSA keys are typically created in a key pair. You can see this in the relevant Go code.

```go
package rsa

func GenerateKey(random io.Reader, bits int) (*PrivateKey, error)

type PrivateKey struct {
    PublicKey            // public part.
    D         *big.Int   // private exponent
    Primes    []*big.Int // prime factors of N, has >= 2 elements.

    // Precomputed contains precomputed values that speed up private
    // operations, if available.
    Precomputed PrecomputedValues
}
```

The above code makes it apparent that generating a private key always involves generating the public key. 

We can't go much further talking about RSA keys without explaining the common ways these objects are serialized and transported.

Let's run through these.

### ANS.1, PEM, DER, PKCS, oh my...

#### ASN.1

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

Libraries will often return DER encoded keys and certificates when crafting crytographic primitives. 
It can be convenient for applications to work with DER as any penality for marshalling/unmarshalling the binary to ASCII is not present.

#### PEM

PEM is simply the base64 encoded DER data surrouned by a block of ASCII text. 
Since DER can encode several ASN.1 formats and PEM simply holds a base64 representation of this data, PEM can hold multiple ASN.1 described formats transitively.

PEM is the encoding public keys, private keys, and certifactes are typically transported in due to it being human readable and can instantly be recognizable. 

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

RSA keys are often used with with x.509 certificates. As a reminder certificates are used to prove authenticity. 

The certificate has a public key and enough information to prove this key is from who the receiver thinks it is.

A certificate is yet another ASN.1 described object defined in the [rfc-5280](https://tools.ietf.org/html/rfc5280) and can be marshalled to DER and PEM just like the others.
