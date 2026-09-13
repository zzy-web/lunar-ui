import EpxUpload from './src/upload.vue'
const LuUpload: typeof EpxUpload = EpxUpload
export { EpxUpload, LuUpload }
export default EpxUpload
export type { UploadFile, UploadStatus, UploadRequest, UploadRequestOptions } from './src/types'
