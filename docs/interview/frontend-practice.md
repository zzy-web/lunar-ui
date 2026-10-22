---
title: "前端工程实践场景题面试题"
description: "前端工程实践场景题分类，共 7 道面试题，按全站连续题号编排并提供参考答案。"
---

# 前端工程实践场景题

共 **7 题**，题号 **687–693**。 [返回分类总览](./)

> 答案用于面试复习与工程讨论；【推导】保留原文标记，表示题意依据不完整截图补全。实现细节请结合项目锁定的版本验证。

> 687–693 的独立分类标题未在截图中显示；此处依据题目内容归类为“前端工程实践场景题”。

## 687. 【推导】页面上有多个按钮，分别响应不同操作时，如何组织事件处理与状态管理？ {#q-687}

**参考答案：**

每个按钮绑定明确 command/handler，以操作 ID 管 pending/success/error，共享业务状态集中在 composable/store。防重复提交，独立操作可并行，互斥操作设锁，统一错误提示；不要用一个全局 loading 错误禁用所有按钮。


**示例：按操作维度管理按钮状态。**

```js
import { reactive } from 'vue'
const actions = reactive({})
async function execute(id, operation) {
  if (actions[id]?.pending) return
  actions[id] = { pending: true, error: null }
  try {
    return await operation()
  } catch (error) {
    actions[id].error = error instanceof Error ? error.message : String(error)
  } finally {
    actions[id].pending = false
  }
}
// 两个独立按钮分别调用 execute('save', save) 与 execute('export', exportFile)。
// 若两者修改同一资源，应额外设置业务级互斥或版本条件。
```

## 688. 登录无感刷新实现方案。 {#q-688}

**参考答案：**

短期 access token 失效时用受控 refresh token 刷新；单页内用 single-flight Promise 合并刷新，等待请求刷新后最多重放一次。refresh 失败清会话并跳登录，多标签需协调轮换；HttpOnly Cookie 配合 Secure/SameSite 与 CSRF 防护，非幂等写请求重放需幂等键。

## 689. 【推导】频繁切换页码，导致页码和数据不一致，如何处理请求竞态？ {#q-689}

**参考答案：**

每次翻页生成递增 requestId，返回时只允许最新 ID 提交数据，同时 AbortController 取消旧请求。loading/error 也按 ID 更新，页码/筛选/排序作为同一查询快照；仅取消不够，因为旧请求可能已完成或不可取消。


**示例：取消旧请求，并用序号兜底阻止过期提交。**

```js
import { ref, onScopeDispose } from 'vue'
const rows = ref([]), loading = ref(false), error = ref(null)
let latest = 0, controller
async function loadPage(page) {
  const id = ++latest
  controller?.abort()
  const current = controller = new AbortController()
  loading.value = true
  error.value = null
  try {
    const response = await fetch(`/api/items?page=${encodeURIComponent(page)}`, {
      signal: current.signal
    })
    if (!response.ok) throw new Error(`HTTP ${response.status}`)
    const result = await response.json()
    if (id === latest) rows.value = result.items
  } catch (cause) {
    if (id === latest && !current.signal.aborted) error.value = String(cause)
  } finally {
    if (id === latest) loading.value = false
  }
}
onScopeDispose(() => { latest++; controller?.abort() })
```

在 `setup` 或其组合函数中使用；实际接口还应校验 `result.items`。若页码、筛选和排序同时变化，统一以完整查询快照生成请求。

## 690. 【推导】使用 Web Worker 优化 100000000 规模的数据处理，如何拆分计算并传递结果？ {#q-690}

**参考答案：**

先明确算法与内存限制，100000000 个元素不应无条件一次创建；Worker 分块计算并只回传聚合结果/进度。使用 transferable ArrayBuffer 避免复制，必要时共享内存需隔离条件；主线程可取消，分块大小按性能测定，原题未给计算目标不能编造结果。


**示例：分块计算 0 到 count−1 的和，仅回传进度与聚合值。**

```js
// sum-worker.js：示例计算目标自定义，并非缺失原题的还原。
self.onmessage = ({ data: { count } }) => {
  if (!Number.isSafeInteger(count) || count < 0 || count > 100000000) {
    self.postMessage({ type: 'error', message: 'count 超出示例范围' })
    return
  }
  let index = 0, sum = 0
  function step() {
    const end = Math.min(index + 100000, count)
    for (; index < end; index++) sum += index
    if (index < count) {
      self.postMessage({ type: 'progress', completed: index, total: count })
      setTimeout(step, 0)
    } else self.postMessage({ type: 'done', sum })
  }
  step()
}
```

```js
// 主线程：每个 Worker 在此示例只接收一个任务。
const worker = new Worker(new URL('./sum-worker.js', import.meta.url), { type: 'module' })
worker.onmessage = ({ data }) => {
  console.log(data)
  if (data.type === 'done' || data.type === 'error') worker.terminate()
}
worker.onerror = () => worker.terminate()
worker.postMessage({ count: 100000000 })
// 用户取消或组件卸载时：worker.terminate()
```

