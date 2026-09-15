# Image

Image fitting, native lazy loading, placeholders and retry. Set dimensions to reserve space and provide meaningful alternative text.

<script setup>
import { ref } from 'vue'
const broken = ref(true)
const sample = 'data:image/svg+xml,' + encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" width="400" height="240"><rect width="400" height="240" fill="#409eff"/><circle cx="290" cy="70" r="35" fill="#fff"/></svg>')
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



## Events

| Event | Parameters | Description |
| --- | --- | --- |
| `load` | `(event: Event)` | Emitted when the image loads |
| `error` | `(event: Event)` | Emitted when the image fails |



## Slots

| Slot | Parameters | Description |
| --- | --- | --- |
| `placeholder` | `—` | Loading placeholder |
| `error` | `{ retry: () => void }` | Content for errors or missing sources |



## Methods

| Method | Signature | Description |
| --- | --- | --- |
| `retry` | `() => void` | Recreate the image without bypassing browser caching |



## Usage notes

Set dimensions to reserve space and use alt for meaningful images. The browser determines lazy-load timing. Source changes reset state; late events from earlier images are ignored.
