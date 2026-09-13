# Avatar 头像

展示图片或文字头像，图片加载失败时自动显示默认插槽；修改图片地址后重新尝试加载。

<script setup>
import { ref } from 'vue'
const failed = ref(false)
const picture = 'data:image/svg+xml,' + encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" width="80" height="80"><rect width="80" height="80" fill="#409eff"/><circle cx="40" cy="29" r="14" fill="white"/><path d="M14 80V67a26 26 0 0 1 52 0v13" fill="white"/></svg>')
</script>

## 尺寸、形状与回退

<DemoBlock>
<div style="display:flex;align-items:center;gap:16px">
  <lu-avatar :src="picture" alt="用户头像" size="large" />
  <lu-avatar shape="square" alt="Lunar UI">LU</lu-avatar>
  <lu-avatar size="small" alt="用户 A">A</lu-avatar>
  <lu-avatar :size="64" :src="failed ? 'data:image/png;base64,invalid' : picture" alt="回退示例">备用</lu-avatar>
  <lu-button @click="failed = !failed">切换失败 / 恢复</lu-button>
</div>
<template #source>

```vue
<lu-avatar src="/avatar.png" alt="用户头像" size="large">备用</lu-avatar>
<lu-avatar shape="square" alt="Lunar UI">LU</lu-avatar>
<lu-avatar :size="64" :src="src" @error="onError">备用</lu-avatar>
```

</template>
</DemoBlock>

## API

- `src` / `srcSet`：图片地址和响应式候选地址，默认空字符串。
- `alt`：图片替代文本，同时用于回退头像的无障碍名称。
- `size`：`large | default | small | number`，默认 default；预设为 56 / 40 / 24px，数字单位 px。
- `shape`：`circle | square`，默认 circle。
- `fit`：`fill | contain | cover | none | scale-down`，默认 cover。

`error(event)` 和 `load(event)` 分别在图片失败和加载完成时触发。默认插槽展示回退内容，未提供时显示 `?`。支持 `LuAvatar` 和 `EpxAvatar` 导入。
