export type UploadStatus = 'ready' | 'uploading' | 'success' | 'fail'
export interface UploadFile {
  uid: string | number
  name: string
  url?: string
  size?: number
  status?: UploadStatus
  percentage?: number
  raw?: File
  response?: unknown
}
export interface UploadRequestOptions {
  file: File
  action: string
  method: string
  filename: string
  headers: Record<string, string>
  data: Record<string, string | Blob>
  withCredentials: boolean
  signal: AbortSignal
  onProgress: (percentage: number) => void
}
export type UploadRequest = (options: UploadRequestOptions) => Promise<unknown>
