<template>
  <div class="epx-spin" :class="{ 'epx-spin--wrapper': $slots.default, 'is-loading': loading }" :aria-busy="loading">
    <div v-if="$slots.default" class="epx-spin__content"><slot /></div>
    <div v-if="loading" class="epx-spin__indicator" :class="{ 'epx-spin__indicator--overlay': $slots.default }" role="status" :aria-label="text || ariaLabel">
      <slot name="indicator"><span class="epx-spin__spinner" :style="spinnerStyle" aria-hidden="true" /></slot>
      <span v-if="text" class="epx-spin__text">{{ text }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { CSSProperties } from 'vue'

defineOptions({ name: 'LuSpin' })
const props = withDefaults(defineProps<{
  loading?: boolean
  text?: string
  ariaLabel?: string
  size?: number
}>(), { loading: true, ariaLabel: 'Loading', size: 32 })

const spinnerStyle = computed<CSSProperties>(() => ({
  width: `${Number.isFinite(props.size) && props.size > 0 ? props.size : 32}px`,
  height: `${Number.isFinite(props.size) && props.size > 0 ? props.size : 32}px`
}))
</script>
