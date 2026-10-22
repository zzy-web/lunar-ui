---
title: "计算机网络面试题"
description: "计算机网络分类，共 37 道面试题，按全站连续题号编排并提供参考答案。"
---

# 计算机网络

共 **37 题**，题号 **180–216**。 [返回分类总览](./)

> 答案用于面试复习与工程讨论，具体实现请结合项目锁定的版本验证。

## 180. HTTP 请求方式。 {#q-180}

**参考答案：**

GET 获取资源，HEAD 获取响应头，POST 提交处理，PUT 替换目标表示，PATCH 部分修改，DELETE 删除，OPTIONS 查询能力。安全性/幂等性是方法语义，不等于实现一定合规；PATCH 是否幂等取决于补丁语义。

## 181. GET / POST 的区别。 {#q-181}

**参考答案：**

GET 语义为安全读取且幂等，参数常在 URL；POST 用于提交处理，通常不保证幂等。两者都可通过 HTTPS 保护传输，POST 不天然更安全；URL 长度、缓存和请求体处理受协议语义及实现共同影响。

## 182. RESTful 规范。 {#q-182}

**参考答案：**

REST 以资源 URI、标准方法、无状态请求和统一表示组织接口，如 GET /orders/1、POST /orders。合理使用状态码、分页、缓存和超媒体；REST 是架构风格，不等于“所有接口都用 JSON”。

## 183. 浏览器缓存（强缓存 / 协商缓存）。 {#q-183}

**参考答案：**

强缓存通过 Cache-Control/Expires 判断新鲜度，可直接复用；过期后用 If-None-Match/If-Modified-Since 协商。服务器验证未变返回 304，否则返回新表示；缓存键还受 Vary、URL 和权限语义影响。

## 184. Cache-Control 的取值。 {#q-184}

**参考答案：**

max-age 控制新鲜期，s-maxage 面向共享缓存，public/private 控制共享范围，no-cache 要求复用前验证，no-store 禁止存储，must-revalidate 禁止过期后无条件使用，immutable 表示新鲜期间内容不变。no-cache 不等于不缓存。

## 185. 常见的 HTTP 状态码及其代表的含义是什么？ {#q-185}

**参考答案：**

200 成功，201 已创建，204 无响应体；301/302 重定向，304 表示缓存验证未修改；400 参数/请求错误，401 缺有效认证，403 拒绝，404 不存在，409 冲突，429 限流；500 服务异常，502/503/504 常见于网关或上游故障。

## 186. 网络状态码 301、302、303 有何区别？分别适用于什么场景？ {#q-186}

**参考答案：**

301 永久重定向，302 临时重定向，历史客户端可能把 POST 改为 GET；303 明确引导用获取方法访问结果，常用于提交后跳转。需要严格保留方法和请求体时使用 307（临时）或 308（永久）。

## 187. 400 和 401、403 状态码。 {#q-187}

**参考答案：**

400 表示请求格式或参数不符合要求，401 表示缺少/无效认证并通常带 WWW-Authenticate，403 表示服务端拒绝权限。不要通过这些响应泄露敏感资源是否存在，可在安全策略下统一返回 404。

## 188. HTTP 和 HTTPS 的区别。 {#q-188}

**参考答案：**

HTTPS 是 HTTP 通过 TLS 传输，提供机密性、完整性和通常的服务器身份认证。它不保证业务安全或服务器可信内容绝对正确；默认端口常为 443 与 80，性能受握手、连接复用与协议版本影响。

## 189. 描述一下 HTTPS 的加密过程。 {#q-189}

**参考答案：**

以 TLS 1.3 为例，客户端和服务器协商版本/套件，交换密钥协商材料，服务器提供证书并证明私钥持有，客户端验证证书与主机名，双方导出对称流量密钥。应用数据用对称加密保护，不能简单概括为“用证书公钥加密全部数据”。

## 190. Cookie 为了解决什么问题？ {#q-190}

**参考答案：**

