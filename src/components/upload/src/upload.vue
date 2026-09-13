<template>
  <div class="epx-upload" :class="{ 'is-disabled': disabled }">
    <input ref="input" class="epx-upload__input" type="file" tabindex="-1" aria-hidden="true" :accept="accept" :multiple="multiple" :disabled="disabled" @change="onInput" />
    <div v-if="drag" class="epx-upload__drop" :class="{ 'is-over': dragging }" role="button" :tabindex="disabled ? -1 : 0" :aria-disabled="disabled" :aria-label="label"
      @click="pick" @keydown.enter.prevent="pick" @keydown.space.prevent="pick"
      @dragover.prevent="dragging = !disabled" @dragleave.prevent="dragging = false" @drop.prevent="onDrop">
      <slot name="trigger">{{ label }}<span class="epx-upload__hint">{{ dragText }}</span></slot>
    </div>
    <button v-else type="button" class="epx-upload__trigger" :disabled="disabled" @click="pick"><slot name="trigger">{{ label }}</slot></button>
    <div v-if="$slots.tip" class="epx-upload__tip"><slot name="tip" /></div>
    <ul v-if="showFileList && files.length" class="epx-upload__list" :aria-label="listLabel">
      <li v-for="file in files" :key="file.uid" class="epx-upload__file" :class="`is-${file.status || 'ready'}`">
        <slot name="file" :file="file">
          <button type="button" class="epx-upload__name" :title="file.name" @click="emit('preview', file)">{{ file.name }}</button>
          <span class="epx-upload__status" role="status">{{ file.status === 'uploading' ? `${Math.round(file.percentage || 0)}%` : file.status === 'success' ? successText : file.status === 'fail' ? errorText : readyText }}</span>
          <progress v-if="file.status === 'uploading'" :value="file.percentage || 0" max="100" :aria-label="file.name" />
          <button v-if="file.status === 'uploading'" type="button" :disabled="disabled" class="epx-upload__action" @click="abort(file)">{{ cancelText }}</button>
          <button type="button" :disabled="disabled" class="epx-upload__action" :aria-label="`${removeText} ${file.name}`" @click="remove(file)">×</button>
        </slot>
      </li>
    </ul>
    <slot />
  </div>
