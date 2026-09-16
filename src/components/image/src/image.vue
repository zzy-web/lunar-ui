<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import ImagePreview from './image-preview.vue'
defineOptions({ name: 'LuImage' })
const props = withDefaults(defineProps<{
  src?: string
  srcSet?: string
  sizes?: string
  alt?: string
  fit?: 'fill' | 'contain' | 'cover' | 'none' | 'scale-down'
  lazy?: boolean
  width?: string | number
  height?: string | number
  errorText?: string
  preview?: boolean
  previewSrcList?: string[]
  initialIndex?: number
  infinite?: boolean
  hideOnClickModal?: boolean
  minScale?: number
  maxScale?: number
  zoomRate?: number
  previewLabel?: string
}>(), { src: '', alt: '', fit: 'fill', errorText: 'Image unavailable', previewSrcList: () => [], initialIndex: 0, infinite: true, hideOnClickModal: false, minScale: 0.2, maxScale: 7, zoomRate: 1.2, previewLabel: 'Image preview' })
const emit = defineEmits<{ load: [event: Event]; error: [event: Event]; show: []; close: []; switch: [index: number] }>()
const visible = ref(false)
const previewIndex = ref(0)
const currentSource = ref('')
const sources = computed(() => props.previewSrcList.length ? props.previewSrcList.filter(Boolean) : props.preview && (currentSource.value || props.src) ? [currentSource.value || props.src] : [])
function showPreview(index = props.initialIndex) {
  if (!sources.value.length || visible.value) return
  previewIndex.value = Number.isFinite(index) ? Math.min(sources.value.length - 1, Math.max(0, Math.floor(index))) : 0
  visible.value = true
  emit('show')
}
function closePreview() {
  if (!visible.value) return
  visible.value = false
  emit('close')
}
watch(sources, value => { if (!value.length) closePreview() })
const failed = ref(false)
const loaded = ref(false)
const attempt = ref(0)
const sourceKey = computed(() => JSON.stringify([props.src, props.srcSet, props.sizes, attempt.value]))
watch(sourceKey, () => { failed.value = false; loaded.value = false; currentSource.value = '' }, { flush: 'sync' })
const dimension = (value?: string | number) => typeof value === 'number' ? `${Number.isFinite(value) ? Math.max(0, value) : 0}px` : value
function settle(event: Event, key: string, success: boolean) {
  if (key !== sourceKey.value) return
  loaded.value = success
  failed.value = !success
  if (success) currentSource.value = (event.target as HTMLImageElement | null)?.currentSrc || props.src
  if (success) emit('load', event)
  else emit('error', event)
}
function retry() { attempt.value++ }
defineExpose({ retry, showPreview, closePreview })
</script>

<template>
  <div class="epx-image" :style="{ width: dimension(width), height: dimension(height) }" :aria-busy="!!(src || srcSet) && !loaded && !failed">
    <template v-for="key in [sourceKey]" :key="key">
      <img v-if="(src || srcSet) && !failed" class="epx-image__inner" :class="{ 'is-loading': !loaded }" :src="src || undefined" :srcset="srcSet" :sizes="sizes" :alt="alt" :loading="lazy ? 'lazy' : 'eager'" decoding="async" :style="{ objectFit: fit }" @load="settle($event, key, true)" @error="settle($event, key, false)" />
    </template>
    <div v-if="failed || !(src || srcSet)" class="epx-image__error">
      <slot name="error" :retry="retry"><span role="img" :aria-label="alt || errorText">{{ errorText }}</span></slot>
    </div>
    <div v-else-if="!loaded" class="epx-image__placeholder"><slot name="placeholder"><span aria-hidden="true">…</span></slot></div>
    <button v-if="sources.length && loaded && !failed" class="epx-image__preview-trigger" type="button" aria-haspopup="dialog" :aria-label="previewLabel" @click="showPreview()"><slot name="preview-icon"><span aria-hidden="true">⊕</span></slot></button>
    <ImagePreview v-if="visible" :sources="sources" :initial-index="previewIndex" :infinite="infinite" :hide-on-click-modal="hideOnClickModal" :min-scale="minScale" :max-scale="maxScale" :zoom-rate="zoomRate" :label="previewLabel" :alt="alt" @close="closePreview" @switch="emit('switch', $event)" />
  </div>
</template>
