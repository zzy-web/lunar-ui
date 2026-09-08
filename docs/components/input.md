# Input 输入框

`EpxInput` 用于输入单行文本。它支持 `v-model`、原生输入类型、占位提示、尺寸、禁用、只读，以及前后缀插槽。

## 基础用法

```vue
<script setup lang="ts">
import { ref } from 'vue'

const value = ref('')
</script>

<template>
  <epx-input v-model="value" placeholder="请输入内容" />
</template>
```

## 不同尺寸

```vue
<template>
  <epx-input size="large" placeholder="大型输入框" />
  <epx-input placeholder="默认输入框" />
  <epx-input size="small" placeholder="小型输入框" />
</template>
```

## 禁用和只读

```vue
<template>
  <epx-input model-value="不可编辑" disabled />
  <epx-input model-value="只读内容" readonly />
</template>
```

## 前后缀

```vue
<template>
  <epx-input v-model="keyword" placeholder="搜索">
    <template #prefix>🔍</template>
    <template #suffix>.com</template>
  </epx-input>
</template>
```

## Props

| 属性 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `modelValue` | `string \| number` | `''` | 输入框绑定值。 |
| `type` | `string` | `'text'` | 原生 `input` 的 `type` 属性。 |
| `size` | `'large' \| 'default' \| 'small'` | `'default'` | 输入框尺寸。 |
| `placeholder` | `string` | `undefined` | 占位提示文本。 |
| `disabled` | `boolean` | `false` | 是否禁用输入框。 |
| `readonly` | `boolean` | `false` | 是否只读。 |

## 事件

| 事件名 | 说明 |
| --- | --- |
| `update:modelValue` | 输入值变化时触发，用于支持 `v-model`。 |
| `input` | 输入值变化时触发。 |

## 插槽

| 插槽名 | 说明 |
| --- | --- |
| `prefix` | 输入框前缀内容。 |
| `suffix` | 输入框后缀内容。 |
