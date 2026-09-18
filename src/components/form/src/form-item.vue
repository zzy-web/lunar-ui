<template>
  <div class="epx-form-item" :class="formItemClass" role="group" :aria-labelledby="label ? `${id}-label` : undefined" :aria-describedby="errorMessage ? `${id}-error` : undefined" :aria-invalid="Boolean(errorMessage)" :aria-busy="validating || undefined" @focusout="handleBlur">
    <label v-if="label" :id="`${id}-label`" :for="props.for" class="epx-form-item__label" :style="labelStyle">{{ label }}</label>
    <div class="epx-form-item__content">
      <slot :error="errorMessage" :validating="validating" />
      <div v-if="errorMessage" :id="`${id}-error`" class="epx-form-item__error" :title="errorMessage" role="alert">{{ errorMessage }}</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, inject, nextTick, onBeforeUnmount, onMounted, ref, useId, watch } from 'vue'
import { formContextKey } from './tokens'
import { cloneFieldValue, getFieldValue, setFieldValue } from './value'
import type { CSSProperties } from 'vue'
import type { FormItemContext, FormRule } from './tokens'

defineOptions({ name: 'LuFormItem' })

const props = withDefaults(defineProps<{
  label?: string
  prop?: string
  required?: boolean
  rules?: FormRule | FormRule[]
  for?: string
  validateOnChange?: boolean
}>(), { validateOnChange: true })

const formContext = inject(formContextKey, undefined)
const errorMessage = ref('')
const validating = ref(false)
const id = `lu-form-item-${useId()}`
let version = 0
let resetting = false
let initialValue: unknown

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
  return props.prop ? getFieldValue(formContext?.model, props.prop) : undefined
}

async function validate(trigger?: 'blur' | 'change') {
  const rules = normalizedRules.value.filter(rule => !trigger || !rule.trigger || [rule.trigger].flat().includes(trigger))
  if (!rules.length) return true
  const current = ++version
  const value = cloneFieldValue(getValue())
  validating.value = true
  let message = ''
  try {
    for (const rule of rules) {
      const empty = value === undefined || value === null || value === '' || (Array.isArray(value) && value.length === 0)
      if (rule.required && empty) message = rule.message || `${props.label || props.prop || 'Field'} is required`
      if (!message && !empty) {
        const length = typeof value === 'number' ? value : typeof value === 'string' || Array.isArray(value) ? value.length : undefined
        if (length !== undefined && ((rule.min !== undefined && length < rule.min) || (rule.max !== undefined && length > rule.max) || (rule.len !== undefined && length !== rule.len))) message = rule.message || 'Value is outside the allowed range'
        if (!message && rule.pattern && !new RegExp(rule.pattern.source, rule.pattern.flags).test(String(value))) message = rule.message || 'Value does not match the required format'
      }
      if (!message && rule.validator) {
        try {
          const result = await rule.validator(value)
          if (result !== true) message = typeof result === 'string' ? result || rule.message || 'Validation failed' : rule.message || 'Validation failed'
        } catch (error) {
          message = rule.message || (error instanceof Error ? error.message : '') || 'Validation failed'
        }
      }
      if (message || current !== version) break
    }
    if (current !== version) return false
    errorMessage.value = message
    return !message
  } finally {
    if (current === version) validating.value = false
  }
}

function clearValidate() {
  version++
  validating.value = false
  errorMessage.value = ''
}

async function resetField() {
  resetting = true
  clearValidate()
  if (props.prop) setFieldValue(formContext?.model, props.prop, cloneFieldValue(initialValue))
  await nextTick()
  resetting = false
}

function handleBlur(event: FocusEvent) {
  if ((event.currentTarget as HTMLElement)?.contains?.(event.relatedTarget as Node)) return
  if (!resetting && !formContext?.disabled) void validate('blur')
}

watch(getValue, () => {
  // Invalidate pending work even when automatic change validation is disabled.
  version++
  validating.value = false
  if (!resetting && props.validateOnChange !== false && !formContext?.disabled) void validate('change')
}, { deep: true, flush: 'post' })
watch(() => props.prop, () => { clearValidate(); initialValue = cloneFieldValue(getValue()) })
watch(normalizedRules, clearValidate, { deep: true })

const fieldContext: FormItemContext = {
  get prop() { return props.prop },
  validate,
  clearValidate,
  resetField
}

onMounted(() => { initialValue = cloneFieldValue(getValue()); formContext?.addField(fieldContext) })
onBeforeUnmount(() => { clearValidate(); formContext?.removeField(fieldContext) })

defineExpose({ validate, clearValidate, resetField, errorMessage, validating })
</script>
