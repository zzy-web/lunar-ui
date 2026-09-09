# Empty 空状态

无数据时提供明确说明和后续操作，也支持接入业务插图。

<script setup>
import { ref } from 'vue'
const created = ref(false)
</script>

## 基础用法

<DemoBlock>
<lu-empty description="No projects yet" />
<template #source>

```vue
<script setup>
import { ref } from 'vue'
const created = ref(false)
</script>

<template>
  <lu-empty description="No projects yet" />
</template>
```

</template>
</DemoBlock>

## 引导后续操作

<DemoBlock>
<lu-empty v-if="!created" description="Create your first project to get started.">
  <lu-button type="primary" @click="created = true">Create project</lu-button>
</lu-empty>
<lu-alert v-else title="Project created" type="success" show-icon :closable="false" />
<lu-button v-if="created" size="small" @click="created = false">Reset example</lu-button>
<template #source>

```vue
<script setup>
import { ref } from 'vue'
const created = ref(false)
</script>

<template>
  <lu-empty v-if="!created" description="Create your first project to get started.">
    <lu-button type="primary" @click="created = true">Create project</lu-button>
  </lu-empty>
  <lu-alert v-else title="Project created" type="success" show-icon :closable="false" />
  <lu-button v-if="created" size="small" @click="created = false">Reset example</lu-button>
</template>
```

</template>
</DemoBlock>

## 自定义说明

<DemoBlock>
<lu-empty>
  <template #description><strong>No matching results</strong><br />Try another keyword or remove your filters.</template>
</lu-empty>
<template #source>

```vue
<script setup>
import { ref } from 'vue'
const created = ref(false)
</script>

<template>
  <lu-empty>
    <template #description><strong>No matching results</strong><br />Try another keyword or remove your filters.</template>
  </lu-empty>
</template>
```

</template>
</DemoBlock>

## Props

| 属性 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `description` | `string` | `'暂无数据'` | 空状态说明。 |
| `image` | `string` | — | 可选图片 URL，不传时不展示图片。 |
| `imageAlt` | `string` | `''` | 图片替代文本，装饰图可留空。 |
| `imageSize` | `number` | `120` | 图片宽度，单位 px。 |

## 插槽

| 插槽名 | 插槽参数 | 说明 |
| --- | --- | --- |
| `image` | — | 自定义图片内容。 |
| `description` | — | 自定义说明。 |
| `default` | — | 操作按钮。 |

## 使用说明

组件不发出事件，操作由插槽内按钮处理。
