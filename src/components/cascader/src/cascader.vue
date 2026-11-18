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
  filterable?: boolean
  searchLabel?: string
  noMatchText?: string
  placeholder?: string
  label?: string
  clearLabel?: string
}>(), {
  placeholder: 'Select', label: 'Category', clearLabel: 'Clear selection',
  searchLabel: 'Search options', noMatchText: 'No matching options'
})
const emit = defineEmits<{
  'update:modelValue': [path: CascaderValue[]]
  change: [path: CascaderValue[]]
}>()
const { formDisabled } = useFormControl(props)
const path = ref<CascaderValue[]>([...(props.modelValue ?? [])])
const searchInput = ref<HTMLInputElement>()
const query = ref('')
const keyword = computed(() => props.filterable && !formDisabled.value ? query.value.trim().toLowerCase() : '')
const matches = computed(() => {
  const results: { label: string; path: CascaderValue[] }[] = []
  if (!keyword.value) return results
  function visit(options: readonly CascaderOption[], parent: CascaderValue[], labels: string[]) {
    for (const option of options) {
      if (option.disabled) continue
      const next = [...parent, option.value]
      const names = [...labels, option.label]
      const label = names.join(' / ')
      if ((props.checkStrictly || !option.children?.length) && label.toLowerCase().includes(keyword.value)) {
        results.push({ label, path: next })
      }
      if (option.children?.length) visit(option.children, next, names)
    }
  }
  visit(props.options, [], [])
  return results
})
watch([formDisabled, () => props.filterable], () => { query.value = '' })
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
function chooseMatch(next: CascaderValue[]) {
  if (formDisabled.value) return
  path.value = [...next]
  query.value = ''
  publish([...next])
  searchInput.value?.focus()
}
function dismissSearch(event: KeyboardEvent) {
  if (!keyword.value || event.isComposing) return
  event.stopPropagation()
  query.value = ''
  searchInput.value?.focus()
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
  query.value = ''
  publish([])
}
</script>

<template>
  <div class="epx-cascader" role="group" :aria-label="label" @keydown.esc="dismissSearch">
    <input v-if="filterable" ref="searchInput" v-model="query" type="search" class="epx-field-button"
      :aria-label="searchLabel" :placeholder="searchLabel" :disabled="formDisabled" />
    <ul v-if="keyword && matches.length" class="epx-cascader__results">
      <li v-for="match in matches" :key="JSON.stringify(match.path)">
        <button type="button" class="epx-field-button" @click="chooseMatch(match.path)">{{ match.label }}</button>
      </li>
    </ul>
    <span v-else-if="keyword" role="status">{{ noMatchText }}</span>
    <template v-else>
    <select v-for="(level, depth) in levels" :key="depth" class="epx-field-button"
      :value="String(level.index)" :aria-label="`${label} ${depth + 1}`" :disabled="formDisabled" @change="select(depth, $event)">
      <option value="-1" disabled>{{ placeholder }}</option>
      <option v-for="(option, index) in level.options" :key="index" :disabled="option.disabled" :value="String(index)">{{ option.label }}</option>
    </select>
    </template>
    <button v-if="clearable && path.length" type="button" class="epx-field-button" :disabled="formDisabled" :aria-label="clearLabel" @click="clear">×</button>
  </div>
</template>
