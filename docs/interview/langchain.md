---
title: "LangChain 框架面试题"
description: "LangChain 框架分类，共 11 道面试题，按全站连续题号编排并提供参考答案。"
---

# LangChain 框架

共 **11 题**，题号 **354–364**。 [返回分类总览](./)

> 答案用于面试复习与工程讨论；【推导】保留原文标记，表示题意依据不完整截图补全。实现细节请结合项目锁定的版本验证。

## 354. 【推导】LangChain 在 Agent 技术栈里定位是什么？主要解决哪些问题？ {#q-354}

**参考答案：**

LangChain 提供模型、消息、工具、结构化输出等集成与高层 Agent 入口，降低多供应商接入成本。具体 API 随版本演进，应固定依赖并使用对应文档，不把旧 Chain/AgentExecutor 教程当唯一实现方式。

## 355. 【推导】Runnable 协议与 LCEL 是什么？如何用它们组合执行链？ {#q-355}

**参考答案：**

Runnable 统一 invoke、batch、stream 等调用接口，LCEL 用管道等组合映射、并行与串行步骤。例如 prompt | model | parser；它适合数据流组合，不自动提供所有长任务持久化与审批能力。

## 356. 【推导】Message 类型体系与 ChatModel 有什么关系？如何组织消息与模型调用？ {#q-356}

**参考答案：**

SystemMessage、HumanMessage、AIMessage、ToolMessage 表示角色和内容，ChatModel 接受消息序列并返回 AIMessage 等结果。工具结果通过 tool_call_id 配对，注意多模态内容块和具体厂商适配，不能简单拼成无角色字符串。

## 357. 【推导】LangChain 中 Tool 的定义和 bind_tools 如何使用？如何完成工具绑定与调用？ {#q-357}

**参考答案：**

通过函数/@tool 或结构化定义声明工具，model.bind_tools(tools) 使模型了解 schema 并返回 tool_calls。应用/Agent runtime 解析校验参数、执行工具、把 ToolMessage 传回模型；绑定本身不等于自动执行。

## 358. 【推导】用 LangChain 预置组件搭一条标准 Agent 执行链，需要哪些组件和步骤？ {#q-358}

**参考答案：**

准备 ChatModel、工具定义、系统提示和消息状态，使用对应版本的 Agent 构造入口运行模型—工具循环，并配置检查点/事件与错误处理。可用 create_agent 等高层入口；生产仍需业务鉴权、幂等和预算。

## 359. 【推导】LangChain Memory 抽象各实现有什么区别？如何选择和管理对话上下文？ {#q-359}

**参考答案：**

旧教程有缓冲、窗口、摘要等 Memory 类，分别以完整历史、近期轮次或压缩摘要提供上下文。当前实现宜按版本使用图状态/checkpointer 管短期、store 管长期，避免直接照搬已弃用类名。

## 360. 【推导】Output Parser 与 with_structured_output 有什么区别？分别适用于什么场景？ {#q-360}

**参考答案：**

Output Parser 在生成后解析/验证文本，可能因格式错误失败；with_structured_output 利用模型支持的 schema/工具调用等机制约束并解析。都需处理拒答、截断和业务约束，具体支持方式由模型与适配器决定。

## 361. 【推导】CallbackHandler 与 LangSmith 如何用于调用追踪、调试和观测？ {#q-361}

**参考答案：**

CallbackHandler 订阅模型、工具和链路事件，LangSmith 提供追踪、调试和评测视图。关联业务 runId 与模型/工具 span，控制采样、脱敏和成本；平台观测不能替代关键业务审计。

## 362. 【推导】langchain-core、community 等包分别承担什么职责？如何组织项目依赖？ {#q-362}

**参考答案：**

langchain-core 提供核心抽象，供应商集成通常在独立包，community 放社区集成，langchain 提供高层能力。固定兼容版本，按实际需要安装，避免为了一个模型拉入全部可选依赖。

## 363. 【推导】什么场景直接调用厂商 SDK 比引入 LangChain 更合适？ {#q-363}

**参考答案：**

简单单模型调用、特定厂商新特性、严格性能/依赖要求或已有编排时，直接 SDK 更清晰。跨模型、多工具和复杂状态时框架可能节省开发成本；用实际代码量、可测性和升级成本比较。

## 364. 【推导】LangChain 中 AgentExecutor 和其他 Agent 执行方式有什么区别？如何选择？ {#q-364}

**参考答案：**

AgentExecutor 是旧架构常见执行器，现代入口和 LangGraph 更强调显式状态、持久化、流式与中断。新项目按锁定版本选择受维护入口，迁移须测试工具消息格式和控制行为，不仅替换构造函数名。

## 参考资料

以下官方资料用于核对相关协议与版本敏感点，其余方案题为工程参考设计。

- [LangChain 当前架构与入口](https://docs.langchain.com/oss/python/langchain/overview)
