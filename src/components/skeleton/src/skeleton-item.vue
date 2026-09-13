<template>
  <span class="epx-skeleton__item" :class="`epx-skeleton__item--${variant}`" aria-hidden="true">
    <svg v-if="variant === 'image'" viewBox="0 0 48 48" fill="none" aria-hidden="true"><rect x="5" y="7" width="38" height="34" rx="4" /><circle cx="17" cy="18" r="4" /><path d="m6 35 11-10 8 7 7-10 10 13" /></svg>
  </span>
</template>
<script setup lang="ts">
defineOptions({ name: 'LuSkeletonItem' })
withDefaults(defineProps<{ variant?: 'text' | 'p' | 'h1' | 'h3' | 'caption' | 'button' | 'circle' | 'rect' | 'image' }>(), { variant: 'text' })
</script>
