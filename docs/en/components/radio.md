# Radio

Use radio buttons for mutually exclusive options. RadioGroup shares the selected value, size and disabled state.

<script setup>
import { ref } from 'vue'
const plan = ref('team')
const standalone = ref(false)
</script>

## Radio group

<DemoBlock>
<lu-radio-group v-model="plan" aria-label="Plan">
  <lu-radio value="personal">Personal</lu-radio>
  <lu-radio value="team">Team</lu-radio>
  <lu-radio value="enterprise" disabled>Enterprise</lu-radio>
</lu-radio-group>
<template #source>

```vue
<script setup>
import { ref } from 'vue'
const plan = ref('team')
const standalone = ref(false)
</script>

<template>
  <lu-radio-group v-model="plan" aria-label="Plan">
    <lu-radio value="personal">Personal</lu-radio>
    <lu-radio value="team">Team</lu-radio>
    <lu-radio value="enterprise" disabled>Enterprise</lu-radio>
  </lu-radio-group>
</template>
```

</template>
</DemoBlock>

## Borders and sizes

<DemoBlock>
<lu-radio-group v-model="plan" size="large" aria-label="Plan with borders">
  <lu-radio value="personal" border>Personal</lu-radio>
  <lu-radio value="team" border>Team</lu-radio>
</lu-radio-group>
<lu-radio-group model-value="team" disabled aria-label="Disabled plan">
  <lu-radio value="team">Team</lu-radio>
  <lu-radio value="personal">Personal</lu-radio>
</lu-radio-group>
<template #source>

```vue
<script setup>
import { ref } from 'vue'
const plan = ref('team')
const standalone = ref(false)
</script>

<template>
  <lu-radio-group v-model="plan" size="large" aria-label="Plan with borders">
    <lu-radio value="personal" border>Personal</lu-radio>
    <lu-radio value="team" border>Team</lu-radio>
  </lu-radio-group>
  <lu-radio-group model-value="team" disabled aria-label="Disabled plan">
    <lu-radio value="team">Team</lu-radio>
    <lu-radio value="personal">Personal</lu-radio>
  </lu-radio-group>
</template>
```

</template>
</DemoBlock>

## Boolean values

<DemoBlock>
<lu-radio v-model="standalone" :value="true" name="standalone">Yes</lu-radio>
<lu-radio v-model="standalone" :value="false" name="standalone">No</lu-radio>
<template #source>

```vue
<script setup>
import { ref } from 'vue'
const plan = ref('team')
const standalone = ref(false)
</script>

<template>
  <lu-radio v-model="standalone" :value="true" name="standalone">Yes</lu-radio>
  <lu-radio v-model="standalone" :value="false" name="standalone">No</lu-radio>
</template>
```

</template>
</DemoBlock>

## Radio Props

| Attribute | Type | Default | Description |
| --- | --- | --- | --- |
| `modelValue` | `RadioValue` | `undefined` | Standalone bound value; RadioValue is string, number or boolean. |
| `value` | `RadioValue` | — | Required value of this option. |
| `label` | `string` | — | Label text; falls back to value, overridden by the slot. |
| `name` | `string` | — | Native radio name; inherited from the group when present. |
| `disabled` | `boolean` | `false` | Whether the control is disabled. |
| `size` | `'large' \| 'default' \| 'small'` | `'default'` | Inherits group size when omitted. |
| `border` | `boolean` | `false` | Show a border. |

## RadioGroup Props

| Attribute | Type | Default | Description |
| --- | --- | --- | --- |
| `modelValue` | `RadioValue` | `undefined` | Selected group value. |
| `disabled` | `boolean` | `false` | Whether the control is disabled. |
| `size` | `'large' \| 'default' \| 'small'` | `'default'` | Component size. |
| `name` | `string` | — | Native group name; a unique name is generated when omitted. |

## Events

| Event | Signature | Description |
| --- | --- | --- |
| `update:modelValue` | `(value: RadioValue)` | Update the bound value; emitted by RadioGroup for grouped radios. |
| `change` | `(value: RadioValue)` | Selection changed; supported by Radio and RadioGroup. |

## Slots

| Slot | Slot props | Description |
| --- | --- | --- |
| `default` | — | Radio label content or RadioGroup children. |

## Usage notes

Label the group using `aria-label` or `aria-labelledby`. Tab enters the group; arrow keys move between native radio buttons. Disabling the group disables all children.
