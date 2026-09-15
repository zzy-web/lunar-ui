<script setup lang="ts">
import { computed, onBeforeUnmount, provide, ref, watch } from 'vue'
import { collapseKey } from './tokens'
import type { CollapseName, CollapseValue } from './tokens'

defineOptions({ name: 'LuCollapse' })
const props = withDefaults(defineProps<{
  modelValue?: CollapseValue
  accordion?: boolean
  disabled?: boolean
  expandIconPosition?: 'left' | 'right'
  beforeCollapse?: (name: CollapseName, expanded: boolean) => boolean | void | Promise<boolean | void>
}>(), { expandIconPosition: 'right' })
const emit = defineEmits<{
  'update:modelValue': [value: CollapseValue]
  change: [value: CollapseValue]
  'collapse-error': [error: unknown]
}>()
const root = ref<HTMLElement>()
const internal = ref<CollapseValue>([])
const pending = ref<CollapseName>()
let version = 0
const activeNames = computed(() => {
  const value = props.modelValue === undefined ? internal.value : props.modelValue
  const names = value === null ? [] : Array.isArray(value) ? [...new Set(value)] : [value]
  return props.accordion ? names.slice(0, 1) : names
})
function invalidate() { version++; pending.value = undefined }
watch(() => [props.modelValue, props.accordion, props.disabled], invalidate, { deep: true, flush: 'sync' })
async function toggle(name: CollapseName, available: () => boolean) {
  if (props.disabled || pending.value !== undefined || !available()) return
  const expanded = !activeNames.value.includes(name)
  const request = ++version
  if (props.beforeCollapse) {
    pending.value = name
    try {
      const allowed = await props.beforeCollapse(name, expanded)
      if (allowed === false || request !== version) return
    } catch (error) {
      if (request === version) emit('collapse-error', error)
      return
    } finally { if (request === version) pending.value = undefined }
  }
  if (request !== version || props.disabled || !available()) return
  const next: CollapseValue = props.accordion ? (expanded ? name : null)
    : expanded ? [...activeNames.value, name] : activeNames.value.filter(value => value !== name)
  if (props.modelValue === undefined) internal.value = next
  emit('update:modelValue', next)
  emit('change', next)
}
provide(collapseKey, {
  get activeNames() { return activeNames.value },
  get disabled() { return props.disabled },
  get pending() { return pending.value },
  get expandIconPosition() { return props.expandIconPosition },
  toggle, invalidate
})
function navigate(event: KeyboardEvent) {
  if (props.disabled || !['ArrowDown', 'ArrowUp', 'Home', 'End'].includes(event.key)) return
  const target = event.target as HTMLElement
  if (!target.matches('.epx-collapse__header') || target.closest('.epx-collapse') !== root.value) return
  const buttons = Array.from(root.value?.querySelectorAll<HTMLButtonElement>('.epx-collapse__header:not(:disabled)') ?? [])
    .filter(button => button.closest('.epx-collapse') === root.value)
  const current = buttons.indexOf(target as HTMLButtonElement)
  if (current < 0) return
  event.preventDefault()
  const next = event.key === 'Home' ? 0 : event.key === 'End' ? buttons.length - 1 : (current + (event.key === 'ArrowDown' ? 1 : -1) + buttons.length) % buttons.length
  buttons[next]?.focus()
}
onBeforeUnmount(invalidate)
defineExpose({ activeNames })
</script>

<template>
  <div ref="root" class="epx-collapse" :class="{ 'is-disabled': disabled }" :aria-busy="pending !== undefined" @keydown="navigate"><slot /></div>
</template>
