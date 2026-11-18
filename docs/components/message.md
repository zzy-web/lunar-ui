# Message 消息提示

在浏览器代码中显示简短的操作反馈。多条消息会叠放，每次调用返回可关闭的句柄。

<script setup>
import { LuMessage } from '../../src'
</script>

<lu-button type="primary" @click="LuMessage.success('保存成功')">显示成功消息</lu-button>
<lu-button @click="LuMessage({ type: 'error', message: '保存失败', duration: 0, closeLabel: '关闭' })">显示常驻错误</lu-button>
<lu-button @click="LuMessage.closeAll()">关闭全部</lu-button>

```ts
import { LuMessage } from 'lunar-ui'

LuMessage.success('保存成功')
const handle = LuMessage({ message: '保存失败', type: 'error', duration: 0 })
handle.close()
```

## API

| 选项 | 类型 | 默认值 |
| --- | --- | --- |
| `message` | `string` | — |
| `type` | `success / info / warning / error` | `info` |
| `duration` | `number` (毫秒) | `3000` |
| `showClose` | `boolean` | `false` |
| `closeLabel` | `string` | `Close` |

调用 `LuMessage(text)` 显示普通消息，也可调用 `success`、`info`、`warning` 和 `error`。设置 `duration: 0` 可让消息常驻并显示关闭按钮，`LuMessage.closeAll()` 可关闭全部消息。服务端调用返回空操作句柄。
