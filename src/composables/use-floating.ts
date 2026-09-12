import { nextTick, ref, watch } from 'vue'
import type { CSSProperties, Ref } from 'vue'

export type FloatingPlacement = 'top' | 'top-start' | 'top-end' | 'bottom' | 'bottom-start' | 'bottom-end' | 'left' | 'left-start' | 'left-end' | 'right' | 'right-start' | 'right-end'

// Shared viewport positioning. Flip on the primary axis, then keep the panel within the viewport.
export function useFloating(anchor: Ref<HTMLElement | undefined>, panel: Ref<HTMLElement | undefined>, visible: Readonly<Ref<boolean>>, placement: () => FloatingPlacement, offset: () => number) {
  const style = ref<CSSProperties>({ position: 'fixed', visibility: 'hidden' })
  const actualPlacement = ref<FloatingPlacement>(placement())
  function update() {
    if (typeof window === 'undefined' || !anchor.value?.getBoundingClientRect || !panel.value?.getBoundingClientRect) return
    const a = anchor.value.getBoundingClientRect(), p = panel.value.getBoundingClientRect()
    const width = document.documentElement.clientWidth, height = window.innerHeight
    const naturalHeight = Math.max(p.height, panel.value.scrollHeight + p.height - panel.value.clientHeight)
    const margin = 8, gap = Math.max(0, offset())
    const [requestedSide, align] = placement().split('-')
    let side = requestedSide
    const space: Record<string, number> = { top: a.top - margin, bottom: height - a.bottom - margin, left: a.left - margin, right: width - a.right - margin }
    const opposite: Record<string, string> = { top: 'bottom', bottom: 'top', left: 'right', right: 'left' }
    const vertical = side === 'top' || side === 'bottom'
    const needed = (vertical ? naturalHeight : p.width) + gap
    if (space[side] < needed && space[opposite[side]] > space[side]) side = opposite[side]
    const maxHeight = Math.max(0, vertical ? space[side] - gap : height - margin * 2)
    const panelHeight = Math.min(naturalHeight, maxHeight)
    const panelWidth = Math.min(p.width, width - margin * 2)
    let x: number, y: number
    if (vertical) {
      x = align === 'start' ? a.left : align === 'end' ? a.right - panelWidth : a.left + (a.width - panelWidth) / 2
      y = side === 'top' ? a.top - panelHeight - gap : a.bottom + gap
    } else {
      x = side === 'left' ? a.left - panelWidth - gap : a.right + gap
      y = align === 'start' ? a.top : align === 'end' ? a.bottom - panelHeight : a.top + (a.height - panelHeight) / 2
    }
    actualPlacement.value = (side + (align ? `-${align}` : '')) as FloatingPlacement
    style.value = {
      position: 'fixed', visibility: 'visible',
      left: `${Math.max(margin, Math.min(x, width - panelWidth - margin))}px`,
      top: `${Math.max(margin, Math.min(y, height - panelHeight - margin))}px`,
      maxWidth: `min(var(--epx-floating-max-width, 320px), ${Math.max(0, width - margin * 2)}px)`, maxHeight: `${maxHeight}px`
    }
  }
  watch([visible, placement, offset], async (_, __, onCleanup) => {
    style.value = { position: 'fixed', visibility: 'hidden' }
    if (!visible.value || typeof window === 'undefined') return
    let stopped = false
    const observer = typeof ResizeObserver === 'undefined' ? undefined : new ResizeObserver(update)
    onCleanup(() => {
      stopped = true
      observer?.disconnect()
      window.removeEventListener('resize', update)
      window.removeEventListener('scroll', update, true)
    })
    await nextTick()
    if (stopped) return
    update()
    if (anchor.value) observer?.observe(anchor.value)
    if (panel.value) observer?.observe(panel.value)
    window.addEventListener('resize', update)
    window.addEventListener('scroll', update, true)
  }, { flush: 'post', immediate: true })
  return { style, actualPlacement, update }
}
