# Alert

Show inline feedback or information that needs attention, with semantic types, icons, descriptions and dismissal.

<script setup>
import { ref } from 'vue'
const version = ref(0)
</script>

## Semantic types

<DemoBlock direction="column">
<lu-alert title="Saved successfully" type="success" show-icon :closable="false" />
<lu-alert title="A new version is available" type="info" show-icon :closable="false" />
<lu-alert title="Review your changes" type="warning" show-icon :closable="false" />
<lu-alert title="Unable to save" type="error" show-icon :closable="false" />
<template #source>

```vue
<script setup>
import { ref } from 'vue'
const version = ref(0)
</script>

<template>
  <lu-alert title="Saved successfully" type="success" show-icon :closable="false" />
  <lu-alert title="A new version is available" type="info" show-icon :closable="false" />
  <lu-alert title="Review your changes" type="warning" show-icon :closable="false" />
  <lu-alert title="Unable to save" type="error" show-icon :closable="false" />
</template>
```

</template>
</DemoBlock>

## Description and dismissal

<DemoBlock direction="column">
<lu-alert :key="version" title="Unsaved changes" description="Save your work before leaving this page." type="warning" show-icon close-label="Dismiss warning" />
<lu-button size="small" @click="version++">Reset alert</lu-button>
<template #source>

```vue
<script setup>
import { ref } from 'vue'
const version = ref(0)
</script>

<template>
  <lu-alert :key="version" title="Unsaved changes" description="Save your work before leaving this page." type="warning" show-icon close-label="Dismiss warning" />
  <lu-button size="small" @click="version++">Reset alert</lu-button>
</template>
```

</template>
</DemoBlock>

## Dark effect and slots

<DemoBlock direction="column">
<lu-alert type="success" effect="dark" :closable="false" show-icon>
  <template #title>Workspace ready</template>
  Invite your team to start collaborating.
</lu-alert>
<template #source>

```vue
<script setup>
import { ref } from 'vue'
const version = ref(0)
</script>

<template>
  <lu-alert type="success" effect="dark" :closable="false" show-icon>
    <template #title>Workspace ready</template>
    Invite your team to start collaborating.
  </lu-alert>
</template>
```

</template>
</DemoBlock>

## Props

- `title` / `description`: title and description strings.
- `type`: `success | info | warning | error`, default `info`.
- `effect`: `light | dark`, default `light`.
- `closable`: default `true`. `showIcon` / `center`: default `false`.
- `closeText`: custom dismissal text; `closeLabel`: accessible close label, default `Close alert`.

## Events

`close(event: MouseEvent)`: emitted after dismissing; the component hides itself. Remount or change its `key` to show it again.

## Usage notes

The `title` slot replaces the title; `default` replaces the description. Warning and error use `role="alert"`; information and success use `role="status"`.
