# Tag 标签

用于标记状态或分类。关闭按钮仅触发 `close`，由父组件决定移除标签。

<script setup>
import { ref } from 'vue'
const visible = ref(true)
</script>

## 示例

<DemoBlock>
<lu-tag>Primary</lu-tag>
<lu-tag type="success">Success</lu-tag>
<lu-tag type="warning" effect="dark">Warning</lu-tag>
<lu-tag type="danger" effect="plain">Danger</lu-tag>
<lu-tag type="info" round>Info</lu-tag>
<lu-tag v-if="visible" closable close-label="Remove example tag" @close="visible = false">Close me</lu-tag>
<lu-button v-else size="small" @click="visible = true">Reset tag</lu-button>
<lu-tag size="small">Small</lu-tag>
<lu-tag size="large">Large</lu-tag>

<template #source>

```vue
<script setup lang="ts">
import { ref } from 'vue'
const visible = ref(true)
</script>

<template>
  <lu-tag>Primary</lu-tag>
  <lu-tag type="success">Success</lu-tag>
  <lu-tag type="warning" effect="dark">Warning</lu-tag>
  <lu-tag type="danger" effect="plain">Danger</lu-tag>
  <lu-tag type="info" round>Info</lu-tag>
  <lu-tag v-if="visible" closable close-label="Remove example tag" @close="visible = false">Close me</lu-tag>
  <lu-button v-else size="small" @click="visible = true">Reset tag</lu-button>
  <lu-tag size="small">Small</lu-tag>
  <lu-tag size="large">Large</lu-tag>
</template>
```

</template>
</DemoBlock>

## Props

| 属性 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `type` | `'primary' \| 'success' \| 'warning' \| 'danger' \| 'info'` | `'primary'` | 语义类型。 |
| `effect` | `'light' \| 'dark' \| 'plain'` | `'light'` | 主题效果。 |
| `size` | `'large' \| 'default' \| 'small'` | `'default'` | 组件尺寸。 |
| `closable` | `boolean` | `false` | 显示关闭按钮。 |
| `round` | `boolean` | `false` | 使用圆角样式。 |
| `closeLabel` | `string` | `'Close tag'` | 关闭按钮可访问名称。 |

## 事件

| 事件名 | 参数 / 签名 | 说明 |
| --- | --- | --- |
| `close` | `(event: MouseEvent)` | 点击关闭按钮触发，由父组件决定移除标签。 |

## 插槽

| 插槽名 | 插槽参数 | 说明 |
| --- | --- | --- |
| `default` | — | 标签内容。 |
