# Select 选择器

从预设选项中选择值，支持单选、多选标签、搜索、清空、禁用与加载状态。下拉面板使用统一主题样式，并支持键盘操作。

<script setup>
import { ref } from 'vue'
const advancedValue = ref([])
const remoteValue = ref(undefined)
const groupedOptions = [
  { value: 'design', label: 'Design', group: 'Product' },
  { value: 'engineering', label: 'Engineering', group: 'Product' },
  { value: 'support', label: 'Support', group: 'Operations' },
  { value: 'archived', label: 'Archived', group: 'Operations', disabled: true }
]
async function remoteMethod(query) {
  await new Promise(resolve => setTimeout(resolve, 400))
  return groupedOptions.filter(option => option.label.toLowerCase().includes(query.toLowerCase()))
}
const searchValue = ref(undefined)
const value = ref(undefined)
const multiple = ref([1])
const options = [{ label: 'Design', value: 1 }, { label: 'Engineering', value: 2 }, { label: 'Archived', value: 3, disabled: true }]
</script>

## 基础用法与清空

<DemoBlock>
<lu-select v-model="value" :options="options" clearable aria-label="Team" placeholder="Select a team" />
<template #source>

```vue
<script setup>
import { ref } from 'vue'
const value = ref(undefined)
const multiple = ref([1])
const options = [{ label: 'Design', value: 1 }, { label: 'Engineering', value: 2 }, { label: 'Archived', value: 3, disabled: true }]
</script>

<template>
  <lu-select v-model="value" :options="options" clearable aria-label="Team" placeholder="Select a team" />
</template>
```

</template>
</DemoBlock>

## 多选

<DemoBlock>
<lu-select v-model="multiple" :options="options" multiple clearable aria-label="Teams" />
<template #source>

```vue
<script setup>
import { ref } from 'vue'
const value = ref(undefined)
const multiple = ref([1])
const options = [{ label: 'Design', value: 1 }, { label: 'Engineering', value: 2 }, { label: 'Archived', value: 3, disabled: true }]
</script>

<template>
  <lu-select v-model="multiple" :options="options" multiple clearable aria-label="Teams" />
</template>
```

</template>
</DemoBlock>

## 禁用与加载

<DemoBlock>
<lu-select :options="options" :model-value="1" disabled aria-label="Disabled team" />
<lu-select loading loading-text="Loading…" aria-label="Loading teams" />
<template #source>

```vue
<script setup>
import { ref } from 'vue'
const value = ref(undefined)
const multiple = ref([1])
const options = [{ label: 'Design', value: 1 }, { label: 'Engineering', value: 2 }, { label: 'Archived', value: 3, disabled: true }]
</script>

<template>
  <lu-select :options="options" :model-value="1" disabled aria-label="Disabled team" />
  <lu-select loading loading-text="Loading…" aria-label="Loading teams" />
</template>
```

</template>
</DemoBlock>

## 搜索选项

设置 `filterable` 可按选项标签搜索，不区分大小写。多选无需按住 Ctrl / Command，点击选项即可切换，点击标签关闭按钮可移除。

<DemoBlock>
<lu-select v-model="searchValue" :options="options" filterable clearable aria-label="Search teams" placeholder="Search teams" />
<template #source>

```vue
<lu-select v-model="searchValue" :options="options" filterable clearable placeholder="Search teams" />
```

</template>
</DemoBlock>

## 分组、全选与数量上限

<DemoBlock>
<lu-select v-model="advancedValue" :options="groupedOptions" multiple filterable show-select-all :multiple-limit="2" clearable aria-label="Grouped teams">
  <template #option="{ option, selected }"><span>{{ option.label }}</span><small style="margin-left: 8px; opacity: .6">{{ selected ? 'Selected' : option.group }}</small></template>
</lu-select>
<template #source>

```vue
<lu-select v-model="advancedValue" :options="groupedOptions" multiple filterable
  show-select-all :multiple-limit="2" clearable>
  <template #option="{ option, selected, disabled }">
    <span>{{ option.label }}</span>
    <small>{{ option.group }}</small>
  </template>
</lu-select>
<!-- groupedOptions: [{ value: 'design', label: 'Design', group: 'Product' }] -->
```

</template>
</DemoBlock>

