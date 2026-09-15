<script setup lang="ts">
import { computed, nextTick, ref, useId, watch } from 'vue'
import type { TabItem } from './types'
defineOptions({ name: 'LuTabs' })
const props = withDefaults(defineProps<{ modelValue?: string | number; items?: TabItem[]; type?: 'line' | 'card'; label?: string; orientation?: 'horizontal' | 'vertical'; activation?: 'automatic' | 'manual'; lazy?: boolean }>(), { items: () => [], type: 'line', label: 'Tabs', orientation: 'horizontal', activation: 'automatic' })
const emit = defineEmits<{ 'update:modelValue': [value: string | number]; change: [value: string | number] }>()
const id = useId()
const buttons = ref<HTMLButtonElement[]>([])
const internalValue = ref<string | number>()
const active = computed(() => props.items.find(item => item.name === (props.modelValue ?? internalValue.value) && !item.disabled) ?? props.items.find(item => !item.disabled))
const focusedName = ref<string | number>()
const visited = ref(new Set<string | number>())
const focusable = computed(() => props.items.find(item => item.name === focusedName.value && !item.disabled) ?? active.value)
watch(() => active.value?.name, name => { focusedName.value = name }, { immediate: true })
watch(() => [active.value?.name, props.items.map(item => item.name)] as const, ([name, names]) => {
  const next = new Set([...visited.value].filter(value => names.includes(value)))
  if (name !== undefined) next.add(name)
  visited.value = next
}, { immediate: true })
function select(item: TabItem) {
  if (!item.disabled) focusedName.value = item.name
  if (item.disabled || item.name === active.value?.name) return
  if (props.modelValue === undefined) internalValue.value = item.name
  emit('update:modelValue', item.name)
  emit('change', item.name)
}
async function navigate(event: KeyboardEvent, index: number) {
  const previous = props.orientation === 'vertical' ? 'ArrowUp' : 'ArrowLeft'
  const next = props.orientation === 'vertical' ? 'ArrowDown' : 'ArrowRight'
  if (![previous, next, 'Home', 'End'].includes(event.key)) return
  event.preventDefault()
  const enabled = props.items.map((item, i) => item.disabled ? -1 : i).filter(i => i >= 0)
  if (!enabled.length) return
  const current = enabled.indexOf(index)
  const target = event.key === 'Home' ? enabled[0] : event.key === 'End' ? enabled[enabled.length - 1] : enabled[(current + (event.key === next ? 1 : -1) + enabled.length) % enabled.length]
  focusedName.value = props.items[target].name
  if (props.activation === 'automatic') select(props.items[target])
  await nextTick()
  buttons.value[target]?.focus()
}
</script>
<template>
  <div class="epx-tabs" :class="[`epx-tabs--${type}`, `epx-tabs--${orientation}`]">
    <div class="epx-tabs__nav" role="tablist" :aria-label="label" :aria-orientation="orientation">
      <button v-for="(item, index) in items" :id="`${id}-tab-${index}`" :key="item.name" :ref="el => { buttons[index] = el as HTMLButtonElement }" type="button" role="tab" class="epx-tabs__tab" :class="{ 'is-active': active?.name === item.name }" :disabled="item.disabled" :aria-selected="active?.name === item.name" :aria-controls="`${id}-panel-${index}`" :tabindex="focusable?.name === item.name ? 0 : -1" @click="select(item)" @keydown="navigate($event, index)"><slot name="label" :item="item">{{ item.label }}</slot></button>
    </div>
    <div v-for="(item, index) in items" v-show="active?.name === item.name" :id="`${id}-panel-${index}`" :key="item.name" class="epx-tabs__panel" role="tabpanel" :aria-labelledby="`${id}-tab-${index}`" tabindex="0"><slot v-if="!lazy || visited.has(item.name)" :name="String(item.name)" :item="item"><slot :item="item" /></slot></div>
  </div>
</template>
