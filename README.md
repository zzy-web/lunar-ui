# Lunar UI

A compact Vue 3 component library inspired by Element Plus.

## Install

```bash
npm install @your-scope/lunar-ui
```

## Use

```ts
import { createApp } from 'vue'
import LunarUI from '@your-scope/lunar-ui'
import '@your-scope/lunar-ui/dist/style.css'

createApp(App).use(LunarUI).mount('#app')
```

## Components

- `EpxButton`
- `EpxInput`
- `EpxCard`

## Publish

Update `name` in `package.json`, then run:

```bash
npm login
npm run release
```
