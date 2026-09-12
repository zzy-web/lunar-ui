# Select

A themed dropdown with single and multiple selection, removable tags, optional search, clear, disabled and loading states.

<script setup>
import { ref } from 'vue'
const advancedValue = ref([])
const remoteValue = ref(undefined)
const groupedOptions = [
  { value: 'design', label: 'Design', group: 'Product' },
  { value: 'engineering', label: 'Engineering', group: 'Product' },
  { value: 'support', label: 'Support', group: 'Operations' },
  { value: 'archived', label: 'Archived', group: 'Operations', disabled: true }
]
async function remoteMethod(query) {
  await new Promise(resolve => setTimeout(resolve, 400))
  return groupedOptions.filter(option => option.label.toLowerCase().includes(query.toLowerCase()))
}
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

## Groups, select all and selection limit

<DemoBlock>
<lu-select v-model="advancedValue" :options="groupedOptions" multiple filterable show-select-all :multiple-limit="2" clearable aria-label="Grouped teams">
  <template #option="{ option, selected }"><span>{{ option.label }}</span><small style="margin-left: 8px; opacity: .6">{{ selected ? 'Selected' : option.group }}</small></template>
</lu-select>
<template #source>

```vue
<lu-select v-model="advancedValue" :options="groupedOptions" multiple filterable
  show-select-all :multiple-limit="2" clearable>
  <template #option="{ option, selected, disabled }">
    <span>{{ option.label }}</span>
    <small>{{ option.group }}</small>
  </template>
</lu-select>
<!-- groupedOptions: [{ value: 'design', label: 'Design', group: 'Product' }] -->
```

</template>
</DemoBlock>

`group` groups options by label. Select all affects enabled search results only and fills remaining capacity in result order. Deselect all preserves selections outside the results. `multipleLimit=0` means unlimited; existing selections can still be removed at the limit. The `option` slot receives `{ option, selected, disabled }`; use display content rather than nested interactive controls.

## Remote search

<DemoBlock>
<lu-select v-model="remoteValue" :remote-method="remoteMethod" :debounce="300" clearable aria-label="Remote teams" placeholder="Search remote teams" />
<template #source>

```vue
<script setup>
import { ref } from 'vue'
const remoteValue = ref()
async function remoteMethod(query) {
  const response = await fetch(`/api/teams?q=${encodeURIComponent(query)}`)
  if (!response.ok) throw new Error('Failed to load teams')
  return response.json() // [{ value, label, group?, disabled? }]
}
</script>
<template>
  <lu-select v-model="remoteValue" :remote-method="remoteMethod" :debounce="300" clearable />
</template>
```

</template>
</DemoBlock>

The demo simulates a 400 ms request. `remoteMethod(query)` returns a Promise of options and enables search automatically. Opening loads the empty query. Loading is managed internally; typing remains available. Stale responses are discarded; failures display `remoteErrorText` and emit `remote-error`. Selected labels survive result changes.

## Props

| Attribute | Type | Default | Description |
| --- | --- | --- | --- |
| `modelValue` | `SelectValue \| SelectValue[]` | `undefined` | Bound value; SelectValue is string or number. |
| `options` | `SelectOption[]` | `[]` | Options with label, value and optional disabled. |
| `remoteMethod` | `(query: string) => Promise<SelectOption[]>` | — | Remote search / 远程搜索。 |
| `debounce` | `number` | `300` | Remote debounce in ms / 远程请求防抖毫秒数。 |
| `showSelectAll` | `boolean` | `false` | Multiple select-all / 多选全选按钮。 |
| `multipleLimit` | `number` | `0` | Maximum selections; 0 unlimited / 上限，0 不限。 |
| `remoteErrorText` | `string` | `加载失败，请重新搜索` | Remote error text / 远程错误提示。 |
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

Clearing returns `undefined` in single mode or `[]` in multiple mode. Arrow keys navigate enabled options; Enter selects; Escape and Tab close the popup. Multiple selection stays open and needs no modifier key. Values retain their string or number types. Virtualization is not supported.
