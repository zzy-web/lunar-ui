<template>
  <form class="epx-form" :class="formClass" :aria-disabled="disabled || undefined" @submit.prevent="emit('submit', $event)" @reset.prevent="resetFields()">
    <slot />
  </form>
</template>

<script setup lang="ts">
import { computed, provide } from 'vue'
import { formContextKey } from './tokens'
import type { FormItemContext, FormRules } from './tokens'

defineOptions({ name: 'LuForm' })

const props = withDefaults(defineProps<{
  model?: Record<string, unknown>
  rules?: FormRules
  labelWidth?: string | number
  labelPosition?: 'left' | 'right' | 'top'
  disabled?: boolean
  size?: 'large' | 'default' | 'small'
}>(), {
  labelPosition: 'right'
})

const fields: FormItemContext[] = []
const emit = defineEmits<{ submit: [event: Event] }>()
const formClass = computed(() => [`epx-form--label-${props.labelPosition}`])

function addField(field: FormItemContext) {
  if (!fields.includes(field)) fields.push(field)
}

function removeField(field: FormItemContext) {
  const index = fields.indexOf(field)
  if (index > -1) fields.splice(index, 1)
}

async function validate() {
  const results = await Promise.all(fields.map((field) => field.validate()))
  return results.every(Boolean)
}

function selectedFields(props?: string | string[]) {
  const paths = props === undefined ? undefined : Array.isArray(props) ? props : [props]
  return fields.filter(field => !paths || (field.prop !== undefined && paths.includes(field.prop)))
}

async function validateField(props: string | string[]) {
  return (await Promise.all(selectedFields(props).map(field => field.validate()))).every(Boolean)
}

function clearValidate(props?: string | string[]) {
  selectedFields(props).forEach((field) => field.clearValidate())
}

async function resetFields(props?: string | string[]) {
  await Promise.all(selectedFields(props).map(field => field.resetField()))
}

provide(formContextKey, {
  get model() { return props.model },
  get rules() { return props.rules },
  get labelWidth() { return props.labelWidth },
  get labelPosition() { return props.labelPosition },
  get disabled() { return props.disabled },
  get size() { return props.size },
  addField,
  removeField
})

defineExpose({ validate, validateField, clearValidate, resetFields })
</script>
