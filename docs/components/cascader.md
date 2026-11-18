# Cascader 级联选择器

逐级选择分类路径。每级使用原生选择控件，支持键盘和移动端系统选择器。

<script setup>
import { ref } from 'vue'

const path = ref(['frontend', 'vue'])
const options = [
  { value: 'frontend', label: '前端', children: [
    { value: 'vue', label: 'Vue' }, { value: 'css', label: 'CSS' }
  ] },
  { value: 'backend', label: '后端', children: [
    { value: 'python', label: 'Python' }, { value: 'node', label: 'Node.js' }
  ] }
]
</script>

<lu-cascader v-model="path" :options="options" clearable filterable label="技术分类" placeholder="请选择" search-label="搜索分类" no-match-text="没有匹配项" />
<p>{{ path.join(' / ') }}</p>

```vue
<lu-cascader v-model="path" :options="options" clearable filterable />
```

## API

| 属性 | 类型 | 默认值 |
| --- | --- | --- |
| `options` | `CascaderOption[]` | — |
| `v-model` | `(string \| number)[]` | `[]` |
| `disabled` / `clearable` / `check-strictly` / `filterable` | `boolean` | `false` |
| `search-label` / `no-match-text` | `string` | `Search options` / `No matching options` |
| `label` / `placeholder` / `clear-label` | `string` | `Category` / `Select` / `Clear selection` |

选项包含 `label`、`value`，可选 `disabled` 和 `children`。同一层的兄弟选项值应唯一。选中叶子时通过 `change` 返回完整路径。设置 `check-strictly` 后也可提交父级路径，清空时返回空数组。

启用 `filterable` 后，可以按任意一级的标签搜索完整路径。搜索忽略大小写和首尾空格，跳过禁用选项及其子树。选中结果后恢复逐级回显，按 Escape 可清除搜索。
