# Tag

Display a status or category. The close button emits `close`; the parent decides whether to remove the tag.

<script setup>
import { ref } from 'vue'
const visible = ref(true)
</script>

## Examples

<DemoBlock source-label="View source">
<lu-tag>Primary</lu-tag>
<lu-tag type="success">Success</lu-tag>
<lu-tag type="warning" effect="dark">Warning</lu-tag>
<lu-tag type="danger" effect="plain">Danger</lu-tag>
<lu-tag type="info" round>Info</lu-tag>
<lu-tag v-if="visible" closable close-label="Remove example tag" @close="visible = false">Close me</lu-tag>
<lu-button v-else size="small" @click="visible = true">Reset tag</lu-button>
<lu-tag size="small">Small</lu-tag>
<lu-tag size="large">Large</lu-tag>

<template #source>

```vue
<script setup lang="ts">
import { ref } from 'vue'
const visible = ref(true)
</script>

<template>
  <lu-tag>Primary</lu-tag>
  <lu-tag type="success">Success</lu-tag>
  <lu-tag type="warning" effect="dark">Warning</lu-tag>
  <lu-tag type="danger" effect="plain">Danger</lu-tag>
  <lu-tag type="info" round>Info</lu-tag>
  <lu-tag v-if="visible" closable close-label="Remove example tag" @close="visible = false">Close me</lu-tag>
  <lu-button v-else size="small" @click="visible = true">Reset tag</lu-button>
  <lu-tag size="small">Small</lu-tag>
  <lu-tag size="large">Large</lu-tag>
</template>
```

</template>
</DemoBlock>

## Props

| Attribute | Type | Default | Description |
| --- | --- | --- | --- |
| `type` | `'primary' \| 'success' \| 'warning' \| 'danger' \| 'info'` | `'primary'` | Semantic type. |
| `effect` | `'light' \| 'dark' \| 'plain'` | `'light'` | Theme effect. |
| `size` | `'large' \| 'default' \| 'small'` | `'default'` | Component size. |
| `closable` | `boolean` | `false` | Show a close button. |
| `round` | `boolean` | `false` | Use rounded corners. |
| `closeLabel` | `string` | `'Close tag'` | Accessible close button label. |

## Events

| Event | Signature | Description |
| --- | --- | --- |
| `close` | `(event: MouseEvent)` | Emitted on close click; the parent decides whether to remove the tag. |

## Slots

| Slot | Slot props | Description |
| --- | --- | --- |
| `default` | — | Tag content. |
