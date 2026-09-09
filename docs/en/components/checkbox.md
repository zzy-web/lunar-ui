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

| Attribute | Type | Default | Description |
| --- | --- | --- | --- |
| `modelValue` | `boolean` | `false` | Bound value. |
| `label` | `string` | — | Label text, overridden by the default slot. |
| `indeterminate` | `boolean` | `false` | Parent-controlled indeterminate state. |
| `disabled` | `boolean` | `false` | Whether the control is disabled. |
| `size` | `'large' \| 'default' \| 'small'` | `'default'` | Component size. |

## Events

| Event | Signature | Description |
| --- | --- | --- |
| `update:modelValue` | `(value: boolean)` | Update the bound value. |
| `change` | `(value: boolean)` | Emitted when the user changes the value. |

## Slots

| Slot | Slot props | Description |
| --- | --- | --- |
| `default` | — | Label content. |
