# VirtualList 虚拟列表

只渲染可视区和缓冲区内的行，支持固定行高和动态行高。默认固定行高模式会裁剪超出内容；图文混排或可展开内容请启用 `dynamic`。

<script setup>
import { ref } from 'vue'
const list = ref()
const items = Array.from({ length: 10000 }, (_, id) => ({ id, name: `记录 ${id + 1}` }))
const expanded = ref({})
const stories = Array.from({ length: 1000 }, (_, id) => ({ id, text: '这是一条会根据容器宽度自动换行的动态记录。'.repeat(id % 4 + 1) }))
const picture = 'data:image/svg+xml,' + encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" width="480" height="160"><rect width="480" height="160" fill="#409eff"/><circle cx="360" cy="50" r="30" fill="white"/></svg>')
</script>


## 一万条数据与滚动定位

<DemoBlock direction="column">
<lu-button @click="list?.scrollToIndex(4999, 'center')">定位第 5000 条</lu-button>
<lu-virtual-list ref="list" :items="items" item-key="id" :height="280" :item-height="44" label="记录列表">
  <template #default="{ item, index }"><div style="padding: 10px 16px; border-bottom: 1px solid var(--epx-border-color-light)">{{ index + 1 }} · {{ item.name }}</div></template>
</lu-virtual-list>
<template #source>

```vue
<script setup>
import { ref } from 'vue'
const list = ref()
const items = Array.from({ length: 10000 }, (_, id) => ({ id, name: `记录 ${id + 1}` }))
</script>

<template>
  <lu-button @click="list?.scrollToIndex(4999, 'center')">定位第 5000 条</lu-button>
  <lu-virtual-list ref="list" :items="items" item-key="id" :height="280" :item-height="44" label="记录列表">
    <template #default="{ item, index }"><div style="padding: 10px 16px; border-bottom: 1px solid var(--epx-border-color-light)">{{ index + 1 }} · {{ item.name }}</div></template>
  </lu-virtual-list>
</template>
```

</template>
</DemoBlock>


## 动态行高与展开内容

<DemoBlock direction="column">
<lu-virtual-list :items="stories" item-key="id" dynamic :item-height="120" :height="360" label="动态记录">
  <template #default="{ item }">
    <article style="padding: 16px; border-bottom: 1px solid var(--epx-border-color-light)">
      <strong>记录 {{ item.id + 1 }}</strong>
      <p>{{ item.text }}</p>
      <lu-image v-if="item.id % 5 === 0" :src="picture" width="100%" alt="蓝色插图" lazy />
      <lu-button size="small" @click="expanded[item.id] = !expanded[item.id]">展开 / 收起</lu-button>
      <p v-if="expanded[item.id]">{{ item.text.repeat(3) }}</p>
    </article>
  </template>
</lu-virtual-list>
<template #source>

```vue
<script setup>
import { ref } from 'vue'
const list = ref()
const items = Array.from({ length: 10000 }, (_, id) => ({ id, name: `记录 ${id + 1}` }))
const expanded = ref({})
const stories = Array.from({ length: 1000 }, (_, id) => ({ id, text: '这是一条会根据容器宽度自动换行的动态记录。'.repeat(id % 4 + 1) }))
const picture = 'data:image/svg+xml,' + encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" width="480" height="160"><rect width="480" height="160" fill="#409eff"/><circle cx="360" cy="50" r="30" fill="white"/></svg>')
</script>

<template>
  <lu-virtual-list :items="stories" item-key="id" dynamic :item-height="120" :height="360" label="动态记录">
    <template #default="{ item }">
      <article style="padding: 16px; border-bottom: 1px solid var(--epx-border-color-light)">
        <strong>记录 {{ item.id + 1 }}</strong>
        <p>{{ item.text }}</p>
        <lu-image v-if="item.id % 5 === 0" :src="picture" width="100%" alt="蓝色插图" lazy />
        <lu-button size="small" @click="expanded[item.id] = !expanded[item.id]">展开 / 收起</lu-button>
        <p v-if="expanded[item.id]">{{ item.text.repeat(3) }}</p>
      </article>
    </template>
  </lu-virtual-list>
</template>
```

</template>
</DemoBlock>

动态模式通过 `ResizeObserver` 测量行高，支持图片加载、文本换行和展开后自动更新。高度按稳定键缓存，新增或移除上方数据时保留当前阅读锚点；容器宽度变化会清除旧测量并重新测量可见行。

未渲染的行使用估计高度，远距离滚动定位会在目标测量后校正。请提供唯一稳定的 `itemKey` 和接近平均行高的 `itemHeight`；行外边距不计入测量，请使用内容内边距。离屏内容变化后可调用 `resetHeights()` 清除旧缓存。运行环境需要支持 `ResizeObserver` 才能持续跟踪尺寸变化。

## VirtualList Props

| 属性 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `items` | `T[]` | `[]` | 数据数组，插槽类型随元素推导 |
| `height` | `number` | `300` | 视口高度（px） |
| `itemHeight` | `number` | `40` | 固定行高或动态模式下的估计行高（px） |
| `dynamic` | `boolean` | `false` | 启用动态行高测量 |
| `overscan` | `number` | `3` | 上下各额外渲染的行数 |
| `itemKey` | `keyof T / ((item: T, index: number) => string / number)` | `—` | 稳定键字段或函数，默认使用索引 |
| `label` | `string` | `Virtual list` | 列表无障碍名称 |



## 事件

| 事件名 | 参数 | 说明 |
| --- | --- | --- |
| `scroll` | `(offset: number)` | 原生滚动时触发，参数为像素偏移 |
| `rangeChange` | `({ start: number, end: number })` | 首次渲染和渲染范围变化时触发；含缓冲行，end 不包含在范围内 |



## 插槽

| 插槽名 | 插槽参数 | 说明 |
| --- | --- | --- |
| `default` | `{ item: T, index: number }` | 行内容，索引从零开始 |
| `empty` | `—` | 空数据内容 |



## 方法

| 方法名 | 签名 | 说明 |
| --- | --- | --- |
| `scrollTo` | `(offset: number) => void` | 定位到像素偏移，越界值自动限制 |
| `scrollToIndex` | `(index: number, align?: 'start' / 'center' / 'end' / 'auto') => void` | 定位到索引；默认 start，auto 在可见时保持位置 |
| `resetHeights` | `() => void` | 清除高度缓存并重新测量当前行 |



## 使用说明

非正数和非有限的 height、itemHeight 使用默认值；overscan 负数归零。数据减少或尺寸变化会修正滚动位置。容器支持原生键盘滚动；离开渲染区的行会卸载，请将需保留的状态存放在数据中。
