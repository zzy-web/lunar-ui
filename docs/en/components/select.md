# Select

A themed dropdown with single and multiple selection, removable tags, optional search, clear, disabled and loading states.

<script setup>
import { ref } from 'vue'
const searchValue = ref(undefined)
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

## Search

Enable `filterable` to match option labels, ignoring case.

<DemoBlock>
<lu-select v-model="searchValue" :options="options" filterable clearable aria-label="Search teams" placeholder="Search teams" />
<template #source>

```vue
<lu-select v-model="searchValue" :options="options" filterable clearable placeholder="Search teams" />
```

</template>
</DemoBlock>

## Props

| Attribute | Type | Default | Description |
| --- | --- | --- | --- |
| `modelValue` | `SelectValue \| SelectValue[]` | `undefined` | Bound value; SelectValue is string or number. |
| `options` | `SelectOption[]` | `[]` | Options with label, value and optional disabled. |
| `filterable` | `boolean` | `false` | Search option labels. |
| `noMatchText` | `string` | `无匹配选项` | Empty search result text. |
| `multiple` | `boolean` | `false` | Enable multiple selection. |
| `clearable` | `boolean` | `false` | Show the clear button. |
| `disabled` | `boolean` | `false` | Whether the control is disabled. |
| `loading` | `boolean` | `false` | Loading state; disables interaction. |
| `size` | `'large' \| 'default' \| 'small'` | `'default'` | Component size. |
| `placeholder` | `string` | `'请选择'` | Placeholder when no option is selected. |
| `loadingText` | `string` | `'加载中…'` | Loading message. |
| `emptyText` | `string` | `'暂无选项'` | Message when there are no options. |
| `clearLabel` | `string` | `'Clear selection'` | Accessible clear button label. |

## Events

| Event | Signature | Description |
| --- | --- | --- |
| `update:modelValue` | `(value: SelectValue \| SelectValue[] \| undefined)` | Update the bound value. |
| `change` | `(value: SelectValue \| SelectValue[] \| undefined)` | Emitted on selection or clear. |
| `clear` | `()` | Emitted when cleared. |
| `focus` | `(event: FocusEvent)` | Receives focus. |
| `blur` | `(event: FocusEvent)` | Loses focus. |

## Methods

| Method | Signature | Description |
| --- | --- | --- |
| `focus` | `() => void` | Focus the select. |
| `blur` | `() => void` | Blur the select. |

## Usage notes

Clearing returns `undefined` in single mode or `[]` in multiple mode. Arrow keys navigate enabled options; Enter selects; Escape and Tab close the popup. Multiple selection stays open and needs no modifier key. Values retain their string or number types. Remote filtering and virtualization are not supported.
