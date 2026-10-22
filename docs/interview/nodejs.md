---
title: "Node.js面试题"
description: "Node.js分类，共 40 道面试题，按全站连续题号编排并提供参考答案。"
---

# Node.js

共 **40 题**，题号 **1–40**。 [返回分类总览](./)

> 答案用于面试复习与工程讨论；【推导】保留原文标记，表示题意依据不完整截图补全。实现细节请结合项目锁定的版本验证。

## 1. 后端语言特性与适用场景。 {#q-1}

**参考答案：**

Node.js 用 JavaScript/TypeScript 编写服务，擅长 I/O 密集型接口、网关和实时通信；Python 生态适合数据与 AI；Java、Go 常用于工程化服务。选型比较团队经验、延迟、吞吐和部署约束，CPU 密集任务应隔离或使用适合的计算运行时。

## 2. 【推导】Node.js 事件循环各阶段的执行顺序是什么？各阶段分别处理哪些任务？ {#q-2}

**参考答案：**

事件循环按 timers、pending callbacks、idle/prepare、poll、check、close callbacks 等阶段推进：定时器处理到期回调，poll 处理 I/O，check 处理 setImmediate，close 处理关闭事件。Node 20 起基于 libuv 1.45 的定时器调度在 poll 后运行；nextTick 与 Promise 微任务不属于独立的 libuv 阶段。

## 3. 【推导】Node.js 为什么说是单线程，却又能在高并发场景下处理大量请求？ {#q-3}

**参考答案：**

单线程主要指一个 JS 执行环境的回调执行线程。网络 I/O 由操作系统异步机制处理，部分工作交给 libuv 线程池，等待期间 JS 能处理其他请求；高并发并不等于 CPU 计算并行，长计算会阻塞循环。

## 4. 【推导】libuv 线程池负责哪些任务？默认线程数是多少，如何调整？ {#q-4}

**参考答案：**

libuv 线程池常处理文件系统异步操作、部分 DNS（dns.lookup）、加密和压缩任务，默认 4 个线程；可在进程启动前设置 UV_THREADPOOL_SIZE。普通网络 socket I/O 通常走操作系统事件通知，增加线程数需测量 CPU、内存和下游负载。

## 5. 【推导】CommonJS 与 ES Module 在 Node.js 中有什么区别？如何选择和混用？ {#q-5}

**参考答案：**

CommonJS 使用 require/module.exports，加载以同步方式为主；ESM 使用 import/export，静态依赖、实时绑定并支持顶层 await。通过 .cjs、.mjs 或 package.json 的 type 明确格式，优先统一一种；混用可用动态 import 或 createRequire，具体互操作限制与 Node 版本有关。

## 6. 【推导】npm、npx、package.json 分别是什么，有什么作用？ {#q-6}

**参考答案：**

npm 管理包、依赖与 scripts；npx（npm exec 的入口）执行本地或临时获取的包命令；package.json 描述项目元数据、脚本、依赖与导出。执行临时远程包前应核对来源及版本。

## 7. 【推导】package.json 中的 main、exports 字段分别有什么作用，有什么区别？ {#q-7}

**参考答案：**

main 是传统的包主入口；exports 可定义根入口、子路径、import/require 等条件，并限制未声明的内部路径。支持 exports 的解析器优先使用它；发布双格式包时应同时检查类型声明和消费端兼容性。

## 8. 【推导】npm install 的依赖树与 lock 文件是什么关系？lock 文件如何帮助保证依赖安装的一致性？ {#q-8}

**参考答案：**

package.json 描述允许的版本范围，lock 文件记录解析出的依赖树、精确版本和完整性信息。提交 lock 并在 CI 用 npm ci 可防止静默更新；平台可选依赖、Node/npm 版本及安装脚本仍可能影响最终环境。

## 9. 【推导】dependencies 和 devDependencies 有什么区别？分别应该放哪些依赖？ {#q-9}

**参考答案：**

dependencies 放消费运行时需要的外部包，devDependencies 放构建、测试、类型检查等开发工具。库共享宿主的 Vue 等通常放 peerDependencies，同时在开发依赖中安装用于本地验证；是否打包进产物也会影响依赖划分。

## 10. 【推导】Node.js 是单线程的吗？为什么单线程也能处理高并发请求？ {#q-10}

**参考答案：**