HTTP 请求本身不保存跨请求身份，Cookie 让服务器设置小型状态，由浏览器按域、路径等规则自动携带。常用于会话标识和偏好；应设置 Secure、HttpOnly、SameSite、有效期，Cookie 不是无限量数据库。

## 191. Cookie 和 Session 的区别。 {#q-191}

**参考答案：**

Cookie 是客户端存储并自动携带的数据机制；Session 是服务器管理会话状态的模式，常通过 Cookie 中的随机 session id 关联。Session 也需过期、撤销和多实例共享；Cookie 可存其他数据，两者不互斥。

## 192. TCP（传输控制协议）和 UDP（用户数据报协议）有什么区别？ {#q-192}

**参考答案：**

TCP 是可靠、有序的字节流，提供重传、流量和拥塞控制，但没有消息边界；UDP 是尽力而为的数据报，保留消息边界，开销低但不保证交付和顺序。实时或 QUIC 场景可在 UDP 上构建额外可靠性。

## 193. TCP 三次握手。 {#q-193}

**参考答案：**

客户端发 SYN(seq=x)，服务器回 SYN+ACK(seq=y, ack=x+1)，客户端回 ACK(ack=y+1)，双方确认初始序列号及双向通信。握手还协商选项并建立连接状态，后续 ACK 序号遵循字节流语义。

## 194. 如果 TCP 变成二次握手，会导致什么问题？ {#q-194}

**参考答案：**

只有两次握手时，服务器无法确认对方收到自己的初始序列号，历史延迟 SYN 也可能造成无效连接状态。第三次 ACK 完成对双向序列空间的确认，减少旧报文误建连接和不必要资源占用。

## 195. TCP 的四次挥手。 {#q-195}

**参考答案：**

TCP 两个方向可独立关闭：主动方发 FIN，对方 ACK；对方发送完再 FIN，主动方 ACK 并进入 TIME_WAIT。ACK 与 FIN 可合并所以不一定看到四个独立包；TIME_WAIT 用于处理重传和旧报文。

## 196. 描述一下 TCP 的拥塞控制。 {#q-196}

**参考答案：**

发送速率同时受拥塞窗口 cwnd 与接收窗口 rwnd 限制。经典 Reno 包括慢启动、拥塞避免、快速重传和恢复；现代系统还可能用 CUBIC/BBR 等，算法与丢包、RTT、带宽估计相关，不能只背一种行为。

## 197. 什么是跨域？如何解决？ {#q-197}

**参考答案：**

源由协议、主机、端口组成，任一不同即跨源。浏览器通常限制脚本读取跨源响应，可用服务端正确配置 CORS、同源反向代理等解决；JSONP 仅限脚本式 GET 且有风险，关闭浏览器安全策略不是生产方案。

## 198. 同源策略具体限制的内容。 {#q-198}

**参考答案：**

同源策略限制跨源 DOM 访问、部分存储访问和网络响应读取，并非所有跨源请求都不能发出。图片、脚本、表单等有不同规则，所以同源策略不能代替 CSRF 防护或服务端认证。

## 199. 发起请求时浏览器做了什么？ {#q-199}

**参考答案：**

浏览器构建请求、匹配 Cookie 与缓存、执行安全/CORS 检查，必要时预检，再解析 DNS、复用或创建连接并收发数据。还会处理重定向、解压和响应可访问性；失败可能发生在网络前、传输中或响应读取阶段。

## 200. XSS 攻击是什么？ {#q-200}

**参考答案：**

XSS 是攻击者控制的内容被当成脚本执行。按上下文编码输出，避免危险 HTML 注入，对富文本使用可靠清洗，配合 CSP 和 HttpOnly；防护必须对应 HTML、属性、URL、JS 等不同上下文。

## 201. SQL 注入。 {#q-201}

**参考答案：**

SQL 注入由不可信输入拼接为可执行 SQL 结构导致。使用参数化查询/预编译，动态表名或排序字段用白名单映射，数据库账号最小权限；ORM 也可能因 raw query 拼接而受影响。

