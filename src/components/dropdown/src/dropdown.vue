<template>
  <span class="epx-dropdown">
    <button v-bind="$attrs" :id="triggerId" ref="anchor" class="epx-button epx-dropdown__trigger" :class="[`epx-button--${size}`, { 'is-disabled': disabled }]"
      type="button" :disabled="disabled" aria-haspopup="menu" :aria-controls="isVisible ? menuId : undefined"
      :aria-expanded="isVisible" @click="toggle" @keydown="triggerKeydown">
      <slot>{{ label }}</slot>
      <svg class="epx-dropdown__arrow" viewBox="0 0 16 16" aria-hidden="true"><path d="m4 6 4 4 4-4" /></svg>
    </button>
  </span>
  <Teleport to="body" :disabled="!teleported">
    <div v-if="isVisible" :id="menuId" ref="panel" class="epx-dropdown__menu" :class="`epx-dropdown__menu--${size}`"
      role="menu" :aria-labelledby="triggerId" tabindex="-1" :style="style" :data-placement="actualPlacement" @keydown="menuKeydown">
      <template v-for="option in options" :key="option.command">
        <div v-if="option.divided" class="epx-dropdown__divider" role="separator" />
        <button :ref="element => setItem(option.command, element)" type="button" role="menuitem" tabindex="-1"
          class="epx-dropdown__item" :class="{ 'is-danger': option.danger }" :disabled="option.disabled" :aria-disabled="option.disabled || undefined"
          @focus="activeCommand = option.command" @click="select(option)">
          <slot name="item" :option="option">{{ option.label }}</slot>
        </button>
      </template>
      <div v-if="!options.length" class="epx-dropdown__empty"><slot name="empty">{{ emptyText }}</slot></div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { computed, nextTick, ref, useId, watch } from 'vue'
import type { ComponentPublicInstance } from 'vue'
import { useFloating } from '../../../composables/use-floating'
import type { FloatingPlacement } from '../../../composables/use-floating'
import type { DropdownOption } from './types'

defineOptions({ name: 'LuDropdown', inheritAttrs: false })
const props = withDefaults(defineProps<{
  options?: DropdownOption[]
  label?: string
  disabled?: boolean
  visible?: boolean
  hideOnClick?: boolean
  placement?: FloatingPlacement
  size?: 'small' | 'default' | 'large'
  offset?: number
  teleported?: boolean
  emptyText?: string
}>(), { options: () => [], label: 'Actions', visible: undefined, hideOnClick: true, placement: 'bottom-start', size: 'default', offset: 6, teleported: true, emptyText: 'No actions' })
const emit = defineEmits<{
  'update:visible': [value: boolean]
  'visible-change': [value: boolean]
  command: [command: string | number, option: DropdownOption]
}>()
const id = useId(), triggerId = `lu-dropdown-trigger-${id}`, menuId = `lu-dropdown-menu-${id}`
const anchor = ref<HTMLElement>(), panel = ref<HTMLElement>()
const internalVisible = ref(false)
const isVisible = computed(() => !props.disabled && (props.visible ?? internalVisible.value))
const { style, actualPlacement } = useFloating(anchor, panel, isVisible, () => props.placement, () => props.offset)
const items = new Map<string | number, HTMLElement>()
const activeCommand = ref<string | number | null>(null)
const enabledOptions = computed(() => props.options.filter(option => !option.disabled))
let openAtEnd = false
function setItem(command: string | number, element: Element | ComponentPublicInstance | null) {
  if (element) items.set(command, element as HTMLElement)
  else items.delete(command)
}
function setVisible(value: boolean) {
  if (value && props.disabled) return
  if ((props.visible ?? internalVisible.value) === value) return
  if (props.visible === undefined) internalVisible.value = value
  if (props.visible !== value) emit('update:visible', value)
}
function focusItem(index: number) {
  const option = enabledOptions.value[index]
  if (option) items.get(option.command)?.focus()
  else panel.value?.focus()
}
function handleOpen() { openAtEnd = false; setVisible(true) }
function handleClose() { setVisible(false); anchor.value?.focus() }
function toggle() { if (isVisible.value) setVisible(false); else handleOpen() }
function triggerKeydown(event: KeyboardEvent) {
  if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
    event.preventDefault()
    openAtEnd = event.key === 'ArrowUp'
    if (isVisible.value) focusItem(openAtEnd ? enabledOptions.value.length - 1 : 0)
    else setVisible(true)
  } else if (event.key === 'Escape' && isVisible.value) {
    event.preventDefault(); handleClose()
  }
}
function menuKeydown(event: KeyboardEvent) {
  const options = enabledOptions.value
  const index = options.findIndex(option => items.get(option.command) === event.target)
  switch (event.key) {
    case 'ArrowDown': event.preventDefault(); focusItem((index + 1) % options.length); break
    case 'ArrowUp': event.preventDefault(); focusItem((index - 1 + options.length) % options.length); break
    case 'Home': event.preventDefault(); focusItem(0); break
    case 'End': event.preventDefault(); focusItem(options.length - 1); break
    case 'Escape': event.preventDefault(); event.stopPropagation(); handleClose(); break
    // Restore the trigger synchronously so the browser's native Tab traversal resumes there.
    case 'Tab': handleClose(); break
  }
}
function select(option: DropdownOption) {
  if (props.disabled || option.disabled) return
  emit('command', option.command, option)
  if (props.hideOnClick) handleClose()
}
watch(isVisible, async (value, previous, onCleanup) => {
  if (previous !== undefined) emit('visible-change', value)
  if (!value) return
  let stopped = false
  const outside = (event: Event) => {
    const target = event.target as Node
    if (!anchor.value?.contains(target) && !panel.value?.contains(target)) setVisible(false)
  }
  if (typeof document !== 'undefined') {
    document.addEventListener('pointerdown', outside, true)
    document.addEventListener('focusin', outside, true)
  }
  onCleanup(() => {
    stopped = true
    if (typeof document !== 'undefined') {
      document.removeEventListener('pointerdown', outside, true)
      document.removeEventListener('focusin', outside, true)
    }
  })
  await nextTick()
  // Positioning reveals the panel in a separate render; hidden elements cannot receive focus.
  await nextTick()
  if (!stopped && isVisible.value) focusItem(openAtEnd ? enabledOptions.value.length - 1 : 0)
}, { flush: 'post', immediate: true })
watch(() => props.disabled, value => { if (value) setVisible(false) })
watch(enabledOptions, options => {
  if (isVisible.value && activeCommand.value != null && !options.some(option => option.command === activeCommand.value)) focusItem(0)
}, { flush: 'post' })
defineExpose({ handleOpen, handleClose })
</script>
