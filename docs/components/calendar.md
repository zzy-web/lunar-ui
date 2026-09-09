# Calendar 日历

月视图日历，支持日期选择、月份切换和自定义日期内容。日期按本地时区处理。

<script setup>
import { ref } from 'vue'
const selected = ref(new Date(2026, 8, 9))
const isWeekend = date => [0, 6].includes(date.getDay())
</script>

## 日期选择

<DemoBlock>
<lu-calendar v-model="selected" />
<template #source>

```vue
<script setup>
import { ref } from 'vue'
const selected = ref(new Date(2026, 8, 9))
</script>

<template>
  <lu-calendar v-model="selected" />
</template>
```

</template>
</DemoBlock>

## 禁用日期与自定义内容

<DemoBlock>
<lu-calendar v-model="selected" :disabled-date="isWeekend">
<template #date-cell="{ date, data }">
<span>{{ date.getDate() }}</span>
<span v-if="data.day === '2026-09-09'" style="display: block; font-size: 12px">发布日</span>
</template>
</lu-calendar>
<template #source>

```vue
<script setup lang="ts">
import { ref } from 'vue'
const selected = ref(new Date(2026, 8, 9))
const isWeekend = (date: Date) => [0, 6].includes(date.getDay())
</script>

<template>
  <lu-calendar v-model="selected" :disabled-date="isWeekend">
    <template #date-cell="{ date, data }">
      <span>{{ date.getDate() }}</span>
      <span v-if="data.day === '2026-09-09'" style="display: block; font-size: 12px">发布日</span>
    </template>
  </lu-calendar>
</template>
```

</template>
</DemoBlock>

## Props

| 属性 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `modelValue` | `Date` | — | 选中日期，未提供时内部默认选中今天；无效日期回退到内部选择。 |
| `firstDayOfWeek` | `0 \| 1 \| 2 \| 3 \| 4 \| 5 \| 6` | `1` | 每周第一天，0 为周日。 |
| `locale` | `'zh-CN' \| 'en-US'` | `'zh-CN'` | 显示语言。 |
| `disabledDate` | `(date: Date) => boolean` | — | 返回 true 时禁止选择该日期。 |

## 事件

| 事件名 | 参数 / 签名 | 说明 |
| --- | --- | --- |
| `update:modelValue` | `(date: Date)` | 选择日期时更新绑定值，为本地零点的新对象。 |
| `change` | `(date: Date)` | 选择日期时触发。 |
| `panel-change` | `(date: Date)` | 展示月份变化时触发，参数为该月第一天；外部更新不会触发。 |

## 插槽

| 插槽名 | 插槽参数 | 说明 |
| --- | --- | --- |
| `header` | `{ date: Date, title: string, selectMonth: (action: 'prev' \| 'today' \| 'next') => void }` | 自定义日历头部。 |
| `date-cell` | `{ date: Date, data: CalendarCell }` | 自定义日期内容。 |

## 使用说明

`CalendarCell` 说明插槽数据结构：`date: Date`、`day: string`、`type: string`、`isSelected: boolean`、`isToday: boolean`、`disabled: boolean`。`day` 格式为 `YYYY-MM-DD`，`type` 为 `prev-month`、`current-month` 或 `next-month`。日期按钮内请使用非交互内容。

月份导航保留选择，“今天”返回本月而不选择日期；点击相邻月份日期会切换月份。外部更新请替换 Date 对象。Tab 聚焦日期按钮，Enter 或空格选择。固定显示六周。
