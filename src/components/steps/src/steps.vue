<script setup lang="ts">
import { computed, nextTick, ref } from 'vue'
import type { ComponentPublicInstance } from 'vue'
import { clamp, finite } from '../../../utils/number'
import type { StepItem, StepStatus } from './types'

defineOptions({ name: 'LuSteps' })
const props = withDefaults(defineProps<{
  active?: number
  items?: StepItem[]
  direction?: 'horizontal' | 'vertical'
  processStatus?: StepStatus
  finishStatus?: StepStatus
  alignCenter?: boolean
  simple?: boolean
  space?: string | number
  clickable?: boolean
  label?: string
  statusLabels?: Partial<Record<StepStatus, string>>
}>(), { items: () => [], direction: 'horizontal', processStatus: 'process', finishStatus: 'finish', label: 'Progress' })
const emit = defineEmits<{ 'update:active': [index: number]; change: [index: number, previous: number] }>()
const internal = ref(0)
const buttons = ref<HTMLButtonElement[]>([])
const active = computed(() => clamp(Math.floor(finite(props.active ?? internal.value, 0)), 0, props.items.length))
const labels = computed(() => ({ wait: 'Waiting', process: 'In progress', finish: 'Finished', success: 'Success', error: 'Error', ...props.statusLabels }))
const status = (item: StepItem, index: number): StepStatus => item.status ?? (index < active.value ? props.finishStatus : index === active.value ? props.processStatus : 'wait')
const tabIndex = computed(() => props.items[active.value] && !props.items[active.value].disabled ? active.value : props.items.findIndex(item => !item.disabled))
const itemStyle = computed(() => props.space !== undefined && !props.simple ? { flexBasis: typeof props.space === 'number' ? `${props.space}px` : props.space, flexGrow: 0, flexShrink: 0 } : undefined)
function select(index: number) {
  if (!props.clickable || !props.items[index] || props.items[index].disabled || index === active.value) return
  const previous = active.value
  if (props.active === undefined) internal.value = index
  emit('update:active', index)
  emit('change', index, previous)
}
async function navigate(event: KeyboardEvent, index: number) {
  if (!props.clickable) return
  const previous = props.direction === 'vertical' ? 'ArrowUp' : 'ArrowLeft'
  const next = props.direction === 'vertical' ? 'ArrowDown' : 'ArrowRight'
  if (![previous, next, 'Home', 'End'].includes(event.key)) return
  event.preventDefault()
  const enabled = props.items.map((item, i) => item.disabled ? -1 : i).filter(i => i >= 0)
  if (!enabled.length) return
  const position = enabled.indexOf(index)
  const target = event.key === 'Home' ? enabled[0] : event.key === 'End' ? enabled[enabled.length - 1]
    : enabled[(position + (event.key === next ? 1 : -1) + enabled.length) % enabled.length]
  select(target)
  await nextTick()
  buttons.value[target]?.focus()
}
</script>

<template>
  <ol class="epx-steps" :class="[`epx-steps--${direction}`, { 'is-center': alignCenter, 'is-simple': simple, 'is-clickable': clickable }]" :aria-label="label">
    <li v-for="(item, index) in items" :key="index" class="epx-step" :class="[`is-${status(item, index)}`, { 'is-disabled': item.disabled }]" :style="itemStyle" :aria-current="index === active ? 'step' : undefined">
      <span class="epx-step__line" aria-hidden="true" />
      <component :is="clickable ? 'button' : 'div'" :ref="(el: Element | ComponentPublicInstance | null) => { buttons[index] = el as HTMLButtonElement }" class="epx-step__body" :type="clickable ? 'button' : undefined" :disabled="clickable ? item.disabled : undefined" :tabindex="clickable ? (index === tabIndex ? 0 : -1) : undefined" @click="select(index)" @keydown="navigate($event, index)">
        <span class="epx-step__icon" aria-hidden="true"><slot name="icon" :item="item" :index="index" :status="status(item, index)">{{ item.icon ?? (status(item, index) === 'success' ? '✓' : status(item, index) === 'error' ? '×' : index + 1) }}</slot></span>
        <span class="epx-step__main">
          <span class="epx-step__title"><slot name="title" :item="item" :index="index">{{ item.title }}</slot></span>
          <span v-if="!simple && (item.description || $slots.description)" class="epx-step__description"><slot name="description" :item="item" :index="index">{{ item.description }}</slot></span>
          <span class="epx-visually-hidden">{{ labels[status(item, index)] }}</span>
        </span>
      </component>
    </li>
  </ol>
</template>
