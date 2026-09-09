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

| 属性 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `modelValue` | `boolean` | `false` | 绑定值。 |
| `disabled` | `boolean` | `false` | 是否禁用。 |
| `loading` | `boolean` | `false` | 加载状态，同时禁止切换。 |
| `activeText` | `string` | — | 开关右侧文字。 |
| `inactiveText` | `string` | — | 开关左侧文字。 |
| `size` | `'large' \| 'default' \| 'small'` | `'default'` | 组件尺寸。 |

## 事件

| 事件名 | 参数 / 签名 | 说明 |
| --- | --- | --- |
| `update:modelValue` | `(value: boolean)` | 更新绑定值。 |
| `change` | `(value: boolean)` | 用户更改值时触发。 |
