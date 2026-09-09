# Calendar

A monthly calendar with date selection, month navigation and custom date cells. Dates use the local time zone.

<script setup>
import { ref } from 'vue'
const selected = ref(new Date(2026, 8, 9))
const isWeekend = date => [0, 6].includes(date.getDay())
</script>

## Date selection

<DemoBlock source-label="View source">
<lu-calendar v-model="selected" locale="en-US" />
<template #source>

```vue
<script setup>
import { ref } from 'vue'
const selected = ref(new Date(2026, 8, 9))
</script>

<template>
  <lu-calendar v-model="selected" locale="en-US" />
</template>
```

</template>
</DemoBlock>

## Disabled dates and custom content

<DemoBlock source-label="View source">
<lu-calendar v-model="selected" locale="en-US" :disabled-date="isWeekend">
<template #date-cell="{ date, data }">
<span>{{ date.getDate() }}</span>
<span v-if="data.day === '2026-09-09'" style="display: block; font-size: 12px">Release</span>
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
  <lu-calendar v-model="selected" locale="en-US" :disabled-date="isWeekend">
    <template #date-cell="{ date, data }">
      <span>{{ date.getDate() }}</span>
      <span v-if="data.day === '2026-09-09'" style="display: block; font-size: 12px">Release</span>
    </template>
  </lu-calendar>
</template>
```

</template>
</DemoBlock>

## Props

- `modelValue?: Date`: selected date. Without a binding, the calendar maintains its own selection, initially today. Invalid dates fall back to the internal selection.
- `firstDayOfWeek`: integer from `0` (Sunday) to `6` (Saturday), default `1`.
- `locale`: `'zh-CN'` (default) or `'en-US'`.
- `disabledDate?: (date: Date) => boolean`: return true to disable a date.

## Events

- `update:modelValue(date: Date)` / `change(date: Date)`: emitted on date selection, with a new local-midnight Date.
- `panel-change(date: Date)`: emitted when navigation or date selection changes the displayed month; receives the first day of that month. External model updates do not emit this event.

Month navigation preserves the selection. Today returns to the current month without selecting a date. Selecting a neighboring month's date switches to that month. Replace the bound Date object to update it externally.

## Slots

- `header`：`{ date: Date, title: string, selectMonth: (action: 'prev' | 'today' | 'next') => void }`
- `date-cell`：`{ date: Date, data: { date: Date, day: string, type: string, isSelected: boolean, isToday: boolean, disabled: boolean } }`

`day` uses `YYYY-MM-DD`; `type` is `prev-month`, `current-month` or `next-month`. Date cells are buttons: use noninteractive slot content. Tab focuses enabled buttons, Enter or Space selects a date. The calendar always displays six weeks.
