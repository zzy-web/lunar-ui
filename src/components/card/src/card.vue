<template>
  <section class="epx-card" :class="cardClass">
    <div v-if="$slots.header || header" class="epx-card__header"><slot name="header">{{ header }}</slot></div>
    <div class="epx-card__body" :style="bodyStyle"><slot /></div>
    <div v-if="$slots.footer" class="epx-card__footer"><slot name="footer" /></div>
  </section>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { CSSProperties } from 'vue'

defineOptions({ name: 'LuCard' })
const props = withDefaults(defineProps<{ header?: string; shadow?: 'always' | 'hover' | 'never'; bodyStyle?: CSSProperties }>(), { shadow: 'always' })
const cardClass = computed(() => [`is-shadow-${props.shadow}`])
</script>
