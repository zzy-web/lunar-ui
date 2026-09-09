<template>
  <div class="epx-progress" :class="[`epx-progress--${status}`, { 'is-indeterminate': indeterminate }]">
    <div class="epx-progress__track" role="progressbar" :aria-label="ariaLabel" :aria-valuemin="0" :aria-valuemax="100" :aria-valuenow="indeterminate ? undefined : value" :style="{ height: `${height}px` }">
      <div class="epx-progress__bar" :style="{ width: indeterminate ? '35%' : `${value}%`, backgroundColor: color || undefined }" />
    </div>
    <span v-if="showText" class="epx-progress__text"><slot :percentage="value">{{ format ? format(value) : indeterminate ? '…' : `${value}%` }}</slot></span>
  </div>
</template>
<script setup lang="ts">
import { computed } from 'vue'
defineOptions({ name: 'LuProgress' })
const props = withDefaults(defineProps<{
  percentage?: number
  status?: 'default' | 'success' | 'warning' | 'exception'
  strokeWidth?: number
  showText?: boolean
  indeterminate?: boolean
  color?: string
  ariaLabel?: string
  format?: (percentage: number) => string
}>(), { percentage: 0, status: 'default', strokeWidth: 8, showText: true, indeterminate: false, ariaLabel: '进度' })
const value = computed(() => Number.isFinite(props.percentage) ? Math.min(100, Math.max(0, props.percentage)) : 0)
const height = computed(() => Number.isFinite(props.strokeWidth) ? Math.max(1, props.strokeWidth) : 8)
</script>
