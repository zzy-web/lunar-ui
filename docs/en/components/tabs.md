# Tabs

Switch between related content. Arrow keys, Home and End navigate enabled tabs.

<script setup>
import { ref } from 'vue'
const active = ref('overview')
const items = [{ name: 'overview', label: 'Overview' }, { name: 'settings', label: 'Settings' }, { name: 'locked', label: 'Locked', disabled: true }]
</script>

## Basic usage

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

## Card style

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

## Vertical tabs, manual activation and lazy rendering

Use `orientation="vertical"` for Up/Down navigation. With `activation="manual"`, navigation only moves focus; Enter or Space selects the focused tab. Home / End focus the first or last enabled tab. `lazy` mounts content on first selection and preserves it afterward; removing a tab unmounts its content. Defaults remain horizontal, automatic activation, and eager rendering.

<DemoBlock direction="column">
<lu-tabs :items="items" orientation="vertical" activation="manual" lazy>
  <template #overview>Project overview</template>
  <template #settings><lu-input placeholder="State is preserved when switching tabs" /></template>
</lu-tabs>
<template #source>

```vue
<script setup>
const items = [
  { name: 'overview', label: 'Overview' },
  { name: 'locked', label: 'Locked', disabled: true },
  { name: 'settings', label: 'Settings' }
]
</script>

<template>
  <lu-tabs :items="items" orientation="vertical" activation="manual" lazy>
    <template #overview>Project overview</template>
    <template #settings><lu-input placeholder="State is preserved when switching tabs" /></template>
  </lu-tabs>
</template>
```

</template>
</DemoBlock>

## Tabs Props

| Property | Type | Default | Description |
| --- | --- | --- | --- |
| `modelValue` | `string / number` | — | Active name; supports `v-model` |
| `items` | `TabItem[]` | `[]` | Unique name, label and optional disabled |
| `orientation` | `horizontal / vertical` | `horizontal` | Layout and arrow key direction |
| `activation` | `automatic / manual` | `automatic` | Whether navigation also selects the tab |
| `lazy` | `boolean` | `false` | Mount panel content on first selection and retain it |
| `type` | `line / card` | `line` | Visual style |
| `label` | `string` | `Tabs` | Accessible tab list name |

## Events and slots

`update:modelValue` and `change` receive the selected name. Slots matching item names render panels; the default slot receives `{ item }` as fallback. The `label` slot receives `{ item }`. Reserve `label` and `default` for these slots. Panels remain mounted. Missing or disabled values display the first enabled tab without emitting a change.
