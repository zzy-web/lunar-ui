# Checkbox 复选框

用于布尔值选择，支持半选展示。半选状态由父组件通过 `indeterminate` 控制，不会自动清除。

<script setup>
import { ref } from 'vue'
const checked = ref(false)
const channels = ref(['email'])
const choices = ref([0])
const all = ['email', 'sms', 'push']
</script>

## 示例

<DemoBlock>
<lu-checkbox v-model="checked">Accept terms</lu-checkbox>
<lu-checkbox :model-value="true" disabled>Disabled</lu-checkbox>
<lu-checkbox indeterminate aria-label="Select all" />
<lu-checkbox size="small">Small</lu-checkbox>
<lu-checkbox size="large">Large</lu-checkbox>

<template #source>

```vue
<script setup lang="ts">
import { ref } from 'vue'
const checked = ref(false)
</script>

<template>
  <lu-checkbox v-model="checked">Accept terms</lu-checkbox>
  <lu-checkbox :model-value="true" disabled>Disabled</lu-checkbox>
  <lu-checkbox indeterminate aria-label="Select all" />
  <lu-checkbox size="small">Small</lu-checkbox>
  <lu-checkbox size="large">Large</lu-checkbox>
</template>
```

</template>
</DemoBlock>

## 复选框组与全选

在组上绑定数组，每个 Checkbox 使用独立的 `value`。`label` 仅用于展示，不作为选中值。全选和半选状态由业务数据计算。

<DemoBlock direction="column">
  <lu-checkbox :model-value="channels.length === all.length" :indeterminate="channels.length > 0 && channels.length < all.length" @change="value => channels = value ? [...all] : []">全选通知渠道</lu-checkbox>
  <lu-checkbox-group v-model="channels" aria-label="通知渠道" name="channels">
    <lu-checkbox value="email">邮件</lu-checkbox>
    <lu-checkbox value="sms">短信</lu-checkbox>
    <lu-checkbox value="push">推送</lu-checkbox>
  </lu-checkbox-group>
  <span>已选：{{ channels.join('、') || '无' }}</span>
  <template #source>

```vue
<script setup>
import { ref } from 'vue'
const channels = ref(['email'])
const all = ['email', 'sms', 'push']
</script>

<template>
  <lu-checkbox :model-value="channels.length === all.length"
    :indeterminate="channels.length > 0 && channels.length < all.length"
    @change="value => channels = value ? [...all] : []">全选通知渠道</lu-checkbox>
  <lu-checkbox-group v-model="channels" aria-label="通知渠道" name="channels">
    <lu-checkbox value="email">邮件</lu-checkbox>
    <lu-checkbox value="sms">短信</lu-checkbox>
    <lu-checkbox value="push">推送</lu-checkbox>
  </lu-checkbox-group>
</template>
```

  </template>
</DemoBlock>

## 数量限制与类型化值

最多选择两项，最少保留一项。支持字符串、数字和布尔值，`0`、`false` 均为有效选项，数字 `0` 与字符串 `'0'` 不同。

<DemoBlock direction="column">
  <lu-checkbox-group v-model="choices" :min="1" :max="2" size="large" aria-label="选择一至两项">
    <lu-checkbox :value="0">数字 0</lu-checkbox>
    <lu-checkbox :value="false">布尔 false</lu-checkbox>
    <lu-checkbox value="0">字符串 0</lu-checkbox>
    <lu-checkbox value="disabled" disabled>禁用项</lu-checkbox>
  </lu-checkbox-group>
  <span>{{ JSON.stringify(choices) }}</span>
  <template #source>

```vue
<script setup>
import { ref } from 'vue'
const choices = ref([0])
</script>

<template>
  <lu-checkbox-group v-model="choices" :min="1" :max="2" size="large" aria-label="选择一至两项">
    <lu-checkbox :value="0">数字 0</lu-checkbox>
    <lu-checkbox :value="false">布尔 false</lu-checkbox>
    <lu-checkbox value="0">字符串 0</lu-checkbox>
    <lu-checkbox value="disabled" disabled>禁用项</lu-checkbox>
  </lu-checkbox-group>
</template>
```

  </template>
</DemoBlock>

## CheckboxGroup Props

| 属性 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `modelValue` | `readonly CheckboxValue[]` | `[]` | 选中值，更新事件返回新数组 |
| `min` / `max` | `number` | `0` / 无上限 | 用户操作的数量限制 |
| `disabled` | `boolean` | `false` | 禁用全部子项 |
| `size` | `'large' \| 'default' \| 'small'` | `'default'` | 子项默认尺寸，可单独覆盖 |
| `name` | `string` | — | 原生复选框共享的表单名称 |

组提供 `default` 插槽，触发 `update:modelValue` 和 `change`，参数均为 `CheckboxValue[]`。使用 `aria-label` 或 `aria-labelledby` 提供组名称。`CheckboxValue` 可从 `lunar-ui` 导入。

限制只约束用户操作，不会自动修改外部数组或补足最小数量。数量按去重后的数组计算，包括暂时未渲染的值；用户更新时返回去重后的新数组。限制值向下取整且不小于 0；非有限 `min` 按 0、非有限 `max` 按无上限处理，`max < min` 时按 `min` 处理。组内缺少 `value` 的子项会禁用；每个子项应使用唯一值。

## Props

| 属性 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `modelValue` | `boolean` | `false` | 绑定值。 |
| `value` | `string \| number \| boolean` | — | 组内选项值；独立使用时为原生 input 的 value。 |
| `name` | `string` | — | 原生 input 名称，优先使用组的 name。 |
| `label` | `string` | — | 标签文本，可由默认插槽覆盖。 |
| `indeterminate` | `boolean` | `false` | 半选展示状态，由父组件控制。 |
| `disabled` | `boolean` | `false` | 是否禁用。 |
| `size` | `'large' \| 'default' \| 'small'` | `'default'` | 组件尺寸。 |

## 事件

组内由 CheckboxGroup 管理选中状态，Checkbox 的 `modelValue` 被忽略，也不触发 `update:modelValue`；Checkbox 的 `change` 仍返回该项的新布尔状态。独立使用保持原有布尔绑定行为。

| 事件名 | 参数 / 签名 | 说明 |
| --- | --- | --- |
| `update:modelValue` | `(value: boolean)` | 更新绑定值。 |
| `change` | `(value: boolean)` | 用户更改值时触发。 |

## 插槽

| 插槽名 | 插槽参数 | 说明 |
| --- | --- | --- |
| `default` | — | 标签内容。 |

置于 `LuForm` 内时，此组件继承表单禁用状态和默认尺寸，组件/分组显式尺寸优先。详见 [Form 表单](./form)。
