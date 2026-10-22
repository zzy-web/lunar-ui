---
title: "Vue面试题"
description: "Vue分类，共 45 道面试题，按全站连续题号编排并提供参考答案。"
---

# Vue

共 **45 题**，题号 **100–144**。 [返回分类总览](./)

> 答案用于面试复习与工程讨论，具体实现请结合项目锁定的版本验证。

::: info 源码专题说明
132–144 的“Vue 3.6 alien-signals”为原始材料标题。本页解释信号系统的通用原理；未指定源码 tag/commit 时，不对具体版本的内部字段和算法名称作保证。[alien-signals 源码](https://github.com/stackblitz/alien-signals) · [Vue 发布记录](https://github.com/vuejs/core/blob/main/CHANGELOG.md)。
:::

## 100. Vue 2 不能监听数组下标的原因是什么？ {#q-100}

**参考答案：**

Vue 2 对数组主要通过改写 push、splice 等方法触发通知，没有为每个下标设置响应式 setter；直接 arr[i] = x 或改 length 不会按预期通知。使用 Vue.set(arr, i, x)、splice 或替换数组；这属于实现取舍而非 Object.defineProperty 绝对不能拦截数字键。

## 101. Vue 2 和 Vue 3 的具体区别是什么？ {#q-101}

**参考答案：**

Vue 2 主要用 Object.defineProperty，Vue 3 用 Proxy，并提供 Composition API、Fragment、Teleport 等能力。Vue 3 改善类型支持、编译优化和应用实例隔离；迁移还需检查 v-model、全局 API、事件和生态依赖兼容。

## 102. Vue 的通讯方式有哪些？ {#q-102}

**参考答案：**

父子用 props/emits 和 v-model，跨层用 provide/inject，复杂共享状态用 Pinia，插槽负责内容与作用域数据。模板 ref 可调用显式暴露的方法，但不宜形成紧耦合；事件总线必须管理订阅清理。

## 103. Vue 的常用修饰符有哪些？ {#q-103}

**参考答案：**

事件常用 .stop、.prevent、.once、.self、.capture、.passive，表单常用 .trim、.number、.lazy，按键如 .enter。修饰符顺序影响行为；.passive 不应与阻止默认行为组合，.number 也不能替代完整数值校验。

## 104. Vue 2 初始化过程做了哪些事？ {#q-104}

**参考答案：**

Vue 2 初始化合并选项，建立生命周期/事件/渲染上下文，调用 beforeCreate，初始化注入、props、methods、data、computed、watch 等，再 created。挂载时编译模板/获取 render，创建渲染 watcher，生成并 patch DOM。

## 105. created 和 mounted 这两个生命周期钩子有什么区别？分别适合进行哪些操作？ {#q-105}

**参考答案：**

created 时数据、方法和响应式已建立，但尚无挂载 DOM，适合发起不依赖 DOM 的工作。mounted 时组件 DOM 已插入，可读取模板 ref 或初始化 DOM 插件；不保证异步子树、图片等都已完成，SSR 不执行 mounted。

## 106. Vue 的 $nextTick 是如何实现的？ {#q-106}

**参考答案：**

nextTick 把回调/Promise 接到 Vue 的批量更新队列之后；Vue 3 调度通常基于 Promise 微任务，Vue 2 还有不同环境降级。它保证等待已排队的 DOM 更新，不保证浏览器已绘制，也不能等待任意网络请求。

## 107. 以下两段代码在 Vue 中分别渲染出什么结果？ {#q-107}

> 截图只显示题目标题开头，未显示所指的两段代码，因此不能还原具体代码或确定完整考点。

**参考答案：**

原题缺少两段代码，无法判断具体渲染结果。解题需逐步检查绑定值、模板自动解包、v-if/v-for、响应式修改与 nextTick 时机；应先补齐代码、Vue 版本和执行位置，不能凭标题编造输出。

## 108. 为什么 Vue 中的 data 是一个 function，而不是直接使用对象？ {#q-108}

**参考答案：**

可复用组件的 data 使用函数，为每个实例返回独立对象，避免多个实例共享可变状态。Vue 2 根实例存在不同规则；Vue 3 Options API 的 data 也应返回对象，Composition API 则在每次 setup 中创建实例状态。

## 109. Vue 的父组件和子组件生命周期钩子的执行顺序是什么？ {#q-109}

**参考答案：**

同步父子组件初次挂载通常是父 beforeCreate/created、父 beforeMount，子创建与挂载，子 mounted，父 mounted。更新通常父 beforeUpdate、子 beforeUpdate、子 updated、父 updated；卸载父 beforeUnmount、子 beforeUnmount、子 unmounted、父 unmounted，异步子组件需另论。

## 110. watch 和 computed 有什么区别？ {#q-110}

**参考答案：**

computed 描述从响应式依赖计算出的值，按依赖缓存，适合纯同步计算。watch 观察指定来源并运行副作用，可执行异步请求、清理过期任务和控制触发时机；不应为简单派生值再维护一份重复状态。

## 111. 谈谈 computed 的机制：缓存了什么，什么时候会重新计算？ {#q-111}

**参考答案：**

computed 缓存上次求值结果并记录读取到的响应式依赖。依赖变化后标记失效，下一次读取时按需重新计算；没有响应式依赖的 Date.now() 不会自行刷新，缓存不是按传入参数建立的通用记忆化缓存。

## 112. 为什么 computed 不支持异步？ {#q-112}

**参考答案：**

computed getter 设计用于同步派生和同步依赖追踪，async getter 返回的是 Promise，await 后读取也无法按普通同步 getter 的方式完整追踪。异步数据使用 watch/watchEffect 配合独立 ref、加载态、错误态和过期请求清理。

## 113. Vue 3 DOM Diff 算法。 {#q-113}

**参考答案：**

Vue 3 patch 先比较节点类型和 key，针对 keyed 子节点同步头尾、处理新增/删除，再映射中间区间并借助 LIS 减少移动。编译产生的 patch flag 和 block tree 可跳过静态部分；稳定唯一 key 是正确复用的前提。

## 114. Vue 3 的最长递增子序列算法。 {#q-114}

**参考答案：**

将新序列中复用节点映射为旧索引，求其最长递增子序列，该子序列保持相对顺序，可不移动。常用二分维护尾值并记录前驱，复杂度 O(n log n)；忽略代表新节点的空位，逆序遍历插入或移动其他节点。

## 115. Vue 3 中 ref 和 reactive 的区别。 {#q-115}

**参考答案：**

ref 通过 .value 包装任意值，对对象默认深层响应式；reactive 返回对象的深层 Proxy，不能直接用于原始值。reactive 解构原始属性或整体替换引用容易失去关联，可用 toRefs；模板中的 ref 自动解包有上下文限制。

## 116. Vue 3 区分 ref 和 reactive 的原因。 {#q-116}

**参考答案：**

原始值不能作为 Proxy 的对象目标，ref 用统一容器承载标量、对象和可替换引用；reactive 提供自然的对象属性访问。两者服务不同状态建模需求，可结合 toRef/toRefs，不是互相完全替代。

## 117. Vue 响应式中的 Observer、Dep、Watcher 分别是什么？它们如何协作实现响应式更新？ {#q-117}

**参考答案：**

Vue 2 Observer 遍历对象建立 getter/setter，Dep 管理某属性的订阅者，Watcher 求值时被记录为当前依赖目标。getter 收集 watcher，setter 通知 Dep，watcher 进入批量调度；分支依赖变化后还要清理旧订阅。

## 118. Vue 3 为什么要用 Proxy 替换 Object.defineProperty 实现响应式？ {#q-118}

**参考答案：**

Proxy 拦截对象层面的 get/set/delete/has/ownKeys 等操作，能覆盖新增删除属性与数组操作并支持更完整的集合处理。Vue 2 需预先遍历并对新增属性另行处理；Proxy 也有边界，如代理身份不同和解构丢失响应关联。

## 119. 什么是虚拟 DOM？ {#q-119}

**参考答案：**

虚拟 DOM 是描述界面结构的 JS 节点树，包含类型、属性、子节点和 key。渲染器比较新旧树并更新宿主节点，便于声明式和跨平台；它不是必然比手写 DOM 快，性能取决于更新粒度及编译优化。

## 120. Vue 2 的生命周期。 {#q-120}

**参考答案：**

Vue 2 主要有 beforeCreate、created、beforeMount、mounted、beforeUpdate、updated、beforeDestroy、destroyed；keep-alive 有 activated/deactivated，另有 errorCaptured。初始化数据和 DOM 的可用时点不同，资源应在销毁前清理。

## 121. Vue 3 的生命周期。 {#q-121}

**参考答案：**

Vue 3 Options API 保留创建、挂载、更新钩子，将销毁改为 beforeUnmount/unmounted；Composition API 常用 onMounted、onUpdated、onBeforeUnmount、onUnmounted。setup 在创建阶段运行，钩子通常需在 setup 同步注册。

## 122. watch 怎么深度监听对象变化？ {#q-122}

**参考答案：**

watch(() => state.obj, callback, { deep: true }) 深度遍历依赖；直接 watch reactive 对象默认深层监听。嵌套原地修改时新旧值常是同一对象引用，需历史快照才能 diff；深遍历有成本，应尽量监听精确字段。

## 123. Vue 2 删除数组元素时，用 delete 和 Vue.delete 有什么区别？ {#q-123}

**参考答案：**

delete arr[i] 留下空洞、长度不变，且 Vue 2 无法按其数组增强方法通知更新；Vue.delete(arr, i) 对有效下标使用 splice，使元素前移并触发通知。业务上删除列表项通常优先 splice 或 filter。

## 124. Vue 3.0 编译做了哪些优化？ {#q-124}

**参考答案：**

主要有静态提升、patch flag 标记动态部分、block tree 收集动态节点、缓存部分事件处理器等。编译器提供可跳过工作的提示，降低运行时全树比较；具体优化是否生成取决于模板和编译选项。

## 125. Vue 3.0 新特性——Composition API 是什么？如何使用，有哪些优势？ {#q-125}

**参考答案：**

Composition API 用 ref/reactive 定义状态、computed 派生、watch 处理副作用，并通过组合函数复用有状态逻辑。逻辑按业务关注点组织，类型推断更自然；组合函数应正确清理监听并避免意外共享模块级状态。

## 126. Vue 要做权限管理该怎么做？如何实现路由权限和按钮权限控制？ {#q-126}

**参考答案：**

登录后获取角色/权限，路由 meta 与守卫控制导航，必要时动态注册路由；按钮用指令或组件按权限显示/禁用。前端只是体验控制，服务端必须对每个资源操作鉴权，刷新后恢复权限且退出时清除状态。

## 127. Vue 项目脚手架。 {#q-127}

**参考答案：**

Vue 3 新项目通常通过 create-vue 生成 Vite 项目，再选择 TypeScript、Router、Pinia 与测试配置。脚手架负责初始结构和工具链，不提供完整业务架构；已有 Vue CLI 项目迁移应评估插件和构建差异。

## 128. Vue Router 3.x 的 hash 模式与 history 模式有什么区别？分别如何实现，需要哪些服务端配置？ {#q-128}

**参考答案：**

hash 路由放在 # 后，片段不发给服务器，通过 hashchange 导航；history 用 pushState/replaceState 和 popstate，URL 更自然。history 深链需服务器回退应用入口，但 API/静态文件/真实 404 不应全部错误地回退。

## 129. Vue 3.5 更新——Props 响应式更新。 {#q-129}

**参考答案：**

Vue 3.5 中，同一 script setup 内从 defineProps 解构的变量由编译器保持响应式访问。传给 watch 或外部组合函数时应使用 getter，如 () => foo；普通对象解构不会因此自动响应化。[官方说明](https://vuejs.org/api/sfc-script-setup.html#reactive-props-destructure)

## 130. Vue 3.5 更新——useTemplateRef。 {#q-130}

**参考答案：**

useTemplateRef('input') 将逻辑中的 ref 与模板 ref="input" 关联，挂载后可访问元素/组件并帮助推断类型。挂载前或条件卸载后可能为 null，调用 DOM 方法前需判断；它不等于普通业务状态 ref。

## 131. Vue 3.5 更新——watch deep。 {#q-131}

**参考答案：**

Vue 3.5 的 watch deep 可设置数字表示最大遍历深度；如监听数组时 deep: 1 可覆盖替换和数组层级变更，而不深遍历元素内部。根据数据结构选深度，仍要注意遍历开销。[官方说明](https://vuejs.org/guide/essentials/watchers.html#deep-watchers)

## 132. Vue 3.6 alien-signals——如何调试文件并跟踪源码执行流程？ {#q-132}

**参考答案：**

先固定题目对应 Vue/alien-signals 的 tag 或 commit，使用源码 source map，在响应式读取、写入、追踪、传播和执行处打断点。用最小条件依赖示例跟踪链路；原题“Vue 3.6”是来源标题，未指定提交不能把某篇分析当作所有版本事实。

## 133. Vue 3.6 alien-signals——signal。 {#q-133}

**参考答案：**

signal 通常是可读取/写入的响应式值，读取时关联当前订阅者，写入时比较变化并使下游失效。派生计算和 effect 基于依赖图运行；具体 API 与状态字段依 alien-signals 版本，不能直接等同 Vue 公共 ref API。

## 134. Vue 3.6 alien-signals——图论。 {#q-134}

**参考答案：**

把信号/派生计算/effect 视作图节点，依赖与订阅是有向边。更新传播相当于沿边遍历，需解决动态建边、去重、菱形依赖和失效判断；可先画 A→B、A→C、B/C→D 解释为何不能盲目重复执行 D。

## 135. Vue 3.6 alien-signals——如何建立信号与订阅者之间的关系？ {#q-135}

**参考答案：**

订阅者执行前设为 active subscriber，读取 signal 时创建或复用双方之间的依赖边，执行后恢复上一个 active subscriber。边要能从依赖端通知订阅者，也能从订阅端清理依赖；避免同轮重复记录。

## 136. Vue 3.6 alien-signals——依赖构建。 {#q-136}

**参考答案：**

依赖构建不是扫描代码，而是在派生计算/effect 实际运行时捕获读取。条件分支决定当前依赖集合，每次重算复用有效边并清理未再读取的边；未执行的分支不应持续订阅。

## 137. Vue 3.6 alien-signals——依赖构建过程中，如何记录和连接依赖关系？ {#q-137}

**参考答案：**

典型实现用 Link 记录 dependency、subscriber 及两端前后链接，把边挂到双方链表中。跟踪读取时检查当前轮次/游标，复用已有边或插入新边；这是原理示意，具体字段以锁定源码提交为准。

## 138. Vue 3.6 alien-signals——依赖构建过程中，如何更新和清理依赖关系？ {#q-138}

**参考答案：**

运行前准备依赖游标，运行中逐步匹配/复用实际读取到的依赖，结束后删除多余边并同步更新双向链表。用 flag ? a : b 测试切换后旧分支不再触发，兼顾异常退出清理和重复依赖去重。

## 139. Vue 3.6 alien-signals——数据信号如何读取、更新并触发依赖传播？ {#q-139}

**参考答案：**

读取信号返回当前值并在跟踪上下文中建边；更新先按实现的相等规则判断，再标记并传播失效。派生节点按需重新计算，变化确认后再驱动 effect；批量更新中要区分“可能变化”和“值确实变化”。

## 140. Vue 3.6 alien-signals——传播模型如何工作，如何通知依赖方更新？ {#q-140}

**参考答案：**

沿订阅关系把下游标记为可能失效，再在需要读取/执行时检查上游是否真的改变，结合推送失效与拉取求值。菱形图应避免重复执行和读取中间不一致值；调度与批处理策略以实现为准。

## 141. Vue 3.6 alien-signals——状态机。 {#q-141}

**参考答案：**

状态机用标志表示节点未失效、待验证、已脏、正在追踪/执行等状态，以减少无意义重算并防止重入。不要背固定枚举数值，应解释各状态的进入条件、执行条件和清理条件。

## 142. Vue 3.6 alien-signals——各种状态如何表示，状态之间如何转换？ {#q-142}

**参考答案：**

写入使节点从有效转为待验证/脏；读取派生值时检查依赖，必要时计算；若结果未变可消除下游的无效唤醒，计算完成恢复有效。嵌套计算需要保存并恢复运行状态，异常也必须清理。

## 143. Vue 3.6 alien-signals——栈结构替代递归的实现思路是什么？ {#q-143}

**参考答案：**

把递归遍历的返回位置、当前节点和下一条边保存到显式栈，用 while 推进依赖图。这样可避免深图调用栈溢出，并可精确控制回溯；仍要防重复访问、循环依赖和额外分配。

## 144. Vue 3.6 alien-signals——染色算法如何用于依赖状态标记与更新传播？ {#q-144}

> 132–144 保留截图中的版本与专题名称，未对这些名称的技术准确性进行核验。其中 137、138 的可见标题均仅为“依赖构建…”，上述补全是可能的题意，无法确认原题的分篇内容和顺序。

**参考答案：**

“染色”可理解为为节点标记有效、待检查、已失效等状态：更新时沿边标记，求值时确认并清除。它帮助剪枝和去重，不是固定公共 API；应结合具体源码说明标志如何改变，不能把概念比喻当成版本保证。

## 参考资料

以下官方资料用于核对相关协议与版本敏感点，其余方案题为工程参考设计。

- [Vue Watchers](https://vuejs.org/guide/essentials/watchers.html)
- [响应式 Props 解构](https://vuejs.org/api/sfc-script-setup.html#reactive-props-destructure)
