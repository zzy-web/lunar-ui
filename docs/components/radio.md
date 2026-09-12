# Radio 单选框

单选框用于一组互斥选项。通过 RadioGroup 统一绑定选中值、尺寸与禁用状态。

<script setup>
import { ref } from 'vue'
const plan = ref('team')
const borderedPlan = ref('team')
const standalone = ref(false)
</script>

## 单选框组

<DemoBlock>
<lu-radio-group v-model="plan" aria-label="Plan">
  <lu-radio value="personal">Personal</lu-radio>
  <lu-radio value="team">Team</lu-radio>
  <lu-radio value="enterprise" disabled>Enterprise</lu-radio>
</lu-radio-group>
<template #source>

```vue
<script setup>
import { ref } from 'vue'
const plan = ref('team')
</script>

<template>
  <lu-radio-group v-model="plan" aria-label="Plan">
    <lu-radio value="personal">Personal</lu-radio>
    <lu-radio value="team">Team</lu-radio>
    <lu-radio value="enterprise" disabled>Enterprise</lu-radio>
  </lu-radio-group>
</template>
```

</template>
</DemoBlock>

## 带边框与尺寸

<DemoBlock>
<lu-radio-group v-model="borderedPlan" size="large" aria-label="Plan with borders">
  <lu-radio value="personal" border>Personal</lu-radio>
  <lu-radio value="team" border>Team</lu-radio>
</lu-radio-group>
<lu-radio-group model-value="team" disabled aria-label="Disabled plan">
  <lu-radio value="team">Team</lu-radio>
  <lu-radio value="personal">Personal</lu-radio>
</lu-radio-group>
<template #source>

```vue
<script setup>
import { ref } from 'vue'
const borderedPlan = ref('team')
</script>

<template>
  <lu-radio-group v-model="borderedPlan" size="large" aria-label="Plan with borders">
    <lu-radio value="personal" border>Personal</lu-radio>
    <lu-radio value="team" border>Team</lu-radio>
  </lu-radio-group>
  <lu-radio-group model-value="team" disabled aria-label="Disabled plan">
    <lu-radio value="team">Team</lu-radio>
    <lu-radio value="personal">Personal</lu-radio>
  </lu-radio-group>
</template>
```

</template>
</DemoBlock>

## 布尔值

<DemoBlock>
<lu-radio v-model="standalone" :value="true" name="standalone">Yes</lu-radio>
<lu-radio v-model="standalone" :value="false" name="standalone">No</lu-radio>
<template #source>

```vue
<script setup>
import { ref } from 'vue'
const standalone = ref(false)
</script>

<template>
  <lu-radio v-model="standalone" :value="true" name="standalone">Yes</lu-radio>
  <lu-radio v-model="standalone" :value="false" name="standalone">No</lu-radio>
</template>
```

</template>
</DemoBlock>

## Radio Props

| 属性 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `modelValue` | `RadioValue` | `undefined` | 独立使用时的绑定值；RadioValue 为 string、number 或 boolean。 |
| `value` | `RadioValue` | — | 必填，当前选项值。 |
| `label` | `string` | — | 标签文本，默认显示 value，可用插槽覆盖。 |
| `name` | `string` | — | 原生 radio 名称；在组内继承组名称。 |
| `disabled` | `boolean` | `false` | 是否禁用。 |
| `size` | `'large' \| 'default' \| 'small'` | `'default'` | 未设置时继承组尺寸。 |
| `border` | `boolean` | `false` | 显示边框。 |

## RadioGroup Props

| 属性 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `modelValue` | `RadioValue` | `undefined` | 组选中值。 |
| `disabled` | `boolean` | `false` | 是否禁用。 |
| `size` | `'large' \| 'default' \| 'small'` | `'default'` | 组件尺寸。 |
| `name` | `string` | — | 原生组名称；未提供时自动生成唯一名称。 |

## 事件

| 事件名 | 参数 / 签名 | 说明 |
| --- | --- | --- |
| `update:modelValue` | `(value: RadioValue)` | 更新绑定值；组内由 RadioGroup 发出。 |
| `change` | `(value: RadioValue)` | 选项变化时触发；Radio 和 RadioGroup 均支持。 |

## 插槽

| 插槽名 | 插槽参数 | 说明 |
| --- | --- | --- |
| `default` | — | Radio 的标签内容，或 RadioGroup 的子项。 |

## 使用说明

请为组设置 `aria-label` 或 `aria-labelledby`。Tab 进入组，方向键切换同组原生单选框。组禁用时全部子项禁用。
