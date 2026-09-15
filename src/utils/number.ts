export function finite(value: number | undefined, fallback: number): number {
  return typeof value === 'number' && Number.isFinite(value) ? value : fallback
}

export function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value))
}

export function decimalPlaces(value: number): number {
  const [coefficient, exponent = '0'] = String(value).toLowerCase().split('e')
  return Math.min(15, Math.max(0, (coefficient.split('.')[1]?.length ?? 0) - Number(exponent)))
}

export function round(value: number, precision = 12): number {
  return Number(value.toFixed(clamp(Math.floor(precision), 0, 15)))
}
