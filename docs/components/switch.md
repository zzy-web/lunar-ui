# Switch 开关

切换布尔、字符串或数值状态。加载或禁用时不会触发更新；没有文本时请提供 `aria-label`。

<script setup>
import { ref } from 'vue'
const enabled = ref(false)
const savedState = ref('off')
const confirmToggle = () => new Promise(resolve => setTimeout(() => resolve(true), 600))
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
| `modelValue` | `boolean \| string \| number` | `false` | 绑定值。 |
| `disabled` | `boolean` | `false` | 是否禁用。 |
| `loading` | `boolean` | `false` | 加载状态，同时禁止切换。 |
| `activeText` | `string` | — | 开关右侧文字。 |
| `inactiveText` | `string` | — | 开关左侧文字。 |
| `size` | `'large' \| 'default' \| 'small'` | `'default'` | 组件尺寸。 |

## 事件

| 事件名 | 参数 / 签名 | 说明 |
| --- | --- | --- |
| `update:modelValue` | `(value: boolean \| string \| number)` | 更新绑定值。 |
| `change` | `(value: boolean \| string \| number)` | 用户更改值时触发。 |

## 异步确认与自定义值

<DemoBlock>
<lu-switch v-model="savedState" active-value="on" inactive-value="off" :before-change="confirmToggle" active-text="Save preference" />
<span>{{ savedState }}</span>
<template #source>

```vue
<script setup>
import { ref } from 'vue'
const savedState = ref('off')
const confirmToggle = () => new Promise(resolve => setTimeout(() => resolve(true), 600))
</script>
<template>
  <lu-switch v-model="savedState" active-value="on" inactive-value="off" :before-change="confirmToggle" active-text="Save preference" />
</template>
```

</template>
</DemoBlock>

`activeValue`、`inactiveValue` 支持 boolean、string、number，默认 true/false。`beforeChange(): boolean | Promise<boolean>` 返回 false 可取消切换；等待期间自动显示加载并阻止重复点击。外部值或禁用状态变化使旧结果失效，异常通过 `change-error(error)` 发出且不会切换。实例提供 `focus()`、`blur()`。示例用 600 毫秒延迟模拟保存。

置于 `LuForm` 内时，此组件继承表单禁用状态和默认尺寸，组件/分组显式尺寸优先。详见 [Form 表单](./form)。
