<template>
  <div ref="anchor" class="epx-select" :class="[`epx-select--${size}`, { 'is-disabled': blocked, 'is-open': visible }]">
    <div class="epx-select__wrapper" @click="focus(); if (!visible) open(); else if (!filterable) close()">
      <span v-if="multiple && hasValue" class="epx-select__tags">
        <span v-for="value in values" :key="typeof value + ':' + value" class="epx-select__tag">
          <span :title="labelFor(value)">{{ labelFor(value) }}</span>
          <button v-if="!blocked && !options.find(option => option.value === value)?.disabled" type="button" :aria-label="`Remove ${labelFor(value)}`" @click.stop="remove(value)">×</button>
        </span>
      </span>
      <input v-bind="$attrs" ref="control" class="epx-select__input" role="combobox" aria-haspopup="listbox" type="text" autocomplete="off" :name="undefined"
        :readonly="!filterable" :disabled="blocked" :aria-expanded="visible" :aria-controls="visible ? listId : undefined"
        :aria-activedescendant="visible && active >= 0 ? `${listId}-${active}` : undefined" :aria-autocomplete="filterable ? 'list' : 'none'"
        :aria-busy="loading || undefined" :value="filterable && visible ? query : !multiple && hasValue ? labelFor(values[0]) : ''"
        :placeholder="loading ? loadingText : multiple && hasValue ? '' : placeholder"
        @input="search" @keydown="keydown" @focus="emit('focus', $event)" @blur="emit('blur', $event)" />
      <button v-if="clearable && hasValue && !blocked" type="button" class="epx-select__clear" :aria-label="clearLabel" @click.stop="clear">×</button>
      <svg v-if="loading" class="epx-select__spinner" viewBox="0 0 16 16" aria-hidden="true"><circle cx="8" cy="8" r="6" /></svg>
      <svg v-else class="epx-select__arrow" viewBox="0 0 16 16" aria-hidden="true"><path d="m4 6 4 4 4-4" /></svg>
    </div>
    <select v-model="selectedValue" hidden aria-hidden="true" tabindex="-1" :name="($attrs.name as string)" :multiple="multiple" :disabled="blocked">
      <option v-if="!multiple" :value="undefined" disabled />
      <option v-for="option in options" :key="typeof option.value + ':' + option.value" :value="option.value" :disabled="option.disabled">{{ option.label }}</option>
    </select>
  </div>
  <Teleport to="body">
    <div v-if="visible" ref="panel" :id="listId" class="epx-select__panel" role="listbox" :aria-label="($attrs['aria-label'] as string) || placeholder" :aria-multiselectable="multiple || undefined"
      :style="[style, { width: panelWidth, maxHeight: `min(280px, ${style.maxHeight || '280px'})`, '--epx-floating-max-width': '100vw' }]" @mousedown.prevent>
      <div v-for="(option, index) in filtered" :id="`${listId}-${index}`" :key="typeof option.value + ':' + option.value"
        class="epx-select__option" :class="{ 'is-selected': values.includes(option.value), 'is-active': active === index, 'is-disabled': option.disabled }"
        role="option" :aria-selected="values.includes(option.value)" :aria-disabled="option.disabled || undefined"
        @mouseenter="!option.disabled && (active = index)" @click="choose(option)">
        <span>{{ option.label }}</span><span v-if="values.includes(option.value)" aria-hidden="true">✓</span>
      </div>
      <div v-if="!filtered.length" class="epx-select__empty">{{ options.length ? noMatchText : emptyText }}</div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { computed, ref, nextTick, useId, watch } from 'vue'
