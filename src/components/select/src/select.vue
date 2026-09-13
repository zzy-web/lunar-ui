<template>
  <div ref="anchor" class="epx-select" :style="($attrs.style as any)" :class="[$attrs.class, `epx-select--${size}`, { 'is-disabled': blocked, 'is-open': visible }]">
    <div class="epx-select__wrapper" @click="toggle">
      <slot name="prefix" />
      <div class="epx-select__content">
      <span v-if="multiple && hasValue" class="epx-select__tags">
        <span v-for="value in displayedValues" :key="typeof value + ':' + value" class="epx-select__tag">
          <span :title="labelFor(value)"><slot name="label" :value="value" :label="labelFor(value)">{{ labelFor(value) }}</slot></span>
          <button v-if="!blocked && !sourceOptions.find(option => option.value === value)?.disabled" type="button" :aria-label="`Remove ${labelFor(value)}`" @click.stop="remove(value)">×</button>
        </span>
        <span v-if="hiddenValues.length" class="epx-select__tag" :tabindex="collapseTagsTooltip ? 0 : undefined" :title="collapseTagsTooltip ? hiddenValues.map(labelFor).join(', ') : undefined" :aria-label="hiddenValues.map(labelFor).join(', ')">+ {{ hiddenValues.length }}</span>
      </span>
      <input v-bind="inputAttrs" ref="control" class="epx-select__input" :class="{ 'is-collapsed': multiple && hasValue && !searchable }" role="combobox" aria-haspopup="listbox" type="text" autocomplete="off" :name="undefined"
        :readonly="!searchable" :disabled="blocked" :aria-expanded="visible" :aria-controls="visible ? listId : undefined"
        :aria-activedescendant="visible && active >= 0 ? `${listId}-${active}` : undefined" :aria-autocomplete="searchable ? 'list' : 'none'"
        :aria-busy="busy || undefined" :value="searchable && visible ? query : !multiple && hasValue ? labelFor(values[0]) : ''"
        :placeholder="busy ? loadingText : multiple && hasValue ? '' : placeholder"
        @compositionstart="composing = true" @compositionend="compositionEnd" @input="search" @keydown="keydown" @focus="emit('focus', $event); if (automaticDropdown) open()" @blur="emit('blur', $event)" />
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
  <Teleport :to="appendTo" :disabled="!teleported">
    <div v-if="visible" ref="panel" class="epx-select__panel" :class="popperClass"
      :style="[style, { width: panelWidth, maxHeight: `min(${height}px, ${style.maxHeight || height + 'px'})`, '--epx-floating-max-width': '100vw' }]" @mousedown.prevent>
      <div v-if="$slots.header" class="epx-select__header"><slot name="header" /></div>
      <button v-if="multiple && showSelectAll" type="button" class="epx-select__all" :disabled="busy || !selectable.length" @click="selectAll" @keydown.esc="close(); focus()">{{ allSelected ? '取消全选' : '全选当前结果' }}<span v-if="multipleLimit > 0">{{ values.length }} / {{ multipleLimit }}</span></button>
      <div :id="listId" role="listbox" :aria-label="($attrs['aria-label'] as string) || placeholder" :aria-multiselectable="multiple || undefined">
      <template v-for="(option, index) in busy ? [] : filtered" :key="typeof option.value + ':' + option.value">
        <div v-if="option.group && (index === 0 || filtered[index - 1].group !== option.group)" class="epx-select__group" role="presentation">{{ option.group }}</div>
        <div :id="`${listId}-${index}`" class="epx-select__option" :class="{ 'is-selected': values.includes(option.value), 'is-active': active === index, 'is-disabled': unavailable(option) }"
          role="option" :aria-label="option.group ? `${option.group}: ${option.label}` : option.label" :aria-selected="values.includes(option.value)" :aria-disabled="unavailable(option) || undefined"
          @mouseenter="!unavailable(option) && (active = index)" @click="choose(option)">
          <span><slot name="option" :option="option" :selected="values.includes(option.value)" :disabled="unavailable(option)">{{ option.label }}</slot></span><span v-if="values.includes(option.value)" aria-hidden="true">✓</span>
        </div>
      </template>
      </div>
      <div v-if="busy || remoteFailed || !filtered.length" class="epx-select__empty" role="status"><slot v-if="busy" name="loading">{{ loadingText }}</slot><slot v-else name="empty">{{ remoteFailed ? remoteErrorText : query ? noMatchText : noDataText ?? emptyText }}</slot></div>
      <div v-if="$slots.footer" class="epx-select__footer"><slot name="footer" /></div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { computed, ref, nextTick, useId, watch, useAttrs } from 'vue'
