<template>
  <label class="epx-radio" :class="[`epx-radio--${size ?? group?.size ?? 'default'}`, { 'is-disabled': isDisabled, 'is-bordered': border, 'is-checked': checked }]">
    <input v-bind="$attrs" class="epx-radio__input" type="radio" :name="group?.name ?? name" :value="String(value)" :checked="checked" :disabled="isDisabled" @change="change" />
    <span><slot>{{ label ?? String(value) }}</slot></span>
  </label>
</template>
<script setup lang="ts">
import { computed, inject } from 'vue'
import { radioGroupKey } from './tokens'
import type { RadioValue } from './tokens'
defineOptions({ name: 'LuRadio', inheritAttrs: false })
const props = defineProps<{
  modelValue?: RadioValue
  value: RadioValue
  label?: string
  name?: string
  disabled?: boolean
  border?: boolean
  size?: 'large' | 'default' | 'small'
}>()
const emit = defineEmits<{ 'update:modelValue': [value: RadioValue]; change: [value: RadioValue] }>()
const group = inject(radioGroupKey, undefined)
const isDisabled = computed(() => props.disabled || group?.disabled)
const checked = computed(() => (group ? group.modelValue : props.modelValue) === props.value)
function change() {
  if (isDisabled.value || checked.value) return
  if (group) group.change(props.value)
  else emit('update:modelValue', props.value)
  emit('change', props.value)
}
</script>
