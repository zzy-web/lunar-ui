# Drawer 抽屉

用抽屉查看和编辑表格行，保留原来的表格页面。

<script setup>
import { ref, reactive } from 'vue'

const rows = ref([{ id: 1, name: 'Alice' }, { id: 2, name: 'Bob' }])
const visible = ref(false)
const form = ref()
const draft = reactive({ id: 0, name: '' })

function edit(row) {
  Object.assign(draft, row)
  visible.value = true
}
async function save() {
  if (!await form.value?.validate()) return
  rows.value = rows.value.map(row => row.id === draft.id ? { ...draft } : row)
  visible.value = false
}
</script>

<lu-table :data="rows" row-key="id">
  <lu-table-column prop="name" label="姓名" />
  <lu-table-column label="操作" width="100">
    <template #default="{ row }">
      <lu-button @click="edit(row)">编辑</lu-button>
    </template>
  </lu-table-column>
</lu-table>
<lu-drawer v-model="visible" title="编辑用户" destroy-on-close>
  <lu-form ref="form" :model="draft" @submit="save">
    <lu-form-item prop="name" label="姓名" required>
      <lu-input v-model="draft.name" aria-label="姓名" />
    </lu-form-item>
  </lu-form>
  <template #footer="{ close }">
    <lu-button @click="close">取消</lu-button>
    <lu-button type="primary" @click="save">保存</lu-button>
  </template>
</lu-drawer>

## API

| 属性 | 类型 | 默认值 |
| --- | --- | --- |
| `v-model` | `boolean` | — |
| `title` / `aria-label` / `close-label` | `string` | — / `Drawer` / `Close` |
| `direction` | `left / right / top / bottom` | `right` |
| `size` | CSS 宽度或高度 | `min(420px, 100%)` |
| `close-on-press-escape` / `close-on-click-modal` | `boolean` | `true` |
| `lock-scroll` / `show-close` | `boolean` | `true` |
| `destroy-on-close` | `boolean` | `false` |

提供 `header`、默认和 `footer` 插槽，底部插槽提供 `close()`。可见状态变化时触发 `open` 或 `close`。Tab 在面板内循环，关闭后焦点回到打开抽屉的控件。
