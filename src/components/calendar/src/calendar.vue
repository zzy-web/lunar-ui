<template>
  <section class="epx-calendar">
    <div class="epx-calendar__header">
      <slot name="header" :date="new Date(panel)" :title="title" :select-month="selectMonth">
        <span class="epx-calendar__title" aria-live="polite">{{ title }}</span>
        <div class="epx-calendar__actions">
          <button type="button" @click="selectMonth('prev')">{{ labels.prev }}</button>
          <button type="button" @click="selectMonth('today')">{{ labels.today }}</button>
          <button type="button" @click="selectMonth('next')">{{ labels.next }}</button>
        </div>
      </slot>
    </div>
    <table class="epx-calendar__table" :aria-label="title">
      <thead><tr><th v-for="day in weekdays" :key="day" scope="col">{{ day }}</th></tr></thead>
      <tbody>
        <tr v-for="(week, index) in weeks" :key="index">
          <td v-for="cell in week" :key="cell.day" :class="{ 'is-other-month': cell.type !== 'current-month', 'is-selected': cell.isSelected, 'is-today': cell.isToday }">
            <button type="button" class="epx-calendar__day" :disabled="cell.disabled" :aria-label="cell.day" :aria-pressed="cell.isSelected" :aria-current="cell.isToday ? 'date' : undefined" @click="selectDate(cell.date)">
              <slot name="date-cell" :date="new Date(cell.date)" :data="cell">
                <span>{{ cell.date.getDate() }}</span>
              </slot>
            </button>
          </td>
        </tr>
      </tbody>
    </table>
  </section>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'

defineOptions({ name: 'LuCalendar' })
const props = withDefaults(defineProps<{
  modelValue?: Date
  firstDayOfWeek?: 0 | 1 | 2 | 3 | 4 | 5 | 6
  locale?: 'zh-CN' | 'en-US'
  disabledDate?: (date: Date) => boolean
}>(), { firstDayOfWeek: 1, locale: 'zh-CN' })
const emit = defineEmits<{
  'update:modelValue': [date: Date]
  change: [date: Date]
  'panel-change': [date: Date]
}>()

function valid(date: Date | undefined): date is Date {
  return date instanceof Date && !Number.isNaN(date.getTime())
}
function localDate(year: number, month: number, day: number) {
  const date = new Date(0)
  date.setFullYear(year, month, day)
  date.setHours(0, 0, 0, 0)
  return date
}
function key(date: Date) {
  return [String(date.getFullYear()).padStart(4, '0'), String(date.getMonth() + 1).padStart(2, '0'), String(date.getDate()).padStart(2, '0')].join('-')
}
const initial = valid(props.modelValue) ? props.modelValue : new Date()
const internal = ref(new Date(initial))
const selected = computed(() => valid(props.modelValue) ? props.modelValue : internal.value)
const panel = ref(localDate(initial.getFullYear(), initial.getMonth(), 1))
watch(() => props.modelValue?.getTime(), () => {
  if (!valid(props.modelValue)) return
  internal.value = new Date(props.modelValue)
  panel.value = localDate(props.modelValue.getFullYear(), props.modelValue.getMonth(), 1)
})
const labels = computed(() => props.locale === 'en-US'
  ? { prev: 'Previous month', today: 'Today', next: 'Next month' }
  : { prev: '上个月', today: '今天', next: '下个月' })
const title = computed(() => new Intl.DateTimeFormat(props.locale, { year: 'numeric', month: 'long' }).format(panel.value))
const weekdays = computed(() => {
  const names = props.locale === 'en-US' ? ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'] : ['日', '一', '二', '三', '四', '五', '六']
  return Array.from({ length: 7 }, (_, index) => names[(index + props.firstDayOfWeek) % 7])
})
const weeks = computed(() => {
  const year = panel.value.getFullYear()
  const month = panel.value.getMonth()
  const offset = (panel.value.getDay() - props.firstDayOfWeek + 7) % 7
  const today = key(new Date())
  const cells = Array.from({ length: 42 }, (_, index) => {
    const date = localDate(year, month, index - offset + 1)
    const day = key(date)
    return {
      date, day,
      type: date.getMonth() === month ? 'current-month' : date < panel.value ? 'prev-month' : 'next-month',
      isSelected: day === key(selected.value),
      isToday: day === today,
      disabled: props.disabledDate?.(new Date(date)) ?? false
    }
  })
  return Array.from({ length: 6 }, (_, index) => cells.slice(index * 7, index * 7 + 7))
})
function selectDate(date: Date) {
  if (props.disabledDate?.(new Date(date))) return
  internal.value = new Date(date)
  const next = localDate(date.getFullYear(), date.getMonth(), 1)
  if (next.getTime() !== panel.value.getTime()) {
    panel.value = next
    emit('panel-change', new Date(next))
  }
  emit('update:modelValue', new Date(date))
  emit('change', new Date(date))
}
function selectMonth(action: 'prev' | 'today' | 'next') {
  const today = new Date()
  const next = action === 'today'
    ? localDate(today.getFullYear(), today.getMonth(), 1)
    : localDate(panel.value.getFullYear(), panel.value.getMonth() + (action === 'prev' ? -1 : 1), 1)
  if (next.getTime() === panel.value.getTime()) return
  panel.value = next
  emit('panel-change', new Date(next))
}
</script>
