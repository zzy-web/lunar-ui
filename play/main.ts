import { createApp, ref } from 'vue'
import LunarUI from '../src'

const App = {
  setup() {
    const name = ref('')
    const dialogVisible = ref(false)
    const centeredDialogVisible = ref(false)
    return { name, dialogVisible, centeredDialogVisible }
  },
  template: `
    <main style="max-width: 760px; margin: 48px auto; font-family: Arial, sans-serif;">
      <h1>Lunar UI Playground</h1>
      <lu-card header="Basic components" shadow="hover">
        <div style="display: grid; gap: 16px;">
          <div style="display: flex; gap: 12px; flex-wrap: wrap;">
            <lu-button>Default</lu-button><lu-button type="primary">Primary</lu-button><lu-button type="success" round>Success</lu-button><lu-button type="danger" loading>Loading</lu-button>
          </div>
          <lu-input v-model="name" placeholder="Please input" />
          <p>Name: {{ name || 'empty' }}</p>
          <div style="display: flex; gap: 12px; flex-wrap: wrap;">
            <lu-button type="primary" @click="dialogVisible = true">Open dialog</lu-button>
            <lu-button @click="centeredDialogVisible = true">Centered dialog</lu-button>
          </div>
        </div>
      </lu-card>
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
