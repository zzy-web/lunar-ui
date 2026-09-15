# Image 图片

支持适配模式、浏览器原生懒加载、加载占位和失败重试。建议指定尺寸，避免加载时布局跳动；使用 `alt` 描述有意义的图片。

<script setup>
import { ref } from 'vue'
const broken = ref(true)
const sample = 'data:image/svg+xml,' + encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" width="400" height="240"><rect width="400" height="240" fill="#409eff"/><circle cx="290" cy="70" r="35" fill="#fff"/><path d="M0 240L140 70L300 240" fill="#213d5b"/></svg>')
</script>


## 适配与懒加载

<DemoBlock direction="column">
<lu-image :src="sample" alt="蓝色山景插图" :width="240" :height="140" fit="cover" lazy />
<template #source>

```vue
<script setup>
const sample = 'data:image/svg+xml,' + encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" width="400" height="240"><rect width="400" height="240" fill="#409eff"/><circle cx="290" cy="70" r="35" fill="#fff"/><path d="M0 240L140 70L300 240" fill="#213d5b"/></svg>')
</script>

<template>
  <lu-image :src="sample" alt="蓝色山景插图" :width="240" :height="140" fit="cover" lazy />
</template>
```

</template>
</DemoBlock>


## 失败回退

<DemoBlock direction="column">
<lu-image :src="broken ? 'data:image/png;base64,invalid' : sample" :width="240" :height="140" alt="示例图片">
  <template #placeholder>加载中…</template>
  <template #error="{ retry }"><lu-button @click="broken = false; retry()">切换有效图片并重试</lu-button></template>
</lu-image>
<template #source>

```vue
<script setup>
import { ref } from 'vue'
const broken = ref(true)
const sample = 'data:image/svg+xml,' + encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" width="400" height="240"><rect width="400" height="240" fill="#409eff"/><circle cx="290" cy="70" r="35" fill="#fff"/><path d="M0 240L140 70L300 240" fill="#213d5b"/></svg>')
</script>

<template>
  <lu-image :src="broken ? 'data:image/png;base64,invalid' : sample" :width="240" :height="140" alt="示例图片">
    <template #placeholder>加载中…</template>
    <template #error="{ retry }"><lu-button @click="broken = false; retry()">切换有效图片并重试</lu-button></template>
  </lu-image>
</template>
```

</template>
</DemoBlock>

## Image Props

| 属性 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `src` | `string` | `''` | 图片地址 |
| `srcSet` | `string` | `—` | 响应式图片源集合 |
| `sizes` | `string` | `—` | 响应式图片尺寸描述 |
| `alt` | `string` | `''` | 替代文本，装饰图可留空 |
| `fit` | `fill / contain / cover / none / scale-down` | `fill` | 图片适配方式 |
| `lazy` | `boolean` | `false` | 启用浏览器原生懒加载 |
| `width` | `string / number` | `—` | 宽度，数字按 px 处理 |
| `height` | `string / number` | `—` | 高度，数字按 px 处理 |
| `errorText` | `string` | `Image unavailable` | 默认失败说明 |



## 事件

| 事件名 | 参数 | 说明 |
| --- | --- | --- |
| `load` | `(event: Event)` | 图片加载成功时触发 |
| `error` | `(event: Event)` | 图片加载失败时触发 |



## 插槽

| 插槽名 | 插槽参数 | 说明 |
| --- | --- | --- |
| `placeholder` | `—` | 加载占位内容 |
| `error` | `{ retry: () => void }` | 失败或缺少图片源时的内容 |



## 方法

| 方法名 | 签名 | 说明 |
| --- | --- | --- |
| `retry` | `() => void` | 重新创建图片元素，不绕过浏览器缓存 |



## 使用说明

建议指定尺寸以预留空间，并使用 alt 描述有意义的图片。懒加载时机由浏览器决定。更换图片源会重置状态，旧图片的延迟事件不会覆盖当前状态。
