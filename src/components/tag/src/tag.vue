<template>
  <span class="epx-tag" :class="[`epx-tag--${type}`, `epx-tag--${size}`, `epx-tag--${effect}`, { 'is-round': round }]">
    <span class="epx-tag__content"><slot /></span>
    <button v-if="closable" class="epx-tag__close" type="button" :aria-label="closeLabel" @click.stop="emit('close', $event)">×</button>
  </span>
</template>

<script setup lang="ts">
defineOptions({ name: 'LuTag' })
withDefaults(defineProps<{
  type?: 'primary' | 'success' | 'warning' | 'danger' | 'info'
  size?: 'large' | 'default' | 'small'
  effect?: 'light' | 'dark' | 'plain'
  closable?: boolean
  round?: boolean
  closeLabel?: string
}>(), { type: 'primary', size: 'default', effect: 'light', closable: false, round: false, closeLabel: 'Close tag' })
const emit = defineEmits<{ close: [event: MouseEvent] }>()
</script>
