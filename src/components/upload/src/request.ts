import type { UploadRequest } from './types'

export const uploadRequest: UploadRequest = options => new Promise((resolve, reject) => {
  if (!options.action) { reject(new Error('Upload action is required')); return }
  const xhr = new XMLHttpRequest()
  const abort = () => xhr.abort()
  const cleanup = () => options.signal.removeEventListener('abort', abort)
  xhr.open(options.method, options.action, true)
  xhr.withCredentials = options.withCredentials
  Object.entries(options.headers).forEach(([key, value]) => xhr.setRequestHeader(key, value))
  xhr.upload.onprogress = event => { if (event.lengthComputable) options.onProgress(event.loaded / event.total * 100) }
  xhr.onload = () => {
    cleanup()
    let response: unknown = xhr.responseText
    try { response = JSON.parse(xhr.responseText) } catch { /* Text responses are supported. */ }
    if (xhr.status >= 200 && xhr.status < 300) resolve(response)
    else reject(new Error(`Upload failed (${xhr.status})`))
  }
  xhr.onerror = () => { cleanup(); reject(new Error('Upload network error')) }
  xhr.onabort = () => { cleanup(); reject(new DOMException('Upload aborted', 'AbortError')) }
  if (options.signal.aborted) { reject(new DOMException('Upload aborted', 'AbortError')); return }
  options.signal.addEventListener('abort', abort, { once: true })
  const body = new FormData()
  Object.entries(options.data).forEach(([key, value]) => body.append(key, value))
  body.append(options.filename, options.file, options.file.name)
  try { xhr.send(body) } catch (error) { cleanup(); reject(error) }
})
