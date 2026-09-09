# Checkbox 复选框

用于布尔值选择，支持半选展示。半选状态由父组件通过 `indeterminate` 控制，不会自动清除。

<script setup>
import { ref } from 'vue'
const checked = ref(false)
</script>

## 示例

<DemoBlock>
<lu-checkbox v-model="checked">Accept terms</lu-checkbox>
<lu-checkbox :model-value="true" disabled>Disabled</lu-checkbox>
<lu-checkbox indeterminate aria-label="Select all" />
<lu-checkbox size="small">Small</lu-checkbox>
<lu-checkbox size="large">Large</lu-checkbox>

<template #source>

```vue
<script setup lang="ts">
import { ref } from 'vue'
const checked = ref(false)
</script>

<template>
  <lu-checkbox v-model="checked">Accept terms</lu-checkbox>
  <lu-checkbox :model-value="true" disabled>Disabled</lu-checkbox>
  <lu-checkbox indeterminate aria-label="Select all" />
  <lu-checkbox size="small">Small</lu-checkbox>
  <lu-checkbox size="large">Large</lu-checkbox>
</template>
```

</template>
</DemoBlock>

## Props

- `modelValue`: 布尔值，默认 `false`.
- `label`: 字符串；默认插槽优先于此文本。
- `indeterminate`: 布尔值，默认 `false`.
- `disabled`: 布尔值，默认 `false`.
- `size`: `large`, `default` 或 `small`. 默认 `default`.

## 事件

`update:modelValue` / `change`: `(value: boolean)`.

## 插槽

`default`: 标签内容。
