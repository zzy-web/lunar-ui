# Skeleton 骨架屏

内容加载期间展示占位布局，完成后切换为实际内容。

<script setup>
import { ref } from 'vue'
const loading = ref(true)
</script>

## 加载切换与自定义布局

<DemoBlock>
<lu-switch v-model="loading" aria-label="切换加载状态" />
<lu-skeleton :loading="loading" animated :rows="3" style="margin-top:20px">
  <lu-card>内容已加载完成。</lu-card>
</lu-skeleton>
<lu-skeleton :loading="loading" animated style="margin-top:24px">
  <template #template>
    <lu-skeleton-item variant="image" style="height:140px" />
    <lu-skeleton-item variant="h3" style="width:50%" />
    <lu-skeleton-item />
  </template>
  <lu-card>自定义布局的内容已加载完成。</lu-card>
</lu-skeleton>
<template #source>

```vue
<lu-skeleton :loading="loading" animated :rows="3">
  <lu-card>内容已加载完成。</lu-card>
</lu-skeleton>
<lu-skeleton :loading="loading" animated>
  <template #template>
    <lu-skeleton-item variant="image" style="height:140px" />
    <lu-skeleton-item variant="h3" style="width:50%" />
    <lu-skeleton-item />
  </template>
  <lu-card>实际内容</lu-card>
</lu-skeleton>
```

</template>
</DemoBlock>

## API

- `loading`：是否显示占位，默认 true。关闭后挂载默认插槽内容。
- `animated`：开启渐变动画，默认 false；尊重系统减少动态效果设置。
- `rows`：标题占位之外的正文行数，默认 3，负数按 0 处理，小数向下取整。
- `count`：重复占位组数，默认 1，最少 1 组。
- `loadingText`：辅助技术读出的加载提示，默认 `Loading…`。

`template` 插槽接收从 0 开始的 `{ index }`。占位内容对屏幕阅读器隐藏，容器通过 `aria-busy` 表示加载状态。

`LuSkeletonItem` 的 `variant` 支持 `text`（默认）、`p`、`h1`、`h3`、`caption`、`button`、`circle`、`rect`、`image`，可通过 style 调整尺寸。支持 `LuSkeleton` / `LuSkeletonItem` 及对应 `Epx` 别名。
