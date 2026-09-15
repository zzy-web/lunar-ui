<script setup lang="ts">
import { computed, ref, watch } from 'vue'
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
}>(), { src: '', alt: '', fit: 'fill', errorText: 'Image unavailable' })
const emit = defineEmits<{ load: [event: Event]; error: [event: Event] }>()
const failed = ref(false)
const loaded = ref(false)
const attempt = ref(0)
const sourceKey = computed(() => JSON.stringify([props.src, props.srcSet, props.sizes, attempt.value]))
watch(sourceKey, () => { failed.value = false; loaded.value = false }, { flush: 'sync' })
const dimension = (value?: string | number) => typeof value === 'number' ? `${Number.isFinite(value) ? Math.max(0, value) : 0}px` : value
function settle(event: Event, key: string, success: boolean) {
  if (key !== sourceKey.value) return
  loaded.value = success
  failed.value = !success
  if (success) emit('load', event)
  else emit('error', event)
}
function retry() { attempt.value++ }
defineExpose({ retry })
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
  </div>
</template>
