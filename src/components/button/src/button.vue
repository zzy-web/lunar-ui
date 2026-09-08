<template>
  <button class="epx-button" :class="buttonClass" :disabled="disabled || loading" :type="nativeType" @click="handleClick">
    <span v-if="loading" class="epx-button__loading" aria-hidden="true" />
    <slot />
  </button>
</template>

<script setup lang="ts">
import { computed } from 'vue'

defineOptions({ name: 'EpxButton' })

const props = withDefaults(defineProps<{
  type?: 'default' | 'primary' | 'success' | 'warning' | 'danger'
  size?: 'large' | 'default' | 'small'
  nativeType?: 'button' | 'submit' | 'reset'
  plain?: boolean
  round?: boolean
  loading?: boolean
  disabled?: boolean
}>(), { type: 'default', size: 'default', nativeType: 'button' })

const emit = defineEmits<{ click: [event: MouseEvent] }>()
const buttonClass = computed(() => [`epx-button--${props.type}`, props.size !== 'default' ? `epx-button--${props.size}` : '', { 'is-plain': props.plain, 'is-round': props.round, 'is-loading': props.loading, 'is-disabled': props.disabled }])
function handleClick(event: MouseEvent) { if (props.disabled || props.loading) return; emit('click', event) }
</script>
