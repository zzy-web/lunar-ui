<template>
  <div class="epx-form-item" :class="formItemClass">
    <label v-if="label" class="epx-form-item__label" :style="labelStyle">{{ label }}</label>
    <div class="epx-form-item__content">
      <slot />
      <div v-if="errorMessage" class="epx-form-item__error" :title="errorMessage" role="alert">{{ errorMessage }}</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, inject, onBeforeUnmount, onMounted, ref } from 'vue'
import { formContextKey } from './tokens'
import type { CSSProperties } from 'vue'
import type { FormItemContext, FormRule } from './tokens'

defineOptions({ name: 'LuFormItem' })

const props = defineProps<{
  label?: string
  prop?: string
  required?: boolean
  rules?: FormRule | FormRule[]
}>()

const formContext = inject(formContextKey, undefined)
const errorMessage = ref('')

const normalizedRules = computed(() => {
  const rules: FormRule[] = []
  if (props.required) rules.push({ required: true })
  const formRule = props.prop ? formContext?.rules?.[props.prop] : undefined
  const itemRules = props.rules
  for (const rule of [formRule, itemRules]) {
    if (Array.isArray(rule)) rules.push(...rule)
    else if (rule) rules.push(rule)
  }
  return rules
})

const formItemClass = computed(() => ({
  'is-error': Boolean(errorMessage.value),
  'is-required': props.required || normalizedRules.value.some((rule) => rule.required)
}))

const labelStyle = computed<CSSProperties>(() => {
  if (formContext?.labelPosition === 'top') return {}
  const width = formContext?.labelWidth
  if (width === undefined) return {}
  return { width: typeof width === 'number' ? `${width}px` : width }
})

function getValue() {
  return props.prop && formContext?.model ? formContext.model[props.prop] : undefined
}

async function validate() {
  errorMessage.value = ''
  for (const rule of normalizedRules.value) {
    const value = getValue()
    if (rule.required && (value === undefined || value === null || value === '')) {
      errorMessage.value = rule.message || `${props.label || props.prop || 'Field'} is required`
      return false
    }
    if (rule.validator) {
      const result = await rule.validator(value)
      if (result !== true) {
        errorMessage.value = typeof result === 'string' ? result : rule.message || 'Validation failed'
        return false
      }
    }
  }
  return true
}

function clearValidate() {
  errorMessage.value = ''
}

const fieldContext: FormItemContext = {
  prop: props.prop,
  validate,
  clearValidate
}

onMounted(() => formContext?.addField(fieldContext))
onBeforeUnmount(() => formContext?.removeField(fieldContext))

defineExpose({ validate, clearValidate })
</script>
