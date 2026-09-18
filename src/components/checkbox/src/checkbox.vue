<template>
  <label class="epx-checkbox" :class="[`epx-checkbox--${resolvedSize}`, { 'is-disabled': isDisabled }]">
    <input v-bind="$attrs" class="epx-checkbox__input" type="checkbox" :name="group?.name ?? name" :value="value ?? 'on'" :checked="isChecked" :indeterminate="indeterminate" :disabled="isDisabled" @change="handleChange" />
    <span v-if="$slots.default || label" class="epx-checkbox__label"><slot>{{ label }}</slot></span>
  </label>
</template>

<script setup lang="ts">
import { useFormControl } from '../../../composables/use-form-control'
import { computed, inject } from 'vue'
import { checkboxGroupKey } from './tokens'
import type { CheckboxValue } from './tokens'

defineOptions({ name: 'LuCheckbox', inheritAttrs: false })
const props = withDefaults(defineProps<{
  modelValue?: boolean
  value?: CheckboxValue
  name?: string
  label?: string
  indeterminate?: boolean
  disabled?: boolean
  size?: 'large' | 'default' | 'small'
}>(), { modelValue: false, value: undefined, indeterminate: false, disabled: false })
const { formDisabled, formSize } = useFormControl(props)
const emit = defineEmits<{ 'update:modelValue': [value: boolean]; change: [value: boolean] }>()
const group = inject(checkboxGroupKey, undefined)
const isChecked = computed(() => group ? props.value !== undefined && group.modelValue.includes(props.value) : props.modelValue)
const isDisabled = computed(() => formDisabled.value || Boolean(group?.isDisabled(props.value)))
const resolvedSize = computed(() => props.size ?? group?.size ?? formSize.value)
function handleChange(event: Event) {
  const input = event.target as HTMLInputElement
  if (isDisabled.value) {
    input.checked = isChecked.value
    return
  }
  const value = input.checked
  if (group) {
    if (props.value !== undefined && group.change(props.value, value)) emit('change', value)
    else input.checked = isChecked.value
    return
  }
  emit('update:modelValue', value)
  emit('change', value)
}
</script>
