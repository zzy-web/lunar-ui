# Collapse 折叠面板

使用 CollapseItem 组织可折叠内容，支持多开、手风琴、异步拦截和自定义标题。

<script setup>
import { ref } from 'vue'
const open = ref(['overview'])
const accordion = ref('account')
const guarded = ref([])
const allow = ref(true)
const guard = async () => {
  await new Promise(resolve => setTimeout(resolve, 500))
  return allow.value
}
</script>

## 多面板与禁用项

<DemoBlock direction="column">
<lu-collapse v-model="open">
  <lu-collapse-item name="overview" title="Overview">Lunar UI uses Vue 3 and theme variables.</lu-collapse-item>
  <lu-collapse-item name="details" title="Details">Each panel can be expanded independently.</lu-collapse-item>
  <lu-collapse-item name="locked" title="Locked" disabled>Unavailable content</lu-collapse-item>
</lu-collapse>
<template #source>

```vue
<script setup>
import { ref } from 'vue'
const open = ref(['overview'])
const accordion = ref('account')
const guarded = ref([])
const allow = ref(true)
const guard = async () => {
  await new Promise(resolve => setTimeout(resolve, 500))
  return allow.value
}
</script>

<template>
  <lu-collapse v-model="open">
    <lu-collapse-item name="overview" title="Overview">Lunar UI uses Vue 3 and theme variables.</lu-collapse-item>
    <lu-collapse-item name="details" title="Details">Each panel can be expanded independently.</lu-collapse-item>
    <lu-collapse-item name="locked" title="Locked" disabled>Unavailable content</lu-collapse-item>
  </lu-collapse>
</template>
```

</template>
</DemoBlock>

## 手风琴与标题插槽

<DemoBlock direction="column">
<lu-collapse v-model="accordion" accordion expand-icon-position="left">
  <lu-collapse-item name="account">
    <template #title="{ isActive }">Account <lu-tag size="small">{{ isActive ? 'Open' : 'Closed' }}</lu-tag></template>
    Edit your profile and preferences.
  </lu-collapse-item>
  <lu-collapse-item name="security" title="Security">Configure account security.</lu-collapse-item>
</lu-collapse>
<template #source>

```vue
<script setup>
import { ref } from 'vue'
const open = ref(['overview'])
const accordion = ref('account')
const guarded = ref([])
const allow = ref(true)
const guard = async () => {
  await new Promise(resolve => setTimeout(resolve, 500))
  return allow.value
}
</script>

<template>
  <lu-collapse v-model="accordion" accordion expand-icon-position="left">
    <lu-collapse-item name="account">
      <template #title="{ isActive }">Account <lu-tag size="small">{{ isActive ? 'Open' : 'Closed' }}</lu-tag></template>
      Edit your profile and preferences.
    </lu-collapse-item>
    <lu-collapse-item name="security" title="Security">Configure account security.</lu-collapse-item>
  </lu-collapse>
</template>
```

</template>
</DemoBlock>

## 异步展开拦截

<DemoBlock direction="column">
<lu-switch v-model="allow" active-text="Allow changes" />
<lu-collapse v-model="guarded" :before-collapse="guard">
  <lu-collapse-item name="guarded" title="Wait 500ms before changing">The guard accepted this change.</lu-collapse-item>
</lu-collapse>
<template #source>

```vue
<script setup>
import { ref } from 'vue'
const open = ref(['overview'])
const accordion = ref('account')
const guarded = ref([])
const allow = ref(true)
const guard = async () => {
  await new Promise(resolve => setTimeout(resolve, 500))
  return allow.value
}
</script>

<template>
  <lu-switch v-model="allow" active-text="Allow changes" />
  <lu-collapse v-model="guarded" :before-collapse="guard">
    <lu-collapse-item name="guarded" title="Wait 500ms before changing">The guard accepted this change.</lu-collapse-item>
  </lu-collapse>
</template>
```

</template>
</DemoBlock>

## 延迟渲染与销毁

<DemoBlock direction="column">
<lu-collapse>
  <lu-collapse-item name="retained" title="Lazy: value is retained" lazy><lu-input-number label="Retained quantity" /></lu-collapse-item>
  <lu-collapse-item name="destroyed" title="Destroy on close: value resets" destroy-on-close><lu-input-number label="Reset quantity" /></lu-collapse-item>
</lu-collapse>
<template #source>

```vue
<script setup>
import { ref } from 'vue'
const open = ref(['overview'])
const accordion = ref('account')
const guarded = ref([])
const allow = ref(true)
const guard = async () => {
  await new Promise(resolve => setTimeout(resolve, 500))
  return allow.value
}
</script>

<template>
  <lu-collapse>
    <lu-collapse-item name="retained" title="Lazy: value is retained" lazy><lu-input-number label="Retained quantity" /></lu-collapse-item>
    <lu-collapse-item name="destroyed" title="Destroy on close: value resets" destroy-on-close><lu-input-number label="Reset quantity" /></lu-collapse-item>
  </lu-collapse>
</template>
```

</template>
</DemoBlock>

## 交互说明

多个面板使用名称数组；手风琴使用单个 string / number，null 表示全部关闭（支持数字 0 和空字符串作为名称）。标题使用原生按钮，可用 Enter / 空格展开，上下方向键及 Home / End 移动焦点并跳过禁用项。所有名称需唯一。

## Collapse Props

| 属性 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `modelValue` | `CollapseValue` | `[]` | 展开名称；手风琴关闭值为 null |
| `accordion` | `boolean` | `false` | 最多展开一个面板 |
| `disabled` | `boolean` | `false` | 禁用整个分组 |
| `expandIconPosition` | `left / right` | `right` | 箭头位置 |
| `beforeCollapse` | `(name, expanded) => boolean / void / Promise` | `—` | 返回 false 或拒绝 Promise 阻止切换 |

## 事件

`update:modelValue(value)` / `change(value)`：切换成功时触发；`collapse-error(error)`：拦截函数抛出或 Promise 拒绝时触发。等待期间忽略重复操作；外部值、模式或禁用状态变化会使旧请求失效。

## 插槽

Collapse 的 `default` 放置 CollapseItem。CollapseItem 的 `default` 渲染内容，`title` / `icon` 接收 `{ isActive }`。不要在标题按钮内嵌套交互元素。

## 类型与补充 API

CollapseItem Props：`name: string | number` 必填；`title: string = ''`；`disabled: boolean = false`；`lazy: boolean = false`（首次展开才挂载）；`destroyOnClose: boolean = false`（关闭卸载，优先于 lazy）。Collapse ref 暴露只读 `activeNames`；CollapseItem ref 暴露 `isActive`。

功能参考：[Element Plus Collapse](https://element-plus.org/en-US/component/collapse.html)。本页 API 以 Lunar UI 实际实现为准，不保证与 Element Plus 完全兼容。
