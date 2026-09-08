import { createApp, ref } from 'vue'
import LunarUI from '../src'

const App = {
  setup() {
    const name = ref('')
    const dialogVisible = ref(false)
    return { name, dialogVisible }
  },
  template: `
    <main style="max-width: 760px; margin: 48px auto; font-family: Arial, sans-serif;">
      <h1>Lunar UI Playground</h1>
      <epx-card header="Basic components" shadow="hover">
        <div style="display: grid; gap: 16px;">
          <div style="display: flex; gap: 12px; flex-wrap: wrap;">
            <epx-button>Default</epx-button><epx-button type="primary">Primary</epx-button><epx-button type="success" round>Success</epx-button><epx-button type="danger" loading>Loading</epx-button>
          </div>
          <epx-input v-model="name" placeholder="Please input" />
          <p>Name: {{ name || 'empty' }}</p>
          <div>
            <epx-button type="primary" @click="dialogVisible = true">Open dialog</epx-button>
          </div>
        </div>
      </epx-card>
      <epx-dialog v-model="dialogVisible" title="Confirm update" width="420px">
        <p>The dialog supports modal click close, Escape close, custom footer slots, and the same install flow as other Lunar UI components.</p>
        <template #footer>
          <epx-button @click="dialogVisible = false">Cancel</epx-button>
          <epx-button type="primary" @click="dialogVisible = false">Confirm</epx-button>
        </template>
      </epx-dialog>
    </main>`
}
createApp(App).use(LunarUI).mount('#app')
