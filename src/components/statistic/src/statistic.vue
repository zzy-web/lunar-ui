<template>
  <div class="epx-statistic">
    <div v-if="title || $slots.title" class="epx-statistic__title"><slot name="title">{{ title }}</slot></div>
    <div class="epx-statistic__content" :style="valueStyle">
      <span v-if="prefix || $slots.prefix" class="epx-statistic__prefix"><slot name="prefix">{{ prefix }}</slot></span>
      <span class="epx-statistic__value">{{ displayValue }}</span>
      <span v-if="suffix || $slots.suffix" class="epx-statistic__suffix"><slot name="suffix">{{ suffix }}</slot></span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { CSSProperties } from 'vue'

defineOptions({ name: 'LuStatistic' })
const props = withDefaults(defineProps<{
  value?: number
  title?: string
  precision?: number
  groupSeparator?: string
  decimalSeparator?: string
  prefix?: string
  suffix?: string
  formatter?: (value: number) => string | number
  valueStyle?: CSSProperties
}>(), { value: 0, precision: 0, groupSeparator: ',', decimalSeparator: '.' })

const displayValue = computed(() => {
  if (props.formatter) return props.formatter(props.value)
  if (!Number.isFinite(props.value)) return '—'
  const precision = Number.isFinite(props.precision) ? Math.min(20, Math.max(0, Math.trunc(props.precision))) : 0
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: precision,
    maximumFractionDigits: precision,
    useGrouping: true
  }).formatToParts(props.value).map(part => {
    if (part.type === 'group') return props.groupSeparator
    if (part.type === 'decimal') return props.decimalSeparator
    return part.value
  }).join('')
})
</script>
