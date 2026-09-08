<template>
  <Teleport to="body">
    <Transition name="epx-dialog-fade" @after-leave="emit('closed')">
      <div v-if="modelValue" class="epx-overlay" @click="handleOverlayClick">
        <div
          class="epx-dialog"
          :class="dialogClass"
          :style="{ width }"
          role="dialog"
          aria-modal="true"
          :aria-label="title || undefined"
          @click.stop
        >
          <header v-if="$slots.header || title || showClose" class="epx-dialog__header">
            <slot name="header">
              <span class="epx-dialog__title">{{ title }}</span>
            </slot>
            <button v-if="showClose" class="epx-dialog__close" type="button" aria-label="Close" @click="close">x</button>
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
import { computed, onBeforeUnmount, watch } from 'vue'

defineOptions({ name: 'EpxDialog' })

const props = withDefaults(defineProps<{
  modelValue: boolean
  title?: string
  width?: string
  closeOnClickModal?: boolean
  closeOnPressEscape?: boolean
  showClose?: boolean
  center?: boolean
}>(), {
  width: '50%',
  closeOnClickModal: true,
  closeOnPressEscape: true,
  showClose: true
})

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
  open: []
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
    emit('open')
    document.addEventListener('keydown', handleKeydown)
    return
  }
  document.removeEventListener('keydown', handleKeydown)
})

onBeforeUnmount(() => document.removeEventListener('keydown', handleKeydown))
</script>
