const unsafe = new Set(['__proto__', 'prototype', 'constructor'])
function keys(path: string) {
  const result = path.replace(/\[(\d+)\]/g, '.$1').split('.')
  return result.every(key => key && !unsafe.has(key)) ? result : []
}
export function getFieldValue(model: Record<string, unknown> | undefined, path: string) {
  if (!keys(path).length) return undefined
  return keys(path).reduce<unknown>((value, key) => value && typeof value === 'object'
    ? (value as Record<string, unknown>)[key] : undefined, model)
}
export function setFieldValue(model: Record<string, unknown> | undefined, path: string, value: unknown) {
  const parts = keys(path)
  if (!model || !parts.length) return
  let target = model
  for (let i = 0; i < parts.length - 1; i++) {
    const next = target[parts[i]]
    if (!next || typeof next !== 'object') target[parts[i]] = /^\d+$/.test(parts[i + 1]) ? [] : {}
    target = target[parts[i]] as Record<string, unknown>
  }
  target[parts[parts.length - 1]] = value
}
export function cloneFieldValue(value: unknown): unknown {
  if (value instanceof Date) return new Date(value.getTime())
  if (Array.isArray(value)) return value.map(cloneFieldValue)
  if (Object.prototype.toString.call(value) === '[object Object]') {
    return Object.fromEntries(Object.entries(value as Record<string, unknown>).map(([key, item]) => [key, cloneFieldValue(item)]))
  }
  return value
}
