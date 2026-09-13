# Tabs 标签页

组织同级内容。支持方向键、Home 和 End 切换标签，自动跳过禁用项。

<script setup>
import { ref } from 'vue'
const active = ref('overview')
const items = [{ name: 'overview', label: 'Overview' }, { name: 'settings', label: 'Settings' }, { name: 'locked', label: 'Locked', disabled: true }]
</script>

## 基础用法

<DemoBlock direction="column">
<lu-tabs v-model="active" :items="items">
  <template #overview>Project overview</template>
  <template #settings>Project settings</template>
</lu-tabs>
<template #source>

```vue
<script setup>
import { ref } from 'vue'
const active = ref('overview')
const items = [{ name: 'overview', label: 'Overview' }, { name: 'settings', label: 'Settings' }, { name: 'locked', label: 'Locked', disabled: true }]
</script>

<template>
<lu-tabs v-model="active" :items="items">
  <template #overview>Project overview</template>
  <template #settings>Project settings</template>
</lu-tabs>
</template>
```

</template>
</DemoBlock>

## 卡片样式

<DemoBlock direction="column">
<lu-tabs v-model="active" :items="items" type="card">
  <template #overview>Project overview</template>
  <template #settings>Project settings</template>
</lu-tabs>
<template #source>

```vue
<script setup>
import { ref } from 'vue'
const active = ref('overview')
const items = [{ name: 'overview', label: 'Overview' }, { name: 'settings', label: 'Settings' }, { name: 'locked', label: 'Locked', disabled: true }]
</script>

<template>
<lu-tabs v-model="active" :items="items" type="card">
  <template #overview>Project overview</template>
  <template #settings>Project settings</template>
</lu-tabs>
</template>
```

</template>
</DemoBlock>

## Tabs Props

| 属性 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `modelValue` | `string / number` | — | 选中名称，支持 `v-model` |
| `items` | `TabItem[]` | `[]` | 每项提供唯一 name、label 和可选 disabled |
| `type` | `line / card` | `line` | 标签样式 |
| `label` | `string` | `Tabs` | 标签列表的无障碍名称 |

## 事件与插槽

`update:modelValue` 和 `change` 返回选中名称。与 name 同名的插槽渲染面板；默认插槽作为回退，接收 `{ item }`。`label` 插槽自定义标题，接收 `{ item }`，请勿将 name 设为保留名称 `label` 或 `default`。切换时保留面板状态。绑定值不存在或已禁用时显示首个可用项，不主动触发更新。
