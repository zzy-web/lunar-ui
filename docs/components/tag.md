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

- `type`: `primary` （默认）, `success`, `warning`, `danger` 或 `info`.
- `effect`: `light` （默认）, `dark` 或 `plain`.
- `size`: `large`, `default` 或 `small`. 默认 `default`.
- `closable` / `round`: 布尔值，默认 `false`.
- `closeLabel`: 字符串，默认 `Close tag`；关闭按钮的无障碍名称。

## 事件

`close`: `(event: MouseEvent)`.

## 插槽

`default`: 标签内容。