一个 Node JS isolate 通常只有一个 JS 主执行线程，但进程还包含 V8、libuv 等后台线程。异步 I/O 避免等待占住主线程，所以适合大量并发 I/O；CPU 密集型任务用 worker_threads 或独立服务处理。

## 11. 【推导】什么是 Event Loop？它在 Node.js 中如何工作？ {#q-11}

**参考答案：**

Event Loop 持续检查就绪的 I/O、定时器和其他回调并调度执行，使异步完成结果回到 JS。每个回调仍需尽快返回；递归 nextTick 或大量微任务也可能使 I/O 饥饿。

## 12. 【推导】Node.js 遇到文件读取、网络请求等 I/O 操作时，如何实现异步处理？ {#q-12}

**参考答案：**

文件操作通常进入 libuv 线程池，网络 socket 通常由操作系统就绪通知驱动；完成后将回调调度回事件循环。Promise/await 只是消费异步结果的方式，不会自动把同步计算移到后台。

## 13. 宏任务和微任务有什么区别？ {#q-13}

**参考答案：**

任务回调如定时器、I/O 在事件循环阶段执行；Promise.then、queueMicrotask 等微任务在指定检查点清空。Node 还有优先处理的 nextTick 队列；无限追加微任务会延迟下一批任务，不能机械套用浏览器的阶段模型。

## 14. 【推导】process.nextTick、Promise.then、setTimeout 和 setImmediate 的执行顺序及区别是什么？ {#q-14}

**参考答案：**

普通 CommonJS 顶层回调结束后通常 nextTick 先于 Promise 微任务；ESM 顶层执行处于微任务语境，顺序可能不同。顶层 setTimeout(0) 与 setImmediate 顺序不保证；在 I/O 回调中注册时通常 immediate 先执行，定时器时间只是最早执行阈值。

## 15. Node.js Event Loop 实践案例。 {#q-15}

**参考答案：**

可用 fs.readFile 的回调同时注册 setImmediate、setTimeout(0)、process.nextTick 和 Promise.then：通常观察到 nextTick、Promise、immediate、timeout。再与顶层及 ESM 版本比较；示例必须注明 Node 版本和注册位置，不能把一次输出当作所有环境的保证。


**示例（保存为 `.cjs`，在普通 Node.js 进程运行）：**

```js
const fs = require('node:fs')
fs.readFile(__filename, () => {
  setTimeout(() => console.log('timeout'), 0)
  setImmediate(() => console.log('immediate'))
  process.nextTick(() => console.log('nextTick'))
  Promise.resolve().then(() => console.log('promise'))
})
// 此处在 I/O 回调中注册：nextTick → promise → immediate → timeout。
```

## 16. 【推导】Buffer 与 TypedArray 的关系是什么？它们有哪些区别及适用场景？ {#q-16}

**参考答案：**

Buffer 是 Uint8Array 的子类，面向 Node 二进制 I/O，额外提供编码转换和数值读写。TypedArray 是标准化的定长类型视图，适合计算与跨环境代码；共享 ArrayBuffer 时注意 byteOffset/byteLength，Buffer.slice 通常共享内存。

## 17. 【推导】Stream 背压机制如何工作？不处理背压会产生什么问题？ {#q-17}

**参考答案：**

可写流 write 返回 false 表示缓冲达到阈值，生产者应等待 drain 后继续。读取端也应按消费速度拉取；优先使用 pipeline 自动传播背压和错误，否则可能堆积内存、增加 GC 并导致进程退出。


**示例：用 pipeline 处理文件复制的背压、结束与错误。**

```js
import { createReadStream, createWriteStream } from 'node:fs'
import { pipeline } from 'node:stream/promises'

await pipeline(createReadStream('input.bin'), createWriteStream('output.bin'))
```

## 18. 【推导】fs 模块中同步、异步回调、Promise 三种 API 有什么区别，如何选择？ {#q-18}

**参考答案：**

同步 API 阻塞当前线程，适合启动脚本等受控阶段；回调 API 通过 error-first 回调交付结果；fs/promises 便于 await 与统一异常处理。服务请求中避免同步大文件 I/O，超大文件使用流，异步也应控制并发。

## 19. 【推导】path 模块中 join 与 resolve 的区别是什么？ {#q-19}

**参考答案：**

path.join 拼接并规范化路径，不保证返回绝对路径；path.resolve 从右向左处理，遇绝对路径确定根，否则基于 cwd 生成绝对路径。两者都只处理路径字符串，不验证文件存在，也不能单独防止目录穿越。

