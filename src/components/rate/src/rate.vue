<script setup lang="ts">
import { useFormControl } from '../../../composables/use-form-control'
import { computed, ref } from 'vue'
defineOptions({ name: 'LuRate' })
const props = withDefaults(defineProps<{ modelValue?: number; max?: number; disabled?: boolean; readonly?: boolean; clearable?: boolean; showScore?: boolean; allowHalf?: boolean; label?: string; size?: 'small' | 'default' | 'large' }>(), { modelValue: 0, max: 5, label: 'Rating' })
const { formDisabled, formSize } = useFormControl(props)
const emit = defineEmits<{ 'update:modelValue': [value: number]; change: [value: number] }>()
const maximum = computed(() => Number.isFinite(props.max) ? Math.min(100, Math.max(1, Math.floor(props.max))) : 5)
const step = computed(() => props.allowHalf ? 0.5 : 1)
const value = computed(() => Number.isFinite(props.modelValue) ? Math.max(0, Math.min(maximum.value, Math.round(props.modelValue / step.value) * step.value)) : 0)
const hover = ref(0)
const preview = computed(() => !formDisabled.value && !props.readonly && hover.value ? hover.value : value.value)
function update(next: number) {
  if (formDisabled.value || props.readonly) return
  next = Math.max(0, Math.min(maximum.value, next))
  if (next === value.value) return
  emit('update:modelValue', next)
  emit('change', next)
}
function pointerRating(star: number, event?: MouseEvent) {
  if (!props.allowHalf || !event?.currentTarget) return star
  const rect = (event.currentTarget as HTMLElement).getBoundingClientRect()
  return event.clientX < rect.left + rect.width / 2 ? star - 0.5 : star
}
function choose(star: number, event?: MouseEvent) {
  const next = pointerRating(star, event)
  update(props.clearable && next === value.value ? 0 : next)
}
function keyboard(event: KeyboardEvent) {
  if (formDisabled.value || props.readonly) return
  const changes: Record<string, number> = { ArrowRight: value.value + step.value, ArrowUp: value.value + step.value, ArrowLeft: value.value - step.value, ArrowDown: value.value - step.value, Home: 0, End: maximum.value }
  if (!(event.key in changes)) return
  event.preventDefault()
  update(changes[event.key])
}
</script>
<template>
  <div class="epx-rate" :class="[`epx-rate--${formSize}`, { 'is-disabled': formDisabled, 'is-readonly': readonly }]" role="slider" :tabindex="formDisabled ? -1 : 0" :aria-label="label" :aria-valuemin="0" :aria-valuemax="maximum" :aria-valuenow="value" :aria-valuetext="`${value} / ${maximum}`" :aria-disabled="formDisabled" :aria-readonly="readonly" @keydown="keyboard" @mouseleave="hover = 0" @blur="hover = 0">
    <span v-for="star in maximum" :key="star" class="epx-rate__star" :class="{ 'is-active': star <= preview }" aria-hidden="true" @mouseenter="hover = star" @mousemove="hover = pointerRating(star, $event)" @click="choose(star, $event)"><svg viewBox="0 0 24 24"><path d="m12 2 3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01Z" /></svg><svg class="epx-rate__fill" :style="{ clipPath: `inset(0 ${100 - Math.max(0, Math.min(1, preview - star + 1)) * 100}% 0 0)` }" viewBox="0 0 24 24"><path d="m12 2 3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01Z" /></svg></span>
    <span v-if="showScore" class="epx-rate__score" aria-hidden="true">{{ value }} / {{ maximum }}</span>
  </div>
</template>
