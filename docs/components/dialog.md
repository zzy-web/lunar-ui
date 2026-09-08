# Dialog 对话框

`LuDialog` 用于在页面上方以模态层展示内容，组件标签为 `<lu-dialog>`。它支持 `v-model`、标题和底部插槽、按 Escape 关闭、点击遮罩关闭、锁定页面滚动、内容居中，以及关闭后销毁内容。

<script setup>
import { ref } from 'vue'

const basicVisible = ref(false)
const centeredVisible = ref(false)
</script>

## 基础用法

使用 `v-model` 控制对话框显示状态。

<DemoBlock>
  <lu-button type="primary" @click="basicVisible = true">打开对话框</lu-button>

  <lu-dialog v-model="basicVisible" title="确认更新" width="420px">
    <p>这里是对话框内容。</p>

    <template #footer>
      <lu-button @click="basicVisible = false">取消</lu-button>
      <lu-button type="primary" @click="basicVisible = false">确认</lu-button>
    </template>
  </lu-dialog>

  <template #source>

```vue
<script setup lang="ts">
import { ref } from 'vue'

const visible = ref(false)
</script>

<template>
  <lu-button type="primary" @click="visible = true">打开对话框</lu-button>

  <lu-dialog v-model="visible" title="确认更新" width="420px">
    <p>这里是对话框内容。</p>

    <template #footer>
      <lu-button @click="visible = false">取消</lu-button>
      <lu-button type="primary" @click="visible = false">确认</lu-button>
    </template>
  </lu-dialog>
</template>
```

  </template>
</DemoBlock>

## 居中对话框

添加 `center` 可以让正文和底部操作居中。

<DemoBlock>
  <lu-button @click="centeredVisible = true">打开居中对话框</lu-button>

  <lu-dialog v-model="centeredVisible" title="提示" width="360px" center>
    <p>这个对话框会让正文和底部操作居中显示。</p>

    <template #footer>
      <lu-button type="primary" @click="centeredVisible = false">知道了</lu-button>
    </template>
  </lu-dialog>

  <template #source>

```vue
<template>
  <lu-dialog v-model="visible" title="提示" width="360px" center>
    <p>这个对话框会让正文和底部操作居中显示。</p>

    <template #footer>
      <lu-button type="primary" @click="visible = false">知道了</lu-button>
    </template>
  </lu-dialog>
</template>
```

  </template>
</DemoBlock>

## Props

| 属性 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `modelValue` | `boolean` | 必填 | 通过 `v-model` 控制对话框显示状态。 |
| `title` | `string` | `undefined` | 对话框标题。 |
| `ariaLabel` | `string` | `undefined` | 未渲染标题时使用的无障碍标签。 |
| `width` | `string` | `50%` | 对话框宽度。 |
| `top` | `string` | `15vh` | 对话框顶部间距。 |
| `modal` | `boolean` | `true` | 是否显示遮罩背景。 |
| `lockScroll` | `boolean` | `true` | 打开时是否锁定页面滚动。 |
| `closeOnClickModal` | `boolean` | `true` | 点击遮罩时是否关闭。 |
| `closeOnPressEscape` | `boolean` | `true` | 按 Escape 时是否关闭。 |
| `showClose` | `boolean` | `true` | 是否显示头部关闭按钮。 |
| `center` | `boolean` | `false` | 是否让正文和底部操作居中显示。 |
| `destroyOnClose` | `boolean` | `false` | 关闭后是否从 DOM 中移除对话框内容。 |

## 事件

| 事件名 | 说明 |
| --- | --- |
| `open` | 对话框开始打开时触发。 |
| `opened` | 打开动画结束后触发。 |
| `close` | 对话框请求关闭时触发。 |
| `closed` | 关闭动画结束后触发。 |

## 插槽

| 插槽名 | 说明 |
| --- | --- |
| `default` | 对话框主体内容。 |
| `header` | 自定义头部内容。 |
| `footer` | 底部操作区。 |
