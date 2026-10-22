// 题目清单、总览和分类页统一使用此分类顺序与连续题号。
export const interviewCategories = [
  {
    "title": "Node.js",
    "slug": "nodejs",
    "count": 40,
    "start": 1,
    "end": 40,
    "group": "基础技术"
  },
  {
    "title": "Python",
    "slug": "python",
    "count": 59,
    "start": 41,
    "end": 99,
    "group": "基础技术"
  },
  {
    "title": "Vue",
    "slug": "vue",
    "count": 45,
    "start": 100,
    "end": 144,
    "group": "基础技术"
  },
  {
    "title": "浏览器",
    "slug": "browser",
    "count": 6,
    "start": 145,
    "end": 150,
    "group": "基础技术"
  },
  {
    "title": "设计模式",
    "slug": "design-patterns",
    "count": 29,
    "start": 151,
    "end": 179,
    "group": "基础技术"
  },
  {
    "title": "计算机网络",
    "slug": "network",
    "count": 37,
    "start": 180,
    "end": 216,
    "group": "基础技术"
  },
  {
    "title": "LLM 推理机制",
    "slug": "llm",
    "count": 23,
    "start": 217,
    "end": 239,
    "group": "LLM 与 Agent 核心技术"
  },
  {
    "title": "Prompt 上下文工程",
    "slug": "prompt",
    "count": 16,
    "start": 240,
    "end": 255,
    "group": "LLM 与 Agent 核心技术"
  },
  {
    "title": "Tool-Calling",
    "slug": "tool-calling",
    "count": 18,
    "start": 256,
    "end": 273,
    "group": "LLM 与 Agent 核心技术"
  },
  {
    "title": "MCP 协议",
    "slug": "mcp",
    "count": 15,
    "start": 274,
    "end": 288,
    "group": "LLM 与 Agent 核心技术"
  },
  {
    "title": "Agent Skill",
    "slug": "skills",
    "count": 20,
    "start": 289,
    "end": 308,
    "group": "LLM 与 Agent 核心技术"
  },
  {
    "title": "Agent 基础",
    "slug": "agent-basics",
    "count": 30,
    "start": 309,
    "end": 338,
    "group": "LLM 与 Agent 核心技术"
  },
  {
    "title": "Agent 架构",
    "slug": "agent-architecture",
    "count": 15,
    "start": 339,
    "end": 353,
    "group": "LLM 与 Agent 核心技术"
  },
  {
    "title": "LangChain 框架",
    "slug": "langchain",
    "count": 11,
    "start": 354,
    "end": 364,
    "group": "LLM 与 Agent 核心技术"
  },
  {
    "title": "LangGraph 与框架选型",
    "slug": "langgraph",
    "count": 24,
    "start": 365,
    "end": 388,
    "group": "LLM 与 Agent 核心技术"
  },
  {
    "title": "多 Agent 协作",
    "slug": "multi-agent",
    "count": 15,
    "start": 389,
    "end": 403,
    "group": "LLM 与 Agent 核心技术"
  },
  {
    "title": "Workflow 工作流编排",
    "slug": "workflow",
    "count": 15,
    "start": 404,
    "end": 418,
    "group": "LLM 与 Agent 核心技术"
  },
  {
    "title": "向量数据库与存储",
    "slug": "storage",
    "count": 15,
    "start": 419,
    "end": 433,
    "group": "LLM 与 Agent 核心技术"
  },
  {
    "title": "RAG 知识库",
    "slug": "rag",
    "count": 16,
    "start": 434,
    "end": 449,
    "group": "LLM 与 Agent 核心技术"
  },
  {
    "title": "记忆系统",
    "slug": "memory",
    "count": 15,
    "start": 450,
    "end": 464,
    "group": "LLM 与 Agent 核心技术"
  },
  {
    "title": "任务推理策略",
    "slug": "reasoning",
    "count": 15,
    "start": 465,
    "end": 479,
    "group": "LLM 与 Agent 核心技术"
  },
  {
    "title": "多模态 Agent",
    "slug": "multimodal",
    "count": 15,
    "start": 480,
    "end": 494,
    "group": "LLM 与 Agent 核心技术"
  },
  {
    "title": "Coding Agent",
    "slug": "coding-agent",
    "count": 27,
    "start": 495,
    "end": 521,
    "group": "LLM 与 Agent 核心技术"
  },
  {
    "title": "浏览器 Agent",
    "slug": "browser-agent",
    "count": 14,
    "start": 522,
    "end": 535,
    "group": "LLM 与 Agent 核心技术"
  },
  {
    "title": "Agent Harness 工程",
    "slug": "harness",
    "count": 14,
    "start": 536,
    "end": 549,
    "group": "AI 应用工程与生产化"
  },
  {
    "title": "Agent UI 前端交互",
    "slug": "agent-ui",
    "count": 15,
    "start": 550,
    "end": 564,
    "group": "AI 应用工程与生产化"
  },
  {
    "title": "后端服务与 API 设计",
    "slug": "api",
    "count": 15,
    "start": 565,
    "end": 579,
    "group": "AI 应用工程与生产化"
  },
  {
    "title": "流式输出（SSE 与 WebSocket）",
    "slug": "streaming",
    "count": 18,
    "start": 580,
    "end": 597,
    "group": "AI 应用工程与生产化"
  },
  {
    "title": "可观测性（日志与成本分析）",
    "slug": "observability",
    "count": 15,
    "start": 598,
    "end": 612,
    "group": "AI 应用工程与生产化"
  },
  {
    "title": "自动化测试",
    "slug": "testing",
    "count": 15,
    "start": 613,
    "end": 627,
    "group": "AI 应用工程与生产化"
  },
  {
    "title": "持续集成与部署",
    "slug": "cicd",
    "count": 15,
    "start": 628,
    "end": 642,
    "group": "AI 应用工程与生产化"
  },
  {
    "title": "工程化部署",
    "slug": "deployment",
    "count": 14,
    "start": 643,
    "end": 656,
    "group": "AI 应用工程与生产化"
  },
  {
    "title": "权限、安全与合规",
    "slug": "security",
    "count": 15,
    "start": 657,
    "end": 671,
    "group": "AI 应用工程与生产化"
  },
  {
    "title": "系统设计场景题",
    "slug": "system-design",
    "count": 15,
    "start": 672,
    "end": 686,
    "group": "AI 应用工程与生产化"
  },
  {
    "title": "前端工程实践场景题",
    "slug": "frontend-practice",
    "count": 7,
    "start": 687,
    "end": 693,
    "group": "前端工程实践"
  }
] as const

export const interviewSidebar = [
  { text: '面试题', items: [{ text: '分类总览 · 693 题', link: '/interview/' }] },
  ...['基础技术', 'LLM 与 Agent 核心技术', 'AI 应用工程与生产化', '前端工程实践'].map(group => ({
    text: group,
    collapsed: false,
    items: interviewCategories.filter(item => item.group === group).map(item => ({
      text: `${item.title}（${item.count}）`,
      link: `/interview/${item.slug}`
    }))
  }))
]
