<template>
  <div class="epx-radio-group" role="radiogroup" :aria-disabled="disabled || undefined"><slot /></div>
</template>
<script setup lang="ts">
import { provide, useId } from 'vue'
import { radioGroupKey } from './tokens'
import type { RadioValue } from './tokens'
defineOptions({ name: 'LuRadioGroup' })
const props = withDefaults(defineProps<{
  modelValue?: RadioValue
  disabled?: boolean
  size?: 'large' | 'default' | 'small'
  name?: string
}>(), { size: 'default' })
const emit = defineEmits<{ 'update:modelValue': [value: RadioValue]; change: [value: RadioValue] }>()
const id = useId()
provide(radioGroupKey, {
  get modelValue() { return props.modelValue },
  get disabled() { return props.disabled },
  get size() { return props.size },
  get name() { return props.name ?? `lu-radio-${id}` },
  change(value) {
    if (props.disabled || value === props.modelValue) return
    emit('update:modelValue', value)
    emit('change', value)
  }
})
</script>
