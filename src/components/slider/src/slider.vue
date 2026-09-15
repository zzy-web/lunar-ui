<script setup lang="ts">
import { computed, onBeforeUnmount, ref, watch } from 'vue'
import { LuInputNumber } from '../../input-number'
import { clamp, decimalPlaces, finite, round } from '../../../utils/number'
import type { SliderMarks, SliderValue } from './types'

defineOptions({ name: 'LuSlider' })
const props = withDefaults(defineProps<{
  modelValue?: SliderValue
  min?: number
  max?: number
  step?: number
  range?: boolean
  disabled?: boolean
  vertical?: boolean
  height?: string
  size?: 'small' | 'default' | 'large'
  showStops?: boolean
  marks?: SliderMarks
  showTooltip?: boolean
  formatTooltip?: (value: number) => string | number
  showInput?: boolean
  showInputControls?: boolean
  label?: string
  rangeStartLabel?: string
  rangeEndLabel?: string
}>(), {
  min: 0, max: 100, step: 1, height: '200px', size: 'default', showTooltip: true,
  showInputControls: true, label: 'Slider', rangeStartLabel: 'Range start', rangeEndLabel: 'Range end'
})
const emit = defineEmits<{
  'update:modelValue': [value: SliderValue]
  input: [value: SliderValue]
  change: [value: SliderValue]
}>()
const track = ref<HTMLElement>()
const handles = ref<HTMLButtonElement[]>([])
const internal = ref<SliderValue>(props.range ? [props.min, props.max] : props.min)
const dragging = ref<number | null>(null)
const draft = ref<number[] | null>(null)
const minimum = computed(() => finite(props.min, 0))
const maximum = computed(() => Math.max(minimum.value, finite(props.max, 100)))
const increment = computed(() => props.step > 0 && Number.isFinite(props.step) ? props.step : 1)
const disabled = computed(() => props.disabled || maximum.value === minimum.value)
function normalize(value: number) {
  const raw = clamp(finite(value, minimum.value), minimum.value, maximum.value)
  if (raw === maximum.value) return raw
  return clamp(round(minimum.value + Math.round((raw - minimum.value) / increment.value) * increment.value,
    Math.max(decimalPlaces(minimum.value), decimalPlaces(increment.value))), minimum.value, maximum.value)
}
const values = computed(() => {
  if (draft.value) return draft.value
  const value = props.modelValue ?? internal.value
  if (!props.range) return [normalize(Array.isArray(value) ? value[0] : value)]
  const pair = Array.isArray(value) ? value : [minimum.value, maximum.value]
  return [normalize(pair[0]), normalize(pair[1])].sort((a, b) => a - b)
})
const percent = (value: number) => maximum.value === minimum.value ? 0 : (value - minimum.value) / (maximum.value - minimum.value) * 100
const position = (value: number) => props.vertical ? { bottom: `${percent(value)}%` } : { left: `${percent(value)}%` }
const barStyle = computed(() => {
  const start = props.range ? percent(values.value[0]) : 0
  const end = percent(values.value[props.range ? 1 : 0])
  return props.vertical ? { bottom: `${start}%`, height: `${end - start}%` } : { left: `${start}%`, width: `${end - start}%` }
})
const stops = computed(() => {
  const count = Math.ceil((maximum.value - minimum.value) / increment.value) - 1
  // Excessively dense stops cannot be distinguished visually and would flood the DOM.
  if (!props.showStops || count > 1000 || count < 1) return []
  return Array.from({ length: count }, (_, i) => round(minimum.value + (i + 1) * increment.value, Math.max(decimalPlaces(minimum.value), decimalPlaces(increment.value))))
})
const marks = computed(() => Object.entries(props.marks ?? {}).map(([key, mark]) => ({
  value: Number(key), label: typeof mark === 'string' ? mark : mark.label,
  style: typeof mark === 'string' ? undefined : mark.style
})).filter(mark => Number.isFinite(mark.value) && mark.value >= minimum.value && mark.value <= maximum.value).sort((a, b) => a.value - b.value))
const format = (value: number) => String(props.formatTooltip?.(value) ?? value)
function output(pair: number[]): SliderValue { return props.range ? [pair[0], pair[1]] : pair[0] }
function publish(pair: number[]) {
  const value = output(pair)
  if (props.modelValue === undefined) internal.value = value
  emit('update:modelValue', value)
  emit('input', value)
}
function update(index: number, raw: number, commit: boolean) {
  if (disabled.value) return
  const pair = [...values.value]
  const next = clamp(normalize(raw), props.range && index === 1 ? pair[0] : minimum.value, props.range && index === 0 ? pair[1] : maximum.value)
  if (pair[index] === next) return
  pair[index] = next
  if (dragging.value !== null) draft.value = pair
  publish(pair)
  if (commit) emit('change', output(pair))
}
function keyboard(event: KeyboardEvent, index: number) {
  if (disabled.value) return
  const value = values.value[index]
  const next: Record<string, number> = {
    ArrowLeft: value - increment.value, ArrowDown: value - increment.value,
    ArrowRight: value + increment.value, ArrowUp: value + increment.value,
    PageDown: value - increment.value * 10, PageUp: value + increment.value * 10,
    Home: minimum.value, End: maximum.value
  }
  if (!(event.key in next)) return
  event.preventDefault()
  update(index, next[event.key], true)
}
let pointerId: number | undefined
let initial: number[] = []
function pointerValue(event: PointerEvent) {
  const rect = track.value?.getBoundingClientRect()
  if (!rect || !(props.vertical ? rect.height : rect.width)) return values.value[0]
  const ratio = props.vertical ? (rect.bottom - event.clientY) / rect.height : (event.clientX - rect.left) / rect.width
  return minimum.value + clamp(ratio, 0, 1) * (maximum.value - minimum.value)
}
function start(event: PointerEvent) {
  if (disabled.value || event.button !== 0 || dragging.value !== null) return
  const target = event.target as HTMLElement
  const explicit = target.closest<HTMLElement>('[data-slider-handle]')?.dataset.sliderHandle
  const raw = pointerValue(event)
  const index = explicit !== undefined ? Number(explicit) : props.range && Math.abs(raw - values.value[1]) < Math.abs(raw - values.value[0]) ? 1 : 0
  event.preventDefault()
  initial = [...values.value]
  draft.value = [...values.value]
  dragging.value = index
  pointerId = event.pointerId
  track.value?.setPointerCapture(event.pointerId)
  handles.value[index]?.focus()
  update(index, raw, false)
}
function move(event: PointerEvent) {
  if (dragging.value !== null && event.pointerId === pointerId) update(dragging.value, pointerValue(event), false)
}
function release() {
  const captured = pointerId
  pointerId = undefined
  dragging.value = null
  draft.value = null
  if (captured !== undefined && track.value?.hasPointerCapture(captured)) track.value.releasePointerCapture(captured)
}
function finish(event: PointerEvent) {
  if (dragging.value === null || event.pointerId !== pointerId) return
  move(event)
  const pair = [...values.value]
  release()
  if (pair.some((value, index) => value !== initial[index])) emit('change', output(pair))
}
function cancel(event: PointerEvent) {
  if (dragging.value === null || event.pointerId !== pointerId) return
  const changed = values.value.some((value, index) => value !== initial[index])
  release()
  if (changed) publish(initial)
}
watch(() => [props.disabled, props.min, props.max, props.step, props.range], release)
onBeforeUnmount(release)
</script>

