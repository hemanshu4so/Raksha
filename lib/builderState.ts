import type { BuilderState } from './types'

const KEY = 'rk_builder_v1'

export const DEFAULT_STATE: BuilderState = {
  step: 0,
  design: { id: 'forever-knot', name: 'Forever Knot' },
  thread: { name: 'Crimson', color: '#8E2433' },
  font: { name: 'Classic', family: "'Cormorant Garamond', Georgia, serif" },
  name: 'Arjun',
  message: '',
  packaging: { name: 'Raksha Signature Box', price: 0 },
}

export function loadState(): BuilderState {
  if (typeof window === 'undefined') return DEFAULT_STATE
  try {
    const raw = localStorage.getItem(KEY)
    if (!raw) return DEFAULT_STATE
    return { ...DEFAULT_STATE, ...JSON.parse(raw) }
  } catch {
    return DEFAULT_STATE
  }
}

export function saveState(state: BuilderState): void {
  if (typeof window === 'undefined') return
  try {
    localStorage.setItem(KEY, JSON.stringify(state))
  } catch {
    // storage full or private mode
  }
}

export function clearState(): void {
  if (typeof window === 'undefined') return
  localStorage.removeItem(KEY)
}
