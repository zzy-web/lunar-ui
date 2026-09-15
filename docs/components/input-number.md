# InputNumber 计数器

支持范围约束、十进制步长、严格倍数、精度、格式化和键盘操作。

<script setup>
import { ref } from 'vue'
const quantity = ref(3)
const price = ref(12.5)
const amount = ref(1500)
const nullable = ref(null)
const formatMoney = value => `$ ${value.toLocaleString('en-US')}`
const parseMoney = value => value.replace(/[$,\s]/g, '')
</script>

## 基础与尺寸

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

## 步长、精度与右侧按钮

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

## 格式化与清空策略

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

## 只读与禁用

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

## 交互说明

输入过程中保留临时文本，失焦、Enter 或原生 change 时提交；上下方向键和按钮立即提交。Escape 撤销临时输入，输入法组合期间不提交。无效文本恢复之前的值；空文本默认为 null。严格步长以 0 为基准，最后执行 min/max 限制；精度不会低于 step 的小数位，最高 15 位。未绑定 v-model 时内部管理数值。

## InputNumber Props

| 属性 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `modelValue` | `number / null` | `0 (uncontrolled)` | 绑定数值，null 为空 |
| `min / max` | `number` | `MIN_SAFE_INTEGER / MAX_SAFE_INTEGER` | 允许范围；max 小于 min 时按 min 处理 |
| `step` | `number` | `1` | 正数步长；无效值使用 1 |
| `stepStrictly` | `boolean` | `false` | 仅允许 step 倍数，边界优先 |
| `precision` | `number` | `—` | 小数位数 |
| `size` | `small / default / large` | `default` | 尺寸 |
| `controls` | `boolean` | `true` | 显示加减按钮 |
| `controlsPosition` | `both / right` | `both` | 按钮位置 |
| `disabled / readonly` | `boolean` | `false` | 禁用 / 只读 |
| `placeholder / label` | `string` | `— / Input number` | 占位与无障碍名称 |
| `decreaseLabel / increaseLabel` | `string` | `Decrease / Increase` | 加减按钮无障碍名称 |
| `valueOnClear` | `number / null / min / max` | `null` | 清空后的值 |
| `formatter` | `(value: number) => string` | `—` | 显示格式 |
| `parser` | `(text: string) => string / number` | `—` | 解析输入；建议配合 formatter |

## 事件

`update:modelValue(value)`；`change(value, previous)`：已提交且变化的值；`input(text)`：临时输入文本；`focus(event)` / `blur(event)`。

## 插槽

`prefix`、`suffix`、`decrease-icon`、`increase-icon`。

## 类型与补充 API

通过组件 ref 调用 `focus()`、`blur()`、`select()`。原生 `id`、`name`、`aria-label` 等属性透传到输入框。

功能参考：[Element Plus InputNumber](https://element-plus.org/en-US/component/input-number.html)。本页 API 以 Lunar UI 实际实现为准，不保证与 Element Plus 完全兼容。
