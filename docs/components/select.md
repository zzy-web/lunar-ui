# Select 选择器

从预设选项中选择值，支持单选、多选、清空、禁用与加载状态。使用原生 select，保留浏览器键盘操作和移动端选择体验。

<script setup>
import { ref } from 'vue'
const value = ref(undefined)
const multiple = ref([1])
const options = [{ label: 'Design', value: 1 }, { label: 'Engineering', value: 2 }, { label: 'Archived', value: 3, disabled: true }]
</script>

## 基础用法与清空

<DemoBlock>
<lu-select v-model="value" :options="options" clearable aria-label="Team" placeholder="Select a team" />
<template #source>

```vue
<script setup>
import { ref } from 'vue'
const value = ref(undefined)
const multiple = ref([1])
const options = [{ label: 'Design', value: 1 }, { label: 'Engineering', value: 2 }, { label: 'Archived', value: 3, disabled: true }]
</script>

<template>
  <lu-select v-model="value" :options="options" clearable aria-label="Team" placeholder="Select a team" />
</template>
```

</template>
</DemoBlock>

## 多选

<DemoBlock>
<lu-select v-model="multiple" :options="options" multiple clearable aria-label="Teams" />
<template #source>

```vue
<script setup>
import { ref } from 'vue'
const value = ref(undefined)
const multiple = ref([1])
const options = [{ label: 'Design', value: 1 }, { label: 'Engineering', value: 2 }, { label: 'Archived', value: 3, disabled: true }]
</script>

<template>
  <lu-select v-model="multiple" :options="options" multiple clearable aria-label="Teams" />
</template>
```

</template>
</DemoBlock>

## 禁用与加载

<DemoBlock>
<lu-select :options="options" :model-value="1" disabled aria-label="Disabled team" />
<lu-select loading loading-text="Loading…" aria-label="Loading teams" />
<template #source>

```vue
<script setup>
import { ref } from 'vue'
const value = ref(undefined)
const multiple = ref([1])
const options = [{ label: 'Design', value: 1 }, { label: 'Engineering', value: 2 }, { label: 'Archived', value: 3, disabled: true }]
</script>

<template>
  <lu-select :options="options" :model-value="1" disabled aria-label="Disabled team" />
  <lu-select loading loading-text="Loading…" aria-label="Loading teams" />
</template>
```

</template>
</DemoBlock>

## Props

- `modelValue`：`string | number | (string | number)[]`；单选清空后为 `undefined`，多选清空后为 `[]`。
- `options`：`SelectOption[]`，默认 `[]`；每项包含唯一的 `value`、`label` 和可选 `disabled`。
- `multiple` / `clearable` / `disabled` / `loading`：布尔值，默认 `false`。
- `size`：`large | default | small`，默认 `default`。
- `placeholder` / `loadingText` / `emptyText`：提示文案，默认“请选择”/“加载中…”/“暂无选项”。
- `clearLabel`：清空按钮的可访问名称，默认 `Clear selection`。

## 事件

`update:modelValue` / `change`：返回选中值；`clear`：清空时触发；`focus` / `blur`：原生焦点事件。

## 使用说明

通过 ref 调用 `focus()` / `blur()`。`SelectOption` 和 `SelectValue` 可从库入口导入。本组件采用受控 `v-model`，暂不提供搜索、远程筛选或虚拟滚动；多选以原生列表显示，按住 Ctrl / Command 可选择多项。选项值应唯一，避免同时使用数值 1 与字符串 "1" 等原生控件无法区分的值。
