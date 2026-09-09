# Checkbox

A boolean selection control. The parent controls `indeterminate`; user interaction does not clear that prop.

<script setup>
import { ref } from 'vue'
const checked = ref(false)
</script>

## Examples

<DemoBlock source-label="View source">
<lu-checkbox v-model="checked">Accept terms</lu-checkbox>
<lu-checkbox :model-value="true" disabled>Disabled</lu-checkbox>
<lu-checkbox indeterminate aria-label="Select all" />
<lu-checkbox size="small">Small</lu-checkbox>
<lu-checkbox size="large">Large</lu-checkbox>

<template #source>

```vue
<script setup lang="ts">
import { ref } from 'vue'
const checked = ref(false)
</script>

<template>
  <lu-checkbox v-model="checked">Accept terms</lu-checkbox>
  <lu-checkbox :model-value="true" disabled>Disabled</lu-checkbox>
  <lu-checkbox indeterminate aria-label="Select all" />
  <lu-checkbox size="small">Small</lu-checkbox>
  <lu-checkbox size="large">Large</lu-checkbox>
</template>
```

</template>
</DemoBlock>

## Props

- `modelValue`: boolean, default `false`.
- `label`: string; default slot overrides the label.
- `indeterminate`: boolean, default `false`.
- `disabled`: boolean, default `false`.
- `size`: `large`, `default`, or `small`. Default `default`.

## Events

`update:modelValue` / `change`: `(value: boolean)`.

## Slots

`default`: Label content.
