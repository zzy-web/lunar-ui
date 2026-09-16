<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { acquireViewer, isTopViewer, releaseViewer } from './preview-state'
defineOptions({ name: 'LuImagePreview' })
const props = defineProps<{
  sources: string[]
  initialIndex: number
  infinite: boolean
  hideOnClickModal: boolean
  minScale: number
  maxScale: number
  zoomRate: number
  label: string
  alt: string
}>()
const emit = defineEmits<{ close: []; switch: [index: number] }>()
const id = Symbol('image-viewer')
const panel = ref<HTMLElement>()
const closeButton = ref<HTMLButtonElement>()
const index = ref(0)
const scale = ref(1)
const angle = ref(0)
const x = ref(0), y = ref(0)
const loaded = ref(false), failed = ref(false), attempt = ref(0)
const source = computed(() => props.sources[index.value])
const imageKey = computed(() => JSON.stringify([source.value, index.value, attempt.value]))
const lower = computed(() => Number.isFinite(props.minScale) && props.minScale > 0 ? Math.min(1, props.minScale) : 0.2)
const upper = computed(() => Number.isFinite(props.maxScale) && props.maxScale >= 1 ? props.maxScale : 7)
const rate = computed(() => Number.isFinite(props.zoomRate) && props.zoomRate > 1 ? props.zoomRate : 1.2)
let previousFocus: HTMLElement | null = null
let drag: { pointerId: number; startX: number; startY: number; x: number; y: number; target: HTMLElement } | undefined
function stopDrag() {
  if (drag?.target.hasPointerCapture?.(drag.pointerId)) drag.target.releasePointerCapture(drag.pointerId)
  drag = undefined
}
function reset() { stopDrag(); scale.value = 1; angle.value = 0; x.value = 0; y.value = 0 }
function select(value: number, notify = true) {
  if (!props.sources.length) return emit('close')
  const safe = Number.isFinite(value) ? Math.floor(value) : 0
  const next = Math.min(props.sources.length - 1, Math.max(0, safe))
  if (index.value === next) return
  index.value = next
  if (notify) emit('switch', next)
}
select(props.initialIndex, false)
watch(() => props.sources.slice(), () => select(index.value))
watch(imageKey, () => { loaded.value = false; failed.value = false; reset() })
watch([lower, upper], () => { scale.value = Math.min(upper.value, Math.max(lower.value, scale.value)) })
function move(step: number) {
  const next = index.value + step
  select(props.infinite ? (next + props.sources.length) % props.sources.length : next)
}
function zoom(direction: number) {
  if (!loaded.value) return
  scale.value = Math.min(upper.value, Math.max(lower.value, scale.value * (direction > 0 ? rate.value : 1 / rate.value)))
}
function rotate(direction: number) { if (loaded.value) angle.value = (angle.value + direction * 90) % 360 }
function wheel(event: WheelEvent) { if (event.deltaY) zoom(event.deltaY < 0 ? 1 : -1) }
function startDrag(event: PointerEvent) {
  if (!loaded.value || event.button !== 0) return
  stopDrag()
  const target = event.currentTarget as HTMLElement
  target.setPointerCapture?.(event.pointerId)
  drag = { pointerId: event.pointerId, startX: event.clientX, startY: event.clientY, x: x.value, y: y.value, target }
  event.preventDefault()
}
function moveDrag(event: PointerEvent) {
  if (!drag || event.pointerId !== drag.pointerId) return
  x.value = drag.x + event.clientX - drag.startX
  y.value = drag.y + event.clientY - drag.startY
}
function endDrag(event: PointerEvent) { if (event.pointerId === drag?.pointerId) stopDrag() }
function settle(event: Event, key: string, success: boolean) {
  if (key !== imageKey.value) return
  loaded.value = success
  failed.value = !success
}
function keys(event: KeyboardEvent) {
  if (!isTopViewer(id)) return
  if (event.key === 'Tab') {
    const buttons = Array.from(panel.value?.querySelectorAll<HTMLButtonElement>('button:not(:disabled)') ?? [])
    const current = buttons.indexOf(document.activeElement as HTMLButtonElement)
    if (current < 0 || (event.shiftKey ? current === 0 : current === buttons.length - 1)) {
      event.preventDefault()
      ;(event.shiftKey ? buttons[buttons.length - 1] : buttons[0])?.focus()
    }
    return
  }
  if (event.ctrlKey || event.metaKey || event.altKey) return
  const actions: Record<string, () => void> = { Escape: () => emit('close'), ArrowLeft: () => move(-1), ArrowRight: () => move(1), '+': () => zoom(1), '=': () => zoom(1), '-': () => zoom(-1), '0': reset, r: () => rotate(1), R: () => rotate(-1) }
  if (actions[event.key]) { event.preventDefault(); event.stopPropagation(); actions[event.key]() }
}
onMounted(() => {
  if (typeof document === 'undefined') return
  previousFocus = document.activeElement as HTMLElement | null
  acquireViewer(id)
  document.addEventListener('keydown', keys)
  nextTick(() => closeButton.value?.focus())
})
onBeforeUnmount(() => {
  stopDrag()
  if (typeof document === 'undefined') return
  const restore = isTopViewer(id)
  document.removeEventListener('keydown', keys)
  releaseViewer(id)
  if (restore && previousFocus?.isConnected) previousFocus.focus()
})
</script>

