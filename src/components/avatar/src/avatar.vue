<template>
  <span class="epx-avatar" :class="[`epx-avatar--${shape}`, typeof size === 'string' ? `epx-avatar--${size}` : '']"
    :style="typeof size === 'number' ? { width: `${Math.max(0, size)}px`, height: `${Math.max(0, size)}px` } : undefined"
    :role="!src || failed ? 'img' : undefined" :aria-label="!src || failed ? alt || undefined : undefined">
    <img v-if="src && !failed" :key="src + srcSet" :src="src" :srcset="srcSet" :alt="alt" :style="{ objectFit: fit }" @error="onError" @load="emit('load', $event)" />
    <slot v-else>?</slot>
  </span>
</template>
<script setup lang="ts">
import { ref, watch } from 'vue'
defineOptions({ name: 'LuAvatar' })
const props = withDefaults(defineProps<{
  src?: string
  srcSet?: string
  alt?: string
  size?: number | 'large' | 'default' | 'small'
  shape?: 'circle' | 'square'
  fit?: 'fill' | 'contain' | 'cover' | 'none' | 'scale-down'
}>(), { src: '', srcSet: '', alt: '', size: 'default', shape: 'circle', fit: 'cover' })
const emit = defineEmits<{ error: [event: Event]; load: [event: Event] }>()
const failed = ref(false)
watch([() => props.src, () => props.srcSet], () => { failed.value = false })
function onError(event: Event) { failed.value = true; emit('error', event) }
</script>
