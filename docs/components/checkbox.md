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

| 属性 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `modelValue` | `boolean` | `false` | 绑定值。 |
| `label` | `string` | — | 标签文本，可由默认插槽覆盖。 |
| `indeterminate` | `boolean` | `false` | 半选展示状态，由父组件控制。 |
| `disabled` | `boolean` | `false` | 是否禁用。 |
| `size` | `'large' \| 'default' \| 'small'` | `'default'` | 组件尺寸。 |

## 事件

| 事件名 | 参数 / 签名 | 说明 |
| --- | --- | --- |
| `update:modelValue` | `(value: boolean)` | 更新绑定值。 |
| `change` | `(value: boolean)` | 用户更改值时触发。 |

## 插槽

| 插槽名 | 插槽参数 | 说明 |
| --- | --- | --- |
| `default` | — | 标签内容。 |
