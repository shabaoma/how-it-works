module.exports = {
  "steps": [
    {
      "label": "1 解析地址并建立连接",
      "kicker": "步骤 1",
      "title": "解析地址并建立连接",
      "detail": "浏览器访问 https://shop.example 时，先获得域名对应的 IP 地址，再与服务器建立 TCP 连接。这里从一个尚未建立连接的访问开始说明。",
      "note": "DNS 结果可能来自本地缓存；建立 TCP 连接本身不提供 TLS 身份认证或内容加密。",
      "diagram": "sequenceDiagram\nparticipant B as 浏览器\nparticipant D as DNS 解析器\nparticipant S as HTTPS 服务器\nB->>D: 查询 shop.example\nD-->>B: 返回 IP 地址\nB->>S: TCP SYN\nS-->>B: SYN-ACK\nB->>S: ACK"
    },
    {
      "label": "2 发送 ClientHello",
      "kicker": "步骤 2",
      "title": "发送 ClientHello",
      "detail": "浏览器发送支持的 TLS 版本、密码套件、签名算法、密钥交换组和临时公钥份额。通常也会携带服务器名称指示（SNI）及应用层协议协商（ALPN）扩展。",
      "note": "普通 ClientHello 通常未加密，因此 HTTPS 不保证隐藏域名、IP 和连接时间等元数据；加密 ClientHello（ECH）需双方支持。",
      "diagram": "sequenceDiagram\nparticipant B as 浏览器\nparticipant D as DNS 解析器\nparticipant S as HTTPS 服务器\nB->>S: ClientHello、版本、算法与 key_share"
    },
    {
      "label": "3 协商密钥",
      "kicker": "步骤 3",
      "title": "协商密钥",
      "detail": "服务器选择 TLS 1.3、密码套件和密钥交换组，在 ServerHello 中返回自己的临时公钥份额。双方使用临时私钥与对方公钥独立计算共享秘密，结合握手上下文派生握手流量密钥。",
      "note": "本例使用临时椭圆曲线 Diffie-Hellman（ECDHE）。私钥和共享秘密不会在网络上传输；双方必须支持可兼容的密钥份额，否则可能需要额外往返。",
      "diagram": "sequenceDiagram\nparticipant B as 浏览器\nparticipant D as DNS 解析器\nparticipant S as HTTPS 服务器\nS-->>B: ServerHello 与服务器 key_share\nNote over B,S: 独立计算共享秘密并派生握手密钥"
    },
    {
      "label": "4 服务器证明身份",
      "kicker": "步骤 4",
      "title": "服务器证明身份",
      "detail": "服务器在加密的握手消息中发送 EncryptedExtensions、证书链、CertificateVerify 和 Finished。CertificateVerify 用证书对应私钥签署握手上下文，Finished 认证握手记录。",
      "note": "TLS 1.3 的证书用于认证，不用于把会话密钥加密后发给浏览器。若通过 ALPN 协商 HTTP 协议，服务器选择在 EncryptedExtensions 中返回。",
      "diagram": "sequenceDiagram\nparticipant B as 浏览器\nparticipant D as DNS 解析器\nparticipant S as HTTPS 服务器\nS-->>B: 加密的 EncryptedExtensions\nS-->>B: 加密的 Certificate 与 CertificateVerify\nS-->>B: 加密的 Finished"
    },
    {
      "label": "5 浏览器验证服务器",
      "kicker": "步骤 5",
      "title": "浏览器验证服务器",
      "detail": "浏览器检查证书链能否连接到受信任根、证书是否适用于请求域名、是否在有效期内，以及用途与算法等策略。它还验证 CertificateVerify 签名和服务器 Finished。",
      "note": "证书由服务器发来不代表可信；任一必要验证失败就终止连接，不发送正常的 HTTP 应用请求。有效 HTTPS 证书也不保证网站业务可信。",
      "diagram": "sequenceDiagram\nparticipant B as 浏览器\nparticipant D as DNS 解析器\nparticipant S as HTTPS 服务器\nNote over B: 验证证书链、域名与有效期\nNote over B: 核对握手签名与 Finished\nopt 验证失败\nB->>S: 终止连接\nend"
    },
    {
      "label": "6 完成客户端握手",
      "kicker": "步骤 6",
      "title": "完成客户端握手",
      "detail": "验证通过后，浏览器发送由客户端握手密钥保护的 Finished。服务器验证后，双方在此示例中完成握手，并使用单独派生的应用流量密钥保护后续数据。",
      "note": "通常的 HTTPS 只认证服务器，本页不展示客户端证书；应用中的用户登录仍由 Cookie、OIDC 等机制完成。",
      "diagram": "sequenceDiagram\nparticipant B as 浏览器\nparticipant D as DNS 解析器\nparticipant S as HTTPS 服务器\nB->>S: 加密的客户端 Finished\nNote over S: 验证客户端 Finished\nNote over B,S: 使用应用流量密钥"
    },
    {
      "label": "7 交换加密 HTTP",
      "kicker": "步骤 7",
      "title": "交换加密 HTTP",
      "detail": "浏览器发送 HTTP 请求，服务器返回响应。TLS 使用认证加密保护记录的机密性与完整性，客户端和服务器方向分别使用流量密钥。",
      "note": "TLS 只保护终止 TLS 的两个端点之间的传输。如果 CDN 或反向代理终止 TLS，它能看到明文；到源站的连接需要另行保护。",
      "diagram": "sequenceDiagram\nparticipant B as 浏览器\nparticipant D as DNS 解析器\nparticipant S as HTTPS 服务器\nB->>S: 加密的 HTTP 请求\nS-->>B: 加密的 HTTP 响应"
    }
  ]
};
