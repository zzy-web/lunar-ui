<template>
  <Teleport to="body">
    <div v-if="modelValue && currentStep" class="epx-tour">
      <div class="epx-tour__mask" @click="handleMaskClick" />
      <div v-if="targetRect" class="epx-tour__target" :style="targetStyle" />
      <section class="epx-tour__panel" :style="panelStyle" role="dialog" :aria-label="currentStep.title || 'Tour'">
        <header class="epx-tour__header">
          <h3 class="epx-tour__title">{{ currentStep.title }}</h3>
          <button class="epx-tour__close" type="button" aria-label="Close" @click="close">&times;</button>
        </header>
        <div class="epx-tour__body">{{ currentStep.description }}</div>
        <footer class="epx-tour__footer">
          <span class="epx-tour__progress">{{ current + 1 }} / {{ steps.length }}</span>
          <div class="epx-tour__actions">
            <button class="epx-tour__button" type="button" :disabled="current === 0" @click="prev">{{ prevText }}</button>
            <button class="epx-tour__button epx-tour__button--primary" type="button" @click="next">
              {{ current === steps.length - 1 ? finishText : nextText }}
            </button>
          </div>
        </footer>
      </section>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, ref, watch } from 'vue'
import type { CSSProperties } from 'vue'

defineOptions({ name: 'LuTour' })

export type TourStep = {
  target?: string | HTMLElement
  title?: string
  description?: string
}

const props = withDefaults(defineProps<{
  modelValue: boolean
  steps: TourStep[]
  current?: number
  closeOnClickMask?: boolean
  prevText?: string
  nextText?: string
  finishText?: string
}>(), {
  current: 0,
  closeOnClickMask: false,
  prevText: 'Previous',
  nextText: 'Next',
  finishText: 'Finish'
})

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
  'update:current': [value: number]
  close: []
  finish: []
}>()

const isClient = typeof window !== 'undefined'
const targetRect = ref<DOMRect | null>(null)

const currentStep = computed(() => props.steps[props.current])
const current = computed(() => Math.min(Math.max(props.current, 0), Math.max(props.steps.length - 1, 0)))

const targetStyle = computed<CSSProperties>(() => {
  if (!targetRect.value) return {}
  return {
    top: `${targetRect.value.top - 4}px`,
    left: `${targetRect.value.left - 4}px`,
    width: `${targetRect.value.width + 8}px`,
    height: `${targetRect.value.height + 8}px`
  }
})

const panelStyle = computed<CSSProperties>(() => {
  const rect = targetRect.value
  if (!rect) return { top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }
  const top = rect.bottom + 14
  const left = Math.min(Math.max(rect.left, 16), window.innerWidth - 336)
  return { top: `${top}px`, left: `${left}px` }
})

watch(() => [props.modelValue, props.current, props.steps], () => updateTarget(), { deep: true, immediate: true })

function updateTarget() {
  if (!isClient || !props.modelValue) return
  nextTick(() => {
    const target = currentStep.value?.target
    const element = typeof target === 'string' ? document.querySelector(target) : target
    targetRect.value = element instanceof HTMLElement ? element.getBoundingClientRect() : null
  })
}

function prev() {
  if (current.value > 0) emit('update:current', current.value - 1)
}

function next() {
  if (current.value >= props.steps.length - 1) {
    emit('finish')
    close()
    return
  }
  emit('update:current', current.value + 1)
}

function close() {
  emit('update:modelValue', false)
  emit('close')
}

function handleMaskClick() {
  if (props.closeOnClickMask) close()
}

if (isClient) {
  window.addEventListener('resize', updateTarget)
  window.addEventListener('scroll', updateTarget, true)
}

onBeforeUnmount(() => {
  if (!isClient) return
  window.removeEventListener('resize', updateTarget)
  window.removeEventListener('scroll', updateTarget, true)
})
</script>
