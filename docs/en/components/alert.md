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

| Attribute | Type | Default | Description |
| --- | --- | --- | --- |
| `title` | `string` | — | Title. |
| `description` | `string` | — | Description. |
| `type` | `'success' \| 'info' \| 'warning' \| 'error'` | `'info'` | Semantic type. |
| `effect` | `'light' \| 'dark'` | `'light'` | Theme effect. |
| `closable` | `boolean` | `true` | Show the close button. |
| `showIcon` | `boolean` | `false` | Show the status icon. |
| `center` | `boolean` | `false` | Center the content. |
| `closeText` | `string` | — | Custom close button text. |
| `closeLabel` | `string` | `'Close alert'` | Accessible close button label. |

## Events

| Event | Signature | Description |
| --- | --- | --- |
| `close` | `(event: MouseEvent)` | Emitted on dismissal; the component hides itself. |

## Slots

| Slot | Slot props | Description |
| --- | --- | --- |
| `title` | — | Custom title. |
| `default` | — | Custom description. |

## Usage notes

Remount the component or change its `key` to show it again. Warning and error use `role="alert"`; information and success use `role="status"`.