## 202. DDoS 攻击。 {#q-202}

**参考答案：**

DDoS 用分布式流量耗尽带宽、连接或计算资源。结合上游清洗/CDN/WAF、限流、缓存、队列、熔断与业务降级，区分 L3/L4 与 L7 攻击；不能仅靠扩容或按单 IP 限流解决。

## 203. CSRF 攻击。 {#q-203}

**参考答案：**

CSRF 利用浏览器自动携带身份凭据，诱使用户执行非本意操作。使用 CSRF token、SameSite Cookie、Origin/Referer 校验和敏感操作确认，避免 GET 写入；CORS 主要管响应读取，不是完整 CSRF 防线。

## 204. Ajax 的定义及优缺点。 {#q-204}

**参考答案：**

Ajax 指页面不整体刷新时异步交换数据并更新局部界面，可通过 XHR 或 Fetch 实现。优点是交互连续和减少重复加载，代价是状态管理、错误恢复、可访问性和 SEO 等复杂度，数据格式不局限 XML。

## 205. XMLHttpRequest 对象用法。 {#q-205}

**参考答案：**

创建 XMLHttpRequest，open(method, url)，设置头/timeout 与 onload/onerror/ontimeout，再 send(body)。onload 不代表 HTTP 成功，要检查 status；支持 abort 和上传进度，解析响应也可能失败。

## 206. 封装一个 Ajax 请求方法。 {#q-206}

**参考答案：**

封装应返回 Promise，统一方法、URL、序列化、状态判断、响应解析、网络错误、超时与 abort。不能只在 onload resolve；本分类附最小 Fetch 版异步请求封装，生产可再加有限重试和请求追踪。


**示例：支持超时与外部取消的 JSON 请求封装。**

```js
async function requestJSON(url, { timeout = 10000, signal, ...options } = {}) {
  const controller = new AbortController()
  const onAbort = () => controller.abort(signal?.reason)
  if (signal?.aborted) onAbort()
  else signal?.addEventListener('abort', onAbort, { once: true })
  const timer = setTimeout(() => controller.abort(new Error('请求超时')), timeout)
  try {
    const response = await fetch(url, { ...options, signal: controller.signal })
    if (!response.ok) {
      const error = new Error(`HTTP ${response.status}`)
      error.status = response.status
      throw error
    }
    if (response.status === 204) return null
    return await response.json()
  } finally {
    clearTimeout(timer)
    signal?.removeEventListener('abort', onAbort)
  }
}
// POST JSON 时显式传入 Content-Type 与 JSON.stringify 后的 body。
```

此封装不自动重试，避免重复写入；若响应不是 JSON，应选择相应解析器。超时覆盖正文读取，取消不代表撤销服务器副作用。

## 207. Fetch API。 {#q-207}

**参考答案：**

fetch 返回 `Promise<Response>`，HTTP 404/500 通常仍 resolve，必须检查 response.ok；正文需再调用 json/text 或读取流。可用 AbortController 取消，配置 credentials 和 CORS；取消请求不保证撤销服务端已发生的操作。

## 208. fetch 与 XMLHttpRequest 的区别。 {#q-208}

**参考答案：**

Fetch 基于 Promise、支持流式读取与 Request/Response 抽象；XHR 是事件式接口，传统上传进度支持更直接。两者 HTTP 错误处理、取消和进度接口不同；Fetch 不会因非 2xx 自动 reject。

## 209. 请求会发送 2 次的原因。 {#q-209}

**参考答案：**

可能是跨源非简单请求的 OPTIONS 预检加实际请求，也可能是重定向、重试、重复事件绑定或框架开发模式。先看 Network 的方法、Initiator 和时序；预检不应重复业务副作用。[CORS 说明](https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/CORS)

## 210. WebSocket。 {#q-210}

**参考答案：**

