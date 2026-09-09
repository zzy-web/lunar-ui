<template>
  <section class="lu-demo-block">
    <div class="lu-demo-block__preview" :class="{ 'lu-demo-block__preview--column': direction === 'column' }"><slot /></div>
    <div class="lu-demo-block__toolbar">
      <span class="lu-demo-block__caption">{{ en ? 'LIVE EXAMPLE' : '交互示例' }}</span>
      <div class="lu-demo-block__tools">
        <button type="button" @click="copy">{{ copyState === 'done' ? (en ? 'Copied' : '已复制') : copyState === 'error' ? (en ? 'Copy failed' : '复制失败') : (en ? 'Copy code' : '复制代码') }}</button>
        <button type="button" :aria-expanded="expanded" :aria-controls="id" @click="expanded = !expanded">{{ expanded ? (en ? 'Hide code' : '收起代码') : sourceLabel || (en ? 'View code' : '查看代码') }} <span aria-hidden="true">{{ expanded ? '−' : '+' }}</span></button>
      </div>
      <span class="lu-sr-only" role="status">{{ copyState === 'done' ? (en ? 'Code copied' : '代码已复制') : copyState === 'error' ? (en ? 'Unable to copy. Expand and select the code.' : '复制失败，请展开代码手动复制。') : '' }}</span>
    </div>
    <div v-show="expanded" :id="id" ref="source" class="lu-demo-block__code"><slot name="source" /></div>
  </section>
</template>
<script setup lang="ts">
import { computed, onBeforeUnmount, ref, useId } from 'vue'
import { useData } from 'vitepress'
defineProps<{ sourceLabel?: string; direction?: 'row' | 'column' }>()
const { lang } = useData()
const en = computed(() => lang.value.startsWith('en'))
const expanded = ref(false)
const source = ref<HTMLElement>()
const id = useId()
const copyState = ref<'idle' | 'done' | 'error'>('idle')
let timer: ReturnType<typeof setTimeout> | undefined
async function copy() {
  try {
    const code = source.value?.querySelector('pre code')?.textContent
    if (!code) throw new Error('No source')
    await navigator.clipboard.writeText(code)
    copyState.value = 'done'
  } catch { copyState.value = 'error' }
  clearTimeout(timer)
  timer = setTimeout(() => { copyState.value = 'idle' }, 2000)
}
onBeforeUnmount(() => clearTimeout(timer))
</script>
