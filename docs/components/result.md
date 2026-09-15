# Result 结果

展示操作结果和后续操作。内置图标用于装饰，请在标题中明确描述结果。

## 基础用法

<DemoBlock>
<lu-result icon="success" title="保存成功" sub-title="项目已准备就绪。">
  <template #extra><lu-button type="primary" @click="saved = !saved">{{ saved ? '已确认' : '确认' }}</lu-button></template>
</lu-result>
<template #source>

```vue
<script setup>
import { ref } from 'vue'
const saved = ref(false)
</script>
<template>
  <lu-result icon="success" title="保存成功" sub-title="项目已准备就绪。">
    <template #extra><lu-button type="primary" @click="saved = !saved">{{ saved ? '已确认' : '确认' }}</lu-button></template>
  </lu-result>
</template>
```

</template>
</DemoBlock>

<script setup>
import { ref } from 'vue'
const saved = ref(false)
</script>

## Props

- `icon`：`success | warning | error | info`，默认 `info`。
- `title`：结果标题。
- `subTitle`：补充说明。

## 插槽

支持 `icon`、`title`、`sub-title`、`default`（补充内容）、`extra`（操作区）。插槽优先于对应属性。

组件不发出事件，操作事件绑定在插槽内的按钮上。
