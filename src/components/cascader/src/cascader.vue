<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useFormControl } from '../../../composables/use-form-control'
import type { CascaderOption, CascaderValue } from './types'

defineOptions({ name: 'LuCascader' })
const props = withDefaults(defineProps<{
  options: readonly CascaderOption[]
  modelValue?: readonly CascaderValue[]
  disabled?: boolean
  clearable?: boolean
  checkStrictly?: boolean
  placeholder?: string
  label?: string
  clearLabel?: string
}>(), { placeholder: 'Select', label: 'Category', clearLabel: 'Clear selection' })
const emit = defineEmits<{
  'update:modelValue': [path: CascaderValue[]]
  change: [path: CascaderValue[]]
}>()
const { formDisabled } = useFormControl(props)
const path = ref<CascaderValue[]>([...(props.modelValue ?? [])])
watch(() => props.modelValue?.slice(), value => { if (value !== undefined) path.value = [...value] })
const levels = computed(() => {
  const result: { options: readonly CascaderOption[]; index: number }[] = []
  let options = props.options
  for (const value of [...path.value, undefined]) {
    if (!options.length) break
    const index = options.findIndex(option => option.value === value)
    result.push({ options, index })
    if (index < 0) break
    options = options[index].children ?? []
  }
  return result
})
function publish(next: CascaderValue[]) {
  emit('update:modelValue', next)
  emit('change', next)
}
function select(level: number, event: Event) {
  if (formDisabled.value) return
  const index = (event.target as HTMLSelectElement).selectedIndex - 1
  const option = levels.value[level]?.options[index]
  if (!option || option.disabled) return
  const next = [...path.value.slice(0, level), option.value]
  path.value = next
  if (props.checkStrictly || !option.children?.length) publish(next)
}
function clear() {
  if (formDisabled.value || !path.value.length) return
  path.value = []
  publish([])
}
</script>

<template>
  <div class="epx-cascader" role="group" :aria-label="label">
    <select v-for="(level, depth) in levels" :key="depth" class="epx-field-button"
      :value="String(level.index)" :aria-label="`${label} ${depth + 1}`" :disabled="formDisabled" @change="select(depth, $event)">
      <option value="-1" disabled>{{ placeholder }}</option>
      <option v-for="(option, index) in level.options" :key="index" :disabled="option.disabled" :value="String(index)">{{ option.label }}</option>
    </select>
    <button v-if="clearable && path.length" type="button" class="epx-field-button" :disabled="formDisabled" :aria-label="clearLabel" @click="clear">×</button>
  </div>
</template>
