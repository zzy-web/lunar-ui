# Empty

Explain an empty state and provide a next action, with optional application imagery.

<script setup>
import { ref } from 'vue'
const created = ref(false)
</script>

## Basic usage

<DemoBlock>
<lu-empty description="No projects yet" />
<template #source>

```vue
<script setup>
import { ref } from 'vue'
const created = ref(false)
</script>

<template>
  <lu-empty description="No projects yet" />
</template>
```

</template>
</DemoBlock>

## Next actions

<DemoBlock>
<lu-empty v-if="!created" description="Create your first project to get started.">
  <lu-button type="primary" @click="created = true">Create project</lu-button>
</lu-empty>
<lu-alert v-else title="Project created" type="success" show-icon :closable="false" />
<lu-button v-if="created" size="small" @click="created = false">Reset example</lu-button>
<template #source>

```vue
<script setup>
import { ref } from 'vue'
const created = ref(false)
</script>

<template>
  <lu-empty v-if="!created" description="Create your first project to get started.">
    <lu-button type="primary" @click="created = true">Create project</lu-button>
  </lu-empty>
  <lu-alert v-else title="Project created" type="success" show-icon :closable="false" />
  <lu-button v-if="created" size="small" @click="created = false">Reset example</lu-button>
</template>
```

</template>
</DemoBlock>

## Custom description

<DemoBlock>
<lu-empty>
  <template #description><strong>No matching results</strong><br />Try another keyword or remove your filters.</template>
</lu-empty>
<template #source>

```vue
<script setup>
import { ref } from 'vue'
const created = ref(false)
</script>

<template>
  <lu-empty>
    <template #description><strong>No matching results</strong><br />Try another keyword or remove your filters.</template>
  </lu-empty>
</template>
```

</template>
</DemoBlock>

## Props

| Attribute | Type | Default | Description |
| --- | --- | --- | --- |
| `description` | `string` | `'暂无数据'` | Empty-state description. |
| `image` | `string` | — | Optional image URL; omitted by default. |
| `imageAlt` | `string` | `''` | Image alternative text; leave empty for decorative images. |
| `imageSize` | `number` | `120` | Image width in pixels. |

## Slots

| Slot | Slot props | Description |
| --- | --- | --- |
| `image` | — | Custom image content. |
| `description` | — | Custom description. |
| `default` | — | Action buttons. |

## Usage notes

The component emits no events; actions are handled by buttons in the default slot.
