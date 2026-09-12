<template>
  <div ref="anchor" class="epx-select" :class="[`epx-select--${size}`, { 'is-disabled': blocked, 'is-open': visible }]">
    <div class="epx-select__wrapper" @click="focus(); if (!visible) open(); else if (!searchable) close()">
      <div class="epx-select__content">
      <span v-if="multiple && hasValue" class="epx-select__tags">
        <span v-for="value in values" :key="typeof value + ':' + value" class="epx-select__tag">
          <span :title="labelFor(value)">{{ labelFor(value) }}</span>
          <button v-if="!blocked && !sourceOptions.find(option => option.value === value)?.disabled" type="button" :aria-label="`Remove ${labelFor(value)}`" @click.stop="remove(value)">×</button>
        </span>
      </span>
      <input v-bind="$attrs" ref="control" class="epx-select__input" :class="{ 'is-collapsed': multiple && hasValue && !searchable }" role="combobox" aria-haspopup="listbox" type="text" autocomplete="off" :name="undefined"
        :readonly="!searchable" :disabled="blocked" :aria-expanded="visible" :aria-controls="visible ? listId : undefined"
        :aria-activedescendant="visible && active >= 0 ? `${listId}-${active}` : undefined" :aria-autocomplete="searchable ? 'list' : 'none'"
        :aria-busy="busy || undefined" :value="searchable && visible ? query : !multiple && hasValue ? labelFor(values[0]) : ''"
        :placeholder="busy ? loadingText : multiple && hasValue ? '' : placeholder"
        @input="search" @keydown="keydown" @focus="emit('focus', $event)" @blur="emit('blur', $event)" />
      </div>
      <div class="epx-select__suffix">
      <button v-if="clearable && hasValue && !blocked" type="button" class="epx-select__clear" :aria-label="clearLabel" @click.stop="clear">×</button>
      <svg v-if="busy" class="epx-select__spinner" viewBox="0 0 16 16" aria-hidden="true"><circle cx="8" cy="8" r="6" /></svg>
      <svg v-else class="epx-select__arrow" viewBox="0 0 16 16" aria-hidden="true"><path d="m4 6 4 4 4-4" /></svg>
      </div>
    </div>
    <select v-model="selectedValue" hidden aria-hidden="true" tabindex="-1" :name="($attrs.name as string)" :multiple="multiple" :disabled="blocked">
      <option v-if="!multiple" :value="undefined" disabled />
      <option v-for="option in nativeOptions" :key="typeof option.value + ':' + option.value" :value="option.value" :disabled="option.disabled">{{ option.label }}</option>
    </select>
  </div>
  <Teleport to="body">
    <div v-if="visible" ref="panel" class="epx-select__panel"
      :style="[style, { width: panelWidth, maxHeight: `min(280px, ${style.maxHeight || '280px'})`, '--epx-floating-max-width': '100vw' }]" @mousedown.prevent>
      <button v-if="multiple && showSelectAll" type="button" class="epx-select__all" :disabled="busy || !selectable.length" @click="selectAll" @keydown.esc="close(); focus()">{{ allSelected ? '取消全选' : '全选当前结果' }}<span v-if="multipleLimit > 0">{{ values.length }} / {{ multipleLimit }}</span></button>
      <div :id="listId" role="listbox" :aria-label="($attrs['aria-label'] as string) || placeholder" :aria-multiselectable="multiple || undefined">
      <template v-for="(option, index) in filtered" :key="typeof option.value + ':' + option.value">
        <div v-if="option.group && (index === 0 || filtered[index - 1].group !== option.group)" class="epx-select__group" role="presentation">{{ option.group }}</div>
        <div :id="`${listId}-${index}`" class="epx-select__option" :class="{ 'is-selected': values.includes(option.value), 'is-active': active === index, 'is-disabled': unavailable(option) }"
          role="option" :aria-label="option.group ? `${option.group}: ${option.label}` : option.label" :aria-selected="values.includes(option.value)" :aria-disabled="unavailable(option) || undefined"
          @mouseenter="!unavailable(option) && (active = index)" @click="choose(option)">
          <span><slot name="option" :option="option" :selected="values.includes(option.value)" :disabled="unavailable(option)">{{ option.label }}</slot></span><span v-if="values.includes(option.value)" aria-hidden="true">✓</span>
        </div>
      </template>
      </div>
      <div v-if="busy || remoteFailed || !filtered.length" class="epx-select__empty" role="status">{{ busy ? loadingText : remoteFailed ? remoteErrorText : sourceOptions.length ? noMatchText : emptyText }}</div>
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
  remoteMethod?: (query: string) => Promise<SelectOption[]>
  debounce?: number
  showSelectAll?: boolean
  multipleLimit?: number
  remoteErrorText?: string
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
}>(), { debounce: 300, multipleLimit: 0, remoteErrorText: '加载失败，请重新搜索', noMatchText: '无匹配选项', options: () => [], size: 'default', placeholder: '请选择', loadingText: '加载中…', emptyText: '暂无选项', clearLabel: 'Clear selection' })
const emit = defineEmits<{
  'update:modelValue': [value: SelectValue | SelectValue[] | undefined]
  change: [value: SelectValue | SelectValue[] | undefined]
  clear: []
  'remote-error': [error: unknown]
  focus: [event: FocusEvent]
  blur: [event: FocusEvent]
}>()
const control = ref<HTMLInputElement>()
const anchor = ref<HTMLElement>(), panel = ref<HTMLElement>()
const opened = ref(false), query = ref(''), active = ref(-1)
const listId = `lu-select-${useId()}`
const remoteOptions = ref<SelectOption[]>(props.options), remoteLoading = ref(false), remoteFailed = ref(false)
const sourceOptions = computed(() => props.remoteMethod ? remoteOptions.value : props.options)
const busy = computed(() => props.loading || remoteLoading.value)
const searchable = computed(() => props.filterable || !!props.remoteMethod)
const blocked = computed(() => props.disabled || (props.loading && !props.remoteMethod))
const labelCache = new Map<SelectValue, string>()
watch(sourceOptions, options => options.forEach(option => labelCache.set(option.value, option.label)), { immediate: true })
watch([query, opened, () => props.remoteMethod, () => props.disabled], ([text, isOpen, method, disabled], _, onCleanup) => {
  if (!method || !isOpen || disabled) { remoteLoading.value = false; return }
  let cancelled = false
  remoteLoading.value = true; remoteFailed.value = false; remoteOptions.value = []
  const timer = setTimeout(async () => {
    try { const result = await method(text); if (!cancelled) remoteOptions.value = result }
    catch (error) { if (!cancelled) { remoteFailed.value = true; emit('remote-error', error) } }
    finally { if (!cancelled) remoteLoading.value = false }
  }, Math.max(0, props.debounce))
  onCleanup(() => { cancelled = true; clearTimeout(timer) })
}, { immediate: true })
const visible = computed(() => opened.value && !blocked.value)
const filtered = computed(() => {
  const matches = sourceOptions.value.filter(option => props.remoteMethod || !searchable.value || option.label.toLowerCase().includes(query.value.trim().toLowerCase()))
  const groups = new Map<string, SelectOption[]>()
  matches.forEach(option => { const group = option.group ?? ''; if (!groups.has(group)) groups.set(group, []); groups.get(group)!.push(option) })
  return [...groups.values()].flat()
})
const limit = computed(() => props.multipleLimit > 0 ? Math.floor(props.multipleLimit) : Infinity)
function unavailable(option: SelectOption) { return !!option.disabled || (props.multiple && values.value.length >= limit.value && !values.value.includes(option.value)) }
const selectable = computed(() => filtered.value.filter(option => !option.disabled))
const allSelected = computed(() => selectable.value.length > 0 && selectable.value.every(option => values.value.includes(option.value)))
function selectAll() {
  if (blocked.value || busy.value) return
  if (allSelected.value) update(values.value.filter(value => !selectable.value.some(option => option.value === value)))
  else update([...new Set([...values.value, ...selectable.value.map(option => option.value)])].slice(0, Math.max(values.value.length, limit.value)))
  focus()
}
const { style } = useFloating(anchor, panel, visible, () => 'bottom-start', () => 6)
const panelWidth = ref('280px')
const labelFor = (value: SelectValue) => sourceOptions.value.find(option => option.value === value)?.label ?? labelCache.get(value) ?? String(value)
function close() { opened.value = false; query.value = '' }
function open() {
  if (blocked.value) return
  panelWidth.value = `${anchor.value?.getBoundingClientRect?.().width ?? 280}px`
  opened.value = true
  active.value = filtered.value.findIndex(option => !unavailable(option) && values.value.includes(option.value))
  if (active.value < 0) active.value = filtered.value.findIndex(option => !unavailable(option))
}
function choose(option: SelectOption) {
  if (blocked.value || busy.value || unavailable(option)) return
  if (props.multiple) update(values.value.includes(option.value) ? values.value.filter(value => value !== option.value) : [...values.value, option.value])
  else { update(option.value); close() }
  focus()
}
function remove(value: SelectValue) {
  if (blocked.value || sourceOptions.value.find(option => option.value === value)?.disabled) return
  update(values.value.filter(item => item !== value)); focus()
}
function search(event: Event) { query.value = (event.target as HTMLInputElement).value; if (!visible.value) open() }
function keydown(event: KeyboardEvent) {
  if (blocked.value || event.isComposing) return
  if (props.multiple && props.showSelectAll && visible.value && (event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'a' && !searchable.value) { event.preventDefault(); selectAll(); return }
  if (event.key === 'Escape' || event.key === 'Tab') { close(); if (event.key === 'Escape') event.preventDefault(); return }
  if (event.key === 'Enter' || (event.key === ' ' && !searchable.value)) {
    event.preventDefault()
    if (!visible.value) open()
    else if (filtered.value[active.value]) choose(filtered.value[active.value])
    return
  }
  if (!['ArrowDown', 'ArrowUp', 'Home', 'End'].includes(event.key)) return
  if (!visible.value && ['Home', 'End'].includes(event.key)) return
  event.preventDefault()
  if (!visible.value) { open(); if (event.key === 'ArrowDown') return }
  const indices = filtered.value.flatMap((option, index) => unavailable(option) ? [] : [index])
  const current = indices.indexOf(active.value)
  active.value = event.key === 'Home' ? indices[0] ?? -1 : event.key === 'End' ? indices[indices.length - 1] ?? -1
    : indices[(current + (event.key === 'ArrowUp' ? -1 : 1) + indices.length) % indices.length] ?? -1
  void nextTick(() => panel.value?.querySelector(`[id="${listId}-${active.value}"]`)?.scrollIntoView?.({ block: 'nearest' }))
}
watch(filtered, options => { active.value = options.findIndex(option => !unavailable(option)) })
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
const nativeOptions = computed<SelectOption[]>(() => [...sourceOptions.value, ...values.value.filter(value => !sourceOptions.value.some(option => option.value === value)).map(value => ({ value, label: labelFor(value) }))])
const hasValue = computed(() => values.value.length > 0)
const selectedValue = computed({
  get() {
    return props.multiple ? values.value : values.value[0]
  },
  set(value: SelectValue | SelectValue[] | undefined) {
    if (props.disabled || props.loading) return
    const selected = (Array.isArray(value) ? value : [value])
      .map(value => sourceOptions.value.find(option => option.value === value))
      .filter((option): option is SelectOption => !!option && (!option.disabled || values.value.includes(option.value)))
      .map(option => option.value)
    update(props.multiple ? selected : selected[0])
  }
})
function update(value: SelectValue | SelectValue[] | undefined) {
  if (props.multiple && Array.isArray(value) && value.length > limit.value && value.length > values.value.length) return
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
