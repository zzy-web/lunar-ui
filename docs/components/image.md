# Image 图片

支持适配模式、浏览器原生懒加载、加载占位和失败重试。建议指定尺寸，避免加载时布局跳动；使用 `alt` 描述有意义的图片。

<script setup>
import { ref } from 'vue'
const broken = ref(true)
const sample = 'data:image/svg+xml,' + encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" width="400" height="240"><rect width="400" height="240" fill="#409eff"/><circle cx="290" cy="70" r="35" fill="#fff"/><path d="M0 240L140 70L300 240" fill="#213d5b"/></svg>')
const image = ref()
const gallery = ['#409eff', '#67c23a', '#e6a23c'].map((color, index) =>
  'data:image/svg+xml,' + encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" width="800" height="480"><rect width="800" height="480" fill="${color}"/><circle cx="580" cy="140" r="70" fill="white"/><text x="60" y="380" fill="white" font-size="80">${index + 1}</text></svg>`)
)
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

## 图片组预览

点击加载成功的图片或下方按钮打开预览。工具栏支持缩放、旋转和重置，拖动图片可调整查看位置。

<DemoBlock direction="column">
<lu-image ref="image" :src="gallery[0]" :preview-src-list="gallery" :width="280" :height="168" fit="cover" alt="Gallery illustration" preview-label="图片组预览" :infinite="false" hide-on-click-modal />
<lu-button @click="image?.showPreview(1)">打开第二张图片</lu-button>
<template #source>

```vue
<script setup>
import { ref } from 'vue'
const image = ref()
const gallery = ['#409eff', '#67c23a', '#e6a23c'].map((color, index) =>
  'data:image/svg+xml,' + encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" width="800" height="480"><rect width="800" height="480" fill="${color}"/><circle cx="580" cy="140" r="70" fill="white"/><text x="60" y="380" fill="white" font-size="80">${index + 1}</text></svg>`)
)
</script>

<template>
  <lu-image ref="image" :src="gallery[0]" :preview-src-list="gallery" :width="280" :height="168" fit="cover" alt="Gallery illustration" preview-label="图片组预览" :infinite="false" hide-on-click-modal />
  <lu-button @click="image?.showPreview(1)">打开第二张图片</lu-button>
</template>
```

</template>
</DemoBlock>

## 单图预览

<DemoBlock direction="column">
<lu-image :src="sample" :width="240" :height="140" alt="Landscape" preview />
<template #source>

```vue
<script setup>
const sample = 'data:image/svg+xml,' + encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" width="400" height="240"><rect width="400" height="240" fill="#409eff"/><circle cx="290" cy="70" r="35" fill="#fff"/><path d="M0 240L140 70L300 240" fill="#213d5b"/></svg>')
</script>

<template>
  <lu-image :src="sample" :width="240" :height="140" alt="Landscape" preview />
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
| `preview` | `boolean` | `false` | 启用当前图片的单图预览 |
| `previewSrcList` | `string[]` | `[]` | 预览图片组，非空时自动启用预览；空地址会被过滤 |
| `initialIndex` | `number` | `0` | 默认起始索引，从零开始，越界值自动限制 |
| `infinite` | `boolean` | `true` | 图片组循环切换 |
| `hideOnClickModal` | `boolean` | `false` | 点击预览背景关闭 |
| `minScale` | `number` | `0.2` | 最小缩放倍率，有效范围大于 0 且不超过 1 |
| `maxScale` | `number` | `7` | 最大缩放倍率，至少为 1 |
| `zoomRate` | `number` | `1.2` | 每次缩放的倍率，必须大于 1 |
| `previewLabel` | `string` | `Image preview` | 预览按钮及预览窗口的无障碍名称 |

## 事件

| 事件名 | 参数 | 说明 |
| --- | --- | --- |
| `load` | `(event: Event)` | 图片加载成功时触发 |
| `error` | `(event: Event)` | 图片加载失败时触发 |
| `show` | `()` | 预览打开时触发 |
| `close` | `()` | 预览关闭时触发 |
| `switch` | `(index: number)` | 图片切换时触发，索引从零开始 |

## 插槽

| 插槽名 | 插槽参数 | 说明 |
| --- | --- | --- |
| `placeholder` | `—` | 加载占位内容 |
| `error` | `{ retry: () => void }` | 失败或缺少图片源时的内容 |
| `preview-icon` | `—` | 预览按钮上的装饰内容，不应嵌套交互控件 |

## 方法

| 方法名 | 签名 | 说明 |
| --- | --- | --- |
| `retry` | `() => void` | 重新创建图片元素，不绕过浏览器缓存 |
| `showPreview` | `(index?: number) => void` | 打开预览，默认使用 initialIndex，无图片源时不操作 |
| `closePreview` | `() => void` | 关闭预览 |

## 使用说明

建议指定尺寸以预留空间，并使用 alt 描述有意义的图片。懒加载时机由浏览器决定。更换图片源会重置状态，旧图片的延迟事件不会覆盖当前状态。

预览窗口挂载到 body，打开时锁定页面滚动。Tab 在预览窗口内循环，关闭后返回原焦点。Escape 关闭，左右方向键切图，+/− 或滚轮缩放，R / Shift+R 旋转，0 重置。切图或重试会重置视图。无效缩放配置使用默认值。预览加载失败时提供独立重试按钮；load/error 事件仅描述缩略图加载。previewSrcList 优先于 preview，关闭预览需同时清空图片组并关闭 preview。preview-icon 仅用于装饰。
