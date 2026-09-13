# Upload

File selection, drag and drop, progress, cancellation and retry. The default request sends multipart/form-data using XMLHttpRequest.

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

## Manual upload

This example simulates progress without sending files.

<DemoBlock>
<lu-upload ref="upload" v-model:file-list="files" drag multiple :limit="3" :auto-upload="false" :http-request="mockRequest" label="Choose files" drag-text="or drop files here" ready-text="Ready" success-text="Uploaded" error-text="Failed" cancel-text="Cancel" remove-text="Remove" list-label="Upload files">
  <template #tip>Up to 3 files.</template>
  <lu-button type="primary" @click="upload.submit()">Upload / retry</lu-button>
  <lu-button @click="upload.clearFiles()">Clear</lu-button>
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
    drag multiple :limit="3" :auto-upload="false" label="Choose files">
    <lu-button @click="upload.submit()">Upload / retry</lu-button>
  </lu-upload>
</template>
```

</template>
</DemoBlock>

## Pictures and upload scheduling

<DemoBlock direction="column">
<lu-upload multiple accept="image/*" list-type="picture-card" :max-size="5 * 1024 * 1024" :concurrency="2" :http-request="mockRequest" label="Choose images" success-text="Uploaded" retry-text="Retry">
  <template #tip>Choose images to preview thumbnails, up to 5 MB each. Uploads are simulated.</template>
</lu-upload>

<template #source>

```vue
<lu-upload action="/api/upload" multiple accept="image/*"
  list-type="picture-card" :max-size="5 * 1024 * 1024" :concurrency="2" />
```

</template>
</DemoBlock>

## Upload Props

| Property | Type | Default | Description |
| --- | --- | --- | --- |
| `fileList` | `UploadFile[]` | — | Optional `v-model:file-list`; internally managed when omitted. Initial files require unique uid and name. |
| `action` | `string` | `''` | Upload URL; required for the default request. |
| `method / name` | `string` | `POST / file` | Request method / file field name. |
| `headers` | `Record<string, string>` | `{}` | Request headers; let the browser set multipart Content-Type and boundary. |
| `data` | `Record<string, string \| Blob>` | `{}` | Additional form fields. |
| `withCredentials` | `boolean` | `false` | Include cross-origin credentials. |
| `multiple / drag / disabled` | `boolean` | `false` | Multiple selection / drag and drop / disabled. |
| `accept` | `string` | `''` | Extensions or MIME types, e.g. `.pdf,image/*`. Filters selection and drop; server validation remains necessary. |
| `limit` | `number` | `0` | Total file limit; 0 is unlimited. An exceeding batch is rejected in full. |
| `maxSize` | `number` | `0` | Maximum bytes per file; 0 is unlimited. Oversized files emit `reject(file, 'size')`. |
| `concurrency` | `number` | `3` | Concurrent tasks including async validation, minimum 1. Remaining files queue. |
| `listType` | `text / picture / picture-card` | `text` | Picture layouts generate thumbnails; clicks emit preview. |
| `showSize / autoUpload / showFileList` | `boolean` | `true` | Show sizes / auto upload / show file list. |
| `beforeUpload` | `(file: File) => boolean \| void \| Promise<boolean \| void>` | — | Return false to keep the file ready; throwing marks it failed. |
| `beforeRemove` | `(file: UploadFile, files: UploadFile[]) => boolean \| void \| Promise<boolean \| void>` | — | Return false or throw to prevent removal. |
| `httpRequest` | `UploadRequest` | — | Replace the default request with a Promise-returning function; see below. |
| `label / listLabel / dragText` | `string` | `选择文件 / 上传文件 / 或将文件拖到此处` | Trigger, list and drop hint labels. |
| `readyText / successText / errorText` | `string` | `待上传 / 上传成功 / 上传失败` | Status labels. |
| `cancelText / removeText / retryText` | `string` | `取消 / 移除 / 重试` | Action labels. |

Failed files can be retried individually. Cancellation, clearing and external removal cancel queued tasks. Disabling pauses new tasks while existing tasks continue. Cancelling custom requests releases queue capacity; actual network cancellation requires observing AbortSignal.

## Upload Events

| Event | Arguments | Description |
| --- | --- | --- |
| `update:fileList` | `files` | Synchronize the file list. |
| `change` | `file, files` | File added, succeeded or failed. |
| `progress` | `percentage, file, files` | Progress from 0–100. |
| `success / error` | `response / error, file, files` | Request result. |
| `remove` | `file, files` | File removed. |
| `preview` | `file` | File or thumbnail clicked; handle previews in your application. |
| `exceed` | `rawFiles, files` | File count exceeded. |
| `reject` | `rawFile, reason` | Reason is `accept`, `before-upload` or `size`. |

## Upload Slots

| Slot | Description |
| --- | --- |
| `trigger` | Content inside the existing trigger; avoid nested buttons. |
| `tip` | Hint text. |
| `file` | Receives `{ file }` and replaces a list row. |
| `default` | Additional actions. |

## Upload Methods

| Method | Description |
| --- | --- |
| `submit()` | Upload ready/failed files; returns a Promise and deduplicates pending tasks. |
| `abort(file?)` | Cancel one or all tasks and restore ready status. |
| `clearFiles()` | Cancel and clear all files. |
| `handleStart(rawFile)` | Add a file and follow autoUpload. |
| `handleRemove(file)` | Remove a file through the removal hook. |

## Types and custom requests

`UploadFile` contains `uid, name, url?, size?, raw?, status?, percentage?, response?`; status is `ready | uploading | success | fail`. Entries without raw files are display-only. Generated preview URLs are released on removal or unmount.

`httpRequest(options)` receives `file, action, method, filename, headers, data, withCredentials, signal, onProgress`. Progress is 0–100; cancellation uses AbortSignal; the resolved value is the response. Late responses after cancellation, removal or unmount are ignored.

Exports：`LuUpload`, `EpxUpload`, `UploadFile`, `UploadStatus`, `UploadRequest`, `UploadRequestOptions`。
