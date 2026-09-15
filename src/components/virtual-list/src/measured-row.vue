<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref, watch } from 'vue'
const props = defineProps<{ measurementVersion: number }>()
defineOptions({ name: 'LuVirtualListMeasuredRow' })
const emit = defineEmits<{ resize: [height: number] }>()
const element = ref<HTMLElement>()
let observer: ResizeObserver | undefined
function measure() {
  const height = element.value?.getBoundingClientRect?.().height
  if (height && Number.isFinite(height)) emit('resize', height)
}
onMounted(() => {
  measure()
  if (typeof ResizeObserver !== 'undefined' && element.value) {
    observer = new ResizeObserver(measure)
    observer.observe(element.value)
  }
})
onBeforeUnmount(() => observer?.disconnect())
watch(() => props.measurementVersion, measure, { flush: 'post' })
</script>

<template><div ref="element" class="epx-virtual-list__item epx-virtual-list__item--dynamic"><slot /></div></template>
