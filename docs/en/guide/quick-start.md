# Quick start

Lunar UI is a Vue 3.5+ component library. This repository is in active development; the package name is currently a placeholder, not a confirmed npm release.

## Run locally

```bash
npm ci
npm run dev
```

The documentation includes runnable examples. Use the public repository for the source. [GitHub](https://github.com/zzy-web/lunar-ui)

## Build and install locally

```bash
npm run build:lib
npm pack
# In your Vue application, install the generated tarball:
npm install /path/to/your-scope-lunar-ui-0.1.0.tgz
```

## Register all components

```ts
import { createApp } from 'vue'
import LunarUI from '@your-scope/lunar-ui'
import '@your-scope/lunar-ui/dist/style.css'
import App from './App.vue'

createApp(App).use(LunarUI).mount('#app')
```

## Named imports

```vue
<script setup lang="ts">
import { ref } from 'vue'
import { LuInput, LuButton } from '@your-scope/lunar-ui'
import '@your-scope/lunar-ui/dist/style.css'
const name = ref('')
</script>

<template>
  <LuInput v-model="name" clearable aria-label="Name" />
  <LuButton type="primary">Save</LuButton>
</template>
```

Import the stylesheet once at your application entry. Native attributes such as `id`, `name`, `autocomplete` and `aria-label` reach the Input control. Give every form control an accessible label.

## Validation commands

- `npm run test:components`：library build, type declarations and interaction checks.
- `npm run docs:build`：build both documentation languages into `docs/.vitepress/dist`.
- `npm run build`：build the library and documentation; library files stay in `dist`.