import { useFloating, type FloatingPlacement } from '../../../composables/use-floating'
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
  filterMethod?: (query: string, option: SelectOption) => boolean
  allowCreate?: boolean
  defaultFirstOption?: boolean
  reserveKeyword?: boolean
  collapseTags?: boolean
  collapseTagsTooltip?: boolean
  maxCollapseTags?: number
  automaticDropdown?: boolean
  teleported?: boolean
  appendTo?: string | HTMLElement
  popperClass?: string
  placement?: FloatingPlacement
  offset?: number
  height?: number
  noDataText?: string
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
}>(), { defaultFirstOption: true, reserveKeyword: true, maxCollapseTags: 1, teleported: true, appendTo: 'body', placement: 'bottom-start', offset: 6, height: 280, debounce: 300, multipleLimit: 0, remoteErrorText: '加载失败，请重新搜索', noMatchText: '无匹配选项', options: () => [], size: 'default', placeholder: '请选择', loadingText: '加载中…', emptyText: '暂无选项', clearLabel: 'Clear selection' })
const emit = defineEmits<{
  'update:modelValue': [value: SelectValue | SelectValue[] | undefined]
  change: [value: SelectValue | SelectValue[] | undefined]
  clear: []
  'visible-change': [visible: boolean]
  'remove-tag': [value: SelectValue]
  'remote-error': [error: unknown]
  focus: [event: FocusEvent]
  blur: [event: FocusEvent]
}>()
const attrs = useAttrs()
const inputAttrs = computed(() => Object.fromEntries(Object.entries(attrs).filter(([key]) => key !== 'class' && key !== 'style')))
const composing = ref(false)
const createdOptions = ref<SelectOption[]>([])
const control = ref<HTMLInputElement>()
const anchor = ref<HTMLElement>(), panel = ref<HTMLElement>()
const opened = ref(false), query = ref(''), active = ref(-1)
const listId = `lu-select-${useId()}`
const remoteOptions = ref<SelectOption[]>(props.options), remoteLoading = ref(false), remoteFailed = ref(false)
const sourceOptions = computed(() => {
  const options = props.remoteMethod ? remoteOptions.value : props.options
  return [...options, ...createdOptions.value.filter(created => !options.some(option => option.value === created.value))]
})
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
  const matches = sourceOptions.value.filter(option => props.remoteMethod || !searchable.value || (props.filterMethod ? props.filterMethod(query.value, option) : option.label.toLowerCase().includes(query.value.trim().toLowerCase())))
  const groups = new Map<string, SelectOption[]>()
  matches.forEach(option => { const group = option.group ?? ''; if (!groups.has(group)) groups.set(group, []); groups.get(group)!.push(option) })
  const result = [...groups.values()].flat()
  const text = query.value.trim()
  if (props.allowCreate && searchable.value && text && !sourceOptions.value.some(option => option.label === text || option.value === text)) result.unshift({ label: text, value: text })
  return result
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
const { style } = useFloating(anchor, panel, visible, () => props.placement, () => props.offset)
const panelWidth = ref('280px')
const labelFor = (value: SelectValue) => sourceOptions.value.find(option => option.value === value)?.label ?? labelCache.get(value) ?? String(value)
function toggle() { const wasVisible = visible.value; focus(); if (!wasVisible) open(); else if (!searchable.value) close() }
function close() { opened.value = false; query.value = '' }
function open() {
  if (blocked.value || visible.value) return
  panelWidth.value = `${anchor.value?.getBoundingClientRect?.().width ?? 280}px`
  opened.value = true
  active.value = filtered.value.findIndex(option => !unavailable(option) && values.value.includes(option.value))
  if (active.value < 0) active.value = filtered.value.findIndex(option => !unavailable(option))
}
function choose(option: SelectOption) {
  if (blocked.value || busy.value || unavailable(option)) return
  if (!sourceOptions.value.some(item => item.value === option.value)) createdOptions.value.push(option)
  if (props.multiple) update(values.value.includes(option.value) ? values.value.filter(value => value !== option.value) : [...values.value, option.value])
  else { update(option.value); close() }
  if (props.multiple && !props.reserveKeyword) query.value = ''
  focus()
}
function remove(value: SelectValue) {
  if (blocked.value || sourceOptions.value.find(option => option.value === value)?.disabled) return
  if (!values.value.includes(value)) return
  update(values.value.filter(item => item !== value)); emit('remove-tag', value); focus()
}
function compositionEnd(event: CompositionEvent) { composing.value = false; search(event) }
function search(event: Event) { if (composing.value) return; query.value = (event.target as HTMLInputElement).value; if (!visible.value) open() }
function keydown(event: KeyboardEvent) {
  if (blocked.value || composing.value || event.isComposing) return
  if (event.key === 'Backspace' && props.multiple && !query.value) {
    const value = [...values.value].reverse().find(value => !sourceOptions.value.find(option => option.value === value)?.disabled)
    if (value !== undefined) { event.preventDefault(); remove(value) }
    return
  }
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
    : indices[current < 0 ? (event.key === 'ArrowUp' ? indices.length - 1 : 0) : (current + (event.key === 'ArrowUp' ? -1 : 1) + indices.length) % indices.length] ?? -1
  void nextTick(() => panel.value?.querySelector(`[id="${listId}-${active.value}"]`)?.scrollIntoView?.({ block: 'nearest' }))
}
watch(filtered, options => { active.value = query.value && !props.defaultFirstOption ? -1 : options.findIndex(option => !unavailable(option)) })
watch(blocked, value => { if (value) close() })
watch(visible, (value, _, onCleanup) => {
  emit('visible-change', value)
  if (!value || typeof document === 'undefined') return
  const outside = (event: Event) => {
    if (!anchor.value?.contains(event.target as Node) && !panel.value?.contains(event.target as Node)) close()
  }
  document.addEventListener('pointerdown', outside, true)
  document.addEventListener('focusin', outside, true)
  onCleanup(() => { document.removeEventListener('pointerdown', outside, true); document.removeEventListener('focusin', outside, true) })
})
const values = computed(() => Array.isArray(props.modelValue) ? props.modelValue : props.modelValue === undefined ? [] : [props.modelValue])
const displayedValues = computed(() => props.collapseTags ? values.value.slice(0, Math.max(1, Math.floor(props.maxCollapseTags))) : values.value)
const hiddenValues = computed(() => values.value.slice(displayedValues.value.length))
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
  const nextValues = Array.isArray(value) ? value : value === undefined ? [] : [value]
  if (nextValues.length === values.value.length && nextValues.every((item, index) => item === values.value[index])) return
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
defineExpose({ focus, blur, open, close })
</script>
