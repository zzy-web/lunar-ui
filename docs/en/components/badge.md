# Badge

Display counts, status labels and notification dots beside a target.

<script setup>
import { ref } from 'vue'
const count = ref(12)
</script>

## Counts and dots

<DemoBlock>
<div style="display:flex;gap:40px;padding:16px;align-items:center">
  <lu-badge :value="count"><lu-button @click="count++">Messages +1</lu-button></lu-badge>
  <lu-badge :value="120"><lu-button>Tasks</lu-button></lu-badge>
  <lu-badge is-dot label="New notifications"><lu-button>Updates</lu-button></lu-badge>
  <lu-badge value="NEW" type="primary" />
</div>
<template #source>

```vue
<lu-badge :value="count"><lu-button @click="count++">Messages +1</lu-button></lu-badge>
<lu-badge :value="120"><lu-button>Tasks</lu-button></lu-badge>
<lu-badge is-dot label="New notifications"><lu-button>Updates</lu-button></lu-badge>
<lu-badge value="NEW" type="primary" />
```

</template>
</DemoBlock>

## API

- `value: string | number` defaults to `''`. Numbers above `max` (99) display as `99+`; strings remain unchanged.
- `isDot` / `hidden` default to false. `showZero` defaults to true and controls numeric zero visibility.
- `type`: `primary | success | warning | danger | info`, defaults to danger. `color` overrides the background.
- `offset: [number, number]` defaults to `[0, 0]`; positive values move right and down.
- `label` supplies an accessible name, especially useful for dots.

The default slot is the target; without it the badge appears inline. The `content` slot receives `{ value, displayValue }` and customizes non-dot content. Exports: `LuBadge`, `EpxBadge`.