## 20. 【推导】process 对象上有哪些常用信号与资源信息？如何利用它们处理进程退出和查看资源使用情况？ {#q-20}

**参考答案：**

常用 process.pid、env、argv、cwd、memoryUsage、cpuUsage、resourceUsage；监听 SIGTERM/SIGINT 实现停接请求、排空任务和关闭连接。退出设超时并用 exitCode；exit 事件中不能依赖异步清理，信号支持有平台差异。

## 21. 【推导】Promise 有哪些状态？状态可以发生哪些变化，变化后还能再次改变吗？ {#q-21}

**参考答案：**

Promise 状态为 pending、fulfilled、rejected；从 pending 一旦落定就不能再次改变。resolve 接收另一个 Promise/thenable 时会采用其最终状态，并不一定立即 fulfilled；then 返回新的 Promise。

## 22. async 和 await 的作用是什么？ {#q-22}

**参考答案：**

async 函数总返回 Promise，await 暂停当前异步函数直到等待值落定，成功得到值、失败抛出异常。它不阻塞事件循环，但 await 后面的同步重计算仍会阻塞；独立任务可并发启动再 Promise.all。

## 23. 【推导】Node.js 中未捕获异常与 Promise 未处理拒绝有什么区别？如何监听和处理？ {#q-23}

**参考答案：**

未捕获同步异常会进入 uncaughtException，未处理拒绝可触发 unhandledRejection，默认后果与 Node 配置有关。业务层用 try/catch、catch 和请求边界处理；进程级监听用于记录和有界退出，不应在未知损坏状态下无限继续运行。

## 24. 【推导】cluster 模块如何实现多进程共享端口及请求分发？ {#q-24}

**参考答案：**

cluster 主进程创建多个 worker 进程，各有独立内存和事件循环，通过共享监听句柄/主进程分发接收连接。分发策略依平台而异，不能保证严格均衡；会话应外置，并处理 worker 崩溃和优雅重启。

## 25. 【推导】worker_threads 与 cluster 的定位和区别是什么？分别适用于哪些场景？ {#q-25}

**参考答案：**

worker_threads 在同进程内运行多个 JS isolate，可转移或共享内存，适合 CPU 密集计算；cluster 是多进程服务复制，隔离更强、内存成本更高。高并发 I/O 本身不需要每请求创建 worker，计算一般使用固定线程池。

## 26. 【推导】使用原生 http 模块构建服务时，请求从接收到响应的处理流程是什么？ {#q-26}

**参考答案：**

http.createServer 接收 IncomingMessage 与 ServerResponse，先校验 URL/方法/请求头，再按流读取有大小限制的请求体，处理业务，设置状态和头，最终 end。监听流错误、取消和超时，避免重复响应及无上限缓冲。

## 27. 【推导】EventEmitter 的监听器上限与内存泄漏有什么关系？如何排查监听器泄漏？ {#q-27}

**参考答案：**

EventEmitter 默认单事件超过 10 个监听器时给出警告，不是硬限制，也不能证明一定泄漏。检查 listenerCount、重复注册路径和生命周期清理，使用 once/off；单纯提高上限不能解决长期持有对象的问题。

## 28. 【推导】Node.js 常见的内存泄漏来源有哪些？如何定位和排查？ {#q-28}

**参考答案：**

常见原因有无界缓存、全局引用、未清理定时器/监听器、闭包保留大对象和 Buffer/原生内存。比较多次 heap snapshot 的保留路径，结合 heapUsed、external、RSS 和 GC 曲线，注意抓快照可能暂停服务且包含敏感数据。

## 29. 【推导】如何在 Node.js 项目中接入 TypeScript，并配置编译和开发流程？ {#q-29}

**参考答案：**

安装 TypeScript 与 Node 类型，配置 target、module/moduleResolution、strict、outDir，使 package type 和产物一致。开发可用 tsx 等加载器，CI 做独立 tsc 类型检查，生产运行编译产物并保留 source map；转译成功不等于类型通过。

## 30. 【推导】Node.js 调试与性能分析的常用手段有哪些？ {#q-30}

**参考答案：**

使用 --inspect 配合 DevTools/IDE 断点与 source map；CPU profile 定位热点，heap snapshot 定位对象保留。结合事件循环延迟、请求分位延迟、GC 与负载测试分析，调试端口不得直接暴露公网。

