import type { CSSProperties } from 'vue'
export type SliderValue = number | [number, number]
export type SliderMarks = Record<number, string | { label: string; style?: CSSProperties }>
