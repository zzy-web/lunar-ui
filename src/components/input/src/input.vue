<template>
  <div class="epx-input" :class="inputClass">
    <div class="epx-input__wrapper">
      <span v-if="$slots.prefix" class="epx-input__prefix"><slot name="prefix" /></span>
      <input class="epx-input__inner" :value="modelValue" :type="type" :placeholder="placeholder" :disabled="disabled" :readonly="readonly" @blur="isFocus = false" @focus="isFocus = true" @input="handleInput" />
      <span v-if="$slots.suffix" class="epx-input__suffix"><slot name="suffix" /></span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'

defineOptions({ name: 'EpxInput' })

const props = withDefaults(defineProps<{ modelValue?: string | number; type?: string; size?: 'large' | 'default' | 'small'; placeholder?: string; disabled?: boolean; readonly?: boolean }>(), { modelValue: '', type: 'text', size: 'default' })
const emit = defineEmits<{ 'update:modelValue': [value: string]; input: [value: string] }>()
const isFocus = ref(false)
const inputClass = computed(() => [props.size !== 'default' ? `epx-input--${props.size}` : '', { 'is-focus': isFocus.value, 'is-disabled': props.disabled }])
function handleInput(event: Event) { const value = (event.target as HTMLInputElement).value; emit('update:modelValue', value); emit('input', value) }
</script>
