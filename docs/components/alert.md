# Alert 提示

在页面内显示操作反馈或需要注意的信息。支持语义类型、图标、描述与关闭操作。

<script setup>
import { ref } from 'vue'
const version = ref(0)
</script>

## 语义类型

<DemoBlock direction="column">
<lu-alert title="Saved successfully" type="success" show-icon :closable="false" />
<lu-alert title="A new version is available" type="info" show-icon :closable="false" />
<lu-alert title="Review your changes" type="warning" show-icon :closable="false" />
<lu-alert title="Unable to save" type="error" show-icon :closable="false" />
<template #source>

```vue
<script setup>
import { ref } from 'vue'
const version = ref(0)
</script>

<template>
  <lu-alert title="Saved successfully" type="success" show-icon :closable="false" />
  <lu-alert title="A new version is available" type="info" show-icon :closable="false" />
  <lu-alert title="Review your changes" type="warning" show-icon :closable="false" />
  <lu-alert title="Unable to save" type="error" show-icon :closable="false" />
</template>
```

</template>
</DemoBlock>

## 描述与关闭

<DemoBlock direction="column">
<lu-alert :key="version" title="Unsaved changes" description="Save your work before leaving this page." type="warning" show-icon close-label="Dismiss warning" />
<lu-button size="small" @click="version++">Reset alert</lu-button>
<template #source>

```vue
<script setup>
import { ref } from 'vue'
const version = ref(0)
</script>

<template>
  <lu-alert :key="version" title="Unsaved changes" description="Save your work before leaving this page." type="warning" show-icon close-label="Dismiss warning" />
  <lu-button size="small" @click="version++">Reset alert</lu-button>
</template>
```

</template>
</DemoBlock>

## 深色主题与自定义内容

<DemoBlock direction="column">
<lu-alert type="success" effect="dark" :closable="false" show-icon>
  <template #title>Workspace ready</template>
  Invite your team to start collaborating.
</lu-alert>
<template #source>

```vue
<script setup>
import { ref } from 'vue'
const version = ref(0)
</script>

<template>
  <lu-alert type="success" effect="dark" :closable="false" show-icon>
    <template #title>Workspace ready</template>
    Invite your team to start collaborating.
  </lu-alert>
</template>
```

</template>
</DemoBlock>

## Props

| 属性 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `title` | `string` | — | 标题。 |
| `description` | `string` | — | 描述。 |
| `type` | `'success' \| 'info' \| 'warning' \| 'error'` | `'info'` | 语义类型。 |
| `effect` | `'light' \| 'dark'` | `'light'` | 主题效果。 |
| `closable` | `boolean` | `true` | 显示关闭按钮。 |
| `showIcon` | `boolean` | `false` | 显示类型图标。 |
| `center` | `boolean` | `false` | 内容居中。 |
| `closeText` | `string` | — | 自定义关闭文字。 |
| `closeLabel` | `string` | `'Close alert'` | 关闭按钮的可访问名称。 |

## 事件

| 事件名 | 参数 / 签名 | 说明 |
| --- | --- | --- |
| `close` | `(event: MouseEvent)` | 关闭时触发，组件自行隐藏。 |

## 插槽

| 插槽名 | 插槽参数 | 说明 |
| --- | --- | --- |
| `title` | — | 自定义标题。 |
| `default` | — | 自定义描述。 |

## 使用说明

需要重新显示时重新挂载组件或更新 `key`。警告与错误使用 `role="alert"`，普通信息和成功提示使用 `role="status"`。