</template>
<script setup lang="ts">
import { onBeforeUnmount, ref, watch } from 'vue'
import { uploadRequest } from './request'
import type { UploadFile, UploadRequest } from './types'
defineOptions({ name: 'LuUpload' })
const props = withDefaults(defineProps<{
  fileList?: UploadFile[]
  action?: string
  method?: string
  name?: string
  headers?: Record<string, string>
  data?: Record<string, string | Blob>
  withCredentials?: boolean
  accept?: string
  multiple?: boolean
  disabled?: boolean
  drag?: boolean
  autoUpload?: boolean
  showFileList?: boolean
  limit?: number
  beforeUpload?: (file: File) => boolean | void | Promise<boolean | void>
  beforeRemove?: (file: UploadFile, files: UploadFile[]) => boolean | void | Promise<boolean | void>
  httpRequest?: UploadRequest
  label?: string
  listLabel?: string
  dragText?: string
  readyText?: string
  successText?: string
  errorText?: string
  cancelText?: string
  removeText?: string
}>(), { action: '', method: 'POST', name: 'file', headers: () => ({}), data: () => ({}), accept: '', autoUpload: true, showFileList: true, limit: 0, label: '选择文件', listLabel: '上传文件', dragText: '或将文件拖到此处', readyText: '待上传', successText: '上传成功', errorText: '上传失败', cancelText: '取消', removeText: '移除' })
const emit = defineEmits<{
  'update:fileList': [files: UploadFile[]]
  change: [file: UploadFile, files: UploadFile[]]
  progress: [percentage: number, file: UploadFile, files: UploadFile[]]
  success: [response: unknown, file: UploadFile, files: UploadFile[]]
  error: [error: unknown, file: UploadFile, files: UploadFile[]]
  remove: [file: UploadFile, files: UploadFile[]]
  preview: [file: UploadFile]
  exceed: [files: File[], currentFiles: UploadFile[]]
  reject: [file: File, reason: 'accept' | 'before-upload']
}>()
const input = ref<HTMLInputElement>()
const dragging = ref(false)
const files = ref<UploadFile[]>([...(props.fileList || [])])
const requests = new Map<UploadFile['uid'], AbortController>()
let serial = 0, disposed = false
watch(() => props.fileList, value => {
  if (!value) return
  for (const [uid, controller] of requests) if (!value.some(file => file.uid === uid)) { controller.abort(); requests.delete(uid) }
  files.value = [...value]
}, { deep: true })
function publish() { emit('update:fileList', [...files.value]) }
function patch(uid: UploadFile['uid'], changes: Partial<UploadFile>) {
  const index = files.value.findIndex(file => file.uid === uid)
  if (index < 0) return
  const file = { ...files.value[index], ...changes }
  files.value = files.value.map((item, i) => i === index ? file : item)
  publish()
  return file
}
function pick() { if (!props.disabled) input.value?.click() }
function accepts(file: File) {
  return !props.accept.trim() || props.accept.split(',').some(rule => {
    const token = rule.trim().toLowerCase(), type = file.type.toLowerCase()
    return token.startsWith('.') ? file.name.toLowerCase().endsWith(token) : token.endsWith('/*') ? type.startsWith(token.slice(0, -1)) : type === token
  })
}
function addFiles(rawFiles: File[]) {
  if (props.disabled || disposed) return
  const candidates = (props.multiple ? rawFiles : rawFiles.slice(0, 1)).filter(file => {
    if (accepts(file)) return true
    emit('reject', file, 'accept'); return false
  })
  if (props.limit > 0 && files.value.length + candidates.length > props.limit) { emit('exceed', candidates, [...files.value]); return }
  for (const raw of candidates) {
    const file: UploadFile = { uid: `lu-upload-${Date.now()}-${++serial}`, name: raw.name, size: raw.size, raw, status: 'ready', percentage: 0 }
    files.value = [...files.value, file]; publish(); emit('change', file, [...files.value])
    if (props.autoUpload) void upload(file)
  }
}
function onInput(event: Event) { const target = event.target as HTMLInputElement; addFiles(Array.from(target.files || [])); target.value = '' }
function onDrop(event: DragEvent) { dragging.value = false; addFiles(Array.from(event.dataTransfer?.files || [])) }
async function upload(file: UploadFile) {
  if (props.disabled || disposed || !file.raw || requests.has(file.uid)) return
  const controller = new AbortController()
  requests.set(file.uid, controller)
  const current = () => !disposed && !controller.signal.aborted && requests.get(file.uid) === controller && files.value.some(item => item.uid === file.uid)
  try {
    if (await props.beforeUpload?.(file.raw) === false) { if (current()) emit('reject', file.raw, 'before-upload'); return }
    if (!current() || props.disabled) return
    patch(file.uid, { status: 'uploading', percentage: 0 })
    const response = await (props.httpRequest || uploadRequest)({ file: file.raw, action: props.action, method: props.method, filename: props.name, headers: props.headers, data: props.data, withCredentials: props.withCredentials, signal: controller.signal,
      onProgress: value => {
        if (!current() || !Number.isFinite(value)) return
        const percentage = Math.min(100, Math.max(0, value)), updated = patch(file.uid, { percentage })
        if (updated) emit('progress', percentage, updated, [...files.value])
      }
    })
    if (!current()) return
    const updated = patch(file.uid, { status: 'success', percentage: 100, response })!
    emit('success', response, updated, [...files.value]); emit('change', updated, [...files.value])
  } catch (error) {
    if (!current()) return
    const updated = patch(file.uid, { status: 'fail' })!
    emit('error', error, updated, [...files.value]); emit('change', updated, [...files.value])
  } finally { if (requests.get(file.uid) === controller) requests.delete(file.uid) }
}
function submit() { return Promise.all(files.value.filter(file => !file.status || file.status === 'ready' || file.status === 'fail').map(upload)) }
function abort(file?: UploadFile) {
  for (const [uid, controller] of requests) if (!file || file.uid === uid) { controller.abort(); requests.delete(uid); patch(uid, { status: 'ready', percentage: 0 }) }
}
async function remove(file: UploadFile) {
  if (props.disabled) return
  try { if (await props.beforeRemove?.(file, [...files.value]) === false) return } catch { return }
  if (props.disabled || disposed || !files.value.some(item => item.uid === file.uid)) return
  abort(file); files.value = files.value.filter(item => item.uid !== file.uid); publish(); emit('remove', file, [...files.value])
}
function clearFiles() { abort(); files.value = []; publish() }
onBeforeUnmount(() => { disposed = true; for (const controller of requests.values()) controller.abort(); requests.clear() })
defineExpose({ submit, abort, clearFiles, handleStart: (file: File) => addFiles([file]), handleRemove: remove })
</script>
