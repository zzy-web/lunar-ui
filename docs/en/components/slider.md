# Slider

Adjust values by dragging, clicking the track or using the keyboard. Supports ranges, marks, stops and vertical layouts.

<script setup>
import { ref } from 'vue'
const value = ref(40)
const range = ref([20, 70])
const vertical = ref(35)
const marks = { 0: '0°C', 25: '25°C', 50: { label: '50°C', style: { color: '#e6a23c' } }, 100: '100°C' }
const format = value => `${value}%`
</script>

## Basic slider and input

<DemoBlock direction="column">
<lu-slider v-model="value" show-input :format-tooltip="format" />
<template #source>

```vue
<script setup>
import { ref } from 'vue'
const value = ref(40)
const range = ref([20, 70])
const vertical = ref(35)
const marks = { 0: '0°C', 25: '25°C', 50: { label: '50°C', style: { color: '#e6a23c' } }, 100: '100°C' }
const format = value => `${value}%`
</script>

<template>
  <lu-slider v-model="value" show-input :format-tooltip="format" />
</template>
```

</template>
</DemoBlock>

## Range and stops

<DemoBlock direction="column">
<lu-slider v-model="range" range :step="10" show-stops range-start-label="Minimum" range-end-label="Maximum" />
<p>{{ range[0] }} – {{ range[1] }}</p>
<template #source>

```vue
<script setup>
import { ref } from 'vue'
const value = ref(40)
const range = ref([20, 70])
const vertical = ref(35)
const marks = { 0: '0°C', 25: '25°C', 50: { label: '50°C', style: { color: '#e6a23c' } }, 100: '100°C' }
const format = value => `${value}%`
</script>

<template>
  <lu-slider v-model="range" range :step="10" show-stops range-start-label="Minimum" range-end-label="Maximum" />
  <p>{{ range[0] }} – {{ range[1] }}</p>
</template>
```

</template>
</DemoBlock>

## Custom marks

<DemoBlock direction="column">
<lu-slider v-model="value" :marks="marks" :step="5" />
<template #source>

```vue
<script setup>
import { ref } from 'vue'
const value = ref(40)
const range = ref([20, 70])
const vertical = ref(35)
const marks = { 0: '0°C', 25: '25°C', 50: { label: '50°C', style: { color: '#e6a23c' } }, 100: '100°C' }
const format = value => `${value}%`
</script>

<template>
  <lu-slider v-model="value" :marks="marks" :step="5" />
</template>
```

</template>
</DemoBlock>

## Vertical and disabled

<DemoBlock direction="column">
<div style="display: flex; gap: 40px; align-items: center">
  <lu-slider v-model="vertical" vertical height="180px" :step="5" />
  <lu-slider :model-value="[20, 80]" range vertical height="180px" disabled />
</div>
<template #source>

```vue
<script setup>
import { ref } from 'vue'
const value = ref(40)
const range = ref([20, 70])
const vertical = ref(35)
const marks = { 0: '0°C', 25: '25°C', 50: { label: '50°C', style: { color: '#e6a23c' } }, 100: '100°C' }
const format = value => `${value}%`
</script>

<template>
  <div style="display: flex; gap: 40px; align-items: center">
    <lu-slider v-model="vertical" vertical height="180px" :step="5" />
    <lu-slider :model-value="[20, 80]" range vertical height="180px" disabled />
  </div>
</template>
```

</template>
</DemoBlock>

## Behavior

Arrows move one step; PageUp / PageDown move ten; Home / End move to bounds. Range handles cannot cross. Dragging emits input and model updates, then one change on release. Pointer cancellation restores the starting value. Steps are based on min; max remains reachable. Invalid bounds are normalized; more than 1,000 stops are hidden to avoid excessive DOM.

## Slider Props

| Property | Type | Default | Description |
| --- | --- | --- | --- |
| `modelValue` | `number / [number, number]` | `min / [min, max]` | Number or range; supports internal state |
| `min / max` | `number` | `0 / 100` | Bounds |
| `step` | `number` | `1` | Positive step, including decimals |
| `range` | `boolean` | `false` | Two-handle range |
| `disabled` | `boolean` | `false` | Disable interaction |
| `vertical / height` | `boolean / string` | `false / 200px` | Vertical layout and height |
| `size` | `small / default / large` | `default` | Handle and input size |
| `showStops` | `boolean` | `false` | Show discrete stops |
| `marks` | `SliderMarks` | `{}` | Map values to text or `{ label, style }` |
| `showTooltip` | `boolean` | `true` | Show value on hover, focus or drag |
| `formatTooltip` | `(value: number) => string / number` | `—` | Format tooltip and accessible value |
| `showInput / showInputControls` | `boolean` | `false / true` | Numeric input and controls in horizontal single mode |
| `label` | `string` | `Slider` | Accessible label for single mode |
| `rangeStartLabel / rangeEndLabel` | `string` | `Range start / Range end` | Accessible range endpoint labels |

## Events

`update:modelValue(value)` and `input(value)` fire on adjustment; `change(value)` fires after a drag or keyboard/input commit. Values use the exported `SliderValue` type.

## Slots

None. Customize display with `marks` and `formatTooltip`.

## Types and additional API

Pass [start, end] in range mode. Unsorted external pairs are sorted for display without emitting events. showInput is available only in horizontal single mode.

Feature reference：[Element Plus Slider](https://element-plus.org/en-US/component/slider.html)。This page documents Lunar UI's supported API; it is not a drop-in replacement.
