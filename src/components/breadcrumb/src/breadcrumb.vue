<script setup lang="ts">
import type { BreadcrumbItem } from './types'
defineOptions({ name: 'LuBreadcrumb' })
withDefaults(defineProps<{ items?: BreadcrumbItem[]; separator?: string; label?: string }>(), { items: () => [], separator: '/', label: 'Breadcrumb' })
</script>
<template>
  <nav class="epx-breadcrumb" :aria-label="label">
    <ol class="epx-breadcrumb__list">
      <li v-for="(item, index) in items" :key="index" class="epx-breadcrumb__item">
        <span v-if="index" class="epx-breadcrumb__separator" aria-hidden="true"><slot name="separator">{{ separator }}</slot></span>
        <span v-if="index === items.length - 1" aria-current="page"><slot :item="item" :index="index">{{ item.label }}</slot></span>
        <a v-else-if="item.href" :href="item.href"><slot :item="item" :index="index">{{ item.label }}</slot></a>
        <span v-else><slot :item="item" :index="index">{{ item.label }}</slot></span>
      </li>
    </ol>
  </nav>
</template>
