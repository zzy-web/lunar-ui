<template>
  <form class="epx-form" :class="formClass" @submit.prevent>
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
}>(), {
  labelPosition: 'right'
})

const fields: FormItemContext[] = []
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

function clearValidate() {
  fields.forEach((field) => field.clearValidate())
}

provide(formContextKey, {
  get model() { return props.model },
  get rules() { return props.rules },
  get labelWidth() { return props.labelWidth },
  get labelPosition() { return props.labelPosition },
  addField,
  removeField
})

defineExpose({ validate, clearValidate })
</script>
