# Upload 上传

支持选择、拖拽、多文件上传、进度显示、取消与失败重试。默认通过 XMLHttpRequest 发送 multipart/form-data，也可传入自定义请求。

<script setup>
import { ref } from 'vue'
const upload = ref()
const files = ref([])
function mockRequest({ signal, onProgress }) {
  return new Promise((resolve, reject) => {
    let progress = 0
    const abort = () => { clearInterval(timer); reject(new Error('Cancelled')) }
    const timer = setInterval(() => {
      progress += 20; onProgress(progress)
      if (progress >= 100) { clearInterval(timer); signal.removeEventListener('abort', abort); resolve({ ok: true }) }
    }, 250)
    signal.addEventListener('abort', abort, { once: true })
  })
}
</script>

## 拖拽与手动上传

本例仅模拟进度，不发送文件。

<DemoBlock>
<lu-upload ref="upload" v-model:file-list="files" drag multiple :limit="3" :auto-upload="false" :http-request="mockRequest">
  <template #tip>最多选择 3 个文件，可取消正在上传的文件。</template>
  <lu-button type="primary" @click="upload.submit()">开始上传 / 重试</lu-button>
  <lu-button @click="upload.clearFiles()">清空</lu-button>
</lu-upload>
<template #source>

```vue
<script setup>
import { ref } from 'vue'
const upload = ref()
const files = ref([])
</script>
<template>
  <lu-upload ref="upload" v-model:file-list="files" action="/api/upload"
    drag multiple :limit="3" :auto-upload="false">
    <template #tip>最多选择 3 个文件</template>
    <lu-button @click="upload.submit()">开始上传 / 重试</lu-button>
  </lu-upload>
</template>
```

</template>
</DemoBlock>

## 图片列表与上传控制

<DemoBlock direction="column">
<lu-upload multiple accept="image/*" list-type="picture-card" :max-size="5 * 1024 * 1024" :concurrency="2" :http-request="mockRequest">
  <template #tip>选择图片查看缩略图，最大 5 MB；此处模拟上传。</template>
</lu-upload>

<template #source>

```vue
<lu-upload action="/api/upload" multiple accept="image/*"
  list-type="picture-card" :max-size="5 * 1024 * 1024" :concurrency="2">
  <template #tip>每张图片最大 5 MB，同时上传 2 个文件</template>
</lu-upload>
```

</template>
</DemoBlock>

## Upload Props

| 属性 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `fileList` | `UploadFile[]` | — | 支持 `v-model:file-list`；不传时内部管理。初始文件需唯一 uid 和 name。 |
| `action` | `string` | `''` | 上传地址，使用默认请求时必填。 |
| `method / name` | `string` | `POST / file` | 请求方法 / 文件字段名。 |
| `headers` | `Record<string, string>` | `{}` | 请求头，multipart Content-Type 与 boundary 由浏览器设置。 |
| `data` | `Record<string, string \| Blob>` | `{}` | 附加表单数据。 |
| `withCredentials` | `boolean` | `false` | 是否携带跨域凭据。 |
| `multiple / drag / disabled` | `boolean` | `false` | 多选 / 拖拽 / 禁用。 |
| `accept` | `string` | `''` | 扩展名或 MIME，例如 `.pdf,image/*`；选择与拖拽均过滤，服务端仍需校验。 |
| `limit` | `number` | `0` | 文件总数上限，0 不限；超出时整批拒绝。 |
| `maxSize` | `number` | `0` | 单文件字节上限，0 不限；超过时触发 `reject(file, 'size')`。 |
| `concurrency` | `number` | `3` | 并发任务数，最小 1；包含异步校验，其余文件排队。 |
| `listType` | `text / picture / picture-card` | `text` | 图片模式自动创建缩略图，点击触发 preview。 |
| `showSize / autoUpload / showFileList` | `boolean` | `true` | 显示大小 / 自动上传 / 显示列表。 |
| `beforeUpload` | `(file: File) => boolean \| void \| Promise<boolean \| void>` | — | 返回 false 保持待上传；抛错标记失败。 |
| `beforeRemove` | `(file: UploadFile, files: UploadFile[]) => boolean \| void \| Promise<boolean \| void>` | — | 返回 false 或抛错可阻止移除。 |
| `httpRequest` | `UploadRequest` | — | 替换默认请求，返回 Promise；参数详见下方。 |
| `label / listLabel / dragText` | `string` | `选择文件 / 上传文件 / 或将文件拖到此处` | 选择按钮、列表与拖拽提示文案。 |
| `readyText / successText / errorText` | `string` | `待上传 / 上传成功 / 上传失败` | 状态文案。 |
| `cancelText / removeText / retryText` | `string` | `取消 / 移除 / 重试` | 操作文案。 |

失败文件支持逐项重试。取消、清空或外部移除会撤销对应排队任务；禁用后不启动新任务，已开始的任务继续执行。取消自定义请求会释放并发名额；实际网络取消仍需请求实现响应 AbortSignal。

## Upload Events

| 事件 | 参数 | 说明 |
| --- | --- | --- |
| `update:fileList` | `files` | 同步文件列表。 |
| `change` | `file, files` | 文件加入、成功或失败。 |
| `progress` | `percentage, file, files` | 进度 0–100。 |
| `success / error` | `response / error, file, files` | 请求结果。 |
| `remove` | `file, files` | 文件移除。 |
| `preview` | `file` | 点击文件或缩略图，由业务处理预览。 |
| `exceed` | `rawFiles, files` | 超出数量限制。 |
| `reject` | `rawFile, reason` | reason 为 `accept`、`before-upload` 或 `size`。 |

## Upload Slots

| 插槽 | 说明 |
| --- | --- |
| `trigger` | 选择区内容，已包在可操作元素内，避免嵌套按钮。 |
| `tip` | 提示信息。 |
| `file` | 接收 `{ file }`，替换整行。 |
| `default` | 额外操作。 |

## Upload Methods

| 方法 | 说明 |
| --- | --- |
| `submit()` | 上传待处理及失败文件，返回 Promise；不重复发送处理中任务。 |
| `abort(file?)` | 取消指定或全部任务，恢复待上传。 |
| `clearFiles()` | 取消并清空。 |
| `handleStart(rawFile)` | 加入文件并遵循 autoUpload。 |
| `handleRemove(file)` | 遵循移除钩子。 |

## 类型与自定义请求

`UploadFile` 包含 `uid, name, url?, size?, raw?, status?, percentage?, response?`；status 为 `ready | uploading | success | fail`。已有文件无 raw 时只展示。组件创建的本地预览 URL 在移除或卸载时释放。

`httpRequest(options)` 接收 `file, action, method, filename, headers, data, withCredentials, signal, onProgress`；进度 0–100，取消通过 AbortSignal 通知，Promise 返回值为成功响应。移除、取消或卸载后忽略过期响应。

导出：`LuUpload`, `EpxUpload`, `UploadFile`, `UploadStatus`, `UploadRequest`, `UploadRequestOptions`。
