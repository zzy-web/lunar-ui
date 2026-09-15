<script setup lang="ts">
import { computed, inject, onBeforeUnmount, ref, useId, watch } from 'vue'
import { collapseKey } from './tokens'
import type { CollapseName } from './tokens'

defineOptions({ name: 'LuCollapseItem' })
const props = withDefaults(defineProps<{
  name: CollapseName
  title?: string
  disabled?: boolean
  lazy?: boolean
  destroyOnClose?: boolean
}>(), { title: '' })
const context = inject(collapseKey, undefined)
const id = useId()
const active = computed(() => context?.activeNames.includes(props.name) ?? false)
const disabled = computed(() => props.disabled || context?.disabled || !context)
const visited = ref(false)
watch(active, value => { if (value) visited.value = true }, { immediate: true })
const rendered = computed(() => props.destroyOnClose ? active.value : !props.lazy || visited.value)
let mounted = true
function toggle() {
  const name = props.name
  return context?.toggle(name, () => mounted && !disabled.value && props.name === name)
}
onBeforeUnmount(() => { mounted = false; context?.invalidate() })
defineExpose({ isActive: active })
</script>

<template>
  <div class="epx-collapse__item" :class="{ 'is-active': active, 'is-disabled': disabled }">
    <h3 class="epx-collapse__heading">
      <button :id="`${id}-header`" type="button" class="epx-collapse__header" :class="{ 'is-icon-left': context?.expandIconPosition === 'left' }" :disabled="disabled" :aria-expanded="active" :aria-controls="`${id}-panel`" :aria-busy="context?.pending === name" @click="toggle">
        <span class="epx-collapse__title"><slot name="title" :is-active="active">{{ title }}</slot></span>
        <span class="epx-collapse__arrow" :class="{ 'is-loading': context?.pending === name }" aria-hidden="true"><slot name="icon" :is-active="active">{{ context?.pending === name ? '◌' : '›' }}</slot></span>
      </button>
    </h3>
    <div v-show="active" :id="`${id}-panel`" class="epx-collapse__panel" role="region" :aria-labelledby="`${id}-header`"><div v-if="rendered" class="epx-collapse__content"><slot /></div></div>
  </div>
</template>
