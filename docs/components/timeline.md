# Timeline 时间线

按阅读顺序展示活动记录。使用原生列表语义，可通过 `aria-label` 为时间线命名。


## 基础用法

<DemoBlock direction="column">
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

| 属性 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `timestamp` | `string` | `—` | 时间文本 |
| `datetime` | `string` | `—` | 传给 time 元素的机器可读时间 |
| `hideTimestamp` | `boolean` | `false` | 隐藏时间及时间插槽 |
| `placement` | `top / bottom` | `bottom` | 时间相对内容的位置 |
| `type` | `primary / success / warning / danger / info` | `primary` | 节点类型 |
| `color` | `string` | `—` | 自定义节点颜色，优先于 type |
| `size` | `normal / large` | `normal` | 节点尺寸 |
| `hollow` | `boolean` | `false` | 是否为空心节点 |



## Timeline 插槽

| 插槽名 | 插槽参数 | 说明 |
| --- | --- | --- |
| `default` | `—` | 时间线子项 |



## TimelineItem 插槽

| 插槽名 | 插槽参数 | 说明 |
| --- | --- | --- |
| `default` | `—` | 节点内容 |
| `timestamp` | `—` | 自定义时间 |
| `dot` | `—` | 自定义装饰节点 |



## 使用说明

按照阅读顺序放置 LuTimelineItem。组件使用原生列表语义，可通过 aria-label 命名。hideTimestamp 也会隐藏时间插槽。dot 仅用于装饰，不应包含交互控件。请同时使用文字表达状态。组件不发出事件。
