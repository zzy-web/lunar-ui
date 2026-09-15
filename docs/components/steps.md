# Steps 步骤条

显示流程进度，支持五种状态、横向/纵向布局、简洁模式和可交互步骤。

<script setup>
import { ref } from 'vue'
const active = ref(1)
const items = [
  { title: 'Account', description: 'Create your profile' },
  { title: 'Verify', description: 'Confirm your details' },
  { title: 'Complete', description: 'You are ready to go' }
]
const review = [{ title: 'Uploaded', status: 'success' }, { title: 'Review', status: 'error', description: 'Please retry' }, { title: 'Publish' }]
</script>

## 基础进度

<DemoBlock direction="column">
<lu-steps :active="active" :items="items" finish-status="success" />
<lu-button @click="active = (active + 1) % 4">Next step</lu-button>
<template #source>

```vue
<script setup>
import { ref } from 'vue'
const active = ref(1)
const items = [
  { title: 'Account', description: 'Create your profile' },
  { title: 'Verify', description: 'Confirm your details' },
  { title: 'Complete', description: 'You are ready to go' }
]
const review = [{ title: 'Uploaded', status: 'success' }, { title: 'Review', status: 'error', description: 'Please retry' }, { title: 'Publish' }]
</script>

<template>
  <lu-steps :active="active" :items="items" finish-status="success" />
  <lu-button @click="active = (active + 1) % 4">Next step</lu-button>
</template>
```

</template>
</DemoBlock>

## 居中与可交互步骤

<DemoBlock direction="column">
<lu-steps v-model:active="active" :items="items" clickable align-center finish-status="success" />
<template #source>

```vue
<script setup>
import { ref } from 'vue'
const active = ref(1)
const items = [
  { title: 'Account', description: 'Create your profile' },
  { title: 'Verify', description: 'Confirm your details' },
  { title: 'Complete', description: 'You are ready to go' }
]
const review = [{ title: 'Uploaded', status: 'success' }, { title: 'Review', status: 'error', description: 'Please retry' }, { title: 'Publish' }]
</script>

<template>
  <lu-steps v-model:active="active" :items="items" clickable align-center finish-status="success" />
</template>
```

</template>
</DemoBlock>

## 竖向状态与插槽

<DemoBlock direction="column">
<lu-steps :active="1" :items="review" direction="vertical">
  <template #title="{ item, index }">{{ index + 1 }}. {{ item.title }}</template>
</lu-steps>
<template #source>

```vue
<script setup>
import { ref } from 'vue'
const active = ref(1)
const items = [
  { title: 'Account', description: 'Create your profile' },
  { title: 'Verify', description: 'Confirm your details' },
  { title: 'Complete', description: 'You are ready to go' }
]
const review = [{ title: 'Uploaded', status: 'success' }, { title: 'Review', status: 'error', description: 'Please retry' }, { title: 'Publish' }]
</script>

<template>
  <lu-steps :active="1" :items="review" direction="vertical">
    <template #title="{ item, index }">{{ index + 1 }}. {{ item.title }}</template>
  </lu-steps>
</template>
```

</template>
</DemoBlock>

## 简洁模式

<DemoBlock direction="column">
<lu-steps :active="active" :items="items" simple finish-status="success" />
<template #source>

```vue
<script setup>
import { ref } from 'vue'
const active = ref(1)
const items = [
  { title: 'Account', description: 'Create your profile' },
  { title: 'Verify', description: 'Confirm your details' },
  { title: 'Complete', description: 'You are ready to go' }
]
const review = [{ title: 'Uploaded', status: 'success' }, { title: 'Review', status: 'error', description: 'Please retry' }, { title: 'Publish' }]
</script>

<template>
  <lu-steps :active="active" :items="items" simple finish-status="success" />
</template>
```

</template>
</DemoBlock>

## 交互说明

active 从 0 开始；等于步骤数表示全部完成。单项 status 优先于自动状态。默认仅展示，clickable 开启后可通过点击、方向键及 Home / End 切换，跳过 disabled 项。使用 items 数组配置步骤，与本库 Tabs 等组件的数据接口保持一致。

## Steps Props

| 属性 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `active` | `number` | `0` | 当前步骤；支持 v-model:active 与内部状态 |
| `items` | `StepItem[]` | `[]` | 标题、说明、图标、状态和禁用配置 |
| `direction` | `horizontal / vertical` | `horizontal` | 方向 |
| `processStatus / finishStatus` | `StepStatus` | `process / finish` | 当前项 / 已完成项的状态 |
| `alignCenter` | `boolean` | `false` | 水平布局标题居中 |
| `simple` | `boolean` | `false` | 简洁模式，不显示说明 |
| `space` | `number / string` | `—` | 固定间距；数字为 px；简洁模式忽略 |
| `clickable` | `boolean` | `false` | 启用步骤选择 |
| `label` | `string` | `Progress` | 列表无障碍名称 |
| `statusLabels` | `Partial<Record<StepStatus, string>>` | `English labels` | 朗读状态的本地化文本 |

## 事件

`update:active(index)`、`change(index, previous)`：用户选择不同的可用步骤时触发；外部 active 更新不会触发。

## 插槽

`title` / `description` 接收 `{ item, index }`；`icon` 接收 `{ item, index, status }`，用于自定义图标。

## 类型与补充 API

StepItem：`title: string` 必填；`description?: string`；`icon?: string`（文本图标，复杂图标使用插槽）；`status?: StepStatus`；`disabled?: boolean`。StepStatus：`wait`、`process`、`finish`、`success`、`error`。

功能参考：[Element Plus Steps](https://element-plus.org/en-US/component/steps.html)。本页 API 以 Lunar UI 实际实现为准，不保证与 Element Plus 完全兼容。
