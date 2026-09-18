<template>
  <button class="epx-button" :class="buttonClass" :disabled="formDisabled || loading" :aria-busy="loading || undefined" :type="nativeType" @click="handleClick">
    <span v-if="loading" class="epx-button__loading" aria-hidden="true" />
    <span v-else-if="$slots.icon" class="epx-button__icon"><slot name="icon" /></span>
    <slot />
  </button>
</template>

<script setup lang="ts">
import { useFormControl } from '../../../composables/use-form-control'
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
}>(), { type: 'default', nativeType: 'button' })

const { formDisabled, formSize } = useFormControl(props)
const emit = defineEmits<{ click: [event: MouseEvent] }>()
const buttonClass = computed(() => [`epx-button--${props.type}`, formSize.value !== 'default' ? `epx-button--${formSize.value}` : '', { 'is-plain': props.plain, 'is-round': props.round, 'is-circle': props.circle, 'is-text': props.text, 'is-link': props.link, 'is-loading': props.loading, 'is-disabled': formDisabled.value }])
function handleClick(event: MouseEvent) { if (formDisabled.value || props.loading) return; emit('click', event) }
</script>
