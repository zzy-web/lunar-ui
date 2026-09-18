<template>
  <div class="epx-checkbox-group" role="group" :aria-disabled="formDisabled || undefined"><slot /></div>
</template>

<script setup lang="ts">
import { useFormControl } from '../../../composables/use-form-control'
import { computed, provide } from 'vue'
import { checkboxGroupKey } from './tokens'
import type { CheckboxValue } from './tokens'

defineOptions({ name: 'LuCheckboxGroup' })

const props = withDefaults(defineProps<{
  modelValue?: readonly CheckboxValue[]
  disabled?: boolean
  min?: number
  max?: number
  size?: 'large' | 'default' | 'small'
  name?: string
}>(), { modelValue: () => [], disabled: false })

const { formDisabled, formSize } = useFormControl(props)
const emit = defineEmits<{
  'update:modelValue': [value: CheckboxValue[]]
  change: [value: CheckboxValue[]]
}>()

const selection = computed(() => [...new Set(props.modelValue)])
const minimum = computed(() => Number.isFinite(props.min) ? Math.max(0, Math.floor(props.min!)) : 0)
const maximum = computed(() => Number.isFinite(props.max) ? Math.max(minimum.value, Math.floor(props.max!), 0) : Infinity)

function isDisabled(value: CheckboxValue | undefined) {
  if (formDisabled.value || value === undefined) return true
  return selection.value.includes(value)
    ? selection.value.length <= minimum.value
    : selection.value.length >= maximum.value
}

provide(checkboxGroupKey, {
  get modelValue() { return props.modelValue },
  get size() { return formSize.value },
  get name() { return props.name },
  isDisabled,
  change(value, checked) {
    if (isDisabled(value) || selection.value.includes(value) === checked) return false
    const next = checked ? [...selection.value, value] : selection.value.filter(item => ![value].includes(item))
    emit('update:modelValue', next)
    emit('change', next)
    return true
  }
})
</script>
