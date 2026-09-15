# Timeline 时间线

按阅读顺序展示活动记录。使用原生列表语义，可通过 `aria-label` 为时间线命名。

## 基础用法

<DemoBlock>
<lu-timeline aria-label="项目记录">
  <lu-timeline-item timestamp="2026-09-15" datetime="2026-09-15" type="success" placement="top"><lu-card>项目已创建</lu-card></lu-timeline-item>
  <lu-timeline-item timestamp="10:00" type="warning" size="large" hollow>审核中</lu-timeline-item>
  <lu-timeline-item timestamp="11:00" color="#8b5cf6">等待发布</lu-timeline-item>
</lu-timeline>
<template #source>

```vue
<template>
  <lu-timeline aria-label="项目记录">
    <lu-timeline-item timestamp="2026-09-15" datetime="2026-09-15" type="success" placement="top"><lu-card>项目已创建</lu-card></lu-timeline-item>
    <lu-timeline-item timestamp="10:00" type="warning" size="large" hollow>审核中</lu-timeline-item>
    <lu-timeline-item timestamp="11:00" color="#8b5cf6">等待发布</lu-timeline-item>
  </lu-timeline>
</template>
```

</template>
</DemoBlock>

## TimelineItem Props

- `timestamp`：时间文本。
- `datetime`：HTML `time` 元素的机器可读日期时间。
- `hideTimestamp`：隐藏时间及时间插槽，默认 `false`。
- `placement`：`top | bottom`，默认 `bottom`。
- `type`：`primary | success | warning | danger | info`，默认 `primary`。
- `color`：自定义节点颜色，优先于 `type`。
- `size`：`normal | large`，默认 `normal`。
- `hollow`：空心节点，默认 `false`。

## 插槽

`LuTimeline` 默认插槽放置 `LuTimelineItem`。子项支持 `default`（内容）、`timestamp`（时间内容）和 `dot`（装饰节点）。自定义节点不应包含交互控件。

组件不发出事件。请同时使用内容文字表达状态，避免仅依靠颜色。
