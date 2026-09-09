# Radio 单选框

单选框用于一组互斥选项。通过 RadioGroup 统一绑定选中值、尺寸与禁用状态。

<script setup>
import { ref } from 'vue'
const plan = ref('team')
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
const standalone = ref(false)
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
<lu-radio-group v-model="plan" size="large" aria-label="Plan with borders">
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
const plan = ref('team')
const standalone = ref(false)
</script>

<template>
  <lu-radio-group v-model="plan" size="large" aria-label="Plan with borders">
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
const plan = ref('team')
const standalone = ref(false)
</script>

<template>
  <lu-radio v-model="standalone" :value="true" name="standalone">Yes</lu-radio>
  <lu-radio v-model="standalone" :value="false" name="standalone">No</lu-radio>
</template>
```

</template>
</DemoBlock>

## Props

- `value`：Radio 必填，类型 `string | number | boolean`。标签仅作为展示，选中值由 `value` 决定。
- `modelValue`：同 `value` 类型；有组时由组统一管理。
- `label`：Radio 默认文本，可由默认插槽覆盖。
- `disabled`：默认 `false`；组禁用时所有子项禁用。
- `size`：`large | default | small`；子项未设置时继承组尺寸。
- `border`：Radio 边框样式，默认 `false`。
- `name`：原生 radio 名称；组未传时自动生成，避免多个组互相影响。

## 事件

Radio 与 RadioGroup 支持 `update:modelValue(value)` 和 `change(value)`。组内由组发出绑定更新，Radio 仍发出自身的 `change`。

## 使用说明

默认插槽：Radio 标签 / RadioGroup 子项。请为组设置 `aria-label` 或 `aria-labelledby`。Tab 进入组，方向键切换同组原生单选框。
