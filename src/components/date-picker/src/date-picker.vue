<script setup lang="ts">
import { computed, nextTick, ref, useId, watch } from 'vue'
import { LuCalendar } from '../../calendar'
import { useFormControl } from '../../../composables/use-form-control'
import type { DatePickerShortcut, DatePickerValue, DateRange } from './types'

defineOptions({ name: 'LuDatePicker' })
const props = withDefaults(defineProps<{
  modelValue?: DatePickerValue
  range?: boolean
  disabled?: boolean
  clearable?: boolean
  placeholder?: string
  locale?: 'zh-CN' | 'en-US'
  disabledDate?: (date: Date) => boolean
  shortcuts?: readonly DatePickerShortcut[]
}>(), { locale: 'zh-CN', clearable: true })
const emit = defineEmits<{ 'update:modelValue': [value: DatePickerValue]; change: [value: DatePickerValue] }>()
const { formDisabled } = useFormControl(props)
const en = computed(() => props.locale === 'en-US')
const id = useId()
const trigger = ref<HTMLButtonElement>()
const panel = ref<HTMLElement>()
const visible = ref(false)
const internal = ref<DatePickerValue>(null)
const start = ref<Date>()
const selected = computed(() => props.modelValue === undefined ? internal.value : props.modelValue)
const calendarValue = computed(() => start.value ?? (Array.isArray(selected.value) ? selected.value[0] : selected.value) ?? undefined)
const formatter = computed(() => new Intl.DateTimeFormat(props.locale, { year: 'numeric', month: '2-digit', day: '2-digit' }))
const display = computed(() => {
  const values = Array.isArray(selected.value) ? selected.value : [selected.value]
  return values.filter((date): date is Date => date instanceof Date && Number.isFinite(+date))
    .map(date => formatter.value.format(date)).join(' – ')
})
function publish(value: DatePickerValue) {
  if (formDisabled.value) return
  if (props.modelValue === undefined) internal.value = value
  emit('update:modelValue', value)
  emit('change', value)
}
function close(restore = false) {
  visible.value = false
  start.value = undefined
  if (restore) trigger.value?.focus()
}
async function toggle() {
  if (formDisabled.value) return
  if (visible.value) { close(); return }
  visible.value = true
  await nextTick()
  panel.value?.focus()
}
function select(date: Date) {
  if (formDisabled.value || props.disabledDate?.(new Date(date))) return
  if (props.range && !start.value) {
    start.value = new Date(date)
    return
  }
  if (props.range && start.value) {
    const pair: DateRange = [new Date(start.value), new Date(date)]
    if (pair[0] > pair[1]) pair.reverse()
    publish(pair)
  } else publish(new Date(date))
  close(true)
}
function applyShortcut(shortcut: DatePickerShortcut) {
  if (formDisabled.value) return
  const value = shortcut.value()
  const dates = Array.isArray(value) ? value : [value]
  if (Array.isArray(value) !== props.range || dates.some(date => !Number.isFinite(+date) || props.disabledDate?.(new Date(date)))) return
  const days = dates.map(date => {
    const day = new Date(date)
    day.setHours(0, 0, 0, 0)
    return day
  }).sort((a, b) => +a - +b)
  publish(props.range ? [days[0], days[1]] : days[0])
  close(true)
}
function highlighted(date: Date) {
  const day = new Date(date).setHours(0, 0, 0, 0)
  if (start.value) return day === +start.value
  const value = selected.value
  if (!Array.isArray(value)) return false
  const first = new Date(value[0]).setHours(0, 0, 0, 0)
  const last = new Date(value[1]).setHours(0, 0, 0, 0)
  return day >= first && day <= last
}
function focusout(event: FocusEvent) {
  if (visible.value && !(event.currentTarget as HTMLElement).contains(event.relatedTarget as Node | null)) close()
}
function escape(event: KeyboardEvent) {
  if (!visible.value) return
  event.preventDefault()
  event.stopPropagation()
  close(true)
}
watch([formDisabled, () => props.range], () => close())
</script>

<template>
  <div class="epx-date-picker" @focusout="focusout" @keydown.esc="escape">
    <button ref="trigger" type="button" class="epx-field-button" :disabled="formDisabled" aria-haspopup="dialog"
      :aria-expanded="visible" :aria-controls="visible ? id : undefined" @click="toggle">
      {{ display || placeholder || (en ? 'Select date' : '选择日期') }}
    </button>
    <button v-if="display && clearable" type="button" class="epx-field-button" :disabled="formDisabled"
      :aria-label="en ? 'Clear date' : '清空日期'" @click="publish(null); close(true)">×</button>
    <div v-if="visible" :id="id" ref="panel" class="epx-date-picker__panel" tabindex="-1" role="dialog"
      :aria-label="en ? 'Date calendar' : '日期日历'">
      <div v-if="shortcuts?.length" class="epx-date-picker__shortcuts">
        <button v-for="(shortcut, index) in shortcuts" :key="index" class="epx-field-button" type="button" @click="applyShortcut(shortcut)">
          {{ shortcut.label }}
        </button>
      </div>
      <p v-if="range" class="epx-date-picker__hint" aria-live="polite">{{ start ? (en ? 'Select end date' : '选择结束日期') : (en ? 'Select start date' : '选择开始日期') }}</p>
      <LuCalendar :model-value="calendarValue" :locale="locale" :disabled-date="disabledDate" @update:model-value="select">
        <template #date-cell="{ date }">
          <span :class="{ 'is-in-range': highlighted(date) }">{{ date.getDate() }}</span>
        </template>
      </LuCalendar>
    </div>
  </div>
</template>
