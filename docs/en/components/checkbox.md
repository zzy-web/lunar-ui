# Checkbox

A boolean selection control. The parent controls `indeterminate`; user interaction does not clear that prop.

<script setup>
import { ref } from 'vue'
const checked = ref(false)
const channels = ref(['email'])
const choices = ref([0])
const all = ['email', 'sms', 'push']
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

## Groups and select all

Bind an array on the group and give each Checkbox a unique `value`. Labels are display text, not selection values. Derive select-all and indeterminate states from your application data.

<DemoBlock direction="column">
  <lu-checkbox :model-value="channels.length === all.length" :indeterminate="channels.length > 0 && channels.length < all.length" @change="value => channels = value ? [...all] : []">All channels</lu-checkbox>
  <lu-checkbox-group v-model="channels" aria-label="Notification channels" name="channels">
    <lu-checkbox value="email">Email</lu-checkbox>
    <lu-checkbox value="sms">SMS</lu-checkbox>
    <lu-checkbox value="push">Push</lu-checkbox>
  </lu-checkbox-group>
  <span>Selected: {{ channels.join(', ') || 'None' }}</span>
  <template #source>

```vue
<script setup>
import { ref } from 'vue'
const channels = ref(['email'])
const all = ['email', 'sms', 'push']
</script>

<template>
  <lu-checkbox :model-value="channels.length === all.length"
    :indeterminate="channels.length > 0 && channels.length < all.length"
    @change="value => channels = value ? [...all] : []">All channels</lu-checkbox>
  <lu-checkbox-group v-model="channels" aria-label="Notification channels" name="channels">
    <lu-checkbox value="email">Email</lu-checkbox>
    <lu-checkbox value="sms">SMS</lu-checkbox>
    <lu-checkbox value="push">Push</lu-checkbox>
  </lu-checkbox-group>
</template>
```

  </template>
</DemoBlock>

## Limits and typed values

Keep at least one and at most two selections. Strings, numbers and booleans are supported, including `0` and `false`. Numeric `0` differs from the string `'0'`.

<DemoBlock direction="column">
  <lu-checkbox-group v-model="choices" :min="1" :max="2" size="large" aria-label="Choose one or two">
    <lu-checkbox :value="0">Number 0</lu-checkbox>
    <lu-checkbox :value="false">Boolean false</lu-checkbox>
    <lu-checkbox value="0">String 0</lu-checkbox>
    <lu-checkbox value="disabled" disabled>Disabled</lu-checkbox>
  </lu-checkbox-group>
  <span>{{ JSON.stringify(choices) }}</span>
  <template #source>

```vue
<script setup>
import { ref } from 'vue'
const choices = ref([0])
</script>

<template>
  <lu-checkbox-group v-model="choices" :min="1" :max="2" size="large" aria-label="Choose one or two">
    <lu-checkbox :value="0">Number 0</lu-checkbox>
    <lu-checkbox :value="false">Boolean false</lu-checkbox>
    <lu-checkbox value="0">String 0</lu-checkbox>
    <lu-checkbox value="disabled" disabled>Disabled</lu-checkbox>
  </lu-checkbox-group>
</template>
```

  </template>
</DemoBlock>

## CheckboxGroup Props

| Attribute | Type | Default | Description |
| --- | --- | --- | --- |
| `modelValue` | `readonly CheckboxValue[]` | `[]` | Selected values; updates return a new array |
| `min` / `max` | `number` | `0` / unlimited | Limits on user selection |
| `disabled` | `boolean` | `false` | Disable every child |
| `size` | `'large' \| 'default' \| 'small'` | `'default'` | Default child size; individual children can override it |
| `name` | `string` | — | Shared native input name for form submission |

The group provides a `default` slot and emits `update:modelValue` and `change`, both with a `CheckboxValue[]` argument. Supply an accessible group name using `aria-label` or `aria-labelledby`. Import the `CheckboxValue` type from `lunar-ui`.

Limits apply to user interaction; external arrays are never automatically corrected or filled to the minimum. Counts use unique selected values, including values without rendered options; user updates return a new deduplicated array. Limits are rounded down and clamped to zero. Non-finite `min` uses zero; non-finite `max` is unlimited. A maximum below the minimum uses the minimum. Children without a `value` are disabled; use unique values for each child.

## Props

| Attribute | Type | Default | Description |
| --- | --- | --- | --- |
| `modelValue` | `boolean` | `false` | Bound value. |
| `value` | `string \| number \| boolean` | — | Group option value; native input value when used independently. |
| `name` | `string` | — | Native input name; the group's name takes precedence. |
| `label` | `string` | — | Label text, overridden by the default slot. |
| `indeterminate` | `boolean` | `false` | Parent-controlled indeterminate state. |
| `disabled` | `boolean` | `false` | Whether the control is disabled. |
| `size` | `'large' \| 'default' \| 'small'` | `'default'` | Component size. |

## Events

Inside a group, CheckboxGroup controls selection. Checkbox ignores its own `modelValue` and does not emit `update:modelValue`; its `change` still receives the item's new boolean state. Standalone boolean binding is unchanged.

| Event | Signature | Description |
| --- | --- | --- |
| `update:modelValue` | `(value: boolean)` | Update the bound value. |
| `change` | `(value: boolean)` | Emitted when the user changes the value. |

## Slots

| Slot | Slot props | Description |
| --- | --- | --- |
| `default` | — | Label content. |

Inside `LuForm`, this component inherits its disabled state and default size; an explicit component/group size takes precedence. See [Form](./form).
