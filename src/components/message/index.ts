export type MessageType = 'success' | 'info' | 'warning' | 'error'
export interface MessageOptions {
  message: string
  type?: MessageType
  duration?: number
  showClose?: boolean
  closeLabel?: string
}
export interface MessageHandle { close: () => void }

const active = new Set<MessageHandle>()
let host: HTMLDivElement | undefined

function show(input: string | MessageOptions): MessageHandle {
  if (typeof document === 'undefined') return { close() {} }
  const options = typeof input === 'string' ? { message: input } : input
  const type = options.type ?? 'info'
  const duration = Number.isFinite(options.duration) ? options.duration! : 3000
  if (!host) {
    host = document.createElement('div')
    host.className = 'epx-message-stack'
    document.body.append(host)
  }
  const item = document.createElement('div')
  item.className = `epx-message epx-message--${type}`
  const content = document.createElement('span')
  content.setAttribute('role', type === 'error' ? 'alert' : 'status')
  item.append(content)
  host.append(item)
  content.textContent = options.message

  let timer: ReturnType<typeof setTimeout> | undefined
  const handle = {
    close() {
      if (!active.delete(handle)) return
      if (timer !== undefined) clearTimeout(timer)
      item.remove()
      if (!active.size) { host?.remove(); host = undefined }
    }
  }
  active.add(handle)
  if (options.showClose || duration <= 0) {
    const button = document.createElement('button')
    button.type = 'button'
    button.setAttribute('aria-label', options.closeLabel ?? 'Close')
    button.textContent = '×'
    button.addEventListener('click', handle.close)
    item.append(button)
  }
  if (duration > 0) timer = setTimeout(handle.close, duration)
  return handle
}

export const LuMessage = Object.assign(show, {
  success: (message: string) => show({ message, type: 'success' }),
  info: (message: string) => show({ message, type: 'info' }),
  warning: (message: string) => show({ message, type: 'warning' }),
  error: (message: string) => show({ message, type: 'error' }),
  closeAll: () => active.forEach(handle => handle.close())
})
export const EpxMessage = LuMessage
export default LuMessage
