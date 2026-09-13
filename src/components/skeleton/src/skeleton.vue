<template>
  <div class="epx-skeleton" :class="{ 'is-animated': animated && loading }" :aria-busy="loading">
    <template v-if="loading">
      <span class="epx-skeleton__status" role="status">{{ loadingText }}</span>
      <div v-for="index in safeCount" :key="index" class="epx-skeleton__group" aria-hidden="true">
        <slot name="template" :index="index - 1">
          <LuSkeletonItem class="epx-skeleton__first" />
          <LuSkeletonItem v-for="row in safeRows" :key="row" :class="{ 'epx-skeleton__last': row === safeRows && safeRows > 1 }" />
        </slot>
      </div>
    </template>
    <slot v-else />
  </div>
</template>
<script setup lang="ts">
import { computed } from 'vue'
import LuSkeletonItem from './skeleton-item.vue'
defineOptions({ name: 'LuSkeleton' })
const props = withDefaults(defineProps<{
  loading?: boolean
  animated?: boolean
  rows?: number
  count?: number
  loadingText?: string
}>(), { loading: true, rows: 3, count: 1, loadingText: 'Loading…' })
const safeRows = computed(() => Number.isFinite(props.rows) ? Math.max(0, Math.floor(props.rows)) : 3)
const safeCount = computed(() => Number.isFinite(props.count) ? Math.max(1, Math.floor(props.count)) : 1)
</script>
