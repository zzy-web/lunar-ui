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

## 属性

### 图片列表与上传控制

<lu-upload multiple accept="image/*" list-type="picture-card" :max-size="5 * 1024 * 1024" :concurrency="2" :http-request="mockRequest">
  <template #tip>选择图片查看缩略图，最大 5 MB；此处模拟上传。</template>
</lu-upload>

```vue
<lu-upload action="/api/upload" multiple accept="image/*"
  list-type="picture-card" :max-size="5 * 1024 * 1024" :concurrency="2">
  <template #tip>每张图片最大 5 MB，同时上传 2 个文件</template>
</lu-upload>
```

- `listType`：`text`（默认）、`picture`、`picture-card`，后两者自动生成本地图片缩略图；点击触发 `preview`，由业务打开预览。
- `UploadFile.url`：已有图片的展示地址。组件创建的本地预览 URL 在移除或卸载时自动释放。
- `maxSize`：单文件字节数上限，默认 0 不限；超过时触发 `reject(file, 'size')`，不加入列表。
- `concurrency`：同时处理的文件数量，默认 3，最小 1；异步校验也占用名额。其余文件排队，取消、清空或外部移除会撤销对应任务。
- `showSize`：显示文件大小，默认 true；`retryText`：失败行的重试按钮文案，默认“重试”。

失败文件可直接逐项重试。取消自定义请求时，即使请求未响应 AbortSignal，也不会阻塞后续队列；实际网络取消仍需自定义请求配合。禁用后不启动排队任务，已开始的任务继续执行。

- `fileList: UploadFile[]`：支持 `v-model:file-list`；不传时由组件管理。初始文件必须提供唯一 `uid` 和 `name`。
- `action`：上传地址；使用默认请求时必填。`method` 默认 POST，`name` 默认 file。
- `headers: Record<string, string>`、`data: Record<string, string | Blob>`、`withCredentials`（默认 false）：请求配置。multipart 的 Content-Type 及 boundary 由浏览器设置。
- `multiple` / `drag` / `disabled`：多选、拖拽、禁用，默认 false。
- `accept`：扩展名或 MIME 类型，例如 `.pdf,image/*`。选择与拖拽均过滤；服务端仍需校验文件。
- `limit`：文件总数上限，默认 0 不限；超出时本批次不加入。
- `autoUpload` / `showFileList`：自动上传、显示列表，默认 true。
- `beforeUpload(file)`：可异步返回 false 阻止上传，文件保持待上传；抛错则标记失败。
- `beforeRemove(file, files)`：可异步返回 false 或抛错阻止移除。
- `httpRequest(options): Promise<unknown>`：替换请求。options 包含 `file, action, method, filename, headers, data, withCredentials, signal, onProgress`；进度为 0–100，取消由 AbortSignal 通知。返回值作为成功响应。
- 文案可通过 `label`、`listLabel`、`dragText`、`readyText`、`successText`、`errorText`、`cancelText`、`removeText` 自定义。

## 事件、插槽与方法

- `change(file, files)`：加入、成功或失败；`progress(percentage, file, files)`：上传进度。
- `success(response, file, files)` / `error(error, file, files)`：请求结果。
- `remove(file, files)` / `preview(file)`：移除与文件名点击；预览由业务方处理。
- `exceed(rawFiles, files)`：超限；`reject(rawFile, reason)`：类型不符或钩子拒绝，reason 为 `accept` 或 `before-upload`。
- `trigger`：触发区内容，已包在可操作元素内，请勿嵌套按钮；`tip`：提示；`file({ file })`：替换整行；默认插槽：额外操作。
- `submit()`：上传待处理及失败文件，返回 Promise；重复调用不会重复发送正在处理的文件。
- `abort(file?)`：取消指定或全部请求，恢复待上传；`clearFiles()`：取消并清空。
- `handleStart(rawFile)`：加入文件并遵循 autoUpload；`handleRemove(file)`：遵循移除钩子。

`UploadFile` 包含 `uid, name, size?, raw?, status?, percentage?, response?`；status 为 `ready | uploading | success | fail`。已有文件无 raw 时只展示，不会重新上传。移除、取消或卸载后会忽略过期响应。支持 `LuUpload` / `EpxUpload` 及相关类型导出。
