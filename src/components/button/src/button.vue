<template>
  <button class="epx-button" :class="buttonClass" :disabled="disabled || loading" :aria-busy="loading || undefined" :type="nativeType" @click="handleClick">
    <span v-if="loading" class="epx-button__loading" aria-hidden="true" />
    <span v-else-if="$slots.icon" class="epx-button__icon"><slot name="icon" /></span>
    <slot />
  </button>
</template>

<script setup lang="ts">
import { computed } from 'vue'

defineOptions({ name: 'LuButton' })

const props = withDefaults(defineProps<{
  type?: 'default' | 'primary' | 'success' | 'warning' | 'danger'
  size?: 'large' | 'default' | 'small'
  nativeType?: 'button' | 'submit' | 'reset'
  plain?: boolean
  round?: boolean
  circle?: boolean
  text?: boolean
  link?: boolean
  loading?: boolean
  disabled?: boolean
}>(), { type: 'default', size: 'default', nativeType: 'button' })

const emit = defineEmits<{ click: [event: MouseEvent] }>()
const buttonClass = computed(() => [`epx-button--${props.type}`, props.size !== 'default' ? `epx-button--${props.size}` : '', { 'is-plain': props.plain, 'is-round': props.round, 'is-circle': props.circle, 'is-text': props.text, 'is-link': props.link, 'is-loading': props.loading, 'is-disabled': props.disabled }])
function handleClick(event: MouseEvent) { if (props.disabled || props.loading) return; emit('click', event) }
</script>
