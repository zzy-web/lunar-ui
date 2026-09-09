<template>
  <nav v-if="!hideOnSinglePage || pageCount > 1" class="epx-pagination" :class="[`epx-pagination--${size}`, { 'is-disabled': disabled }]" :aria-label="ariaLabel">
    <button type="button" :disabled="disabled || current === 1" :aria-label="prevText" @click="select(current - 1)">{{ prevText }}</button>
    <template v-for="item in pages" :key="item">
      <span v-if="typeof item === 'string'" class="epx-pagination__ellipsis" aria-hidden="true">…</span>
      <button v-else type="button" :disabled="disabled" :aria-label="`${pageLabel} ${item}`" :aria-current="item === current ? 'page' : undefined" @click="select(item)">{{ item }}</button>
    </template>
    <button type="button" :disabled="disabled || current === pageCount" :aria-label="nextText" @click="select(current + 1)">{{ nextText }}</button>
  </nav>
</template>
<script setup lang="ts">
import { computed } from 'vue'
defineOptions({ name: 'LuPagination' })
const props = withDefaults(defineProps<{
  currentPage?: number
  total?: number
  pageSize?: number
  disabled?: boolean
  hideOnSinglePage?: boolean
  size?: 'large' | 'default' | 'small'
  ariaLabel?: string
  pageLabel?: string
  prevText?: string
  nextText?: string
}>(), { currentPage: 1, total: 0, pageSize: 10, disabled: false, hideOnSinglePage: false, size: 'default', ariaLabel: '分页', pageLabel: '第', prevText: '上一页', nextText: '下一页' })
const emit = defineEmits<{ 'update:currentPage': [value: number]; change: [value: number] }>()
const pageCount = computed(() => {
  const total = Number.isFinite(props.total) ? Math.min(Number.MAX_SAFE_INTEGER, Math.max(0, props.total)) : 0
  const size = Number.isFinite(props.pageSize) ? Math.max(1, Math.floor(props.pageSize)) : 10
  return Math.max(1, Math.ceil(total / size))
})
const current = computed(() => Math.min(pageCount.value, Math.max(1, Number.isFinite(props.currentPage) ? Math.floor(props.currentPage) : 1)))
const pages = computed(() => {
  const count = pageCount.value
  if (count <= 7) return Array.from({ length: count }, (_, i) => i + 1)
  const start = Math.max(2, Math.min(current.value - 1, count - 4))
  const end = Math.min(count - 1, Math.max(current.value + 1, 5))
  const result: (number | string)[] = [1]
  if (start > 2) result.push('before')
  for (let page = start; page <= end; page++) result.push(page)
  if (end < count - 1) result.push('after')
  result.push(count)
  return result
})
function select(page: number) {
  if (props.disabled || page < 1 || page > pageCount.value || page === current.value) return
  emit('update:currentPage', page)
  emit('change', page)
}
</script>
