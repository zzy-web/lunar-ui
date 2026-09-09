# 快速开始

Lunar UI 是基于 Vue 3.5+ 的组件库。当前仓库仍在持续开发中，包名为占位名称，尚不代表已在 npm 发布。

## 本地运行

```bash
npm ci
npm run dev
```

文档站包含可运行示例，源码可从公开仓库获取。 [GitHub](https://github.com/zzy-web/lunar-ui)

## 构建与本地安装

```bash
npm run build:lib
npm pack
# 在你的 Vue 应用中安装生成的压缩包：
npm install /path/to/your-scope-lunar-ui-0.1.0.tgz
```

## 完整注册

```ts
import { createApp } from 'vue'
import LunarUI from '@your-scope/lunar-ui'
import '@your-scope/lunar-ui/dist/style.css'
import App from './App.vue'

createApp(App).use(LunarUI).mount('#app')
```

## 按需导入

```vue
<script setup lang="ts">
import { ref } from 'vue'
import { LuInput, LuButton } from '@your-scope/lunar-ui'
import '@your-scope/lunar-ui/dist/style.css'
const name = ref('')
</script>

<template>
  <LuInput v-model="name" clearable aria-label="姓名" />
  <LuButton type="primary">保存</LuButton>
</template>
```

样式文件只需在应用入口导入一次。Input 会将 `id`、`name`、`autocomplete`、`aria-label` 等原生属性传递给输入元素。请为每个表单控件提供可访问名称。

## 开发与验证

- `npm run test:components`：组件构建、类型声明和交互检查。
- `npm run docs:build`：构建中英文文档至 `docs/.vitepress/dist`。
- `npm run build`：构建组件库和文档；组件产物保留在 `dist`。
