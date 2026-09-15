# Slider 滑块

通过拖动、点击轨道或键盘调整数值，支持双端点区间、标记、刻度和竖向布局。

<script setup>
import { ref } from 'vue'
const value = ref(40)
const range = ref([20, 70])
const vertical = ref(35)
const marks = { 0: '0°C', 25: '25°C', 50: { label: '50°C', style: { color: '#e6a23c' } }, 100: '100°C' }
const format = value => `${value}%`
</script>

## 基础与输入框

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

## 区间与刻度

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

## 自定义标记

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

## 竖向与禁用

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

## 交互说明

方向键调整一个步长，PageUp / PageDown 调整十个步长，Home / End 到边界。区间端点不能交叉。拖动时触发 input 和 v-model 更新，释放时仅触发一次 change；取消指针操作恢复拖动前值。步长以 min 为基准，max 始终可达。异常范围归一化；超过 1000 个刻度时隐藏刻度以避免大量 DOM。

## Slider Props

| 属性 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `modelValue` | `number / [number, number]` | `min / [min, max]` | 数值或区间；支持内部状态 |
| `min / max` | `number` | `0 / 100` | 范围 |
| `step` | `number` | `1` | 正数步长；支持小数 |
| `range` | `boolean` | `false` | 双端点区间 |
| `disabled` | `boolean` | `false` | 禁用交互 |
| `vertical / height` | `boolean / string` | `false / 200px` | 竖向布局与高度 |
| `size` | `small / default / large` | `default` | 滑块和输入框尺寸 |
| `showStops` | `boolean` | `false` | 显示离散刻度 |
| `marks` | `SliderMarks` | `{}` | 数值映射到文本或 `{ label, style }` |
| `showTooltip` | `boolean` | `true` | 悬停、聚焦或拖动时显示数值 |
| `formatTooltip` | `(value: number) => string / number` | `—` | 提示与朗读数值格式 |
| `showInput / showInputControls` | `boolean` | `false / true` | 水平单值模式显示计数器及按钮 |
| `label` | `string` | `Slider` | 单值模式无障碍名称 |
| `rangeStartLabel / rangeEndLabel` | `string` | `Range start / Range end` | 区间端点无障碍名称 |

## 事件

`update:modelValue(value)` 与 `input(value)`：值调整时触发；`change(value)`：拖动完成、键盘或计数器提交时触发。值类型为导出的 `SliderValue`。

## 插槽

无。使用 `marks` 和 `formatTooltip` 自定义显示。

## 类型与补充 API

区间模式传 `[起点, 终点]`。外部传入乱序数组会排序显示，不主动触发事件。`showInput` 仅支持水平单值模式。

功能参考：[Element Plus Slider](https://element-plus.org/en-US/component/slider.html)。本页 API 以 Lunar UI 实际实现为准，不保证与 Element Plus 完全兼容。
