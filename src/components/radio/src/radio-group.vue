<template>
  <div class="epx-radio-group" role="radiogroup" :aria-disabled="formDisabled || undefined"><slot /></div>
</template>
<script setup lang="ts">
import { useFormControl } from '../../../composables/use-form-control'
import { provide, useId } from 'vue'
import { radioGroupKey } from './tokens'
import type { RadioValue } from './tokens'
defineOptions({ name: 'LuRadioGroup' })
const props = defineProps<{
  modelValue?: RadioValue
  disabled?: boolean
  size?: 'large' | 'default' | 'small'
  name?: string
}>()
const { formDisabled, formSize } = useFormControl(props)
const emit = defineEmits<{ 'update:modelValue': [value: RadioValue]; change: [value: RadioValue] }>()
const id = useId()
provide(radioGroupKey, {
  get modelValue() { return props.modelValue },
  get disabled() { return formDisabled.value },
  get size() { return formSize.value },
  get name() { return props.name ?? `lu-radio-${id}` },
  change(value) {
    if (formDisabled.value || value === props.modelValue) return
    emit('update:modelValue', value)
    emit('change', value)
  }
})
</script>
