# Progress 进度条

展示任务完成比例或不确定进度。百分比会限制到 0–100；非有限数按 0 处理。通过主题变量适配深色模式。

<script setup lang="ts">
import { ref } from 'vue'
const percentage = ref(40)
</script>

## 示例

<DemoBlock direction="column">
<lu-progress :percentage="percentage" aria-label="Upload" />
  <lu-button @click="percentage = Math.min(100, percentage + 10)">+10%</lu-button>
  <lu-button @click="percentage = 0">Reset</lu-button>
  <lu-progress :percentage="100" status="success" />
  <lu-progress :percentage="65" status="warning" :stroke-width="12" />
  <lu-progress :percentage="30" status="exception" />
  <lu-progress indeterminate aria-label="Loading" />
  <lu-progress :percentage="75" color="#8b5cf6" :format="value => value + ' / 100'" />

<template #source>

```vue
<script setup lang="ts">
import { ref } from 'vue'
const percentage = ref(40)
</script>

<template>
  <lu-progress :percentage="percentage" aria-label="Upload" />
  <lu-button @click="percentage = Math.min(100, percentage + 10)">+10%</lu-button>
  <lu-button @click="percentage = 0">Reset</lu-button>
  <lu-progress :percentage="100" status="success" />
  <lu-progress :percentage="65" status="warning" :stroke-width="12" />
  <lu-progress :percentage="30" status="exception" />
  <lu-progress indeterminate aria-label="Loading" />
  <lu-progress :percentage="75" color="#8b5cf6" :format="value => value + ' / 100'" />
</template>
```

</template>
</DemoBlock>

## Props

| 属性 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `percentage` | `number` | `0` | 进度百分比 |
| `status` | `'default' / 'success' / 'warning' / 'exception'` | `'default'` | 状态颜色 |
| `strokeWidth` | `number` | `8` | 轨道高度（像素），最小 1；非有限数按 8 处理 |
| `showText` | `boolean` | `true` | 显示文字 |
| `indeterminate` | `boolean` | `false` | 不确定进度，不设置 aria-valuenow |
| `color` | `string` | `—` | 自定义进度色，优先于状态色 |
| `ariaLabel` | `string` | `'进度'` | 进度条无障碍名称 |
| `format` | `(percentage: number) => string` | `—` | 自定义文字，接收限制后的百分比 |

## 插槽

| 插槽名 | 参数 | 说明 |
| --- | --- | --- |
| `default` | `{ percentage: number }` | 默认插槽接收 `{ percentage: number }`，可替换进度文字；`:show-text="false"` 时隐藏。 |

## 无障碍

为每个任务设置有意义的 `aria-label`。不确定进度遵循系统的减少动态效果设置。组件不触发事件。