WebSocket 提供持久双向消息通道，适合协作、游戏和实时控制。建立后以消息帧传输，需应用层鉴权、心跳、断线恢复、背压和去重；连接不断并不代表业务结果可靠持久。

## 211. WebSocket 建立连接的过程。 {#q-211}

**参考答案：**

经典 HTTP/1.1 握手发送 Upgrade: websocket、Connection: Upgrade、Sec-WebSocket-Key 等，服务端验证后回 101 和 Sec-WebSocket-Accept。之后切换帧协议；wss 先建立 TLS，HTTP/2 等扩展连接方式需分别讨论。

## 212. WebSocket 支持传输的数据格式。 {#q-212}

**参考答案：**

协议层支持 UTF-8 文本消息和二进制消息，JSON 只是文本载荷的一种应用约定。浏览器 send 可接受字符串、Blob、ArrayBuffer/视图；接收二进制可按 binaryType 返回 Blob 或 ArrayBuffer，应用需定义版本和大小限制。

## 213. Server-Sent Events（SSE）。 {#q-213}

**参考答案：**

SSE 是基于 HTTP 的服务器到客户端单向事件流，常用 text/event-stream 与 EventSource。事件以空行分隔，可带 id、event、data、retry，适合通知和生成输出；客户端上行另用普通 HTTP。

## 214. Server-Sent Events（SSE）示例：如何实现服务端向客户端持续推送事件？ {#q-214}

**参考答案：**

服务端返回 Content-Type: text/event-stream、禁用不适当缓冲，持续写出 id/event/data 后以空行结束，断连清理任务。浏览器用 new EventSource(url) 和 onmessage 接收；本分类附最小示例，并需补充持久化续传。


**最小示例（Node.js 服务端与同源浏览器客户端）：**

```js
// server.mjs
import { createServer } from 'node:http'
createServer((req, res) => {
  if (req.url !== '/events') {
    res.writeHead(404).end()
    return
  }
  res.writeHead(200, {
    'Content-Type': 'text/event-stream; charset=utf-8',
    'Cache-Control': 'no-cache',
    'X-Accel-Buffering': 'no'
  })
  res.flushHeaders()
  let id = 0
  const timer = setInterval(() => {
    // 演示中遇慢消费者即断开，不让缓冲无限累积。
    if (!res.write(`id: ${++id}\ndata: ${JSON.stringify({ time: Date.now() })}\n\n`)) {
      clearInterval(timer)
      res.destroy()
    }
  }, 1000)
  res.on('close', () => clearInterval(timer))
}).listen(3000)
```

```js
// 同源页面中运行；开发服务器需配置 /events 代理。
const stream = new EventSource('/events')
stream.onmessage = event => console.log(JSON.parse(event.data))
// 页面/组件释放时：stream.close()
```

此示例只演示事件格式与资源清理，ID 会随连接重置，不能用于生产续传。生产需要认证、持久事件 ID、Last-Event-ID 重放、心跳、背压和网关超时配置。

## 215. SSE 与 WebSocket 的区别。 {#q-215}

**参考答案：**

SSE 单向推送、基于 HTTP，EventSource 提供重连语义；WebSocket 全双工，可传文本/二进制。生成文本常用 SSE 加 REST 控制，低延迟双向交互可选 WebSocket；两者都需鉴权、状态恢复与慢消费者处理。

## 216. HTTP/2.0。 {#q-216}

**参考答案：**

HTTP/2 用二进制分帧在同一连接上复用流，支持 HPACK 头压缩与流量控制，减少 HTTP/1.1 应用层队头阻塞。底层 TCP 丢包仍可能阻塞全部流；不能把多路复用等同无限并发或已解决所有队头阻塞。

## 参考资料

以下官方资料用于核对相关协议与版本敏感点，其余方案题为工程参考设计。

- [MDN CORS](https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/CORS)
- [MDN SSE](https://developer.mozilla.org/en-US/docs/Web/API/Server-sent_events/Using_server-sent_events)
