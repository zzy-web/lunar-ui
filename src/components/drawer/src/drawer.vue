<script setup lang="ts">
import { nextTick, onBeforeUnmount, ref, useId, watch } from 'vue'
import { acquireBodyScrollLock } from '../../../utils/body-scroll-lock'

defineOptions({ name: 'LuDrawer', inheritAttrs: false })
const props = withDefaults(defineProps<{
  modelValue: boolean
  title?: string
  ariaLabel?: string
  closeLabel?: string
  direction?: 'left' | 'right' | 'top' | 'bottom'
  size?: string
  closeOnPressEscape?: boolean
  closeOnClickModal?: boolean
  showClose?: boolean
  lockScroll?: boolean
  destroyOnClose?: boolean
}>(), {
  direction: 'right', size: 'min(420px, 100%)', ariaLabel: 'Drawer', closeLabel: 'Close',
  closeOnPressEscape: true, closeOnClickModal: true, showClose: true, lockScroll: true
})
const emit = defineEmits<{
  'update:modelValue': [value: boolean]
  open: []
  close: []
}>()
const titleId = useId()
const panel = ref<HTMLElement>()
const closeButton = ref<HTMLButtonElement>()
const rendered = ref(props.modelValue)
let trigger: HTMLElement | undefined
let unlock: (() => void) | undefined

function close() { emit('update:modelValue', false) }
function afterLeave() {
  if (props.destroyOnClose && !props.modelValue) rendered.value = false
}
function keydown(event: KeyboardEvent) {
  if (event.defaultPrevented) return
  if (event.key === 'Escape' && props.closeOnPressEscape) {
    event.preventDefault()
    event.stopPropagation()
    close()
  }
  if (event.key !== 'Tab' || !panel.value) return
  const controls = Array.from(panel.value.querySelectorAll<HTMLElement>(
    'a[href], button, input, select, textarea, [tabindex], [contenteditable="true"]'
  )).filter(el => el.tabIndex >= 0 && !el.matches(':disabled') && !el.closest('[inert]') && el.getClientRects().length)
  const active = document.activeElement
  const index = controls.findIndex(el => el === active)
  if (index < 0 || (event.shiftKey ? index === 0 : index === controls.length - 1)) {
    event.preventDefault()
    const next = event.shiftKey ? controls[controls.length - 1] : controls[0]
    const target = next ?? panel.value
    target.focus()
  }
}
function restoreFocus() {
  const target = trigger
  trigger = undefined
  if (target?.isConnected) target.focus()
}
watch(() => props.modelValue, async (visible, previous, onCleanup) => {
  let current = true
  onCleanup(() => { current = false })
  if (visible) {
    rendered.value = true
    if (typeof HTMLElement !== 'undefined' && document.activeElement instanceof HTMLElement) trigger = document.activeElement
    emit('open')
    await nextTick()
    if (current) (closeButton.value ?? panel.value)?.focus()
  } else if (previous) {
    emit('close')
    await nextTick()
    if (current) restoreFocus()
  }
}, { immediate: true })
watch(() => props.modelValue && props.lockScroll, (locked) => {
  if (locked) unlock ??= acquireBodyScrollLock()
  else { unlock?.(); unlock = undefined }
}, { immediate: true })
onBeforeUnmount(() => { unlock?.(); if (props.modelValue) restoreFocus() })
</script>

<template>
  <Teleport to="body">
    <Transition name="epx-drawer" @after-leave="afterLeave">
      <div v-if="rendered" v-show="modelValue" class="epx-drawer-overlay" :class="'is-' + direction"
        @click.self="closeOnClickModal && close()">
        <section v-bind="$attrs" ref="panel" class="epx-drawer-panel" role="dialog" aria-modal="true" tabindex="-1"
          :aria-labelledby="title ? titleId : undefined" :aria-label="title ? undefined : ariaLabel"
          :style="{ '--epx-drawer-size': size }" @keydown="keydown">
          <header v-if="title || $slots.header || showClose" class="epx-dialog__header">
            <div :id="titleId" class="epx-dialog__title"><slot name="header">{{ title }}</slot></div>
            <button v-if="showClose" ref="closeButton" class="epx-dialog__close" type="button" :aria-label="closeLabel" @click="close">×</button>
          </header>
          <div class="epx-drawer-body epx-dialog__body"><slot /></div>
          <footer v-if="$slots.footer" class="epx-dialog__footer"><slot name="footer" :close="close" /></footer>
        </section>
      </div>
    </Transition>
  </Teleport>
</template>
