<template>
  <span v-bind="$attrs" ref="anchor" class="epx-tooltip" @mouseenter="enter('anchor')" @mouseleave="leave('anchor')"
    @focusin="enter('focus')" @focusout="onBlur" @keydown.esc.stop="dismiss">
    <TooltipTrigger :describedby="isVisible ? id : undefined"><slot /></TooltipTrigger>
  </span>
  <Teleport to="body" :disabled="!teleported">
    <div v-if="isVisible" :id="id" ref="panel" class="epx-tooltip__content" :class="`epx-tooltip__content--${effect}`"
      role="tooltip" :style="style" :data-placement="actualPlacement"
      @mouseenter="enter('panel')" @mouseleave="leave('panel')">
      <slot name="content">{{ content }}</slot>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, ref, useId, useSlots, watch } from 'vue'
import TooltipTrigger from './tooltip-trigger'
import { useFloating } from '../../../composables/use-floating'
import type { FloatingPlacement } from '../../../composables/use-floating'

defineOptions({ name: 'LuTooltip', inheritAttrs: false })
const props = withDefaults(defineProps<{
  content?: string
  placement?: FloatingPlacement
  effect?: 'dark' | 'light'
  disabled?: boolean
  visible?: boolean
  showAfter?: number
  hideAfter?: number
  offset?: number
  teleported?: boolean
}>(), { content: '', placement: 'top', effect: 'dark', visible: undefined, showAfter: 150, hideAfter: 100, offset: 8, teleported: true })
const emit = defineEmits<{ 'update:visible': [value: boolean]; 'visible-change': [value: boolean] }>()
const id = `lu-tooltip-${useId()}`
const slots = useSlots()
const anchor = ref<HTMLElement>(), panel = ref<HTMLElement>()
const internalVisible = ref(false)
const isVisible = computed(() => !props.disabled && !!(props.content || slots.content) && (props.visible ?? internalVisible.value))
const { style, actualPlacement } = useFloating(anchor, panel, isVisible, () => props.placement, () => props.offset)
const active = new Set<string>()
let timer: ReturnType<typeof setTimeout> | undefined
function cancel() { if (timer !== undefined) clearTimeout(timer); timer = undefined }
function setVisible(value: boolean) {
  if (value && props.disabled) return
  if ((props.visible ?? internalVisible.value) === value) return
  if (props.visible === undefined) internalVisible.value = value
  if (props.visible !== value) emit('update:visible', value)
}
function schedule(value: boolean) {
  cancel()
  if (value && props.disabled) return
  const delay = value ? props.showAfter : props.hideAfter
  if (delay <= 0) setVisible(value)
  else timer = setTimeout(() => { timer = undefined; setVisible(value) }, delay)
}
function enter(source: string) { active.add(source); schedule(true) }
function leave(source: string) { active.delete(source); if (!active.size) schedule(false) }
function onBlur(event: FocusEvent) {
  if (event.relatedTarget && anchor.value?.contains(event.relatedTarget as Node)) return
  leave('focus')
}
function dismiss() { cancel(); active.clear(); setVisible(false) }
watch(() => props.disabled, disabled => { if (disabled) dismiss() })
watch(isVisible, value => emit('visible-change', value))
// Hover-only tooltips must also close with Escape when the trigger has no focus.
watch(isVisible, (value, _, onCleanup) => {
  if (!value || typeof document === 'undefined') return
  const onKey = (event: KeyboardEvent) => { if (event.key === 'Escape') dismiss() }
  document.addEventListener('keydown', onKey)
  onCleanup(() => document.removeEventListener('keydown', onKey))
})
onBeforeUnmount(cancel)
</script>
