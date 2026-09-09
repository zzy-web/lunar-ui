# Switch

Toggle a boolean value. Disabled or loading switches do not emit updates. Supply `aria-label` when no text is shown.

<script setup>
import { ref } from 'vue'
const enabled = ref(false)
</script>

## Examples

<DemoBlock source-label="View source">
<lu-switch v-model="enabled" active-text="Notifications" />
<lu-switch :model-value="true" disabled aria-label="Disabled switch" />
<lu-switch loading aria-label="Saving" />
<lu-switch size="small" aria-label="Small switch" />
<lu-switch size="large" aria-label="Large switch" />

<template #source>

```vue
<script setup lang="ts">
import { ref } from 'vue'
const enabled = ref(false)
</script>

<template>
  <lu-switch v-model="enabled" active-text="Notifications" />
  <lu-switch :model-value="true" disabled aria-label="Disabled switch" />
  <lu-switch loading aria-label="Saving" />
  <lu-switch size="small" aria-label="Small switch" />
  <lu-switch size="large" aria-label="Large switch" />
</template>
```

</template>
</DemoBlock>

## Props

- `modelValue`: boolean, default `false`.
- `disabled` / `loading`: boolean, default `false`.
- `activeText` / `inactiveText`: string.
- `size`: `large`, `default`, or `small`. Default `default`.

## Events

`update:modelValue` / `change`: `(value: boolean)`.
