// Track ownership per body so overlapping dialogs cannot release each other's lock.
const locks = new WeakMap<HTMLElement, { count: number; overflow: string }>()

export function acquireBodyScrollLock(): () => void {
  if (typeof document === 'undefined' || !document.body) return () => {}
  const body = document.body
  let state = locks.get(body)
  if (!state) {
    state = { count: 0, overflow: body.style.overflow }
    locks.set(body, state)
  }
  state.count++
  body.style.overflow = 'hidden'
  let released = false
  return () => {
    if (released) return
    released = true
    if (--state.count === 0) {
      body.style.overflow = state.overflow
      locks.delete(body)
    }
  }
}
