# Input 输入框

`LuInput` 用于单行文本、密码或多行输入，组件标签为 `<lu-input>`。支持 `v-model`、清空、字数统计、尺寸、禁用、只读，以及前后缀插槽。

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

## 可清空输入

<DemoBlock>
  <lu-input v-model="inputValue" clearable aria-label="姓名" placeholder="输入姓名" clear-label="清空输入" />
<template #source>

```vue
<lu-input v-model="value" clearable aria-label="姓名" />
```

</template>
</DemoBlock>

## 密码显示切换

<DemoBlock>
  <lu-input v-model="keyword" show-password autocomplete="new-password" aria-label="密码" password-label="显示密码" />
<template #source>

```vue
<lu-input v-model="password" show-password autocomplete="new-password" aria-label="密码" />
```

</template>
</DemoBlock>

## 文本域与字数统计

<DemoBlock>
  <lu-input v-model="inputValue" type="textarea" :rows="4" :maxlength="120" show-word-limit aria-label="说明" />
<template #source>

```vue
<lu-input v-model="description" type="textarea" :rows="4" :maxlength="120" show-word-limit aria-label="说明" />
```

</template>
</DemoBlock>

## 增强 API

- `clearable` / `showPassword` / `showWordLimit`：布尔值，默认 `false`。
- `maxlength`：原生长度限制；设置后可显示字数统计，密码输入不显示统计。
- `rows`：文本域行数，默认 `3`。
- `resize`：`none | both | horizontal | vertical`，默认 `vertical`。
- `clearLabel` / `passwordLabel`：操作按钮可访问名称，默认 `Clear input` / `Show password`。
- `change(value: string)`：原生提交更改或清空时触发。
- `clear()`：点击清空按钮时触发。
- `focus(event: FocusEvent)` / `blur(event: FocusEvent)`：原生焦点事件。
- 暴露方法：`focus()`、`blur()`、`select()`。

原有 `input` 与 `update:modelValue` 事件保留。输入法组词期间不更新绑定值。原生属性传给 input 或 textarea，包括 `id`、`name` 与 ARIA 属性。字数按原生 UTF-16 长度统计。前后缀插槽适用于单行输入。
