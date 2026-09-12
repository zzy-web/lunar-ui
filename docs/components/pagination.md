# Pagination 分页

通过 `v-model:current-page` 控制当前页，可配合表格切片或服务端查询。页码始终显示在有效范围内；外部修改总数不会触发更新事件，也不会自动改写绑定值。

<script setup lang="ts">
import { ref } from 'vue'
const page = ref(1)
</script>

## 示例

<DemoBlock direction="column">
<lu-pagination v-model:current-page="page" :total="200" :page-size="10" />
  <p>Page: {{ page }}</p>
  <lu-pagination :current-page="5" :total="100" disabled size="small" />

<template #source>

```vue
<script setup lang="ts">
import { ref } from 'vue'
const page = ref(1)
</script>

<template>
  <lu-pagination v-model:current-page="page" :total="200" :page-size="10" />
  <p>Page: {{ page }}</p>
  <lu-pagination :current-page="5" :total="100" disabled size="small" />
</template>
```

</template>
</DemoBlock>

## Props

| 属性 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `currentPage` | `number` | `1` | 当前页，从 1 开始 |
| `total` | `number` | `0` | 记录总数；负数与非有限数按 0 处理，上限为 Number.MAX_SAFE_INTEGER |
| `pageSize` | `number` | `10` | 每页条数，向下取整且至少为 1；非有限数按 10 处理 |
| `disabled` | `boolean` | `false` | 禁用全部翻页按钮 |
| `hideOnSinglePage` | `boolean` | `false` | 仅一页时隐藏（包括空数据） |
| `size` | `'large' / 'default' / 'small'` | `'default'` | 尺寸 |
| `ariaLabel` | `string` | `'分页'` | 导航区域的无障碍名称 |
| `pageLabel` | `string` | `'第'` | 页码按钮无障碍名称的前缀 |
| `prevText` | `string` | `'上一页'` | 上一页文字 |
| `nextText` | `string` | `'下一页'` | 下一页文字 |

## 事件

| 事件名 | 参数 | 说明 |
| --- | --- | --- |
| `update:currentPage` | `value: number` | 用户选择不同且有效的页码时触发。 |
| `change` | `value: number` | 与绑定值更新同时触发。 |

## 使用说明

组件只提供页码导航，不请求或切分数据。空数据时保留第 1 页，上一页和下一页均禁用。原生按钮支持 Tab 聚焦及 Enter / Space 激活。使用 `prev-text`、`next-text`、`page-label` 和 `aria-label` 自定义语言。
