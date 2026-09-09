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

## Props

- `value`: required on Radio, type `string | number | boolean`. Labels are display text; `value` identifies the selection.
- `modelValue`: same type as `value`; the group manages selection when present.
- `label`: Radio label, overridden by the default slot.
- `disabled`: default `false`; a disabled group disables every child.
- `size`: `large | default | small`; children inherit the group size unless overridden.
- `border`: Radio border style, default `false`.
- `name`: native radio name; groups generate a unique name when omitted.

## Events

Radio and RadioGroup support `update:modelValue(value)` and `change(value)`. Within a group, the group emits model updates; the child still emits its own `change`.

## Usage notes

Default slot: Radio label / RadioGroup children. Label the group with `aria-label` or `aria-labelledby`. Tab enters the group; arrow keys move between native radio buttons.
