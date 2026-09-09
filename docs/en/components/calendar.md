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

| Attribute | Type | Default | Description |
| --- | --- | --- | --- |
| `modelValue` | `Date` | — | Selected date; defaults internally to today. Invalid dates fall back to internal selection. |
| `firstDayOfWeek` | `0 \| 1 \| 2 \| 3 \| 4 \| 5 \| 6` | `1` | First day of the week; 0 is Sunday. |
| `locale` | `'zh-CN' \| 'en-US'` | `'zh-CN'` | Display language. |
| `disabledDate` | `(date: Date) => boolean` | — | Return true to disable a date. |

## Events

| Event | Signature | Description |
| --- | --- | --- |
| `update:modelValue` | `(date: Date)` | Update selection with a new Date at local midnight. |
| `change` | `(date: Date)` | Emitted on date selection. |
| `panel-change` | `(date: Date)` | Month navigation or selection changes the panel; receives its first day. External updates do not emit this event. |

## Slots

| Slot | Slot props | Description |
| --- | --- | --- |
| `header` | `{ date: Date, title: string, selectMonth: (action: 'prev' \| 'today' \| 'next') => void }` | Custom calendar header. |
| `date-cell` | `{ date: Date, data: CalendarCell }` | Custom date content. |

## Usage notes

`CalendarCell` describes the slot data: `date: Date`, `day: string`, `type: string`, `isSelected: boolean`, `isToday: boolean`, `disabled: boolean`. `day` uses `YYYY-MM-DD`; `type` is `prev-month`, `current-month` or `next-month`. Use noninteractive content inside date buttons.

Month navigation preserves selection. Today returns to the current month without selecting a date; selecting a neighboring date changes the month. Replace the Date object for external updates. Tab focuses date buttons, Enter or Space selects. Six weeks are always displayed.
