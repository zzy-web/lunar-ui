<template>
  <span class="epx-badge">
    <slot />
    <sup v-if="visible" class="epx-badge__content" :class="[`epx-badge--${type}`, { 'is-dot': isDot, 'is-fixed': !!$slots.default }]"
      :style="{ backgroundColor: color, marginTop: `${offset[1]}px`, marginRight: `${-offset[0]}px` }"
      :aria-label="label || (isDot ? 'Notification' : undefined)">
      <slot v-if="!isDot" name="content" :value="value" :display-value="displayValue">{{ displayValue }}</slot>
    </sup>
  </span>
</template>
<script setup lang="ts">
import { computed } from 'vue'
defineOptions({ name: 'LuBadge' })
const props = withDefaults(defineProps<{
  value?: string | number
  max?: number
  isDot?: boolean
  hidden?: boolean
  showZero?: boolean
  type?: 'primary' | 'success' | 'warning' | 'danger' | 'info'
  color?: string
  offset?: [number, number]
  label?: string
}>(), { value: '', max: 99, showZero: true, type: 'danger', offset: () => [0, 0] })
const visible = computed(() => !props.hidden && (props.isDot || (props.value !== '' && (props.showZero || props.value !== 0))))
const displayValue = computed(() => typeof props.value === 'number' && props.value > props.max ? `${props.max}+` : props.value)
</script>