<template>
  <div class="epx-slider" :class="[`epx-slider--${size}`, { 'is-vertical': vertical, 'is-disabled': disabled, 'has-marks': marks.length }]">
    <div ref="track" class="epx-slider__runway" :style="vertical ? { height } : undefined" @pointerdown="start" @pointermove="move" @pointerup="finish" @pointercancel="cancel" @lostpointercapture="cancel">
      <div class="epx-slider__bar" :style="barStyle" />
      <span v-for="stop in stops" :key="stop" class="epx-slider__stop" :style="position(stop)" aria-hidden="true" />
      <span v-for="mark in marks" :key="mark.value" class="epx-slider__mark" :style="[position(mark.value), mark.style]" aria-hidden="true">{{ mark.label }}</span>
      <button v-for="(value, index) in values" :key="index" :ref="el => { handles[index] = el as HTMLButtonElement }" type="button" role="slider" class="epx-slider__handle" :class="{ 'is-dragging': dragging === index }" :data-slider-handle="index" :style="position(value)" :disabled="disabled" :aria-label="range ? (index === 0 ? rangeStartLabel : rangeEndLabel) : label" :aria-valuemin="range && index === 1 ? values[0] : minimum" :aria-valuemax="range && index === 0 ? values[1] : maximum" :aria-valuenow="value" :aria-valuetext="format(value)" :aria-orientation="vertical ? 'vertical' : 'horizontal'" @keydown="keyboard($event, index)">
        <span v-if="showTooltip" class="epx-slider__tooltip" aria-hidden="true">{{ format(value) }}</span>
      </button>
    </div>
    <LuInputNumber v-if="showInput && !range && !vertical" class="epx-slider__input" :model-value="values[0]" :min="minimum" :max="maximum" :step="increment" :disabled="disabled" :controls="showInputControls" :size="size" :label="label" @update:model-value="update(0, $event ?? minimum, true)" />
  </div>
</template>
