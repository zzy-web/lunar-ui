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

点击轨道会将最近的手柄移到对应步进点。按住手柄边缘开始拖动时，手柄会保持当前位置，随指针移动再更新。拖动时触发 `input` 和 `v-model` 更新，数值改变后释放手柄会触发一次 `change`。取消指针操作会恢复拖动前的值。

步长以 `min` 为基准。组件会调整无效的范围设置，超过 1,000 个刻度时会隐藏刻度。

### 键盘操作

聚焦滑块手柄后，可用以下按键调整数值。双手柄模式下，每个手柄的可调范围以另一个手柄的位置为界。

| 按键 | 操作 |
| --- | --- |
| `←` / `↓` | 移到上一个步进点 |
| `→` / `↑` | 移到下一个步进点 |
| `Page Down` / `Page Up` | 向下或向上移动十个步进点，到边界时停止 |
| `Home` / `End` | 跳到当前手柄允许的最小值或最大值 |

当 `max` 位于两个步进点之间时，它仍可通过键盘选中。例如 `min=0`、`max=10`、`step=3` 时，按右方向键依次经过 0、3、6、9、10。

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


置于 `LuForm` 内时，此组件继承表单禁用状态和默认尺寸，组件/分组显式尺寸优先。详见 [Form 表单](./form)。

## 使用建议

- 精确数值输入可配合输入框；滑块更适合在范围内探索。
- 区间滑块应清楚说明两个端点的含义和允许的最小间隔。
