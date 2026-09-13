<script setup lang="ts">
import { computed, nextTick, ref, useId } from 'vue'
import type { TabItem } from './types'
defineOptions({ name: 'LuTabs' })
const props = withDefaults(defineProps<{ modelValue?: string | number; items?: TabItem[]; type?: 'line' | 'card'; label?: string }>(), { items: () => [], type: 'line', label: 'Tabs' })
const emit = defineEmits<{ 'update:modelValue': [value: string | number]; change: [value: string | number] }>()
const id = useId()
const buttons = ref<HTMLButtonElement[]>([])
const internalValue = ref<string | number>()
const active = computed(() => props.items.find(item => item.name === (props.modelValue ?? internalValue.value) && !item.disabled) ?? props.items.find(item => !item.disabled))
function select(item: TabItem) {
  if (item.disabled || item.name === active.value?.name) return
  if (props.modelValue === undefined) internalValue.value = item.name
  emit('update:modelValue', item.name)
  emit('change', item.name)
}
async function navigate(event: KeyboardEvent, index: number) {
  if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) return
  event.preventDefault()
  const enabled = props.items.map((item, i) => item.disabled ? -1 : i).filter(i => i >= 0)
  if (!enabled.length) return
  const current = enabled.indexOf(index)
  const target = event.key === 'Home' ? enabled[0] : event.key === 'End' ? enabled[enabled.length - 1] : enabled[(current + (event.key === 'ArrowRight' ? 1 : -1) + enabled.length) % enabled.length]
  select(props.items[target])
  await nextTick()
  buttons.value[target]?.focus()
}
</script>
<template>
  <div class="epx-tabs" :class="`epx-tabs--${type}`">
    <div class="epx-tabs__nav" role="tablist" :aria-label="label">
      <button v-for="(item, index) in items" :id="`${id}-tab-${index}`" :key="item.name" :ref="el => { buttons[index] = el as HTMLButtonElement }" type="button" role="tab" class="epx-tabs__tab" :class="{ 'is-active': active?.name === item.name }" :disabled="item.disabled" :aria-selected="active?.name === item.name" :aria-controls="`${id}-panel-${index}`" :tabindex="active?.name === item.name ? 0 : -1" @click="select(item)" @keydown="navigate($event, index)"><slot name="label" :item="item">{{ item.label }}</slot></button>
    </div>
    <div v-for="(item, index) in items" v-show="active?.name === item.name" :id="`${id}-panel-${index}`" :key="item.name" class="epx-tabs__panel" role="tabpanel" :aria-labelledby="`${id}-tab-${index}`" tabindex="0"><slot :name="String(item.name)" :item="item"><slot :item="item" /></slot></div>
  </div>
</template>
