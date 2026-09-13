# Badge 徽标

在按钮或头像旁显示数量、状态或小红点。

<script setup>
import { ref } from 'vue'
const count = ref(12)
</script>

## 数量与小红点

<DemoBlock>
<div style="display:flex;gap:40px;padding:16px;align-items:center">
  <lu-badge :value="count"><lu-button @click="count++">消息 +1</lu-button></lu-badge>
  <lu-badge :value="120" :max="99"><lu-button>待办</lu-button></lu-badge>
  <lu-badge is-dot label="有新通知"><lu-button>通知</lu-button></lu-badge>
  <lu-badge value="NEW" type="primary" />
</div>
<template #source>

```vue
<lu-badge :value="count"><lu-button @click="count++">消息 +1</lu-button></lu-badge>
<lu-badge :value="120" :max="99"><lu-button>待办</lu-button></lu-badge>
<lu-badge is-dot label="有新通知"><lu-button>通知</lu-button></lu-badge>
<lu-badge value="NEW" type="primary" />
```

</template>
</DemoBlock>

## API

- `value: string | number`：展示值，默认空字符串。数值超过 `max`（默认 99）显示 `99+`，字符串原样展示。
- `isDot` / `hidden`：小红点模式 / 隐藏徽标，默认 false。
- `showZero`：是否显示数字 0，默认 true。
- `type`：`primary | success | warning | danger | info`，默认 danger。
- `color`：自定义背景色；`offset: [number, number]`：横向和纵向偏移，默认 `[0, 0]`，正值分别向右和向下移动。
- `label`：徽标的无障碍名称，建议为小红点提供明确含义。

默认插槽为附着目标，没有目标时徽标行内展示。`content` 插槽接收 `{ value, displayValue }`，可自定义非圆点内容。支持 `LuBadge` 和 `EpxBadge` 导入。
