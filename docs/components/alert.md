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

- `title` / `description`：标题与描述字符串。
- `type`：`success | info | warning | error`，默认 `info`。
- `effect`：`light | dark`，默认 `light`。
- `closable`：默认 `true`。`showIcon` / `center`：默认 `false`。
- `closeText`：自定义关闭文字；`closeLabel`：关闭按钮可访问名称，默认 `Close alert`。

## 事件

`close(event: MouseEvent)`：关闭后触发，组件自行隐藏。需要重新显示时重新挂载组件或更新 `key`。

## 使用说明

插槽 `title` 覆盖标题，`default` 覆盖描述。警告与错误使用 `role="alert"`，普通信息和成功提示使用 `role="status"`。
