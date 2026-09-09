<template>
  <div class="epx-select" :class="[`epx-select--${size}`, { 'is-disabled': disabled || loading, 'is-multiple': multiple }]">
    <select v-bind="$attrs" ref="control" v-model="selectedValue" class="epx-select__inner" :multiple="multiple" :size="multiple ? 4 : undefined" :disabled="disabled || loading" :aria-busy="loading || undefined" @focus="emit('focus', $event)" @blur="emit('blur', $event)">
      <option v-if="!multiple" :value="undefined" disabled>{{ loading ? loadingText : options.length ? placeholder : emptyText }}</option>
      <option v-for="option in options" :key="typeof option.value + ':' + option.value" :value="option.value" :disabled="option.disabled">{{ option.label }}</option>
    </select>
    <button v-if="clearable && hasValue && !disabled && !loading" type="button" class="epx-select__clear" :aria-label="clearLabel" @click="clear">×</button>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import type { SelectOption, SelectValue } from './types'
defineOptions({ name: 'LuSelect', inheritAttrs: false })
const props = withDefaults(defineProps<{
  modelValue?: SelectValue | SelectValue[]
  options?: SelectOption[]
  multiple?: boolean
  disabled?: boolean
  loading?: boolean
  clearable?: boolean
  size?: 'large' | 'default' | 'small'
  placeholder?: string
  loadingText?: string
  emptyText?: string
  clearLabel?: string
}>(), { options: () => [], size: 'default', placeholder: '请选择', loadingText: '加载中…', emptyText: '暂无选项', clearLabel: 'Clear selection' })
const emit = defineEmits<{
  'update:modelValue': [value: SelectValue | SelectValue[] | undefined]
  change: [value: SelectValue | SelectValue[] | undefined]
  clear: []
  focus: [event: FocusEvent]
  blur: [event: FocusEvent]
}>()
const control = ref<HTMLSelectElement>()
const values = computed(() => Array.isArray(props.modelValue) ? props.modelValue : props.modelValue === undefined ? [] : [props.modelValue])
const hasValue = computed(() => values.value.length > 0)
const selectedValue = computed({
  get() {
    return props.multiple ? values.value : values.value[0]
  },
  set(value: SelectValue | SelectValue[] | undefined) {
    if (props.disabled || props.loading) return
    const selected = (Array.isArray(value) ? value : [value])
      .map(value => props.options.find(option => option.value === value))
      .filter((option): option is SelectOption => !!option && (!option.disabled || values.value.includes(option.value)))
      .map(option => option.value)
    update(props.multiple ? selected : selected[0])
  }
})
function update(value: SelectValue | SelectValue[] | undefined) {
  emit('update:modelValue', value)
  emit('change', value)
}
function focus() { control.value?.focus() }
function blur() { control.value?.blur() }
function clear() {
  if (props.disabled || props.loading) return
  update(props.multiple ? [] : undefined)
  emit('clear')
  focus()
}
defineExpose({ focus, blur })
</script>
