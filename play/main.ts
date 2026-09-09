import { createApp, reactive, ref } from 'vue'
import LunarUI from '../src'

const App = {
  setup() {
    const name = ref('')
    const profile = reactive({ username: '', email: '' })
    const tourVisible = ref(false)
    const tourCurrent = ref(0)
    const dialogVisible = ref(false)
    const centeredDialogVisible = ref(false)
    const users = [
      { id: 1, name: 'Alice', role: 'Developer', status: 'Online' },
      { id: 2, name: 'Bob', role: 'Designer', status: 'Offline' },
      { id: 3, name: 'Carol', role: 'Product Manager', status: 'Online' }
    ]
    const tourSteps = [
      { target: '#playground-input', title: 'Input', description: 'This input updates local state with v-model.' },
      { target: '#playground-table', title: 'Table', description: 'The table renders columns declared with lu-table-column.' }
    ]
    return { name, profile, tourVisible, tourCurrent, dialogVisible, centeredDialogVisible, users, tourSteps }
  },
  template: `
    <main style="max-width: 760px; margin: 48px auto; font-family: Arial, sans-serif;">
      <h1>Lunar UI Playground</h1>
      <lu-card header="Basic components" shadow="hover">
        <div style="display: grid; gap: 16px;">
          <div style="display: flex; gap: 12px; flex-wrap: wrap;">
            <lu-button>Default</lu-button><lu-button type="primary">Primary</lu-button><lu-button type="success" round>Success</lu-button><lu-button type="danger" loading>Loading</lu-button>
          </div>
          <lu-input id="playground-input" v-model="name" placeholder="Please input" />
          <p>Name: {{ name || 'empty' }}</p>
          <lu-form :model="profile" label-width="84px">
            <lu-form-item label="Username" prop="username" required>
              <lu-input v-model="profile.username" placeholder="Username" />
            </lu-form-item>
            <lu-form-item label="Email">
              <lu-input v-model="profile.email" placeholder="Email" />
            </lu-form-item>
          </lu-form>
          <div style="display: flex; gap: 12px; flex-wrap: wrap;">
            <lu-button type="primary" @click="dialogVisible = true">Open dialog</lu-button>
            <lu-button @click="centeredDialogVisible = true">Centered dialog</lu-button>
            <lu-button @click="tourVisible = true">Start tour</lu-button>
          </div>
          <lu-table id="playground-table" :data="users" border stripe row-key="id">
            <lu-table-column prop="name" label="Name" />
            <lu-table-column prop="role" label="Role" />
            <lu-table-column prop="status" label="Status" align="center" />
          </lu-table>
        </div>
      </lu-card>
      <lu-tour v-model="tourVisible" v-model:current="tourCurrent" :steps="tourSteps" />
      <lu-dialog v-model="dialogVisible" title="Confirm update" width="420px">
        <p>The dialog supports modal click close, Escape close, custom footer slots, and the same install flow as other Lunar UI components.</p>
        <template #footer>
          <lu-button @click="dialogVisible = false">Cancel</lu-button>
          <lu-button type="primary" @click="dialogVisible = false">Confirm</lu-button>
        </template>
      </lu-dialog>
      <lu-dialog v-model="centeredDialogVisible" title="Centered dialog" width="360px" center destroy-on-close>
        <p>This one centers its text and footer actions, then removes its body from the DOM after closing.</p>
        <template #footer>
          <lu-button type="primary" @click="centeredDialogVisible = false">Got it</lu-button>
        </template>
      </lu-dialog>
    </main>`
}
createApp(App).use(LunarUI).mount('#app')
