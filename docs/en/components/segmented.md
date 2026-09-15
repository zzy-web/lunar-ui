# Segmented

Switch between exclusive options with primitive values, disabled items, custom slots, vertical and block layouts.

<script setup>
import { ref } from 'vue'
const view = ref('Day')
const plan = ref('team')
const enabled = ref(false)
const options = [
  { label: 'Personal', value: 'personal' },
  { label: 'Team', value: 'team' },
  { label: 'Enterprise', value: 'enterprise', disabled: true }
]
const booleanOptions = [{ label: 'Off', value: false }, { label: 'On', value: true }]
</script>

## Basic options and sizes

<DemoBlock direction="column">
<lu-segmented v-model="view" :options="['Day', 'Week', 'Month']" size="small" />
<lu-segmented v-model="view" :options="['Day', 'Week', 'Month']" />
<lu-segmented v-model="view" :options="['Day', 'Week', 'Month']" size="large" />
<template #source>

```vue
<script setup>
import { ref } from 'vue'
const view = ref('Day')
const plan = ref('team')
const enabled = ref(false)
const options = [
  { label: 'Personal', value: 'personal' },
  { label: 'Team', value: 'team' },
  { label: 'Enterprise', value: 'enterprise', disabled: true }
]
const booleanOptions = [{ label: 'Off', value: false }, { label: 'On', value: true }]
</script>

<template>
  <lu-segmented v-model="view" :options="['Day', 'Week', 'Month']" size="small" />
  <lu-segmented v-model="view" :options="['Day', 'Week', 'Month']" />
  <lu-segmented v-model="view" :options="['Day', 'Week', 'Month']" size="large" />
</template>
```

</template>
</DemoBlock>

## Block, custom content and disabled items

<DemoBlock direction="column">
<lu-segmented v-model="plan" :options="options" block label="Plan">
  <template #default="{ item, selected }"><span>{{ selected ? '✓ ' : '' }}{{ item.label }}</span></template>
</lu-segmented>
<template #source>

```vue
<script setup>
import { ref } from 'vue'
const view = ref('Day')
const plan = ref('team')
const enabled = ref(false)
const options = [
  { label: 'Personal', value: 'personal' },
  { label: 'Team', value: 'team' },
  { label: 'Enterprise', value: 'enterprise', disabled: true }
]
const booleanOptions = [{ label: 'Off', value: false }, { label: 'On', value: true }]
</script>

<template>
  <lu-segmented v-model="plan" :options="options" block label="Plan">
    <template #default="{ item, selected }"><span>{{ selected ? '✓ ' : '' }}{{ item.label }}</span></template>
  </lu-segmented>
</template>
```

</template>
</DemoBlock>

## Vertical and native form values

<DemoBlock direction="column">
<lu-segmented v-model="plan" :options="options" direction="vertical" name="plan" label="Plan" />
<template #source>

```vue
<script setup>
import { ref } from 'vue'
const view = ref('Day')
const plan = ref('team')
const enabled = ref(false)
const options = [
  { label: 'Personal', value: 'personal' },
  { label: 'Team', value: 'team' },
  { label: 'Enterprise', value: 'enterprise', disabled: true }
]
const booleanOptions = [{ label: 'Off', value: false }, { label: 'On', value: true }]
</script>

<template>
  <lu-segmented v-model="plan" :options="options" direction="vertical" name="plan" label="Plan" />
</template>
```

</template>
</DemoBlock>

## Boolean values and disabled group

<DemoBlock direction="column">
<lu-segmented v-model="enabled" :options="booleanOptions" label="Enabled" />
<lu-segmented model-value="Day" :options="['Day', 'Week', 'Month']" disabled />
<template #source>

```vue
<script setup>
import { ref } from 'vue'
const view = ref('Day')
const plan = ref('team')
const enabled = ref(false)
const options = [
  { label: 'Personal', value: 'personal' },
  { label: 'Team', value: 'team' },
  { label: 'Enterprise', value: 'enterprise', disabled: true }
]
const booleanOptions = [{ label: 'Off', value: false }, { label: 'On', value: true }]
</script>

<template>
  <lu-segmented v-model="enabled" :options="booleanOptions" label="Enabled" />
  <lu-segmented model-value="Day" :options="['Day', 'Week', 'Month']" disabled />
</template>
```

</template>
</DemoBlock>

## Behavior

Values use strict equality, so 0, '0' and false are distinct. Without a binding, selection is managed internally. Unmatched values leave every option unchecked without emitting. Arrows and Home/End move and select, skipping disabled items; Enter/Space also selects. Values must be unique.

## Segmented Props

| Property | Type | Default | Description |
| --- | --- | --- | --- |
| `modelValue` | `string / number / boolean` | `—` | Selected value |
| `options` | `(SegmentedValue / SegmentedOption)[]` | `[]` | Primitives or `{ label, value, disabled }` |
| `disabled` | `boolean` | `false` | Disable all options |
| `size` | `small / default / large` | `default` | Size |
| `block` | `boolean` | `false` | Fill available width with equal options |
| `direction` | `horizontal / vertical` | `horizontal` | Layout and arrow-key axis |
| `label` | `string` | `Options` | Accessible group label |
| `name` | `string` | `—` | Hidden form field name; omitted from submission when disabled |

## Events

`update:modelValue(value)` / `change(value)` fire when a different enabled option is selected.

## Slots

default receives { item, selected, index }; item is always a normalized SegmentedOption. Do not nest buttons or links.

## Types and additional API

SegmentedValue and SegmentedOption types are exported. Native form submission uses String(value); v-model retains the original type.

Feature reference：[Element Plus Segmented](https://element-plus.org/en-US/component/segmented.html)。This page documents Lunar UI's supported API; it is not a drop-in replacement.
