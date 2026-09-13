<script setup lang="ts">
import { computed, ref } from 'vue'
defineOptions({ name: 'LuRate' })
const props = withDefaults(defineProps<{ modelValue?: number; max?: number; disabled?: boolean; readonly?: boolean; clearable?: boolean; showScore?: boolean; label?: string; size?: 'small' | 'default' | 'large' }>(), { modelValue: 0, max: 5, label: 'Rating', size: 'default' })
const emit = defineEmits<{ 'update:modelValue': [value: number]; change: [value: number] }>()
const maximum = computed(() => Number.isFinite(props.max) ? Math.min(100, Math.max(1, Math.floor(props.max))) : 5)
const value = computed(() => Number.isFinite(props.modelValue) ? Math.max(0, Math.min(maximum.value, Math.round(props.modelValue))) : 0)
const hover = ref(0)
const preview = computed(() => !props.disabled && !props.readonly && hover.value ? hover.value : value.value)
function update(next: number) {
  if (props.disabled || props.readonly) return
  next = Math.max(0, Math.min(maximum.value, next))
  if (next === value.value) return
  emit('update:modelValue', next)
  emit('change', next)
}
function keyboard(event: KeyboardEvent) {
  const changes: Record<string, number> = { ArrowRight: value.value + 1, ArrowUp: value.value + 1, ArrowLeft: value.value - 1, ArrowDown: value.value - 1, Home: 0, End: maximum.value }
  if (!(event.key in changes)) return
  event.preventDefault()
  update(changes[event.key])
}
</script>
<template>
  <div class="epx-rate" :class="[`epx-rate--${size}`, { 'is-disabled': disabled, 'is-readonly': readonly }]" role="slider" :tabindex="disabled ? -1 : 0" :aria-label="label" :aria-valuemin="0" :aria-valuemax="maximum" :aria-valuenow="value" :aria-valuetext="`${value} / ${maximum}`" :aria-disabled="disabled" :aria-readonly="readonly" @keydown="keyboard" @mouseleave="hover = 0" @blur="hover = 0">
    <span v-for="star in maximum" :key="star" class="epx-rate__star" :class="{ 'is-active': star <= preview }" aria-hidden="true" @mouseenter="hover = star" @click="update(clearable && star === value ? 0 : star)"><svg viewBox="0 0 24 24"><path d="m12 2 3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01Z" /></svg></span>
    <span v-if="showScore" class="epx-rate__score" aria-hidden="true">{{ value }} / {{ maximum }}</span>
  </div>
</template>
