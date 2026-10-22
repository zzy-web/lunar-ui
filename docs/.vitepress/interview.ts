// 分类、题数与题号范围须与原始题库保持一致。
export const interviewCategories = [
  {
    "title": "Node.js",
    "slug": "nodejs",
    "count": 40,
    "start": 42,
    "end": 81,
    "group": "基础技术"
  },
  {
    "title": "Python",
    "slug": "python",
    "count": 59,
    "start": 82,
    "end": 142,
    "group": "基础技术"
  },
  {
    "title": "Vue",
    "slug": "vue",
    "count": 45,
    "start": 318,
    "end": 362,
    "group": "基础技术"
  },
  {
    "title": "浏览器",
    "slug": "browser",
    "count": 6,
    "start": 363,
    "end": 368,
    "group": "基础技术"
  },
  {
    "title": "设计模式",
    "slug": "design-patterns",
    "count": 29,
    "start": 369,
    "end": 397,
    "group": "基础技术"
  },
  {
    "title": "计算机网络",
    "slug": "network",
    "count": 37,
    "start": 398,
    "end": 434,
    "group": "基础技术"
  },
  {
    "title": "LLM 推理机制",
    "slug": "llm",
    "count": 23,
    "start": 435,
    "end": 457,
    "group": "LLM 与 Agent 核心技术"
  },
  {
    "title": "Prompt 上下文工程",
    "slug": "prompt",
    "count": 16,
    "start": 458,
    "end": 473,
    "group": "LLM 与 Agent 核心技术"
  },
  {
    "title": "Tool-Calling",
    "slug": "tool-calling",
    "count": 18,
    "start": 474,
    "end": 491,
    "group": "LLM 与 Agent 核心技术"
  },
  {
    "title": "MCP 协议",
    "slug": "mcp",
    "count": 15,
    "start": 492,
    "end": 506,
    "group": "LLM 与 Agent 核心技术"
  },
  {
    "title": "Agent Skill",
    "slug": "skills",
    "count": 20,
    "start": 507,
    "end": 526,
    "group": "LLM 与 Agent 核心技术"
  },
  {
    "title": "Agent 基础",
    "slug": "agent-basics",
    "count": 30,
    "start": 527,
    "end": 556,
    "group": "LLM 与 Agent 核心技术"
  },
  {
    "title": "Agent 架构",
    "slug": "agent-architecture",
    "count": 15,
    "start": 557,
    "end": 571,
    "group": "LLM 与 Agent 核心技术"
  },
  {
    "title": "LangChain 框架",
    "slug": "langchain",
    "count": 11,
    "start": 572,
    "end": 582,
    "group": "LLM 与 Agent 核心技术"
  },
  {
    "title": "LangGraph 与框架选型",
    "slug": "langgraph",
    "count": 24,
    "start": 583,
    "end": 606,
    "group": "LLM 与 Agent 核心技术"
  },
  {
    "title": "多 Agent 协作",
    "slug": "multi-agent",
    "count": 15,
    "start": 607,
    "end": 621,
    "group": "LLM 与 Agent 核心技术"
  },
  {
    "title": "Workflow 工作流编排",
    "slug": "workflow",
    "count": 15,
    "start": 622,
    "end": 636,
    "group": "LLM 与 Agent 核心技术"
  },
  {
    "title": "向量数据库与存储",
    "slug": "storage",
    "count": 15,
    "start": 637,
    "end": 651,
    "group": "LLM 与 Agent 核心技术"
  },
  {
    "title": "RAG 知识库",
    "slug": "rag",
    "count": 16,
    "start": 652,
    "end": 667,
    "group": "LLM 与 Agent 核心技术"
  },
  {
    "title": "记忆系统",
    "slug": "memory",
    "count": 15,
    "start": 668,
    "end": 682,
    "group": "LLM 与 Agent 核心技术"
  },
  {
    "title": "任务推理策略",
    "slug": "reasoning",
    "count": 15,
    "start": 683,
    "end": 697,
    "group": "LLM 与 Agent 核心技术"
  },
  {
    "title": "多模态 Agent",
    "slug": "multimodal",
    "count": 15,
    "start": 698,
    "end": 712,
    "group": "LLM 与 Agent 核心技术"
  },
  {
    "title": "Coding Agent",
    "slug": "coding-agent",
    "count": 27,
    "start": 713,
    "end": 739,
    "group": "LLM 与 Agent 核心技术"
  },
  {
    "title": "浏览器 Agent",
    "slug": "browser-agent",
    "count": 14,
    "start": 740,
    "end": 753,
    "group": "LLM 与 Agent 核心技术"
  },
  {
    "title": "Agent Harness 工程",
    "slug": "harness",
    "count": 14,
    "start": 754,
    "end": 767,
    "group": "AI 应用工程与生产化"
  },
  {
    "title": "Agent UI 前端交互",
    "slug": "agent-ui",
    "count": 15,
    "start": 768,
    "end": 782,
    "group": "AI 应用工程与生产化"
  },
  {
    "title": "后端服务与 API 设计",
    "slug": "api",
    "count": 15,
    "start": 783,
    "end": 797,
    "group": "AI 应用工程与生产化"
  },
  {
    "title": "流式输出（SSE 与 WebSocket）",
    "slug": "streaming",
    "count": 18,
    "start": 798,
    "end": 815,
    "group": "AI 应用工程与生产化"
  },
  {
    "title": "可观测性（日志与成本分析）",
    "slug": "observability",
    "count": 15,
    "start": 816,
    "end": 830,
    "group": "AI 应用工程与生产化"
  },
  {
    "title": "自动化测试",
    "slug": "testing",
    "count": 15,
    "start": 831,
    "end": 845,
    "group": "AI 应用工程与生产化"
  },
  {
    "title": "持续集成与部署",
    "slug": "cicd",
    "count": 15,
    "start": 846,
    "end": 860,
    "group": "AI 应用工程与生产化"
  },
  {
    "title": "工程化部署",
    "slug": "deployment",
    "count": 14,
    "start": 861,
    "end": 874,
    "group": "AI 应用工程与生产化"
  },
  {
    "title": "权限、安全与合规",
    "slug": "security",
    "count": 15,
    "start": 875,
    "end": 889,
    "group": "AI 应用工程与生产化"
  },
  {
    "title": "系统设计场景题",
    "slug": "system-design",
    "count": 15,
    "start": 890,
    "end": 904,
    "group": "AI 应用工程与生产化"
  },
  {
    "title": "前端工程实践场景题",
    "slug": "frontend-practice",
    "count": 7,
    "start": 905,
    "end": 911,
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
