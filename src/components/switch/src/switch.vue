<template>
  <button v-bind="$attrs" class="epx-switch" :class="[`epx-switch--${size}`, { 'is-checked': modelValue, 'is-disabled': disabled || loading }]" type="button" role="switch" :aria-checked="modelValue" :aria-busy="loading || undefined" :disabled="disabled || loading" @click="toggle">
    <span v-if="inactiveText" class="epx-switch__label">{{ inactiveText }}</span>
    <span class="epx-switch__track" aria-hidden="true"><span class="epx-switch__thumb"><span v-if="loading" class="epx-switch__loading" /></span></span>
    <span v-if="activeText" class="epx-switch__label">{{ activeText }}</span>
  </button>
</template>

<script setup lang="ts">
defineOptions({ name: 'LuSwitch', inheritAttrs: false })
const props = withDefaults(defineProps<{
  modelValue?: boolean
  disabled?: boolean
  loading?: boolean
  activeText?: string
  inactiveText?: string
  size?: 'large' | 'default' | 'small'
}>(), { modelValue: false, disabled: false, loading: false, size: 'default' })
const emit = defineEmits<{ 'update:modelValue': [value: boolean]; change: [value: boolean] }>()
function toggle() {
  if (props.disabled || props.loading) return
  const value = !props.modelValue
  emit('update:modelValue', value)
  emit('change', value)
}
</script>
