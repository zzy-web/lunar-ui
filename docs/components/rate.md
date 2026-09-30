# Rate 评分

使用星级表达整数或半星评分。支持鼠标预览、键盘操作及只读展示。

<script setup>
import { ref } from 'vue'
const score = ref(3)
const halfScore = ref(2.5)
</script>

## 基础用法

<DemoBlock direction="column">
<lu-rate v-model="score" clearable show-score label="Satisfaction" />
<template #source>

```vue
<script setup>
import { ref } from 'vue'
const score = ref(3)
</script>

<template>
<lu-rate v-model="score" clearable show-score label="Satisfaction" />
</template>
```

</template>
</DemoBlock>

## 尺寸与状态

<DemoBlock direction="column">
<lu-rate :model-value="4" size="small" readonly show-score />
<lu-rate :model-value="3" disabled />
<lu-rate v-model="score" size="large" :max="10" />
<template #source>

```vue
<script setup>
import { ref } from 'vue'
const score = ref(3)
</script>

<template>
<lu-rate :model-value="4" size="small" readonly show-score />
<lu-rate :model-value="3" disabled />
<lu-rate v-model="score" size="large" :max="10" />
</template>
```

</template>
</DemoBlock>

## Rate Props

| 属性 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `modelValue` | `number` | `0` | 整数评分，支持 v-model |
| `max` | `number` | `5` | 星星总数，限制为 1–100 的整数 |
| `disabled / readonly` | `boolean` | `false` | 禁用 / 只读，均不触发更新 |
| `clearable` | `boolean` | `false` | 再次点击当前评分可清零 |
| `showScore` | `boolean` | `false` | 显示数值 |
| `size` | `small / default / large` | `default` | 星星尺寸 |
| `label` | `string` | `Rating` | 无障碍名称 |

## 事件与键盘

`update:modelValue` 和 `change` 返回新评分。方向键增减一分，Home 清零，End 设为满分。非有限值按零分展示，小数四舍五入。

## 半星评分

<DemoBlock>
<lu-rate v-model="halfScore" allow-half clearable show-score label="Half-star rating" />
<template #source>

```vue
<script setup>
import { ref } from 'vue'
const halfScore = ref(2.5)
</script>
<template>
  <lu-rate v-model="halfScore" allow-half clearable show-score label="Half-star rating" />
</template>
```

</template>
</DemoBlock>

`allowHalf` 默认为 false；开启后星星左右半区分别选择半星/整星，方向键步长变为 0.5。启用 clearable 后，再次点击当前半星可清空评分。

置于 `LuForm` 内时，此组件继承表单禁用状态和默认尺寸，组件/分组显式尺寸优先。详见 [Form 表单](./form)。

## 使用建议

- 评分前说明刻度含义，尤其是允许半星或清空评分时。
- 只读评分仍需提供可理解的数值或文字，便于辅助技术读取。
