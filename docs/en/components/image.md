# Image

Image fitting, native lazy loading, placeholders and retry. Set dimensions to reserve space and provide meaningful alternative text.

<script setup>
import { ref } from 'vue'
const broken = ref(true)
const sample = 'data:image/svg+xml,' + encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" width="400" height="240"><rect width="400" height="240" fill="#409eff"/><circle cx="290" cy="70" r="35" fill="#fff"/></svg>')
const image = ref()
const gallery = ['#409eff', '#67c23a', '#e6a23c'].map((color, index) =>
  'data:image/svg+xml,' + encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" width="800" height="480"><rect width="800" height="480" fill="${color}"/><circle cx="580" cy="140" r="70" fill="white"/><text x="60" y="380" fill="white" font-size="80">${index + 1}</text></svg>`)
)
</script>


## Basic usage

<DemoBlock direction="column">
<lu-image :src="sample" alt="White circle on blue" :width="240" :height="140" fit="cover" lazy />
<template #source>

```vue
<script setup>
const sample = 'data:image/svg+xml,' + encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" width="400" height="240"><rect width="400" height="240" fill="#409eff"/><circle cx="290" cy="70" r="35" fill="#fff"/></svg>')
</script>

<template>
  <lu-image :src="sample" alt="White circle on blue" :width="240" :height="140" fit="cover" lazy />
</template>
```

</template>
</DemoBlock>


## Error and retry

<DemoBlock direction="column">
<lu-image :src="broken ? 'data:image/png;base64,invalid' : sample" :width="240" :height="140" alt="Example">
  <template #placeholder>Loading…</template>
  <template #error="{ retry }"><lu-button @click="broken = false; retry()">Use valid image and retry</lu-button></template>
</lu-image>
<template #source>

```vue
<script setup>
import { ref } from 'vue'
const broken = ref(true)
const sample = 'data:image/svg+xml,' + encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" width="400" height="240"><rect width="400" height="240" fill="#409eff"/><circle cx="290" cy="70" r="35" fill="#fff"/></svg>')
</script>

<template>
  <lu-image :src="broken ? 'data:image/png;base64,invalid' : sample" :width="240" :height="140" alt="Example">
    <template #placeholder>Loading…</template>
    <template #error="{ retry }"><lu-button @click="broken = false; retry()">Use valid image and retry</lu-button></template>
  </lu-image>
</template>
```

</template>
</DemoBlock>

## Image group preview

Click the loaded image or the button to open the viewer. Use the toolbar to zoom, rotate and reset; drag the image to pan.

<DemoBlock direction="column">
<lu-image ref="image" :src="gallery[0]" :preview-src-list="gallery" :width="280" :height="168" fit="cover" alt="Gallery illustration" preview-label="Gallery preview" :infinite="false" hide-on-click-modal />
<lu-button @click="image?.showPreview(1)">Open second image</lu-button>
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
  <lu-image ref="image" :src="gallery[0]" :preview-src-list="gallery" :width="280" :height="168" fit="cover" alt="Gallery illustration" preview-label="Gallery preview" :infinite="false" hide-on-click-modal />
  <lu-button @click="image?.showPreview(1)">Open second image</lu-button>
</template>
```

</template>
</DemoBlock>

## Single image preview

<DemoBlock direction="column">
<lu-image :src="sample" :width="240" :height="140" alt="Landscape" preview />
<template #source>

```vue
<script setup>
const sample = 'data:image/svg+xml,' + encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" width="400" height="240"><rect width="400" height="240" fill="#409eff"/><circle cx="290" cy="70" r="35" fill="#fff"/></svg>')
</script>

<template>
  <lu-image :src="sample" :width="240" :height="140" alt="Landscape" preview />
</template>
```

</template>
</DemoBlock>

## Image Props

| Property | Type | Default | Description |
| --- | --- | --- | --- |
| `src` | `string` | `''` | Image URL |
| `srcSet` | `string` | `—` | Responsive image sources |
| `sizes` | `string` | `—` | Responsive image sizes |
| `alt` | `string` | `''` | Alternative text; leave empty for decorative images |
| `fit` | `fill / contain / cover / none / scale-down` | `fill` | Image fitting mode |
| `lazy` | `boolean` | `false` | Enable native browser lazy loading |
| `width` | `string / number` | `—` | Width; numbers are pixels |
| `height` | `string / number` | `—` | Height; numbers are pixels |
| `errorText` | `string` | `Image unavailable` | Default error message |
| `preview` | `boolean` | `false` | Enable preview of the current image |
| `previewSrcList` | `string[]` | `[]` | Preview sources; a nonempty list enables preview, empty URLs are filtered |
| `initialIndex` | `number` | `0` | Initial zero-based index, clamped to the list |
| `infinite` | `boolean` | `true` | Wrap around when navigating |
| `hideOnClickModal` | `boolean` | `false` | Close when clicking the preview backdrop |
| `minScale` | `number` | `0.2` | Minimum zoom; positive values are capped at 1 |
| `maxScale` | `number` | `7` | Maximum zoom, at least 1 |
| `zoomRate` | `number` | `1.2` | Zoom multiplier per step, greater than 1 |
| `previewLabel` | `string` | `Image preview` | Accessible name of the trigger and viewer |

## Events

| Event | Parameters | Description |
| --- | --- | --- |
| `load` | `(event: Event)` | Emitted when the image loads |
| `error` | `(event: Event)` | Emitted when the image fails |
| `show` | `()` | Emitted when the viewer opens |
| `close` | `()` | Emitted when the viewer closes |
| `switch` | `(index: number)` | Emitted on image changes with a zero-based index |

## Slots

| Slot | Parameters | Description |
| --- | --- | --- |
| `placeholder` | `—` | Loading placeholder |
| `error` | `{ retry: () => void }` | Content for errors or missing sources |
| `preview-icon` | `—` | Decorative overlay on the preview trigger; do not nest interactive controls |

## Methods

| Method | Signature | Description |
| --- | --- | --- |
| `retry` | `() => void` | Recreate the image without bypassing browser caching |
| `showPreview` | `(index?: number) => void` | Open preview; defaults to initialIndex, no-op without sources |
| `closePreview` | `() => void` | Close the viewer |

## Usage notes

Set dimensions to reserve space and use alt for meaningful images. The browser determines lazy-load timing. Source changes reset state; late events from earlier images are ignored.

The viewer is teleported to the document body and locks page scrolling while open. Tab stays inside the viewer and closing restores focus. Escape closes, Left/Right switches images, +/− or the mouse wheel zooms, R/Shift+R rotates, and 0 resets. Switching or retrying resets the view. Invalid zoom settings use defaults. Preview load failures have their own retry action; load/error events describe the thumbnail. The preview source list takes precedence over preview; disable both to remove preview. The preview-icon slot is decorative.
