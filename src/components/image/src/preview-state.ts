// Share scroll ownership across concurrently mounted image viewers.
const viewers: symbol[] = []
let overflow = ''
export function acquireViewer(id: symbol) {
  if (typeof document === 'undefined') return
  if (!viewers.length) {
    overflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
  }
  viewers.push(id)
}
export function isTopViewer(id: symbol) { return viewers[viewers.length - 1] === id }
export function releaseViewer(id: symbol) {
  const index = viewers.indexOf(id)
  if (index >= 0) viewers.splice(index, 1)
  if (!viewers.length && typeof document !== 'undefined') document.body.style.overflow = overflow
}
