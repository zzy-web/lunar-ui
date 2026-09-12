# Select 选择器

从预设选项中选择值，支持单选、多选标签、搜索、清空、禁用与加载状态。下拉面板使用统一主题样式，并支持键盘操作。

<script setup>
import { ref } from 'vue'
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

## Props

| 属性 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `modelValue` | `SelectValue \| SelectValue[]` | `undefined` | 绑定值；SelectValue 为 string 或 number。 |
| `options` | `SelectOption[]` | `[]` | 选项数组，每项包含 label、value 和可选 disabled。 |
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

清空单选值为 `undefined`，多选值为 `[]`。方向键跳过禁用项，Enter 选择，Escape / Tab 关闭；下拉面板展开时 Home / End 定位首末可用项。多选后面板保持展开。选项值应唯一，保留字符串或数字类型。可从入口导入 `SelectOption` 和 `SelectValue`。暂不提供远程搜索或虚拟滚动。
