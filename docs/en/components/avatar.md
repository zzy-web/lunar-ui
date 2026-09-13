# Avatar

Display a profile image or fallback content. Changing the image source retries loading after failure.

<script setup>
import { ref } from 'vue'
const failed = ref(false)
const picture = 'data:image/svg+xml,' + encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" width="80" height="80"><rect width="80" height="80" fill="#409eff"/><circle cx="40" cy="29" r="14" fill="white"/><path d="M14 80V67a26 26 0 0 1 52 0v13" fill="white"/></svg>')
</script>

## Sizes, shapes and fallback

<DemoBlock>
<div style="display:flex;align-items:center;gap:16px">
  <lu-avatar :src="picture" alt="Profile" size="large" />
  <lu-avatar shape="square" alt="Lunar UI">LU</lu-avatar>
  <lu-avatar size="small" alt="User A">A</lu-avatar>
  <lu-avatar :size="64" :src="failed ? 'data:image/png;base64,invalid' : picture" alt="Fallback demo">LU</lu-avatar>
  <lu-button @click="failed = !failed">Fail / recover</lu-button>
</div>
<template #source>

```vue
<lu-avatar src="/avatar.png" alt="Profile" size="large">LU</lu-avatar>
<lu-avatar shape="square" alt="Lunar UI">LU</lu-avatar>
<lu-avatar :size="64" :src="src" @error="onError">Fallback</lu-avatar>
```

</template>
</DemoBlock>

## API

- `src` / `srcSet`: image URL and responsive candidates, default `''`.
- `alt`: alternative text and accessible name for the fallback.
- `size`: `large | default | small | number`, default default. Presets are 56 / 40 / 24px; numbers use pixels.
- `shape`: `circle | square`, default circle.
- `fit`: `fill | contain | cover | none | scale-down`, default cover.

`error(event)` and `load(event)` report image failure and completion. The default slot supplies fallback content; without it the fallback is `?`. Exports: `LuAvatar`, `EpxAvatar`.
