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

- `description`: default “暂无数据”; provide translated text as needed.
- `image`: optional image URL; without it, only text and actions are shown.
- `imageAlt`: image alternative text, default empty string for decorative images.
- `imageSize`: image width in pixels, default `120`.

## Usage notes

Slots: `image` replaces the image, `description` replaces the text, `default` contains actions. The component emits no events; buttons handle actions.
