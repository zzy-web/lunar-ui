# Spin

Show loading feedback for asynchronous work, either on its own or over content.

<script setup lang="ts">
import { ref } from 'vue'
const loading = ref(true)
</script>

## Basic usage

<DemoBlock>
<lu-spin text="Loading…" />
<template #source>

```vue
<template>
  <lu-spin text="Loading…" />
</template>
```

</template>
</DemoBlock>

## Content overlay

Setting `loading` to `false` removes the overlay and status indicator.

<DemoBlock direction="column">
<lu-switch v-model="loading" aria-label="Toggle loading state" />
<lu-spin :loading="loading" text="Fetching data" style="width: 100%">
  <lu-card style="min-height: 120px">Content waiting for data.</lu-card>
</lu-spin>
<template #source>

```vue
<script setup lang="ts">
import { ref } from 'vue'
const loading = ref(true)
</script>

<template>
  <lu-switch v-model="loading" aria-label="Toggle loading state" />
  <lu-spin :loading="loading" text="Fetching data" style="width: 100%">
    <lu-card style="min-height: 120px">Content waiting for data.</lu-card>
  </lu-spin>
</template>
```

</template>
</DemoBlock>

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `loading` | `boolean` | `true` | Show the loading state |
| `text` | `string` | — | Visible loading message and accessible name |
| `ariaLabel` | `string` | `Loading` | Accessible name when no text is set |
| `size` | `number` | `32` | Default spinner diameter in pixels |

## Slots

`default` contains the content to cover; `indicator` replaces the spinner. Set `text` or `ariaLabel` when using a custom indicator.

## Usage tips

- Cover the affected region for local loading so the rest of the page remains usable.
- Add descriptive text for longer waits so users know what is being loaded.
