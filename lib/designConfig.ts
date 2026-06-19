import type { BuilderState } from './types'

const FIELDS = ['design', 'thread', 'font', 'name', 'message', 'packaging'] as const

/** Encode the 6 design fields into a base64url query param */
export function encodeConfig(state: BuilderState): string {
  const payload = {
    d: state.design.id,
    t: state.thread.name,
    f: state.font.name,
    n: state.name,
    m: state.message,
    p: state.packaging.name,
  }
  const json = JSON.stringify(payload)
  if (typeof window === 'undefined') return ''
  return btoa(unescape(encodeURIComponent(json)))
    .replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '')
}

/** Decode param back to partial overrides for BuilderState */
export function decodeConfig(param: string): Partial<{
  designId: string
  threadName: string
  fontName: string
  name: string
  message: string
  packagingName: string
}> | null {
  try {
    const padded = param.replace(/-/g, '+').replace(/_/g, '/')
    const json = decodeURIComponent(escape(atob(padded)))
    const p = JSON.parse(json)
    return {
      designId:     p.d,
      threadName:   p.t,
      fontName:     p.f,
      name:         p.n,
      message:      p.m,
      packagingName: p.p,
    }
  } catch {
    return null
  }
}

export function buildShareUrl(state: BuilderState): string {
  const config = encodeConfig(state)
  const base = typeof window !== 'undefined' ? window.location.origin : ''
  return `${base}/create-rakhi?config=${config}`
}
