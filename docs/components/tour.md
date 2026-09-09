# Tour 漫游式引导

`LuTour` 用于分步介绍页面功能，组件标签为 `<lu-tour>`。它可以绑定目标元素，也可以在没有目标时居中展示。

<script setup>
import { ref } from 'vue'

const open = ref(false)
const current = ref(0)
const centerOpen = ref(false)

const steps = [
  { target: '#tour-create', title: '创建内容', description: '从这里开始创建新的内容或任务。' },
  { target: '#tour-manage', title: '管理列表', description: '这里展示当前内容的状态和操作入口。' }
]

const centerSteps = [
  { title: '欢迎使用', description: '没有设置 target 时，引导面板会在页面中间展示。' },
  { title: '完成设置', description: '你可以用 current 控制当前步骤。' }
]
</script>

## 基础用法

通过 `steps` 定义步骤，使用 `v-model` 控制是否显示。

<DemoBlock>
  <div style="display: flex; gap: 12px; flex-wrap: wrap;">
    <lu-button id="tour-create" type="primary">创建</lu-button>
    <lu-button id="tour-manage">管理</lu-button>
    <lu-button @click="open = true">开始引导</lu-button>
  </div>
  <lu-tour v-model="open" v-model:current="current" :steps="steps" prev-text="上一步" next-text="下一步" finish-text="完成" />

  <template #source>

```vue
<script setup lang="ts">
import { ref } from 'vue'

const open = ref(false)
const current = ref(0)
const steps = [
  { target: '#tour-create', title: '创建内容', description: '从这里开始创建新的内容或任务。' },
  { target: '#tour-manage', title: '管理列表', description: '这里展示当前内容的状态和操作入口。' }
]
</script>

<template>
  <lu-button id="tour-create" type="primary">创建</lu-button>
  <lu-button id="tour-manage">管理</lu-button>
  <lu-button @click="open = true">开始引导</lu-button>

  <lu-tour
    v-model="open"
    v-model:current="current"
    :steps="steps"
    prev-text="上一步"
    next-text="下一步"
    finish-text="完成"
  />
</template>
```

  </template>
</DemoBlock>

## 居中引导

步骤没有设置 `target` 时，引导面板会居中显示。

<DemoBlock>
  <lu-button type="primary" @click="centerOpen = true">打开居中引导</lu-button>
  <lu-tour v-model="centerOpen" :steps="centerSteps" prev-text="上一步" next-text="下一步" finish-text="完成" close-on-click-mask />

  <template #source>

```vue
<script setup lang="ts">
import { ref } from 'vue'

const open = ref(false)
const steps = [
  { title: '欢迎使用', description: '没有设置 target 时，引导面板会在页面中间展示。' },
  { title: '完成设置', description: '你可以用 current 控制当前步骤。' }
]
</script>

<template>
  <lu-button type="primary" @click="open = true">打开居中引导</lu-button>
  <lu-tour v-model="open" :steps="steps" close-on-click-mask />
</template>
```

  </template>
</DemoBlock>

## Props

| 属性 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `modelValue` | `boolean` | 必填 | 是否显示引导。 |
| `steps` | `TourStep[]` | 必填 | 引导步骤。 |
| `current` | `number` | `0` | 当前步骤索引，支持 `v-model:current`。 |
| `closeOnClickMask` | `boolean` | `false` | 点击遮罩时是否关闭。 |
| `prevText` | `string` | `'Previous'` | 上一步按钮文本。 |
| `nextText` | `string` | `'Next'` | 下一步按钮文本。 |
| `finishText` | `string` | `'Finish'` | 完成按钮文本。 |

## TourStep

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| `target` | `string \| HTMLElement` | 目标元素。传入选择器时会通过 `document.querySelector` 查找。 |
| `title` | `string` | 步骤标题。 |
| `description` | `string` | 步骤说明。 |

## 事件

| 事件名 | 说明 |
| --- | --- |
| `update:modelValue` | 显示状态变化时触发。 |
| `update:current` | 当前步骤变化时触发。 |
| `close` | 引导关闭时触发。 |
| `finish` | 点击完成时触发。 |
