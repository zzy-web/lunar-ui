# Lunar UI

Lunar UI 是一个受 Element Plus 启发的轻量 Vue 3 组件库。它提供小巧、类型友好的组件，既可以作为 Vue 插件整体安装，也可以按需逐个导入。

## 安装

```bash
npm install @your-scope/lunar-ui
```

## 快速开始

```ts
import { createApp } from 'vue'
import LunarUI from '@your-scope/lunar-ui'
import '@your-scope/lunar-ui/dist/style.css'

createApp(App).use(LunarUI).mount('#app')
```

## 组件

- `LuButton`
- `LuInput`
- `LuCard`
- `LuForm`
- `LuFormItem`
- `LuTable`
- `LuTableColumn`
- `LuTour`
- `LuDialog`
- `LuCheckbox`
- `LuSwitch`
- `LuTag`

## 本地开发

```bash
npm run dev
npm run build
npm run docs:build
```
