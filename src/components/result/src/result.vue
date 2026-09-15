<script setup lang="ts">
defineOptions({ name: 'LuResult' })
withDefaults(defineProps<{
  icon?: 'success' | 'warning' | 'error' | 'info'
  title?: string
  subTitle?: string
}>(), { icon: 'info' })
const symbols = { success: '✓', warning: '!', error: '×', info: 'i' }
</script>

<template>
  <div class="epx-result" :class="`epx-result--${icon}`">
    <div class="epx-result__icon"><slot name="icon"><span aria-hidden="true">{{ symbols[icon] }}</span></slot></div>
    <div v-if="title || $slots.title" class="epx-result__title"><slot name="title">{{ title }}</slot></div>
    <div v-if="subTitle || $slots['sub-title']" class="epx-result__subtitle"><slot name="sub-title">{{ subTitle }}</slot></div>
    <div v-if="$slots.default" class="epx-result__content"><slot /></div>
    <div v-if="$slots.extra" class="epx-result__extra"><slot name="extra" /></div>
  </div>
</template>
