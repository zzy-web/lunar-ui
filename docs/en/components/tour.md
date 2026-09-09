# Tour

`LuTour` introduces page features step by step. Use it as `<lu-tour>`. It can attach to target elements or render centered when no target is provided.

<script setup>
import { ref } from 'vue'

const open = ref(false)
const current = ref(0)
const centerOpen = ref(false)

const steps = [
  { target: '#tour-create-en', title: 'Create content', description: 'Start new content or tasks from here.' },
  { target: '#tour-manage-en', title: 'Manage list', description: 'Review status and available actions here.' }
]

const centerSteps = [
  { title: 'Welcome', description: 'Without target, the tour panel is centered on the page.' },
  { title: 'Finish setup', description: 'Use current to control the active step.' }
]
</script>

## Basic Usage

Define steps with `steps`, and control visibility with `v-model`.

<DemoBlock source-label="View source">
  <div style="display: flex; gap: 12px; flex-wrap: wrap;">
    <lu-button id="tour-create-en" type="primary">Create</lu-button>
    <lu-button id="tour-manage-en">Manage</lu-button>
    <lu-button @click="open = true">Start tour</lu-button>
  </div>
  <lu-tour v-model="open" v-model:current="current" :steps="steps" />

  <template #source>

```vue
<script setup lang="ts">
import { ref } from 'vue'

const open = ref(false)
const current = ref(0)
const steps = [
  { target: '#tour-create', title: 'Create content', description: 'Start new content or tasks from here.' },
  { target: '#tour-manage', title: 'Manage list', description: 'Review status and available actions here.' }
]
</script>

<template>
  <lu-button id="tour-create" type="primary">Create</lu-button>
  <lu-button id="tour-manage">Manage</lu-button>
  <lu-button @click="open = true">Start tour</lu-button>

  <lu-tour v-model="open" v-model:current="current" :steps="steps" />
</template>
```

  </template>
</DemoBlock>

## Centered Tour

When a step does not define `target`, the panel is centered.

<DemoBlock source-label="View source">
  <lu-button type="primary" @click="centerOpen = true">Open centered tour</lu-button>
  <lu-tour v-model="centerOpen" :steps="centerSteps" close-on-click-mask />

  <template #source>

```vue
<script setup lang="ts">
import { ref } from 'vue'

const open = ref(false)
const steps = [
  { title: 'Welcome', description: 'Without target, the tour panel is centered on the page.' },
  { title: 'Finish setup', description: 'Use current to control the active step.' }
]
</script>

<template>
  <lu-button type="primary" @click="open = true">Open centered tour</lu-button>
  <lu-tour v-model="open" :steps="steps" close-on-click-mask />
</template>
```

  </template>
</DemoBlock>

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `modelValue` | `boolean` | required | Controls tour visibility. |
| `steps` | `TourStep[]` | required | Tour steps. |
| `current` | `number` | `0` | Active step index. Supports `v-model:current`. |
| `closeOnClickMask` | `boolean` | `false` | Closes the tour when clicking the mask. |
| `prevText` | `string` | `'Previous'` | Previous button text. |
| `nextText` | `string` | `'Next'` | Next button text. |
| `finishText` | `string` | `'Finish'` | Finish button text. |

## TourStep

| Field | Type | Description |
| --- | --- | --- |
| `target` | `string \| HTMLElement` | Target element. String targets are resolved with `document.querySelector`. |
| `title` | `string` | Step title. |
| `description` | `string` | Step description. |

## Events

| Event | Description |
| --- | --- |
| `update:modelValue` | Emitted when visibility changes. |
| `update:current` | Emitted when the active step changes. |
| `close` | Emitted when the tour closes. |
| `finish` | Emitted when the finish button is clicked. |