## 31. 【推导】Nest.js 是什么？它和 Express、Koa 有什么关系与区别？ {#q-31}

**参考答案：**

Nest 是基于模块、装饰器和依赖注入的 Node 应用框架，通常使用 Express 或 Fastify HTTP 适配器。Express 偏轻量路由中间件，Koa 使用异步洋葱模型；Nest 提供更完整结构但有学习与抽象成本，不是 Koa 的默认上层。

## 32. 【推导】Nest.js 中 Module、Controller、Provider 分别承担什么职责，如何协作？ {#q-32}

**参考答案：**

Module 声明并组织 controllers、providers、imports、exports；Controller 负责请求入口和参数映射；Provider 封装业务或基础设施能力。通过 DI 注入协作，跨模块共享 provider 需导出并在使用方导入对应模块。

## 33. 【推导】Nest.js 中依赖注入是什么？为什么要使用依赖注入？ {#q-33}

**参考答案：**

依赖注入由容器按 token 解析并提供对象，调用方声明依赖而不自行 new。可降低耦合、集中管理生命周期并替换测试实现；依赖循环和错误作用域仍需通过模块边界设计避免。

## 34. 【推导】@Injectable() 有什么作用？Service 如何注册并注入到其他组件中？ {#q-34}

**参考答案：**

@Injectable 为类提供可供 DI 使用的元数据，但不会自动在所有模块注册。将 Service 放入模块 providers，在构造函数按类型/token 注入；供其他模块使用时需 exports，接口注入要使用显式 token。

## 35. 【推导】Nest.js 中一个 HTTP 请求从进入到返回响应，会经历哪些处理阶段？ {#q-35}

**参考答案：**

典型 Nest HTTP 流程是 middleware → guards → interceptors 前置 → pipes → controller/service → interceptors 后置 → 响应。未处理异常进入 exception filters；实际顺序还受全局、控制器、路由绑定层级及参数管道顺序影响。

## 36. 【推导】Middleware、Guard、Interceptor、Pipe 和 Exception Filter 分别有什么作用，执行顺序是什么？ {#q-36}

**参考答案：**

Middleware 做通用请求处理，Guard 决定是否允许进入，Pipe 校验转换参数，Interceptor 包裹执行以转换结果/计时，Filter 处理未捕获异常。正常入口为 Middleware、Guard、Interceptor 前置、Pipe、Handler，出口拦截器逆序执行；Filter 属异常分支。

## 37. 【推导】Nest.js 中 DTO 是什么？为什么不直接使用接口或普通对象代替？ {#q-37}

**参考答案：**

DTO 描述传输数据结构，常用 class 搭配 class-validator 与 class-transformer 提供运行时校验和转换元数据。TypeScript interface 编译后被擦除，不能单独实现运行时校验；DTO 与数据库实体应分离以控制可写字段。

## 38. 【推导】Pipe 是什么？如何实现参数校验和数据转换？ {#q-38}

**参考答案：**

Pipe 实现 transform(value, metadata)，返回转换值或抛出异常。可使用 ParseIntPipe 或 ValidationPipe，并显式设置白名单、拒绝额外字段和必要的转换；转换不代表数据可信，仍要校验范围及业务权限。

## 39. 【推导】Exception Filter 是什么？如何统一处理异常并返回一致的错误响应？ {#q-39}

**参考答案：**

Exception Filter 捕获指定类型异常，映射到稳定的状态码和错误响应，如 code、message、requestId。可全局注册，内部堆栈写日志、响应避免泄露数据库和凭据；过滤器不是正常业务错误的任意吞错入口。

## 40. 【推导】Nest.js 如何连接 MySQL？如何使用 TypeORM 完成数据库访问？ {#q-40}

**参考答案：**

安装 @nestjs/typeorm、typeorm、mysql2，通过 TypeOrmModule.forRoot/forRootAsync 配置连接，再 forFeature 注册实体仓库并注入 Repository。配置来自环境/密钥服务，生产用 migration、连接池和事务，关闭自动 synchronize，避免字符串拼接 SQL。

## 参考资料

以下官方资料用于核对相关协议与版本敏感点，其余方案题为工程参考设计。

- [Node.js 事件循环](https://nodejs.org/en/learn/asynchronous-work/event-loop-timers-and-nexttick)
- [Nest 请求生命周期](https://docs.nestjs.com/faq/request-lifecycle)
