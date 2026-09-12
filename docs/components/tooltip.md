# Tooltip 文字提示

在鼠标悬停或键盘聚焦时补充简短说明。支持自动避让视口边缘、延迟显示和受控状态。

<script setup>
import { ref } from 'vue'
const visible = ref(false)
</script>

## 基础用法

默认插槽放置触发元素，`content` 设置提示内容。原生按钮或 `LuButton` 可直接通过 Tab 聚焦；文本触发器自动获得键盘焦点能力。Escape 关闭提示。

<DemoBlock>
  <lu-tooltip content="保存当前编辑内容"><lu-button>保存</lu-button></lu-tooltip>
  <lu-tooltip content="提示可以通过键盘焦点打开" effect="light"><span>聚焦这段文字</span></lu-tooltip>
  <lu-tooltip content="不会显示" disabled><lu-button>已禁用提示</lu-button></lu-tooltip>
  <template #source>

```vue
<lu-tooltip content="保存当前编辑内容">
  <lu-button>保存</lu-button>
</lu-tooltip>
<lu-tooltip content="提示可以通过键盘焦点打开" effect="light">
  <span>聚焦这段文字</span>
</lu-tooltip>
<lu-tooltip content="不会显示" disabled><lu-button>已禁用提示</lu-button></lu-tooltip>
```

  </template>
</DemoBlock>

## 方向与对齐

`placement` 支持上下左右四个方向，以及 `-start`、`-end` 对齐。空间不足时自动翻转，浮层随滚动与窗口尺寸变化更新位置。

<DemoBlock>
  <lu-tooltip v-for="placement in ['top', 'bottom', 'left', 'right', 'bottom-start', 'bottom-end']"
    :key="placement" :placement="placement" :content="'当前方向：' + placement">
    <lu-button size="small">{{ placement }}</lu-button>
  </lu-tooltip>
  <template #source>

```vue
<lu-tooltip placement="bottom-start" content="底部起始位置" :offset="10">
  <lu-button>查看提示</lu-button>
</lu-tooltip>
```

  </template>
</DemoBlock>

## 自定义内容与延迟

`content` 插槽优先于属性。鼠标移入提示内容时保持显示，方便阅读较长文本。内容应为说明文字，不要放入按钮、输入框等交互控件。

<DemoBlock>
  <lu-tooltip :show-after="300" :hide-after="200" effect="light">
    <lu-button>查看快捷键</lu-button>
    <template #content><strong>保存修改</strong><br />Windows：Ctrl + S<br />macOS：⌘ + S</template>
  </lu-tooltip>
  <template #source>

```vue
<lu-tooltip :show-after="300" :hide-after="200" effect="light">
  <lu-button>查看快捷键</lu-button>
  <template #content><strong>保存修改</strong><br />Ctrl + S / ⌘ + S</template>
</lu-tooltip>
```

  </template>
</DemoBlock>

## 受控显示

使用 `v-model:visible` 同步显示状态。禁用状态优先于受控值；空内容不会显示浮层。

<DemoBlock>
  <lu-switch v-model="visible" aria-label="显示提示" />
  <lu-tooltip v-model:visible="visible" content="显示状态与开关联动"><lu-button>受控提示</lu-button></lu-tooltip>
  <template #source>

```vue
<script setup>
import { ref } from 'vue'
const visible = ref(false)
</script>
<template>
  <lu-switch v-model="visible" aria-label="显示提示" />
  <lu-tooltip v-model:visible="visible" content="显示状态与开关联动">
    <lu-button>受控提示</lu-button>
  </lu-tooltip>
</template>
```

  </template>
</DemoBlock>

## Props

| 属性 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `content` | `string` | `''` | 提示文字，插槽优先。 |
| `placement` | `FloatingPlacement` | `'top'` | `top / bottom / left / right`，可附加 `-start / -end`。 |
| `effect` | `'dark' \| 'light'` | `'dark'` | 对比色或浅色浮层，跟随主题变量。 |
| `disabled` | `boolean` | `false` | 禁用提示并取消待显示计时器。 |
| `visible` | `boolean` | `undefined` | 受控显示状态，支持 `v-model:visible`。 |
| `showAfter` | `number` | `150` | 显示延迟，毫秒；0 表示立即显示。 |
| `hideAfter` | `number` | `100` | 隐藏延迟，毫秒。 |
| `offset` | `number` | `8` | 提示与触发元素的间距，像素。 |
| `teleported` | `boolean` | `true` | 将浮层挂到 body，避免滚动容器裁切。 |

## 事件

| 事件名 | 参数 | 说明 |
| --- | --- | --- |
| `update:visible` | `(visible: boolean)` | 请求更新显示状态。 |
| `visible-change` | `(visible: boolean)` | 实际显示状态变化后触发。 |

## 插槽

| 插槽名 | 参数 | 说明 |
| --- | --- | --- |
| `default` | — | 单个触发元素，原有事件与 `aria-describedby` 保留。纯文本也可使用。 |
| `content` | — | 自定义非交互提示内容。 |

## 使用说明

组件提供 `role="tooltip"`，通过 `aria-describedby` 与触发元素关联。自定义触发组件需将属性透传到可聚焦的根元素。原生 disabled 按钮无法通过键盘聚焦；需要解释禁用原因时，请使用可聚焦文本作为触发器。

默认浮层挂到 body。主题变量建议在 `:root` 或 `html.dark` 定义；使用局部主题或带 transform 的祖先时，优先保留默认传送行为。`teleported=false` 可用于没有裁切或变换祖先的布局。SSR 初始受控显示应在客户端挂载后开启。
