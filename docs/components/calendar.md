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

- `modelValue?: Date`：选中日期。不传时组件自行管理，初始选中今天；无效日期回退到内部选择值。
- `firstDayOfWeek`：每周的第一天，`0` 为周日，`6` 为周六，默认 `1`。
- `locale`：语言，可选 `'zh-CN'`（默认）和 `'en-US'`。
- `disabledDate?: (date: Date) => boolean`：返回 true 时禁用该日期。

## 事件

- `update:modelValue(date: Date)` / `change(date: Date)`：选择日期时触发，参数是本地零点的新 Date 对象。
- `panel-change(date: Date)`：导航或选择日期导致展示月份变化时触发，参数是目标月份第一天。外部更新绑定值不会触发该事件。

月份导航保留已选日期。“今天”返回当前月份，不会改变选择。点击相邻月份日期会切换至对应月份。外部修改时请替换绑定的 Date 对象。

## 插槽

- `header`：`{ date: Date, title: string, selectMonth: (action: 'prev' | 'today' | 'next') => void }`
- `date-cell`：`{ date: Date, data: { date: Date, day: string, type: string, isSelected: boolean, isToday: boolean, disabled: boolean } }`

`day` 格式为 `YYYY-MM-DD`；`type` 为 `prev-month`、`current-month` 或 `next-month`。日期单元格是按钮，插槽内请使用非交互内容。使用 Tab 聚焦可用按钮，Enter 或空格选择日期。日历固定显示六周。
