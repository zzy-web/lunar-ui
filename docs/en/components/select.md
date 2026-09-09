# Select

Select one or more predefined values, with clear, disabled and loading states. Uses a native select for browser keyboard and mobile selection behavior.

<script setup>
import { ref } from 'vue'
const value = ref(undefined)
const multiple = ref([1])
const options = [{ label: 'Design', value: 1 }, { label: 'Engineering', value: 2 }, { label: 'Archived', value: 3, disabled: true }]
</script>

## Basic selection and clearing

<DemoBlock>
<lu-select v-model="value" :options="options" clearable aria-label="Team" placeholder="Select a team" />
<template #source>

```vue
<script setup>
import { ref } from 'vue'
const value = ref(undefined)
const multiple = ref([1])
const options = [{ label: 'Design', value: 1 }, { label: 'Engineering', value: 2 }, { label: 'Archived', value: 3, disabled: true }]
</script>

<template>
  <lu-select v-model="value" :options="options" clearable aria-label="Team" placeholder="Select a team" />
</template>
```

</template>
</DemoBlock>

## Multiple selection

<DemoBlock>
<lu-select v-model="multiple" :options="options" multiple clearable aria-label="Teams" />
<template #source>

```vue
<script setup>
import { ref } from 'vue'
const value = ref(undefined)
const multiple = ref([1])
const options = [{ label: 'Design', value: 1 }, { label: 'Engineering', value: 2 }, { label: 'Archived', value: 3, disabled: true }]
</script>

<template>
  <lu-select v-model="multiple" :options="options" multiple clearable aria-label="Teams" />
</template>
```

</template>
</DemoBlock>

## Disabled and loading

<DemoBlock>
<lu-select :options="options" :model-value="1" disabled aria-label="Disabled team" />
<lu-select loading loading-text="Loading…" aria-label="Loading teams" />
<template #source>

```vue
<script setup>
import { ref } from 'vue'
const value = ref(undefined)
const multiple = ref([1])
const options = [{ label: 'Design', value: 1 }, { label: 'Engineering', value: 2 }, { label: 'Archived', value: 3, disabled: true }]
</script>

<template>
  <lu-select :options="options" :model-value="1" disabled aria-label="Disabled team" />
  <lu-select loading loading-text="Loading…" aria-label="Loading teams" />
</template>
```

</template>
</DemoBlock>

## Props

- `modelValue`: `string | number | (string | number)[]`. Clearing returns `undefined` in single mode or `[]` in multiple mode.
- `options`: `SelectOption[]`, default `[]`. Each option has a unique `value`, `label` and optional `disabled`.
- `multiple` / `clearable` / `disabled` / `loading`: booleans, default `false`.
- `size`: `large | default | small`, default `default`.
- `placeholder` / `loadingText` / `emptyText`: default Chinese labels; override these for your language.
- `clearLabel`: accessible clear button label, default `Clear selection`.

## Events

`update:modelValue` / `change`: selected value; `clear`: selection cleared; `focus` / `blur`: native focus events.

## Usage notes

Call `focus()` / `blur()` through a template ref. Import `SelectOption` and `SelectValue` from the library entry. This controlled component does not provide search, remote filtering or virtualization. Multiple mode uses a native list; hold Ctrl / Command to select multiple options. Use unique option values; avoid mixing values such as numeric 1 and string "1" that native controls cannot distinguish.