`group` 按名称分组选项。全选仅作用于当前结果中的非禁用项，按结果顺序填满剩余名额；取消全选保留结果之外的已选项。`multipleLimit=0` 表示不限，达到上限后仍可取消已选项。`option` 插槽接收 `{ option, selected, disabled }`，用于自定义展示内容，请避免嵌套交互控件。

## 远程搜索

<DemoBlock>
<lu-select v-model="remoteValue" :remote-method="remoteMethod" :debounce="300" clearable aria-label="Remote teams" placeholder="Search remote teams" />
<template #source>

```vue
<script setup>
import { ref } from 'vue'
const remoteValue = ref()
async function remoteMethod(query) {
  const response = await fetch(`/api/teams?q=${encodeURIComponent(query)}`)
  if (!response.ok) throw new Error('Failed to load teams')
  return response.json() // [{ value, label, group?, disabled? }]
}
</script>
<template>
  <lu-select v-model="remoteValue" :remote-method="remoteMethod" :debounce="300" clearable />
</template>
```

</template>
</DemoBlock>

示例模拟 400ms 请求。`remoteMethod(query)` 返回选项数组的 Promise，自动开启搜索；展开时以空查询加载。组件管理加载状态，等待期间仍可继续输入；丢弃过期响应，失败显示 `remoteErrorText` 并触发 `remote-error`。结果替换后保留已选项标签。

## Props

| 属性 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `modelValue` | `SelectValue \| SelectValue[]` | `undefined` | 绑定值；SelectValue 为 string 或 number。 |
| `options` | `SelectOption[]` | `[]` | 选项数组，每项包含 label、value 和可选 disabled。 |
| `remoteMethod` | `(query: string) => Promise<SelectOption[]>` | — | Remote search / 远程搜索。 |
| `debounce` | `number` | `300` | Remote debounce in ms / 远程请求防抖毫秒数。 |
| `showSelectAll` | `boolean` | `false` | Multiple select-all / 多选全选按钮。 |
| `multipleLimit` | `number` | `0` | Maximum selections; 0 unlimited / 上限，0 不限。 |
| `remoteErrorText` | `string` | `加载失败，请重新搜索` | Remote error text / 远程错误提示。 |
| `filterable` | `boolean` | `false` | 是否允许输入搜索选项。 |
| `noMatchText` | `string` | `无匹配选项` | 搜索无结果时的提示。 |
| `multiple` | `boolean` | `false` | 多选模式。 |
| `clearable` | `boolean` | `false` | 显示清空按钮。 |
| `disabled` | `boolean` | `false` | 是否禁用。 |
| `loading` | `boolean` | `false` | 加载状态，同时禁止交互。 |
| `size` | `'large' \| 'default' \| 'small'` | `'default'` | 组件尺寸。 |
| `placeholder` | `string` | `'请选择'` | 未选择时的提示。 |
| `loadingText` | `string` | `'加载中…'` | 加载文案。 |
| `emptyText` | `string` | `'暂无选项'` | 无选项时的提示。 |
| `clearLabel` | `string` | `'Clear selection'` | 清空按钮可访问名称。 |

## 事件

| 事件名 | 参数 / 签名 | 说明 |
| --- | --- | --- |
| `update:modelValue` | `(value: SelectValue \| SelectValue[] \| undefined)` | 更新绑定值。 |
| `change` | `(value: SelectValue \| SelectValue[] \| undefined)` | 选择或清空时触发。 |
| `clear` | `()` | 清空时触发。 |
| `focus` | `(event: FocusEvent)` | 获得焦点。 |
| `blur` | `(event: FocusEvent)` | 失去焦点。 |

## 方法

| 方法名 | 参数 / 签名 | 说明 |
| --- | --- | --- |
| `focus` | `() => void` | 聚焦选择器。 |
| `blur` | `() => void` | 移除焦点。 |

## 使用说明

清空单选值为 `undefined`，多选值为 `[]`。方向键跳过禁用项，Enter 选择，Escape / Tab 关闭；下拉面板展开时 Home / End 定位首末可用项。多选后面板保持展开。选项值应唯一，保留字符串或数字类型。可从入口导入 `SelectOption` 和 `SelectValue`。暂不提供虚拟滚动。
