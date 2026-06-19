'use client'

import { useEffect, useState, useRef } from 'react'

const STORAGE_KEY = 'rk_waitlist_done'
const DELAY_MS = 8000

export default function WaitlistPopup() {
  const [visible, setVisible] = useState(false)
  const [email, setEmail] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (typeof window !== 'undefined' && localStorage.getItem(STORAGE_KEY)) return

    const timer = setTimeout(() => setVisible(true), DELAY_MS)

    const onScroll = () => {
      if (window.scrollY > document.documentElement.scrollHeight * 0.4) {
        setVisible(true)
        window.removeEventListener('scroll', onScroll)
      }
    }
    window.addEventListener('scroll', onScroll, { passive: true })

    return () => {
      clearTimeout(timer)
      window.removeEventListener('scroll', onScroll)
    }
  }, [])

  useEffect(() => {
    if (visible && !submitted) inputRef.current?.focus()
  }, [visible, submitted])

  function dismiss() {
    setVisible(false)
    localStorage.setItem(STORAGE_KEY, '1')
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const trimmed = email.trim()
    if (!trimmed || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) {
      setError('Please enter a valid email address.')
      return
    }
    setError('')
    setSubmitted(true)
    localStorage.setItem(STORAGE_KEY, '1')
    setTimeout(() => setVisible(false), 2800)
  }

  if (!visible) return null

  return (
    <div
      className="rk-waitlist-overlay"
      role="dialog"
      aria-modal="true"
      aria-labelledby="rk-waitlist-heading"
      onClick={(e) => { if (e.target === e.currentTarget) dismiss() }}
    >
      <div className="rk-waitlist-modal">
        <button
          className="rk-waitlist-close"
          onClick={dismiss}
          aria-label="Close"
          type="button"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" width="18" height="18" aria-hidden="true">
            <path d="M18 6 6 18M6 6l12 12" strokeLinecap="round" />
          </svg>
        </button>

        {submitted ? (
          <div className="rk-waitlist-success">
            <p className="rk-waitlist-success__icon" aria-hidden="true">✦</p>
            <p className="rk-waitlist-success__heading">You&apos;re on the list.</p>
            <p className="rk-waitlist-success__body">We&apos;ll reach you first when Raksha 2026 opens.</p>
          </div>
        ) : (
          <>
            <p className="rk-eyebrow rk-waitlist-eyebrow">Raksha 2026</p>
            <h2 className="rk-waitlist-heading" id="rk-waitlist-heading">
              Be first to know<br />when orders open.
            </h2>
            <p className="rk-waitlist-body">
              Personalised silver rakhi — made in Junagadh.<br />
              Limited pieces. Join the waitlist.
            </p>
            <form className="rk-waitlist-form" onSubmit={handleSubmit} noValidate>
              <input
                ref={inputRef}
                className="rk-waitlist-input"
                type="email"
                placeholder="your@email.com"
                value={email}
                onChange={(e) => { setEmail(e.target.value); setError('') }}
                aria-label="Email address"
                autoComplete="email"
              />
              {error && <p className="rk-waitlist-error" role="alert">{error}</p>}
              <button className="rk-waitlist-submit" type="submit">
                Join the waitlist
              </button>
            </form>
            <p className="rk-waitlist-note">No spam. We&apos;ll email you once.</p>
          </>
        )}
      </div>
    </div>
  )
}