<template>
  <Teleport to="body">
    <div ref="panel" class="epx-image-preview" role="dialog" aria-modal="true" :aria-label="label" @click.self="hideOnClickModal && emit('close')">
      <button ref="closeButton" class="epx-image-preview__close" type="button" aria-label="Close preview" @click="emit('close')">×</button>
      <div class="epx-image-preview__stage" @click.self="hideOnClickModal && emit('close')" @wheel.prevent="wheel">
        <template v-for="key in [imageKey]" :key="key">
          <img v-if="source && !failed" class="epx-image-preview__image" :class="{ 'is-loading': !loaded }" :src="source" :alt="alt" draggable="false" :style="{ transform: `translate(${x}px, ${y}px) rotate(${angle}deg) scale(${scale})` }" @load="settle($event, key, true)" @error="settle($event, key, false)" @pointerdown="startDrag" @pointermove="moveDrag" @pointerup="endDrag" @pointercancel="endDrag" @lostpointercapture="endDrag" />
        </template>
        <div v-if="failed" class="epx-image-preview__message" role="status">Image unavailable <button type="button" @click="attempt++">Retry</button></div>
        <div v-else-if="!loaded" class="epx-image-preview__message" role="status">Loading…</div>
      </div>
      <button v-if="sources.length > 1" class="epx-image-preview__previous" type="button" aria-label="Previous image" :disabled="!infinite && index === 0" @click="move(-1)">‹</button>
      <button v-if="sources.length > 1" class="epx-image-preview__next" type="button" aria-label="Next image" :disabled="!infinite && index === sources.length - 1" @click="move(1)">›</button>
      <div class="epx-image-preview__toolbar" role="group" aria-label="Image controls">
        <button type="button" aria-label="Zoom out" :disabled="!loaded || scale <= lower" @click="zoom(-1)">−</button>
        <span class="epx-image-preview__scale">{{ Math.round(scale * 100) }}%</span>
        <button type="button" aria-label="Zoom in" :disabled="!loaded || scale >= upper" @click="zoom(1)">+</button>
        <button type="button" aria-label="Rotate left" :disabled="!loaded" @click="rotate(-1)">↶</button>
        <button type="button" aria-label="Rotate right" :disabled="!loaded" @click="rotate(1)">↷</button>
        <button type="button" aria-label="Reset image" :disabled="!loaded" @click="reset">↺</button>
        <span class="epx-image-preview__count" aria-live="polite">{{ index + 1 }} / {{ sources.length }}</span>
      </div>
    </div>
  </Teleport>
</template>
