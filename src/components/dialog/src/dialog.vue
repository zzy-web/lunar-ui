<template>
  <Teleport to="body">
    <Transition name="epx-dialog-fade" @after-enter="emit('opened')" @after-leave="handleAfterLeave">
      <div
        v-if="shouldRender"
        v-show="modelValue"
        class="epx-overlay"
        :class="{ 'is-transparent': !modal }"
        @click="handleOverlayClick"
      >
        <div
          class="epx-dialog"
          :class="dialogClass"
          :style="{ width, marginTop: top }"
          role="dialog"
          aria-modal="true"
          :aria-label="!title ? ariaLabel : undefined"
          :aria-labelledby="title ? titleId : undefined"
          @click.stop
        >
          <header v-if="$slots.header || title || showClose" class="epx-dialog__header">
            <slot name="header">
              <span :id="titleId" class="epx-dialog__title">{{ title }}</span>
            </slot>
            <button v-if="showClose" ref="closeButtonRef" class="epx-dialog__close" type="button" aria-label="Close" @click="close">&times;</button>
          </header>
          <div class="epx-dialog__body">
            <slot />
          </div>
          <footer v-if="$slots.footer" class="epx-dialog__footer">
            <slot name="footer" />
          </footer>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, ref, watch } from 'vue'
import { acquireBodyScrollLock } from '../../../utils/body-scroll-lock'

defineOptions({ name: 'LuDialog' })

const titleId = `epx-dialog-title-${Math.random().toString(36).slice(2, 9)}`
const closeButtonRef = ref<HTMLButtonElement>()
const shouldRender = ref(false)
const isClient = typeof document !== 'undefined'
let releaseBodyScroll: (() => void) | undefined

const props = withDefaults(defineProps<{
  modelValue: boolean
  title?: string
  ariaLabel?: string
  width?: string
  top?: string
  modal?: boolean
  lockScroll?: boolean
  closeOnClickModal?: boolean
  closeOnPressEscape?: boolean
  showClose?: boolean
  center?: boolean
  destroyOnClose?: boolean
}>(), {
  width: '50%',
  top: '15vh',
  modal: true,
  lockScroll: true,
  closeOnClickModal: true,
  closeOnPressEscape: true,
  showClose: true,
  destroyOnClose: false
})

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
  open: []
  opened: []
  close: []
  closed: []
}>()

const dialogClass = computed(() => [{ 'is-center': props.center }])

function close() {
  emit('update:modelValue', false)
  emit('close')
}

function handleOverlayClick() {
  if (props.closeOnClickModal) close()
}

function handleKeydown(event: KeyboardEvent) {
  if (event.key === 'Escape' && props.closeOnPressEscape && props.modelValue) close()
}

watch(() => props.modelValue, (visible) => {
  if (visible) {
    shouldRender.value = true
    emit('open')
    if (isClient) document.addEventListener('keydown', handleKeydown)
    nextTick(() => closeButtonRef.value?.focus())
    return
  }
  if (isClient) document.removeEventListener('keydown', handleKeydown)
}, { immediate: true })

watch(() => props.modelValue && props.lockScroll, (locked) => {
  if (locked) releaseBodyScroll ??= acquireBodyScrollLock()
  else unlockBodyScroll()
}, { immediate: true })

function unlockBodyScroll() {
  releaseBodyScroll?.()
  releaseBodyScroll = undefined
}

function handleAfterLeave() {
  if (props.destroyOnClose) shouldRender.value = false
  emit('closed')
}

onBeforeUnmount(() => {
  if (isClient) document.removeEventListener('keydown', handleKeydown)
  unlockBodyScroll()
})
</script>
