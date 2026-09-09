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

- `type`: `primary` (default), `success`, `warning`, `danger`, or `info`.
- `effect`: `light` (default), `dark`, or `plain`.
- `size`: `large`, `default`, or `small`. Default `default`.
- `closable` / `round`: boolean, default `false`.
- `closeLabel`: string, default `Close tag`; accessible label of the close button.

## Events

`close`: `(event: MouseEvent)`.

## Slots

`default`: Label content.
