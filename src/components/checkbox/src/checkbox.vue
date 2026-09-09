<template>
  <label class="epx-checkbox" :class="[`epx-checkbox--${size}`, { 'is-disabled': disabled }]">
    <input v-bind="$attrs" class="epx-checkbox__input" type="checkbox" :checked="modelValue" :indeterminate="indeterminate" :disabled="disabled" @change="handleChange" />
    <span v-if="$slots.default || label" class="epx-checkbox__label"><slot>{{ label }}</slot></span>
  </label>
</template>

<script setup lang="ts">
defineOptions({ name: 'LuCheckbox', inheritAttrs: false })
const props = withDefaults(defineProps<{
  modelValue?: boolean
  label?: string
  indeterminate?: boolean
  disabled?: boolean
  size?: 'large' | 'default' | 'small'
}>(), { modelValue: false, indeterminate: false, disabled: false, size: 'default' })
const emit = defineEmits<{ 'update:modelValue': [value: boolean]; change: [value: boolean] }>()
function handleChange(event: Event) {
  if (props.disabled) return
  const value = (event.target as HTMLInputElement).checked
  emit('update:modelValue', value)
  emit('change', value)
}
</script>
