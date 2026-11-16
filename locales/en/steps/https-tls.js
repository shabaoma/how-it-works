module.exports = {
  "steps": [
    {
      "label": "1 Resolve and connect",
      "kicker": "STEP 1",
      "title": "Resolve and connect",
      "detail": "When visiting https://shop.example, the browser obtains an IP address and establishes a TCP connection to the server. This example starts without an existing connection.",
      "note": "DNS results may be cached. A TCP connection alone does not provide TLS authentication or content encryption.",
      "diagram": "sequenceDiagram\nparticipant B as Browser\nparticipant D as DNS resolver\nparticipant S as HTTPS server\nB->>D: Resolve shop.example\nD-->>B: Return IP address\nB->>S: TCP SYN\nS-->>B: SYN-ACK\nB->>S: ACK"
    },
    {
      "label": "2 Send ClientHello",
      "kicker": "STEP 2",
      "title": "Send ClientHello",
      "detail": "The browser offers TLS versions, cipher suites, signature algorithms, key exchange groups and an ephemeral public key share. It typically includes Server Name Indication (SNI) and Application-Layer Protocol Negotiation (ALPN).",
      "note": "An ordinary ClientHello is usually unencrypted. HTTPS does not hide all hostnames, IP addresses or timing metadata; Encrypted ClientHello (ECH) requires support.",
      "diagram": "sequenceDiagram\nparticipant B as Browser\nparticipant D as DNS resolver\nparticipant S as HTTPS server\nB->>S: ClientHello, versions, algorithms and key_share"
    },
    {
      "label": "3 Agree on keys",
      "kicker": "STEP 3",
      "title": "Agree on keys",
      "detail": "The server selects TLS 1.3, a cipher suite and key exchange group, returning its ephemeral public key share in ServerHello. Each side computes a shared secret from its private key and the peer public key, then derives handshake traffic keys using the handshake context.",
      "note": "This example uses ephemeral elliptic-curve Diffie-Hellman (ECDHE). Private keys and the shared secret are never sent. Incompatible key shares can require another round trip.",
      "diagram": "sequenceDiagram\nparticipant B as Browser\nparticipant D as DNS resolver\nparticipant S as HTTPS server\nS-->>B: ServerHello and server key_share\nNote over B,S: Independently derive shared secret and handshake keys"
    },
    {
      "label": "4 Prove server identity",
      "kicker": "STEP 4",
      "title": "Prove server identity",
      "detail": "The server sends encrypted EncryptedExtensions, its certificate chain, CertificateVerify and Finished. CertificateVerify signs the handshake context using the certificate private key; Finished authenticates the handshake transcript.",
      "note": "TLS 1.3 certificates authenticate the server; they do not encrypt a session key for delivery. When ALPN is negotiated, the server returns its selection in EncryptedExtensions.",
      "diagram": "sequenceDiagram\nparticipant B as Browser\nparticipant D as DNS resolver\nparticipant S as HTTPS server\nS-->>B: Encrypted EncryptedExtensions\nS-->>B: Encrypted Certificate and CertificateVerify\nS-->>B: Encrypted Finished"
    },
    {
      "label": "5 Validate the server",
      "kicker": "STEP 5",
      "title": "Validate the server",
      "detail": "The browser checks a chain to a trusted root, the requested hostname, validity period, permitted usage and algorithm policy. It also verifies CertificateVerify and the server Finished.",
      "note": "Receiving a certificate does not make it trusted. Required validation failures terminate the connection before normal HTTP application requests. A valid certificate does not guarantee a trustworthy business.",
      "diagram": "sequenceDiagram\nparticipant B as Browser\nparticipant D as DNS resolver\nparticipant S as HTTPS server\nNote over B: Validate chain, hostname and validity\nNote over B: Verify handshake signature and Finished\nopt Validation fails\nB->>S: Terminate connection\nend"
    },
    {
      "label": "6 Finish the handshake",
      "kicker": "STEP 6",
      "title": "Finish the handshake",
      "detail": "After successful validation, the browser sends Finished protected with client handshake keys. The server verifies it. In this example both sides then use separately derived application traffic keys for subsequent data.",
      "note": "Typical HTTPS authenticates the server only; client certificates are excluded here. Application user login still requires mechanisms such as cookies or OIDC.",
      "diagram": "sequenceDiagram\nparticipant B as Browser\nparticipant D as DNS resolver\nparticipant S as HTTPS server\nB->>S: Encrypted client Finished\nNote over S: Verify client Finished\nNote over B,S: Use application traffic keys"
    },
    {
      "label": "7 Exchange encrypted HTTP",
      "kicker": "STEP 7",
      "title": "Exchange encrypted HTTP",
      "detail": "The browser sends an HTTP request and the server returns a response. TLS authenticated encryption protects record confidentiality and integrity, with separate traffic keys for each direction.",
      "note": "TLS protects transmission between its termination endpoints. A CDN or reverse proxy terminating TLS can see plaintext; its connection to the origin needs separate protection.",
      "diagram": "sequenceDiagram\nparticipant B as Browser\nparticipant D as DNS resolver\nparticipant S as HTTPS server\nB->>S: Encrypted HTTP request\nS-->>B: Encrypted HTTP response"
    }
  ]
};
