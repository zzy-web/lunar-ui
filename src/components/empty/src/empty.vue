<template>
  <div class="epx-empty">
    <div v-if="image || $slots.image" class="epx-empty__image" :style="{ width: `${imageSize}px` }">
      <slot name="image"><img :src="image" :alt="imageAlt" /></slot>
    </div>
    <div class="epx-empty__description"><slot name="description">{{ description }}</slot></div>
    <div v-if="$slots.default" class="epx-empty__actions"><slot /></div>
  </div>
</template>
<script setup lang="ts">
defineOptions({ name: 'LuEmpty' })
withDefaults(defineProps<{
  description?: string
  image?: string
  imageAlt?: string
  imageSize?: number
}>(), { description: '暂无数据', imageAlt: '', imageSize: 120 })
</script>
