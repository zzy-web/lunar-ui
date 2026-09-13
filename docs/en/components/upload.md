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

## Props

- `fileList: UploadFile[]`: optional `v-model:file-list`; internally managed when omitted. Initial entries require unique `uid` and `name`.
- `action`: required for the default request. `method` defaults to POST; `name` defaults to file.
- `headers`, `data` (string or Blob values), `withCredentials` (false): request settings. Let the browser set the multipart Content-Type boundary.
- `multiple`, `drag`, `disabled`: default false. `autoUpload` and `showFileList`: default true.
- `accept`: comma-separated extensions or MIME types, such as `.pdf,image/*`. Applies to selection and drop; server validation remains necessary.
- `limit`: total file limit, 0 means unlimited. An exceeding batch is rejected in full.
- `beforeUpload(file)`: may asynchronously return false to keep a file ready without uploading. Throwing marks the file failed.
- `beforeRemove(file, files)`: return false or throw to prevent removal; supports async functions.
- `httpRequest(options): Promise<unknown>`: custom request receiving `file, action, method, filename, headers, data, withCredentials, signal, onProgress`. Progress uses 0–100; observe the AbortSignal for cancellation. The resolved value is the response.
- Text props: `label`, `listLabel`, `dragText`, `readyText`, `successText`, `errorText`, `cancelText`, `removeText`.

## Events, slots and methods

Events: `change(file, files)` on addition/success/failure, `progress(percentage, file, files)`, `success(response, file, files)`, `error(error, file, files)`, `remove(file, files)`, `preview(file)`, `exceed(rawFiles, files)`, and `reject(rawFile, reason)` with reason `accept` or `before-upload`. Handle previews in your application.

Slots: `trigger` supplies content inside the existing trigger (avoid nested buttons); `tip` supplies hints; `file({ file })` replaces a list row; the default slot supplies additional actions.

Methods: `submit()` uploads ready/failed files and returns a Promise, without duplicating pending requests. `abort(file?)` cancels one/all requests and resets them to ready. `clearFiles()` cancels and clears. `handleStart(rawFile)` adds a file and follows autoUpload. `handleRemove(file)` follows the removal hook.

`UploadFile`: `uid, name, size?, raw?, status?, percentage?, response?`; status is `ready | uploading | success | fail`. Entries without raw files are display-only. Late responses after cancellation, removal or unmount are ignored. Exports: `LuUpload`, `EpxUpload`, `UploadFile`, `UploadStatus`, `UploadRequest`, `UploadRequestOptions`.
