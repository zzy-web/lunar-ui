# InputNumber

Numeric input with limits, decimal steps, strict multiples, precision, formatting and keyboard controls.

<script setup>
import { ref } from 'vue'
const quantity = ref(3)
const price = ref(12.5)
const amount = ref(1500)
const nullable = ref(null)
const formatMoney = value => `$ ${value.toLocaleString('en-US')}`
const parseMoney = value => value.replace(/[$,\s]/g, '')
</script>

## Basics and sizes

<DemoBlock direction="column">
<lu-input-number v-model="quantity" :min="0" :max="10" size="small" />
<lu-input-number v-model="quantity" :min="0" :max="10" />
<lu-input-number v-model="quantity" :min="0" :max="10" size="large" />
<template #source>

```vue
<script setup>
import { ref } from 'vue'
const quantity = ref(3)
const price = ref(12.5)
const amount = ref(1500)
const nullable = ref(null)
const formatMoney = value => `$ ${value.toLocaleString('en-US')}`
const parseMoney = value => value.replace(/[$,\s]/g, '')
</script>

<template>
  <lu-input-number v-model="quantity" :min="0" :max="10" size="small" />
  <lu-input-number v-model="quantity" :min="0" :max="10" />
  <lu-input-number v-model="quantity" :min="0" :max="10" size="large" />
</template>
```

</template>
</DemoBlock>

## Steps, precision and right controls

<DemoBlock direction="column">
<lu-input-number v-model="price" :min="0" :max="100" :step="0.25" :precision="2" step-strictly controls-position="right">
  <template #prefix>¥</template>
</lu-input-number>
<lu-input-number v-model="price" :step="0.25" :precision="2" :controls="false">
  <template #suffix>CNY</template>
</lu-input-number>
<template #source>

```vue
<script setup>
import { ref } from 'vue'
const quantity = ref(3)
const price = ref(12.5)
const amount = ref(1500)
const nullable = ref(null)
const formatMoney = value => `$ ${value.toLocaleString('en-US')}`
const parseMoney = value => value.replace(/[$,\s]/g, '')
</script>

<template>
  <lu-input-number v-model="price" :min="0" :max="100" :step="0.25" :precision="2" step-strictly controls-position="right">
    <template #prefix>¥</template>
  </lu-input-number>
  <lu-input-number v-model="price" :step="0.25" :precision="2" :controls="false">
    <template #suffix>CNY</template>
  </lu-input-number>
</template>
```

</template>
</DemoBlock>

## Formatting and clearing

<DemoBlock direction="column">
<lu-input-number v-model="amount" :min="0" :max="10000" :formatter="formatMoney" :parser="parseMoney" />
<lu-input-number v-model="nullable" :min="0" :max="100" value-on-clear="min" placeholder="Clear → 0" />
<template #source>

```vue
<script setup>
import { ref } from 'vue'
const quantity = ref(3)
const price = ref(12.5)
const amount = ref(1500)
const nullable = ref(null)
const formatMoney = value => `$ ${value.toLocaleString('en-US')}`
const parseMoney = value => value.replace(/[$,\s]/g, '')
</script>

<template>
  <lu-input-number v-model="amount" :min="0" :max="10000" :formatter="formatMoney" :parser="parseMoney" />
  <lu-input-number v-model="nullable" :min="0" :max="100" value-on-clear="min" placeholder="Clear → 0" />
</template>
```

</template>
</DemoBlock>

## Read-only and disabled

<DemoBlock direction="column">
<lu-input-number :model-value="8" readonly />
<lu-input-number :model-value="8" disabled />
<template #source>

```vue
<script setup>
import { ref } from 'vue'
const quantity = ref(3)
const price = ref(12.5)
const amount = ref(1500)
const nullable = ref(null)
const formatMoney = value => `$ ${value.toLocaleString('en-US')}`
const parseMoney = value => value.replace(/[$,\s]/g, '')
</script>

<template>
  <lu-input-number :model-value="8" readonly />
  <lu-input-number :model-value="8" disabled />
</template>
```

</template>
</DemoBlock>

## Behavior

Typing preserves a draft; blur, Enter or native change commits it. Arrow Up/Down and buttons commit immediately. Escape discards the draft. Composition does not commit. Invalid text restores the previous value; empty input defaults to null. Strict steps are multiples of zero, followed by bounds clamping. Precision is at least the step's decimal places, capped at 15. Omit v-model for internal state.

## InputNumber Props

| Property | Type | Default | Description |
| --- | --- | --- | --- |
| `modelValue` | `number / null` | `0 (uncontrolled)` | Bound number; null means empty |
| `min / max` | `number` | `MIN_SAFE_INTEGER / MAX_SAFE_INTEGER` | Bounds; max below min is treated as min |
| `step` | `number` | `1` | Positive increment; invalid values fall back to 1 |
| `stepStrictly` | `boolean` | `false` | Snap to step multiples; bounds take precedence |
| `precision` | `number` | `—` | Decimal places |
| `size` | `small / default / large` | `default` | Size |
| `controls` | `boolean` | `true` | Show controls |
| `controlsPosition` | `both / right` | `both` | Control placement |
| `disabled / readonly` | `boolean` | `false` | Disabled / read-only |
| `placeholder / label` | `string` | `— / Input number` | Placeholder and accessible name |
| `decreaseLabel / increaseLabel` | `string` | `Decrease / Increase` | Accessible control labels |
| `valueOnClear` | `number / null / min / max` | `null` | Value after clearing |
| `formatter` | `(value: number) => string` | `—` | Display formatter |
| `parser` | `(text: string) => string / number` | `—` | Parse formatted text |

## Events

`update:modelValue(value)`; `change(value, previous)` for committed changes; `input(text)` for draft text; `focus(event)` / `blur(event)`.

## Slots

`prefix`, `suffix`, `decrease-icon`, `increase-icon`.

## Types and additional API

Component refs expose `focus()`, `blur()`, `select()`. Native attributes such as `id`, `name`, `aria-label` are forwarded to the input.

Feature reference：[Element Plus InputNumber](https://element-plus.org/en-US/component/input-number.html)。This page documents Lunar UI's supported API; it is not a drop-in replacement.
