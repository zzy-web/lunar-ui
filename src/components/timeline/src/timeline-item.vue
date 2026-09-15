<script setup lang="ts">
defineOptions({ name: 'LuTimelineItem' })
withDefaults(defineProps<{
  timestamp?: string
  datetime?: string
  hideTimestamp?: boolean
  placement?: 'top' | 'bottom'
  type?: 'primary' | 'success' | 'warning' | 'danger' | 'info'
  color?: string
  size?: 'normal' | 'large'
  hollow?: boolean
}>(), { placement: 'bottom', type: 'primary', size: 'normal' })
</script>

<template>
  <li class="epx-timeline-item" :class="[`epx-timeline-item--${type}`, `epx-timeline-item--${size}`, { 'is-hollow': hollow }]" :style="color ? { '--epx-timeline-node-color': color } : undefined">
    <span class="epx-timeline-item__tail" aria-hidden="true" />
    <span class="epx-timeline-item__node" aria-hidden="true"><slot name="dot" /></span>
    <div class="epx-timeline-item__wrapper">
      <time v-if="!hideTimestamp && (timestamp || $slots.timestamp) && placement === 'top'" class="epx-timeline-item__timestamp is-top" :datetime="datetime"><slot name="timestamp">{{ timestamp }}</slot></time>
      <div class="epx-timeline-item__content"><slot /></div>
      <time v-if="!hideTimestamp && (timestamp || $slots.timestamp) && placement === 'bottom'" class="epx-timeline-item__timestamp" :datetime="datetime"><slot name="timestamp">{{ timestamp }}</slot></time>
    </div>
  </li>
</template>
