# Result 结果

展示操作结果和后续操作。内置图标用于装饰，请在标题中明确描述结果。

<script setup>
import { ref } from 'vue'
const saved = ref(false)
</script>


## 基础用法

<DemoBlock direction="column">
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

## Result Props

| 属性 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `icon` | `success / warning / error / info` | `info` | 结果图标类型 |
| `title` | `string` | `—` | 结果标题 |
| `subTitle` | `string` | `—` | 补充说明 |



## 插槽

| 插槽名 | 插槽参数 | 说明 |
| --- | --- | --- |
| `icon` | `—` | 自定义图标 |
| `title` | `—` | 自定义标题 |
| `sub-title` | `—` | 自定义说明 |
| `default` | `—` | 补充内容 |
| `extra` | `—` | 操作区域 |



## 使用说明

插槽优先于对应属性。内置图标用于装饰，请在标题中明确描述结果。组件不发出事件，操作事件绑定在 extra 插槽内的按钮上。