import { useFloating } from '../../../composables/use-floating'
import type { SelectOption, SelectValue } from './types'
defineOptions({ name: 'LuSelect', inheritAttrs: false })
const props = withDefaults(defineProps<{
  modelValue?: SelectValue | SelectValue[]
  options?: SelectOption[]
  filterable?: boolean
  noMatchText?: string
  multiple?: boolean
  disabled?: boolean
  loading?: boolean
  clearable?: boolean
  size?: 'large' | 'default' | 'small'
  placeholder?: string
  loadingText?: string
  emptyText?: string
  clearLabel?: string
}>(), { noMatchText: '无匹配选项', options: () => [], size: 'default', placeholder: '请选择', loadingText: '加载中…', emptyText: '暂无选项', clearLabel: 'Clear selection' })
const emit = defineEmits<{
  'update:modelValue': [value: SelectValue | SelectValue[] | undefined]
  change: [value: SelectValue | SelectValue[] | undefined]
  clear: []
  focus: [event: FocusEvent]
  blur: [event: FocusEvent]
}>()
const control = ref<HTMLInputElement>()
const anchor = ref<HTMLElement>(), panel = ref<HTMLElement>()
const opened = ref(false), query = ref(''), active = ref(-1)
const listId = `lu-select-${useId()}`
const blocked = computed(() => props.disabled || props.loading)
const visible = computed(() => opened.value && !blocked.value)
const filtered = computed(() => props.options.filter(option => !props.filterable || option.label.toLowerCase().includes(query.value.trim().toLowerCase())))
const { style } = useFloating(anchor, panel, visible, () => 'bottom-start', () => 6)
const panelWidth = ref('280px')
const labelFor = (value: SelectValue) => props.options.find(option => option.value === value)?.label ?? String(value)
function close() { opened.value = false; query.value = '' }
function open() {
  if (blocked.value) return
  panelWidth.value = `${anchor.value?.getBoundingClientRect?.().width ?? 280}px`
  opened.value = true
  active.value = filtered.value.findIndex(option => !option.disabled && values.value.includes(option.value))
  if (active.value < 0) active.value = filtered.value.findIndex(option => !option.disabled)
}
function choose(option: SelectOption) {
  if (blocked.value || option.disabled) return
  if (props.multiple) update(values.value.includes(option.value) ? values.value.filter(value => value !== option.value) : [...values.value, option.value])
  else { update(option.value); close() }
  focus()
}
function remove(value: SelectValue) {
  if (blocked.value || props.options.find(option => option.value === value)?.disabled) return
  update(values.value.filter(item => item !== value)); focus()
}
function search(event: Event) { query.value = (event.target as HTMLInputElement).value; if (!visible.value) open() }
function keydown(event: KeyboardEvent) {
  if (blocked.value || event.isComposing) return
  if (event.key === 'Escape' || event.key === 'Tab') { close(); if (event.key === 'Escape') event.preventDefault(); return }
  if (event.key === 'Enter' || (event.key === ' ' && !props.filterable)) {
    event.preventDefault()
    if (!visible.value) open()
    else if (filtered.value[active.value]) choose(filtered.value[active.value])
    return
  }
  if (!['ArrowDown', 'ArrowUp', 'Home', 'End'].includes(event.key)) return
  if (!visible.value && ['Home', 'End'].includes(event.key)) return
  event.preventDefault()
  if (!visible.value) { open(); if (event.key === 'ArrowDown') return }
  const indices = filtered.value.flatMap((option, index) => option.disabled ? [] : [index])
  const current = indices.indexOf(active.value)
  active.value = event.key === 'Home' ? indices[0] ?? -1 : event.key === 'End' ? indices[indices.length - 1] ?? -1
    : indices[(current + (event.key === 'ArrowUp' ? -1 : 1) + indices.length) % indices.length] ?? -1
  void nextTick(() => panel.value?.querySelector(`[id="${listId}-${active.value}"]`)?.scrollIntoView?.({ block: 'nearest' }))
}
watch(filtered, options => { active.value = options.findIndex(option => !option.disabled) })
watch(blocked, value => { if (value) close() })
watch(visible, (value, _, onCleanup) => {
  if (!value || typeof document === 'undefined') return
  const outside = (event: Event) => {
    if (!anchor.value?.contains(event.target as Node) && !panel.value?.contains(event.target as Node)) close()
  }
  document.addEventListener('pointerdown', outside, true)
  document.addEventListener('focusin', outside, true)
  onCleanup(() => { document.removeEventListener('pointerdown', outside, true); document.removeEventListener('focusin', outside, true) })
})
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
function blur() { close(); control.value?.blur() }
function clear() {
  if (props.disabled || props.loading) return
  update(props.multiple ? [] : undefined)
  query.value = ''
  emit('clear')
  focus()
}
defineExpose({ focus, blur })
</script>
