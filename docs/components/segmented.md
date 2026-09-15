# Segmented 分段控制器

在一组互斥选项之间切换，支持基础类型值、禁用项、自定义插槽、纵向与整行布局。

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

## 基础与尺寸

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

## 整行、自定义内容和禁用项

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

## 纵向与原生表单值

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

## 布尔值与全局禁用

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

## 交互说明

值使用严格相等比较，0、'0' 和 false 可分别选择。未绑定时内部管理选择；未匹配任何选项时保持未选中，不主动发出事件。方向键、Home / End 移动并选择，跳过禁用项；Enter / 空格也可选择。每个 value 必须唯一。

## Segmented Props

| 属性 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `modelValue` | `string / number / boolean` | `—` | 绑定值 |
| `options` | `(SegmentedValue / SegmentedOption)[]` | `[]` | 基础值或 `{ label, value, disabled }` |
| `disabled` | `boolean` | `false` | 禁用所有选项 |
| `size` | `small / default / large` | `default` | 尺寸 |
| `block` | `boolean` | `false` | 填满整行并均分宽度 |
| `direction` | `horizontal / vertical` | `horizontal` | 布局与方向键轴 |
| `label` | `string` | `Options` | 单选组无障碍名称 |
| `name` | `string` | `—` | 隐藏原生表单字段名；禁用时不提交 |

## 事件

`update:modelValue(value)` / `change(value)`：选中不同可用选项时触发。

## 插槽

`default` 接收 `{ item, selected, index }`，item 始终是标准化后的 SegmentedOption；不要嵌套按钮或链接。

## 类型与补充 API

导出 SegmentedValue 和 SegmentedOption 类型。name 字段以 String(value) 提交；程序内 v-model 保留原始类型。

功能参考：[Element Plus Segmented](https://element-plus.org/en-US/component/segmented.html)。本页 API 以 Lunar UI 实际实现为准，不保证与 Element Plus 完全兼容。
