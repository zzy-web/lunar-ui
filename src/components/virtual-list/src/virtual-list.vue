<script setup lang="ts" generic="T">
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import MeasuredRow from './measured-row.vue'
defineOptions({ name: 'LuVirtualList' })
const props = withDefaults(defineProps<{
  items?: T[]
  height?: number
  itemHeight?: number
  dynamic?: boolean
  overscan?: number
  itemKey?: keyof T | ((item: T, index: number) => string | number)
  label?: string
}>(), { items: () => [], height: 300, itemHeight: 40, overscan: 3, label: 'Virtual list' })
const emit = defineEmits<{
  scroll: [offset: number]
  rangeChange: [range: { start: number; end: number }]
}>()
defineSlots<{ default?(props: { item: T; index: number }): unknown; empty?(): unknown }>()
const viewport = ref<HTMLElement>()
const offset = ref(0)
const positive = (value: number, fallback: number) => Number.isFinite(value) && value > 0 ? value : fallback
const viewportHeight = computed(() => positive(props.height, 300))
const rowHeight = computed(() => positive(props.itemHeight, 40))
const buffer = computed(() => Number.isFinite(props.overscan) ? Math.max(0, Math.floor(props.overscan)) : 3)
const heights = new Map<string | number, number>()
const revision = ref(0)
const measurementVersion = ref(0)
const layout = computed(() => {
  revision.value
  if (!props.dynamic) return { keys: [] as (string | number)[], positions: [] as number[] }
  const keys = props.items.map(keyFor)
  const positions = [0]
  for (const key of keys) positions.push(positions[positions.length - 1] + (heights.get(key) ?? rowHeight.value))
  return { keys, positions }
})
const position = (index: number) => props.dynamic ? layout.value.positions[index] ?? 0 : index * rowHeight.value
const totalHeight = computed(() => props.dynamic ? layout.value.positions[layout.value.positions.length - 1] ?? 0 : props.items.length * rowHeight.value)
const maxOffset = computed(() => Math.max(0, totalHeight.value - viewportHeight.value))
const clamp = (value: number) => Math.min(maxOffset.value, Math.max(0, Number.isFinite(value) ? value : 0))
function indexAt(value: number, positions = layout.value.positions) {
  let low = 0, high = positions.length - 1
  while (low < high) {
    const middle = Math.ceil((low + high) / 2)
    if (positions[middle] <= value) low = middle
    else high = middle - 1
  }
  return low
}
const start = computed(() => Math.max(0, (props.dynamic ? indexAt(clamp(offset.value)) : Math.floor(clamp(offset.value) / rowHeight.value)) - buffer.value))
const end = computed(() => {
  const bottom = clamp(offset.value) + viewportHeight.value
  const index = props.dynamic ? indexAt(bottom) : 0
  return Math.min(props.items.length, (props.dynamic ? index + (position(index) < bottom ? 1 : 0) : Math.ceil(bottom / rowHeight.value)) + buffer.value)
})
const visible = computed(() => props.items.slice(start.value, end.value).map((item, index) => ({ item, index: index + start.value })))
function keyFor(item: T, index: number): string | number {
  const key = typeof props.itemKey === 'function' ? props.itemKey(item, index) : props.itemKey !== undefined ? item[props.itemKey] : index
  return typeof key === 'string' || typeof key === 'number' ? key : index
}
function scrollTo(value: number) {
  target = undefined
  setOffset(value)
}
function setOffset(value: number) {
  offset.value = clamp(value)
  if (viewport.value) viewport.value.scrollTop = offset.value
}
let target: { key: string | number; align: 'start' | 'center' | 'end' | 'auto' } | undefined
function scrollToIndex(index: number, align: 'start' | 'center' | 'end' | 'auto' = 'start') {
  if (!props.items.length) return scrollTo(0)
  const safeIndex = Math.min(props.items.length - 1, Math.max(0, Math.floor(Number.isFinite(index) ? index : 0)))
  target = props.dynamic ? { key: keyFor(props.items[safeIndex], safeIndex), align } : undefined
  const top = position(safeIndex)
  const bottom = position(safeIndex + 1)
  if (align === 'auto' && top >= offset.value && bottom <= offset.value + viewportHeight.value) return
  setOffset(align === 'center' ? top - (viewportHeight.value - (bottom - top)) / 2
    : align === 'end' || (align === 'auto' && top > offset.value) ? bottom - viewportHeight.value : top)
}
function onScroll(event: Event) {
  const value = clamp((event.target as HTMLElement).scrollTop)
  if (Math.abs(value - offset.value) > 1) target = undefined
  offset.value = value
  emit('scroll', offset.value)
}
function measure(key: string | number, height: number) {
  if (!props.dynamic || !Number.isFinite(height) || height <= 0 || heights.get(key) === height) return
  heights.set(key, height)
  revision.value++
}
watch(layout, (current, previous) => {
  if (!props.dynamic) return
  const live = new Set(current.keys)
  for (const key of heights.keys()) if (!live.has(key)) heights.delete(key)
  const anchor = indexAt(offset.value, previous.positions)
  const newIndex = current.keys.indexOf(previous.keys[anchor])
  if (newIndex >= 0) setOffset(current.positions[newIndex] + Math.min(offset.value - previous.positions[anchor], current.positions[newIndex + 1] - current.positions[newIndex]))
  else setOffset(offset.value)
  if (target) {
    const index = current.keys.indexOf(target.key)
    if (index >= 0) scrollToIndex(index, target.align)
    else target = undefined
  }
  // The spacer must grow before the browser can accept a larger scrollTop.
  nextTick(() => { if (viewport.value) viewport.value.scrollTop = offset.value })
})
function resetHeights() { heights.clear(); revision.value++; measurementVersion.value++ }
watch([rowHeight, () => props.dynamic], resetHeights)
watch([maxOffset, viewportHeight], () => setOffset(offset.value), { flush: 'post' })
let viewportObserver: ResizeObserver | undefined
onMounted(() => {
  if (typeof ResizeObserver === 'undefined' || !viewport.value) return
  let width = viewport.value.clientWidth
  viewportObserver = new ResizeObserver(() => {
    if (viewport.value && viewport.value.clientWidth !== width) {
      width = viewport.value.clientWidth
      resetHeights()
    }
  })
  viewportObserver.observe(viewport.value)
})
onBeforeUnmount(() => viewportObserver?.disconnect())
watch([start, end], ([start, end]) => emit('rangeChange', { start, end }), { immediate: true })
defineExpose({ scrollTo, scrollToIndex, resetHeights })
</script>

<template>
  <div ref="viewport" class="epx-virtual-list" role="list" :aria-label="label" tabindex="0" :style="{ height: `${viewportHeight}px` }" @scroll="onScroll">
    <div v-if="items.length" class="epx-virtual-list__spacer" role="presentation" :style="{ height: `${totalHeight}px` }">
      <div class="epx-virtual-list__window" role="presentation" :style="{ transform: `translateY(${position(start)}px)` }">
        <template v-for="entry in visible" :key="keyFor(entry.item, entry.index)">
          <MeasuredRow v-if="dynamic" :measurement-version="measurementVersion" role="listitem" :aria-posinset="entry.index + 1" :aria-setsize="items.length" @resize="measure(keyFor(entry.item, entry.index), $event)"><slot :item="entry.item" :index="entry.index">{{ entry.item }}</slot></MeasuredRow>
          <div v-else class="epx-virtual-list__item" role="listitem" :aria-posinset="entry.index + 1" :aria-setsize="items.length" :style="{ height: `${rowHeight}px` }"><slot :item="entry.item" :index="entry.index">{{ entry.item }}</slot></div>
        </template>
      </div>
    </div>
    <div v-else class="epx-virtual-list__empty"><slot name="empty">No data</slot></div>
  </div>
</template>
