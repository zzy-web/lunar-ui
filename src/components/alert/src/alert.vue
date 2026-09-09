<template>
  <div v-if="visible" class="epx-alert" :class="[`epx-alert--${type}`, `epx-alert--${effect}`, { 'is-center': center }]" :role="type === 'error' || type === 'warning' ? 'alert' : 'status'">
    <span v-if="showIcon" class="epx-alert__icon" aria-hidden="true">{{ icons[type] }}</span>
    <div class="epx-alert__content">
      <div v-if="title || $slots.title" class="epx-alert__title"><slot name="title">{{ title }}</slot></div>
      <div v-if="description || $slots.default" class="epx-alert__description"><slot>{{ description }}</slot></div>
    </div>
    <button v-if="closable" class="epx-alert__close" type="button" :aria-label="closeLabel" @click="close">{{ closeText || '×' }}</button>
  </div>
</template>
<script setup lang="ts">
import { ref } from 'vue'
defineOptions({ name: 'LuAlert' })
withDefaults(defineProps<{
  title?: string
  description?: string
  type?: 'success' | 'info' | 'warning' | 'error'
  effect?: 'light' | 'dark'
  closable?: boolean
  showIcon?: boolean
  center?: boolean
  closeText?: string
  closeLabel?: string
}>(), { type: 'info', effect: 'light', closable: true, closeLabel: 'Close alert' })
const emit = defineEmits<{ close: [event: MouseEvent] }>()
const visible = ref(true)
const icons = { success: '✓', info: 'i', warning: '!', error: '×' }
function close(event: MouseEvent) { visible.value = false; emit('close', event) }
</script>
