<template>
  <div class="epx-divider" :class="[`epx-divider--${direction}`, `epx-divider--${contentPosition}`, { 'is-dashed': dashed }]" role="separator" :aria-orientation="direction">
    <span v-if="direction === 'horizontal' && $slots.default" class="epx-divider__text"><slot /></span>
  </div>
</template>
<script setup lang="ts">
defineOptions({ name: 'LuDivider' })
withDefaults(defineProps<{
  direction?: 'horizontal' | 'vertical'
  contentPosition?: 'left' | 'center' | 'right'
  dashed?: boolean
}>(), { direction: 'horizontal', contentPosition: 'center', dashed: false })
</script>
