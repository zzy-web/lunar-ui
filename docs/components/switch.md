# Switch 开关

切换布尔状态。加载或禁用时不会触发更新；没有文本时请提供 `aria-label`。

<script setup>
import { ref } from 'vue'
const enabled = ref(false)
</script>

## 示例

<DemoBlock>
<lu-switch v-model="enabled" active-text="Notifications" />
<lu-switch :model-value="true" disabled aria-label="Disabled switch" />
<lu-switch loading aria-label="Saving" />
<lu-switch size="small" aria-label="Small switch" />
<lu-switch size="large" aria-label="Large switch" />

<template #source>

```vue
<script setup lang="ts">
import { ref } from 'vue'
const enabled = ref(false)
</script>

<template>
  <lu-switch v-model="enabled" active-text="Notifications" />
  <lu-switch :model-value="true" disabled aria-label="Disabled switch" />
  <lu-switch loading aria-label="Saving" />
  <lu-switch size="small" aria-label="Small switch" />
  <lu-switch size="large" aria-label="Large switch" />
</template>
```

</template>
</DemoBlock>

## Props

- `modelValue`: 布尔值，默认 `false`.
- `disabled` / `loading`: 布尔值，默认 `false`.
- `activeText` / `inactiveText`: 字符串。
- `size`: `large`, `default` 或 `small`. 默认 `default`.

## 事件

`update:modelValue` / `change`: `(value: boolean)`.
