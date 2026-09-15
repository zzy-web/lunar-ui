<script setup lang="ts">
import { computed, nextTick, ref, useAttrs, watch } from 'vue'
import type { StyleValue } from 'vue'
import { clamp, decimalPlaces, finite, round } from '../../../utils/number'

defineOptions({ name: 'LuInputNumber', inheritAttrs: false })
const props = withDefaults(defineProps<{
  modelValue?: number | null
  min?: number
  max?: number
  step?: number
  stepStrictly?: boolean
  precision?: number
  disabled?: boolean
  readonly?: boolean
  controls?: boolean
  controlsPosition?: 'both' | 'right'
  size?: 'small' | 'default' | 'large'
  placeholder?: string
  label?: string
  decreaseLabel?: string
  increaseLabel?: string
  valueOnClear?: number | null | 'min' | 'max'
  formatter?: (value: number) => string
  parser?: (value: string) => string | number
}>(), {
  step: 1, controls: true, controlsPosition: 'both', size: 'default',
  label: 'Input number', decreaseLabel: 'Decrease', increaseLabel: 'Increase', valueOnClear: null
})
const emit = defineEmits<{
  'update:modelValue': [value: number | null]
  change: [value: number | null, previous: number | null]
  input: [value: string]
  focus: [event: FocusEvent]
  blur: [event: FocusEvent]
}>()
const control = ref<HTMLInputElement>()
const attrs = useAttrs()
function inputAttrs() {
  const { class: _class, style: _style, ...rest } = attrs
  return rest
}
const internal = ref<number | null>(0)
const editing = ref(false)
const composing = ref(false)
const draft = ref('')
const minimum = computed(() => finite(props.min, Number.MIN_SAFE_INTEGER))
const maximum = computed(() => Math.max(minimum.value, finite(props.max, Number.MAX_SAFE_INTEGER)))
const increment = computed(() => props.step > 0 && Number.isFinite(props.step) ? props.step : 1)
const digits = computed(() => props.precision === undefined || !Number.isFinite(props.precision)
  ? undefined : clamp(Math.max(Math.floor(props.precision), decimalPlaces(increment.value)), 0, 15))
function normalize(value: number) {
  let next = clamp(value, minimum.value, maximum.value)
  if (props.stepStrictly) next = round(Math.round(next / increment.value) * increment.value, decimalPlaces(increment.value))
  return clamp(round(next, digits.value ?? Math.max(decimalPlaces(next), decimalPlaces(increment.value))), minimum.value, maximum.value)
}
const value = computed(() => {
  const raw = props.modelValue === undefined ? internal.value : props.modelValue
  return raw === null || !Number.isFinite(raw) ? null : normalize(raw)
})
const display = computed(() => value.value === null ? '' : props.formatter
  ? props.formatter(value.value) : digits.value === undefined ? String(value.value) : value.value.toFixed(digits.value))
watch(value, () => { editing.value = false })
const blocked = computed(() => props.disabled || props.readonly)
function publish(next: number | null) {
  if (blocked.value) return
  const normalized = next === null || !Number.isFinite(next) ? null : normalize(next)
  const previous = value.value
  if (normalized === previous) return
  if (props.modelValue === undefined) internal.value = normalized
  emit('update:modelValue', normalized)
  emit('change', normalized, previous)
}
function parse(text: string): number | null | undefined {
  if (!text.trim()) {
    const clear = props.valueOnClear
    return clear === 'min' ? minimum.value : clear === 'max' ? maximum.value : clear
  }
  try {
    const parsed = Number(props.parser ? props.parser(text) : text)
    return Number.isFinite(parsed) ? parsed : undefined
  } catch { return undefined }
}
function input(event: Event) {
  if (blocked.value) return
  editing.value = true
  draft.value = (event.target as HTMLInputElement).value
  if (!composing.value) emit('input', draft.value)
}
async function commit() {
  if (composing.value || blocked.value) return
  if (editing.value) {
    const parsed = parse(draft.value)
    if (parsed !== undefined) publish(parsed)
  }
  editing.value = false
  await nextTick()
  if (control.value) control.value.value = display.value
}
function adjust(direction: number) {
  if (blocked.value || composing.value) return
  const parsed = editing.value ? parse(draft.value) : value.value
  const base = parsed ?? value.value ?? clamp(0, minimum.value, maximum.value)
  publish(round(base + direction * increment.value, Math.max(decimalPlaces(base), decimalPlaces(increment.value))))
  editing.value = false
  control.value?.focus()
}
function keydown(event: KeyboardEvent) {
  if (blocked.value || composing.value || event.isComposing) return
  if (event.key === 'ArrowUp' || event.key === 'ArrowDown') {
    event.preventDefault()
    adjust(event.key === 'ArrowUp' ? 1 : -1)
  } else if (event.key === 'Enter') { event.preventDefault(); void commit() }
  else if (event.key === 'Escape') { editing.value = false; if (control.value) control.value.value = display.value }
}
function blur(event: FocusEvent) { void commit(); emit('blur', event) }
defineExpose({ focus: () => control.value?.focus(), blur: () => control.value?.blur(), select: () => control.value?.select() })
</script>

<template>
  <div class="epx-input-number" :style="attrs.style as StyleValue" :class="[attrs.class, `epx-input-number--${size}`, `epx-input-number--${controlsPosition}`, { 'is-disabled': disabled, 'is-readonly': readonly, 'has-controls': controls }]">
    <button v-if="controls" type="button" class="epx-input-number__decrease" :aria-label="decreaseLabel" :disabled="blocked || (value !== null && value <= minimum)" tabindex="-1" @mousedown.prevent @click="adjust(-1)"><slot name="decrease-icon">−</slot></button>
    <span v-if="$slots.prefix" class="epx-input-number__affix"><slot name="prefix" /></span>
    <input v-bind="inputAttrs()" ref="control" class="epx-input-number__input" type="text" inputmode="decimal" role="spinbutton" :aria-label="String($attrs['aria-label'] ?? label)" :aria-valuemin="minimum" :aria-valuemax="maximum" :aria-valuenow="value ?? undefined" :aria-valuetext="display || undefined" :value="editing ? draft : display" :disabled="disabled" :readonly="readonly" :placeholder="placeholder" @input="input" @change="commit" @keydown="keydown" @focus="emit('focus', $event)" @blur="blur" @compositionstart="composing = true" @compositionend="composing = false; input($event)" />
    <span v-if="$slots.suffix" class="epx-input-number__affix"><slot name="suffix" /></span>
    <button v-if="controls" type="button" class="epx-input-number__increase" :aria-label="increaseLabel" :disabled="blocked || (value !== null && value >= maximum)" tabindex="-1" @mousedown.prevent @click="adjust(1)"><slot name="increase-icon">+</slot></button>
  </div>
</template>
