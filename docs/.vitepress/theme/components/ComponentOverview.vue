<template>
  <div class="lu-catalog">
    <div class="lu-catalog__toolbar">
      <label class="lu-catalog__search">
        <span>{{ en ? 'Find a component' : '查找组件' }}</span>
        <input v-model="query" type="search" :placeholder="en ? 'Search name or purpose…' : '搜索组件名称或用途…'" />
      </label>
      <span class="lu-catalog__count">{{ count }} {{ en ? 'components' : '类组件' }}</span>
    </div>
    <section v-for="group in filtered" :key="group.en" class="lu-catalog__section">
      <h2>{{ en ? group.en : group.zh }} <span>{{ group.items.length }}</span></h2>
      <div class="lu-catalog__grid">
        <a v-for="item in group.items" :key="item.slug" :href="withBase(`${en ? '/en' : ''}/components/${item.slug}`)" class="lu-catalog__card">
          <div class="lu-catalog__card-top"><span class="lu-catalog__symbol" aria-hidden="true">{{ item.name.slice(0, 2) }}</span><span v-if="item.fresh" class="lu-catalog__badge">{{ en ? 'New' : '新增' }}</span><span v-else-if="item.updated" class="lu-catalog__badge">{{ en ? 'Updated' : '增强' }}</span></div>
          <strong>{{ item.name }} <span v-if="!en">{{ item.zh }}</span></strong>
          <p>{{ item.description[en ? 1 : 0] }}</p>
          <span class="lu-catalog__arrow" aria-hidden="true">↗</span>
        </a>
      </div>
    </section>
    <LuEmpty v-if="!count" :description="en ? 'No matching components' : '没有匹配的组件'"><LuButton @click="query = ''">{{ en ? 'Clear search' : '清除搜索' }}</LuButton></LuEmpty>
  </div>
</template>
<script setup lang="ts">
import { computed, ref } from 'vue'
import { useData, withBase } from 'vitepress'
import { LuButton, LuEmpty } from '../../../../src'
import { componentGroups } from '../../components'
const { lang } = useData()
const en = computed(() => lang.value.startsWith('en'))
const query = ref('')
const filtered = computed(() => componentGroups.map(group => ({
  ...group, items: group.items.filter(item => `${item.name} ${item.zh} ${item.description.join(' ')}`.toLowerCase().includes(query.value.trim().toLowerCase()))
})).filter(group => group.items.length))
const count = computed(() => filtered.value.reduce((total, group) => total + group.items.length, 0))
</script>
