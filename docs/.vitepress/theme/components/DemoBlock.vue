<template>
  <section class="lu-demo-block">
    <div class="lu-demo-block__preview">
      <slot />
    </div>
    <details class="lu-demo-block__source">
      <summary>{{ sourceLabel }}</summary>
      <div class="lu-demo-block__code">
        <slot name="source" />
      </div>
    </details>
  </section>
</template>

<script setup lang="ts">
withDefaults(defineProps<{ sourceLabel?: string }>(), {
  sourceLabel: '查看源代码'
})
</script>
