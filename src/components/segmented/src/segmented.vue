<script setup lang="ts">
import { computed, nextTick, ref } from 'vue'
import type { SegmentedOption, SegmentedValue } from './types'

defineOptions({ name: 'LuSegmented' })
const props = withDefaults(defineProps<{
  modelValue?: SegmentedValue
  options?: (SegmentedValue | SegmentedOption)[]
  disabled?: boolean
  block?: boolean
  size?: 'small' | 'default' | 'large'
  direction?: 'horizontal' | 'vertical'
  label?: string
  name?: string
}>(), { modelValue: undefined, options: () => [], size: 'default', direction: 'horizontal', label: 'Options' })
const emit = defineEmits<{ 'update:modelValue': [value: SegmentedValue]; change: [value: SegmentedValue] }>()
const internal = ref<SegmentedValue>()
const buttons = ref<HTMLButtonElement[]>([])
const options = computed<SegmentedOption[]>(() => props.options.map(option => typeof option === 'object' ? option : { label: String(option), value: option }))
const value = computed(() => props.modelValue === undefined ? internal.value : props.modelValue)
const tabIndex = computed(() => {
  const selected = options.value.findIndex(option => option.value === value.value && !option.disabled)
  return selected < 0 ? options.value.findIndex(option => !option.disabled) : selected
})
function select(option: SegmentedOption) {
  if (props.disabled || option.disabled || option.value === value.value) return
  if (props.modelValue === undefined) internal.value = option.value
  emit('update:modelValue', option.value)
  emit('change', option.value)
}
async function navigate(event: KeyboardEvent, index: number) {
  if (props.disabled) return
  const previous = props.direction === 'vertical' ? 'ArrowUp' : 'ArrowLeft'
  const next = props.direction === 'vertical' ? 'ArrowDown' : 'ArrowRight'
  if (![previous, next, 'Home', 'End'].includes(event.key)) return
  event.preventDefault()
  const enabled = options.value.map((option, i) => option.disabled ? -1 : i).filter(i => i >= 0)
  if (!enabled.length) return
  const position = enabled.indexOf(index)
  const target = event.key === 'Home' ? enabled[0] : event.key === 'End' ? enabled[enabled.length - 1]
    : enabled[(position + (event.key === next ? 1 : -1) + enabled.length) % enabled.length]
  select(options.value[target])
  await nextTick()
  buttons.value[target]?.focus()
}
</script>

<template>
  <div class="epx-segmented" :class="[`epx-segmented--${size}`, `epx-segmented--${direction}`, { 'is-block': block, 'is-disabled': disabled }]" role="radiogroup" :aria-label="label" :aria-orientation="direction" :aria-disabled="disabled">
    <input v-if="name && value !== undefined" type="hidden" :name="name" :value="String(value)" :disabled="disabled" />
    <button v-for="(option, index) in options" :key="`${typeof option.value}:${option.value}`" :ref="el => { buttons[index] = el as HTMLButtonElement }" type="button" class="epx-segmented__item" :class="{ 'is-selected': value === option.value }" role="radio" :aria-checked="value === option.value" :disabled="disabled || option.disabled" :tabindex="!disabled && index === tabIndex ? 0 : -1" @click="select(option)" @keydown="navigate($event, index)">
      <slot :item="option" :selected="value === option.value" :index="index">{{ option.label }}</slot>
    </button>
  </div>
</template>
