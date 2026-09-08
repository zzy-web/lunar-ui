# Input 输入框

`LuInput` 用于输入单行文本，组件标签为 `<lu-input>`。它支持 `v-model`、原生输入类型、占位提示、尺寸、禁用、只读，以及前后缀插槽。

<script setup>
import { ref } from 'vue'

const inputValue = ref('')
const keyword = ref('')
</script>

## 基础用法

使用 `v-model` 绑定输入框内容。

<DemoBlock>
  <lu-input v-model="inputValue" placeholder="请输入内容" />

  <template #source>

```vue
<script setup lang="ts">
import { ref } from 'vue'

const value = ref('')
</script>

<template>
  <lu-input v-model="value" placeholder="请输入内容" />
</template>
```

  </template>
</DemoBlock>

## 不同尺寸

使用 `size` 设置输入框尺寸。

<DemoBlock>
  <lu-input size="large" placeholder="大型输入框" />
  <lu-input placeholder="默认输入框" />
  <lu-input size="small" placeholder="小型输入框" />

  <template #source>

```vue
<template>
  <lu-input size="large" placeholder="大型输入框" />
  <lu-input placeholder="默认输入框" />
  <lu-input size="small" placeholder="小型输入框" />
</template>
```

  </template>
</DemoBlock>

## 禁用和只读

`disabled` 会禁用输入框，`readonly` 只禁止编辑。

<DemoBlock>
  <lu-input model-value="不可编辑" disabled />
  <lu-input model-value="只读内容" readonly />

  <template #source>

```vue
<template>
  <lu-input model-value="不可编辑" disabled />
  <lu-input model-value="只读内容" readonly />
</template>
```

  </template>
</DemoBlock>

## 前后缀

通过 `prefix` 和 `suffix` 插槽扩展输入框内容。

<DemoBlock>
  <lu-input v-model="keyword" placeholder="搜索">
    <template #prefix>Search</template>
    <template #suffix>.com</template>
  </lu-input>

  <template #source>

```vue
<template>
  <lu-input v-model="keyword" placeholder="搜索">
    <template #prefix>Search</template>
    <template #suffix>.com</template>
  </lu-input>
</template>
```

  </template>
</DemoBlock>

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
