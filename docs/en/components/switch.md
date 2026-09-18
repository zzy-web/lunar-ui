# Switch

Toggle a boolean value. Disabled or loading switches do not emit updates. Supply `aria-label` when no text is shown.

<script setup>
import { ref } from 'vue'
const enabled = ref(false)
const savedState = ref('off')
const confirmToggle = () => new Promise(resolve => setTimeout(() => resolve(true), 600))
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
| `modelValue` | `boolean \| string \| number` | `false` | Bound value. |
| `disabled` | `boolean` | `false` | Whether the control is disabled. |
| `loading` | `boolean` | `false` | Loading state; also prevents toggling. |
| `activeText` | `string` | — | Text to the right of the switch. |
| `inactiveText` | `string` | — | Text to the left of the switch. |
| `size` | `'large' \| 'default' \| 'small'` | `'default'` | Component size. |

## Events

| Event | Signature | Description |
| --- | --- | --- |
| `update:modelValue` | `(value: boolean \| string \| number)` | Update the bound value. |
| `change` | `(value: boolean \| string \| number)` | Emitted when the user changes the value. |

## Async confirmation and custom values

<DemoBlock>
<lu-switch v-model="savedState" active-value="on" inactive-value="off" :before-change="confirmToggle" active-text="Save preference" />
<span>{{ savedState }}</span>
<template #source>

```vue
<script setup>
import { ref } from 'vue'
const savedState = ref('off')
const confirmToggle = () => new Promise(resolve => setTimeout(() => resolve(true), 600))
</script>
<template>
  <lu-switch v-model="savedState" active-value="on" inactive-value="off" :before-change="confirmToggle" active-text="Save preference" />
</template>
```

</template>
</DemoBlock>

`activeValue` and `inactiveValue` accept boolean, string or number and default to true/false. `beforeChange(): boolean | Promise<boolean>` can veto a change. Pending checks show loading and ignore repeated clicks; external value/disabled changes invalidate old results. Thrown/rejected errors emit `change-error(error)` without changing the value. The instance exposes `focus()` and `blur()`. The demo simulates a 600 ms save.

Inside `LuForm`, this component inherits its disabled state and default size; an explicit component/group size takes precedence. See [Form](./form).
