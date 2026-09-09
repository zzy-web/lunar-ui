<template>
  <div class="epx-input" :class="inputClass">
    <div class="epx-input__wrapper">
      <span v-if="$slots.prefix && type !== 'textarea'" class="epx-input__prefix"><slot name="prefix" /></span>
      <textarea v-if="type === 'textarea'" v-bind="$attrs" ref="control" class="epx-input__inner epx-input__textarea" :value="modelValue" :rows="rows" :maxlength="maxlength" :placeholder="placeholder" :disabled="disabled" :readonly="readonly" :style="{ resize }" @input="handleInput" @change="handleChange" @focus="handleFocus" @blur="handleBlur" @compositionstart="composing = true" @compositionend="handleCompositionEnd" />
      <input v-else v-bind="$attrs" ref="control" class="epx-input__inner" :value="modelValue" :type="showPassword ? (passwordVisible ? 'text' : 'password') : type" :maxlength="maxlength" :placeholder="placeholder" :disabled="disabled" :readonly="readonly" @input="handleInput" @change="handleChange" @focus="handleFocus" @blur="handleBlur" @compositionstart="composing = true" @compositionend="handleCompositionEnd" />
      <button v-if="clearable && String(modelValue).length && !disabled && !readonly" type="button" class="epx-input__action" :aria-label="clearLabel" @mousedown.prevent @click="clear">×</button>
      <button v-if="showPassword && type !== 'textarea'" type="button" class="epx-input__action" :disabled="disabled" :aria-label="passwordLabel" :aria-pressed="passwordVisible" @mousedown.prevent @click="togglePassword">
        <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true"><path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12Z" /><circle cx="12" cy="12" r="3" /><path v-if="passwordVisible" d="m3 3 18 18" /></svg>
      </button>
      <span v-if="$slots.suffix && type !== 'textarea'" class="epx-input__suffix"><slot name="suffix" /></span>
      <span v-if="showWordLimit && maxlength !== undefined && !showPassword && type !== 'password'" class="epx-input__count">{{ String(modelValue).length }} / {{ maxlength }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, nextTick, ref } from 'vue'
defineOptions({ name: 'LuInput', inheritAttrs: false })
const props = withDefaults(defineProps<{
  modelValue?: string | number
  type?: string
  size?: 'large' | 'default' | 'small'
  placeholder?: string
  disabled?: boolean
  readonly?: boolean
  clearable?: boolean
  showPassword?: boolean
  showWordLimit?: boolean
  maxlength?: number
  rows?: number
  resize?: 'none' | 'both' | 'horizontal' | 'vertical'
  clearLabel?: string
  passwordLabel?: string
}>(), { modelValue: '', type: 'text', size: 'default', rows: 3, resize: 'vertical', clearLabel: 'Clear input', passwordLabel: 'Show password' })
const emit = defineEmits<{
  'update:modelValue': [value: string]
  input: [value: string]
  change: [value: string]
  clear: []
  focus: [event: FocusEvent]
  blur: [event: FocusEvent]
}>()
const control = ref<HTMLInputElement | HTMLTextAreaElement>()
const isFocus = ref(false)
const passwordVisible = ref(false)
const composing = ref(false)
let compositionResult: string | undefined
const inputClass = computed(() => [`epx-input--${props.size}`, {
  'is-focus': isFocus.value, 'is-disabled': props.disabled, 'is-textarea': props.type === 'textarea'
}])
function update(value: string) { emit('update:modelValue', value); emit('input', value) }
function handleInput(event: Event) {
  if (props.disabled || props.readonly || composing.value || (event as InputEvent).isComposing) return
  const value = (event.target as HTMLInputElement).value
  if (value === compositionResult) { compositionResult = undefined; return }
  compositionResult = undefined
  update(value)
}
function handleCompositionEnd(event: CompositionEvent) {
  composing.value = false
  if (props.disabled || props.readonly) return
  compositionResult = (event.target as HTMLInputElement).value
  update(compositionResult)
}
function handleChange(event: Event) {
  if (!props.disabled && !props.readonly) emit('change', (event.target as HTMLInputElement).value)
}
function handleFocus(event: FocusEvent) { isFocus.value = true; emit('focus', event) }
function handleBlur(event: FocusEvent) { isFocus.value = false; emit('blur', event) }
function focus() { control.value?.focus() }
function blur() { control.value?.blur() }
function select() { control.value?.select() }
function clear() {
  if (props.disabled || props.readonly) return
  compositionResult = undefined
  update('')
  emit('change', '')
  emit('clear')
  focus()
}
async function togglePassword() {
  if (props.disabled) return
  passwordVisible.value = !passwordVisible.value
  await nextTick()
  focus()
}
defineExpose({ focus, blur, select })
</script>
