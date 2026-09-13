# Skeleton

Show placeholder layouts while loading, then mount the actual content.

<script setup>
import { ref } from 'vue'
const loading = ref(true)
</script>

## Loading and custom layouts

<DemoBlock>
<lu-switch v-model="loading" aria-label="Toggle loading" />
<lu-skeleton :loading="loading" animated :rows="3" style="margin-top:20px">
  <lu-card>Content has loaded.</lu-card>
</lu-skeleton>
<lu-skeleton :loading="loading" animated style="margin-top:24px">
  <template #template>
    <lu-skeleton-item variant="image" style="height:140px" />
    <lu-skeleton-item variant="h3" style="width:50%" />
    <lu-skeleton-item />
  </template>
  <lu-card>Custom content has loaded.</lu-card>
</lu-skeleton>
<template #source>

```vue
<lu-skeleton :loading="loading" animated :rows="3">
  <lu-card>Content has loaded.</lu-card>
</lu-skeleton>
<lu-skeleton :loading="loading" animated>
  <template #template>
    <lu-skeleton-item variant="image" style="height:140px" />
    <lu-skeleton-item variant="h3" style="width:50%" />
    <lu-skeleton-item />
  </template>
  <lu-card>Actual content</lu-card>
</lu-skeleton>
```

</template>
</DemoBlock>

## API

- `loading`: defaults to true; false mounts the default slot.
- `animated`: defaults to false; respects reduced-motion preferences.
- `rows`: body rows in addition to the title placeholder, defaults to 3. Negative values become 0; fractions are rounded down.
- `count`: placeholder groups, defaults to 1, minimum 1.
- `loadingText`: accessible loading message, defaults to `Loading…`.

The `template` slot receives zero-based `{ index }`. Placeholders are hidden from screen readers, while the container exposes `aria-busy`.

`LuSkeletonItem` accepts `variant`: `text` (default), `p`, `h1`, `h3`, `caption`, `button`, `circle`, `rect`, `image`. Override dimensions with style. Exports: `LuSkeleton`, `LuSkeletonItem` and their `Epx` aliases.
