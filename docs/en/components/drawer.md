# Drawer 

Use a drawer for row details and editing while keeping the table on the page.

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
  <lu-table-column prop="name" label="Name" />
  <lu-table-column label="Actions" width="100">
    <template #default="{ row }">
      <lu-button @click="edit(row)">Edit</lu-button>
    </template>
  </lu-table-column>
</lu-table>
<lu-drawer v-model="visible" title="Edit user" destroy-on-close>
  <lu-form ref="form" :model="draft" @submit="save">
    <lu-form-item prop="name" label="Name" required>
      <lu-input v-model="draft.name" aria-label="Name" />
    </lu-form-item>
  </lu-form>
  <template #footer="{ close }">
    <lu-button @click="close">Cancel</lu-button>
    <lu-button type="primary" @click="save">Save</lu-button>
  </template>
</lu-drawer>

## API

| Prop | Type | Default |
| --- | --- | --- |
| `v-model` | `boolean` | — |
| `title` / `aria-label` / `close-label` | `string` | — / `Drawer` / `Close` |
| `direction` | `left / right / top / bottom` | `right` |
| `size` | CSS width or height | `min(420px, 100%)` |
| `close-on-press-escape` / `close-on-click-modal` | `boolean` | `true` |
| `lock-scroll` / `show-close` | `boolean` | `true` |
| `destroy-on-close` | `boolean` | `false` |

Slots are `header`, default, and `footer` with a `close()` callback. The drawer emits `open` and `close` when visibility changes. Tab stays within the panel and focus returns to the opening control on close.