示例不分配一亿长度数组；此求和也可用数学公式直接计算，这里只展示任务分片。一般数据计算可按块转移 ArrayBuffer，超出安全整数范围应改用合适的数值表示。

## 691. 【推导】使用 requestIdleCallback 优化大批量任务处理，如何分片调度并避免阻塞页面？ {#q-691}

**参考答案：**

将任务拆成有界小块，requestIdleCallback 中依据 timeRemaining 和时间预算处理，剩余任务再次调度。设置 timeout 防饥饿，didTimeout 也限制单片工作量；不支持时用定时器/调度器降级，CPU 重计算仍优先 Worker。


**示例：有超时、有降级且可取消的空闲切片。**

```js
function processInIdle(items, visit) {
  let index = 0, cancelled = false, handle
  const hasIdle = typeof requestIdleCallback === 'function'
  const schedule = () => {
    handle = hasIdle
      ? requestIdleCallback(run, { timeout: 1000 })
      : setTimeout(() => run({ didTimeout: false, timeRemaining: () => 4 }), 0)
  }
  function run(deadline) {
    const started = performance.now()
    let processed = 0
    while (!cancelled && index < items.length && processed < 200 &&
      performance.now() - started < 4 &&
      (deadline.timeRemaining() > 1 || (deadline.didTimeout && processed === 0))) {
      visit(items[index++])
      processed++
    }
    if (!cancelled && index < items.length) schedule()
  }
  schedule()
  return () => {
    cancelled = true
    if (hasIdle) cancelIdleCallback(handle)
    else clearTimeout(handle)
  }
}
```

此实现假定 `visit` 是很短的同步操作，无法抢占单次耗时过长的回调；单项重计算需进一步拆分或转 Worker。调用方按业务处理 `visit` 的异常。

## 692. 【推导】虚拟列表如果子元素高度不固定，如何计算位置并维护滚动体验？ {#q-692}

**参考答案：**

维护各项实测高度与前缀和，通过二分确定可视起点，加 overscan；ResizeObserver 更新高度，必要时 Fenwick tree 加速更新/查找。保存首可见项及内部偏移作滚动锚点，高度变化后校正 scrollTop，稳定 key 避免复用错位。


**简化的位置计算示例：**

```js
function prefixOffsets(heights) {
  const offsets = [0]
  for (const height of heights) offsets.push(offsets.at(-1) + height)
  return offsets
}
function firstVisible(offsets, scrollTop) {
  let low = 0, high = offsets.length - 1
  while (low < high) {
    const middle = (low + high) >>> 1
    if (offsets[middle + 1] <= scrollTop) low = middle + 1
    else high = middle
  }
  return Math.min(low, Math.max(0, offsets.length - 2))
}
// offsets[i] 是第 i 项顶部；总高为 offsets.at(-1)。
// 渲染项使用其顶部偏移，未测量项先使用估计高度。
```

以上只展示位置与二分，不是完整虚拟列表。实际还需 ResizeObserver 测量、可视结束位置、overscan、稳定 key 和锚点校正；首可见项前的高度变化 Δh 时，同步校正 scrollTop 以保持视觉位置。项目的 `LuVirtualList` 文档中还有[动态高度示例](../components/virtual-list)。

## 693. 【推导】处理并发请求控制，同时最高并发数受限时，如何实现请求队列与调度？ {#q-693}

> 第 690、691 题的具体计算目标及第 693 题的并发数值均未完整显示；补全标题只表达可能的题意，不补造这些条件。

**参考答案：**

队列持有未启动任务，active 小于 limit 时取出启动，在 finally 释放槽并调度下一项。传入函数而非已开始的 Promise，按输入索引保存结果，支持失败策略、取消和队列上限；原题未指定 limit，应作为参数而非写死数值。


**示例：限制并发、按输入顺序返回 settled 结果。**

```js
async function runLimited(tasks, limit, { signal } = {}) {
  if (!Number.isInteger(limit) || limit < 1) throw new RangeError('limit 必须是正整数')
  const results = new Array(tasks.length)
  let cursor = 0
  async function worker() {
    while (cursor < tasks.length) {
      signal?.throwIfAborted()
      const index = cursor++
      try {
        const value = await tasks[index](signal)
        results[index] = { status: 'fulfilled', value }
      } catch (reason) {
        results[index] = { status: 'rejected', reason }
      }
    }
  }
  await Promise.all(Array.from({ length: Math.min(limit, tasks.length) }, worker))
  signal?.throwIfAborted()
  return results
}
// tasks 是惰性函数数组，例如 [signal => fetch('/api/a', { signal }), ...]。
```

本例失败继续收集结果；取消后不再取新任务，已启动任务需配合 signal 终止，无法强制撤销远端副作用。无限来源应改用有上限的队列/异步迭代器，防待执行任务耗尽内存。
