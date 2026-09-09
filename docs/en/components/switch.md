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

| Attribute | Type | Default | Description |
| --- | --- | --- | --- |
| `modelValue` | `boolean` | `false` | Bound value. |
| `disabled` | `boolean` | `false` | Whether the control is disabled. |
| `loading` | `boolean` | `false` | Loading state; also prevents toggling. |
| `activeText` | `string` | — | Text to the right of the switch. |
| `inactiveText` | `string` | — | Text to the left of the switch. |
| `size` | `'large' \| 'default' \| 'small'` | `'default'` | Component size. |

## Events

| Event | Signature | Description |
| --- | --- | --- |
| `update:modelValue` | `(value: boolean)` | Update the bound value. |
| `change` | `(value: boolean)` | Emitted when the user changes the value. |
