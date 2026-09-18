<template>
  <button v-bind="$attrs" ref="control" class="epx-switch" :class="[`epx-switch--${formSize}`, { 'is-checked': checked, 'is-disabled': formDisabled || busy }]" type="button" role="switch" :aria-checked="checked" :aria-busy="busy || undefined" :disabled="formDisabled || busy" @click="toggle">
    <span v-if="inactiveText" class="epx-switch__label">{{ inactiveText }}</span>
    <span class="epx-switch__track" aria-hidden="true"><span class="epx-switch__thumb"><span v-if="busy" class="epx-switch__loading" /></span></span>
    <span v-if="activeText" class="epx-switch__label">{{ activeText }}</span>
  </button>
</template>

<script setup lang="ts">
import { useFormControl } from '../../../composables/use-form-control'
import { computed, onBeforeUnmount, ref, watch } from 'vue'
defineOptions({ name: 'LuSwitch', inheritAttrs: false })
const props = withDefaults(defineProps<{
  modelValue?: boolean | string | number
  activeValue?: boolean | string | number
  inactiveValue?: boolean | string | number
  beforeChange?: () => boolean | Promise<boolean>
  disabled?: boolean
  loading?: boolean
  activeText?: string
  inactiveText?: string
  size?: 'large' | 'default' | 'small'
}>(), { modelValue: false, activeValue: true, inactiveValue: false, disabled: false, loading: false })
const { formDisabled, formSize } = useFormControl(props)
const emit = defineEmits<{
  'update:modelValue': [value: boolean | string | number]
  change: [value: boolean | string | number]
  'change-error': [error: unknown]
}>()
const control = ref<HTMLButtonElement>()
const pending = ref(false)
const busy = computed(() => props.loading || pending.value)
const checked = computed(() => props.modelValue === props.activeValue)
let version = 0
function invalidate() { version++; pending.value = false }
watch(() => [props.modelValue, props.activeValue, props.inactiveValue, formDisabled.value, props.loading, props.beforeChange], invalidate, { flush: 'sync' })
onBeforeUnmount(invalidate)
function publish() {
  const value = checked.value ? props.inactiveValue : props.activeValue
  emit('update:modelValue', value)
  emit('change', value)
}
async function confirmChange() {
  const current = ++version
  pending.value = true
  try {
    const allowed = await props.beforeChange!()
    if (allowed && current === version && !formDisabled.value && !props.loading) publish()
  } catch (error) {
    if (current === version) emit('change-error', error)
  } finally {
    if (current === version) pending.value = false
  }
}
function toggle() {
  if (formDisabled.value || busy.value) return
  if (props.beforeChange) void confirmChange()
  else publish()
}
defineExpose({ focus: () => control.value?.focus(), blur: () => control.value?.blur() })
</script>
