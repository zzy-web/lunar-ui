# Message 

Show brief feedback from anywhere in browser code. Messages stack, and each call returns a handle you can close.

<script setup>
import { LuMessage } from '../../../src'
</script>

<lu-button type="primary" @click="LuMessage.success('Saved')">Show success</lu-button>
<lu-button @click="LuMessage({ type: 'error', message: 'Save failed', duration: 0, closeLabel: 'Close' })">Show persistent error</lu-button>
<lu-button @click="LuMessage.closeAll()">Close all</lu-button>

```ts
import { LuMessage } from 'lunar-ui'

LuMessage.success('Saved')
const handle = LuMessage({ message: 'Save failed', type: 'error', duration: 0 })
handle.close()
```

## API

| Option | Type | Default |
| --- | --- | --- |
| `message` | `string` | — |
| `type` | `success / info / warning / error` | `info` |
| `duration` | `number` (milliseconds) | `3000` |
| `showClose` | `boolean` | `false` |
| `closeLabel` | `string` | `Close` |

Call `LuMessage(text)` for an info message or use `success`, `info`, `warning`, and `error`. Use `duration: 0` to keep a message visible with a close button, and `LuMessage.closeAll()` to dismiss the stack. On the server the returned handle has no effect.
