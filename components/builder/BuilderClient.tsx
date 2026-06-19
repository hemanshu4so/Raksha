'use client'

import { useCallback, useEffect, useReducer, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import CartDrawer from '@/components/CartDrawer'
import { loadState, saveState, DEFAULT_STATE } from '@/lib/builderState'
import { buildShareUrl, decodeConfig } from '@/lib/designConfig'
import type { BuilderState } from '@/lib/types'
import { checkoutBuilder } from '@/lib/shopify'
import { SHOPIFY_BUILDER_VARIANT_ID } from '@/lib/config'

// 9 steps: 0 = welcome, 1–8 = decisions
const TOTAL_STEPS = 9
const DECISION_STEPS = 8

const DESIGNS = [
  { id: 'forever-knot', name: 'Forever Knot', icon: 'ti-infinity'  },
  { id: 'evil-eye',     name: 'Evil Eye',     icon: 'ti-eye'       },
  { id: 'krishna',      name: 'Krishna',      icon: 'ti-lotus'     },
  { id: 'initial',      name: 'Initial',      icon: 'ti-letter-a'  },
]

const THREADS = [
  { name: 'Crimson',   color: '#8E2433' },
  { name: 'Marigold',  color: '#E0A526' },
  { name: 'Indigo',    color: '#2A3F73' },
  { name: 'Pearl',     color: '#EDE6D6' },
  { name: 'Champagne', color: '#D6C7A1' },
  { name: 'Plum',      color: '#5B2A45' },
]

const FONTS = [
  { id: 'classic',    name: 'Classic Serif', family: "var(--font-cormorant), Georgia, serif",                       preview: 'Arjun'   },
  { id: 'modern',     name: 'Modern Sans',   family: "var(--font-inter), -apple-system, sans-serif",                preview: 'Arjun'   },
  { id: 'gujarati',   name: 'Gujarati',      family: "var(--font-gujarati), 'Noto Sans Gujarati', sans-serif",      preview: 'અર્જુન' },
  { id: 'devanagari', name: 'Devanagari',    family: "var(--font-devanagari), 'Noto Sans Devanagari', sans-serif",  preview: 'अर्जुन' },
]

const PACKAGES = [
  { name: 'Raksha Signature Box', price: 0,   desc: 'Ivory box, cloth lining, hand-tied thread', icon: 'ti-box'      },
  { name: 'Premium Gift Hamper',  price: 499, desc: 'Signature box + silver care kit + candle',   icon: 'ti-package'  },
  { name: 'Minimalist Pouch',     price: 0,   desc: 'Linen drawstring pouch',                     icon: 'ti-backpack' },
]

type Action =
  | { type: 'SET_STEP';      payload: number                    }
  | { type: 'SET_DESIGN';    payload: BuilderState['design']    }
  | { type: 'SET_THREAD';    payload: BuilderState['thread']    }
  | { type: 'SET_FONT';      payload: BuilderState['font']      }
  | { type: 'SET_NAME';      payload: string                    }
  | { type: 'SET_MESSAGE';   payload: string                    }
  | { type: 'SET_PACKAGING'; payload: BuilderState['packaging'] }
  | { type: 'LOAD';          payload: BuilderState              }

function reducer(state: BuilderState, action: Action): BuilderState {
  switch (action.type) {
    case 'LOAD':          return action.payload
    case 'SET_STEP':      return { ...state, step: action.payload }
    case 'SET_DESIGN':    return { ...state, design: action.payload }
    case 'SET_THREAD':    return { ...state, thread: action.payload }
    case 'SET_FONT':      return { ...state, font: action.payload }
    case 'SET_NAME':      return { ...state, name: action.payload }
    case 'SET_MESSAGE':   return { ...state, message: action.payload }
    case 'SET_PACKAGING': return { ...state, packaging: action.payload }
    default:              return state
  }
}

function fmt(p: number) { return '₹' + p.toLocaleString('en-IN') }

const PRODUCT_PRICE = 1799

/** Restore a saved state from config param overrides */
function applyConfig(base: BuilderState, param: string): BuilderState {
  const cfg = decodeConfig(param)
  if (!cfg) return base

  const design = cfg.designId
    ? (DESIGNS.find((d) => d.id === cfg.designId) ?? null)
    : null
  const thread = cfg.threadName
    ? (THREADS.find((t) => t.name === cfg.threadName) ?? null)
    : null
  const font = cfg.fontName
    ? (FONTS.find((f) => f.name === cfg.fontName) ?? null)
    : null
  const packaging = cfg.packagingName
    ? (PACKAGES.find((p) => p.name === cfg.packagingName) ?? null)
    : null

  return {
    ...base,
    step: 6, // drop user at reveal
    ...(design    ? { design:    { id: design.id, name: design.name } }    : {}),
    ...(thread    ? { thread:    { name: thread.name, color: thread.color } } : {}),
    ...(font      ? { font:      { name: font.name, family: font.family } }  : {}),
    ...(cfg.name  !== undefined ? { name: cfg.name }       : {}),
    ...(cfg.message !== undefined ? { message: cfg.message } : {}),
    ...(packaging ? { packaging: { name: packaging.name, price: packaging.price } } : {}),
  }
}

export default function BuilderClient() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [state, dispatch] = useReducer(reducer, DEFAULT_STATE)
  const [checking, setChecking] = useState(false)
  const [checkoutError, setCheckoutError] = useState<string | null>(null)
  const [saveOpen, setSaveOpen] = useState(false)
  const [copied, setCopied] = useState(false)
  const [shareUrl, setShareUrl] = useState('')

  const step = state.step
  const totalPrice = PRODUCT_PRICE + state.packaging.price

  useEffect(() => {
    const configParam = searchParams.get('config')
    const base = loadState()
    dispatch({ type: 'LOAD', payload: configParam ? applyConfig(base, configParam) : base })
  }, [searchParams])

  useEffect(() => { saveState(state) }, [state])

  const goTo = useCallback((s: number) => dispatch({ type: 'SET_STEP', payload: s }), [])

  const autoAdvance = (delay = 360) => setTimeout(() => goTo(step + 1), delay)

  const next = () => {
    if (step >= TOTAL_STEPS - 1) { handleCheckout(); return }
    goTo(step + 1)
  }
  const back = () => {
    if (step === 0) router.push('/')
    else goTo(step - 1)
  }

  const handleCheckout = async () => {
    setCheckoutError(null)
    if (SHOPIFY_BUILDER_VARIANT_ID) {
      setChecking(true)
      try {
        const url = await checkoutBuilder(state, SHOPIFY_BUILDER_VARIANT_ID)
        window.location.href = url
        return
      } catch (err) {
        console.error('Shopify checkout error:', err)
        setCheckoutError('Could not reach checkout. Please try again.')
        setChecking(false)
        return
      }
    }
    try {
      const item = {
        id: `custom-${Date.now()}`,
        title: `Custom Rakhi — ${state.design.name}`,
        price: totalPrice,
        quantity: 1,
        properties: {
          Design: state.design.name, Thread: state.thread.name,
          Font: state.font.name, Name: state.name,
          ...(state.message ? { 'Gift Message': state.message } : {}),
          Packaging: state.packaging.name,
        },
      }
      const cart = JSON.parse(localStorage.getItem('rk_cart') ?? '[]')
      cart.push(item)
      localStorage.setItem('rk_cart', JSON.stringify(cart))
      window.dispatchEvent(new CustomEvent('rk:cart-updated'))
    } catch {}
    router.push('/product/custom')
  }

  const openSave = () => {
    setShareUrl(buildShareUrl(state))
    setCopied(false)
    setSaveOpen(true)
  }

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // fallback: select the input text
    }
  }

  const waText = encodeURIComponent(
    `I've been designing a personalised silver rakhi for you — take a look:\n${shareUrl}`
  )

  const isWelcome = step === 0
  const isReveal  = step === 6

  return (
    <>
      <CartDrawer />
      <div className="rk-atelier" data-step={step}>

        {/* ── Preview panel ── */}
        <div className={`rk-atelier__preview${isReveal ? ' is-reveal' : ''}`}>
          {isWelcome ? (
            <div className="rk-atelier__preview-brand" aria-hidden="true">
              <p className="rk-atelier__preview-wordmark">Raksha</p>
              <p className="rk-atelier__preview-byline">by Silver Ocean</p>
            </div>
          ) : (
            <>
              <div className="rk-atelier__rakhi" aria-hidden="true">
                <div
                  className="rk-atelier__arch"
                  style={{ borderColor: `${state.thread.color} ${state.thread.color} ${state.thread.color} transparent` }}
                />
                <div className="rk-atelier__disc">
                  <span className="rk-atelier__disc-name" style={{ fontFamily: state.font.family }}>
                    {state.name || (isReveal ? '✦' : 'Name')}
                  </span>
                </div>
              </div>
              <div className="rk-atelier__preview-info">
                <p className="rk-atelier__preview-design-name">{state.design.name}</p>
                <p className="rk-atelier__preview-sub">{state.thread.name} · {state.font.name}</p>
              </div>
            </>
          )}
        </div>

        {/* ── Controls panel ── */}
        <div className="rk-atelier__controls">

          <div className="rk-atelier__topbar">
            <button className="rk-atelier__back-btn" onClick={back} aria-label="Go back">
              <i className="ti ti-arrow-left" aria-hidden="true" />
            </button>
            {!isWelcome && (
              <div
                className="rk-atelier__dots"
                role="progressbar"
                aria-label={`Step ${step} of ${DECISION_STEPS}`}
                aria-valuenow={step}
                aria-valuemin={1}
                aria-valuemax={DECISION_STEPS}
              >
                {Array.from({ length: DECISION_STEPS }, (_, i) => (
                  <span
                    key={i}
                    className={`rk-atelier__dot${
                      i < step - 1 ? ' is-done' : i === step - 1 ? ' is-active' : ''
                    }`}
                  />
                ))}
              </div>
            )}
            {!isWelcome ? (
              <button
                className="rk-atelier__save-btn"
                onClick={openSave}
                aria-label="Save your design"
                title="Save your design"
              >
                <i className="ti ti-bookmark" aria-hidden="true" />
              </button>
            ) : (
              <div style={{ width: 36 }} />
            )}
          </div>

          {/* ── STEP 0: Welcome ── */}
          {step === 0 && (
            <div className="rk-atelier__step is-active">
              <div className="rk-atelier__welcome">
                <p className="rk-eyebrow rk-atelier__welcome-eyebrow">The Atelier</p>
                <p className="rk-atelier__welcome-heading">Create His Rakhi</p>
                <p className="rk-atelier__welcome-body">
                  A personalised 925 silver rakhi, crafted to his name.<br />
                  Eight decisions. One keepsake.
                </p>
                <button className="rk-atelier__welcome-btn" onClick={next}>
                  Begin
                  <i className="ti ti-arrow-right" aria-hidden="true" />
                </button>
              </div>
            </div>
          )}

          {/* ── STEP 1: Form / Motif ── */}
          {step === 1 && (
            <div className="rk-atelier__step is-active">
              <p className="rk-eyebrow rk-atelier__step-eyebrow">01 — Form</p>
              <h2 className="rk-atelier__step-heading">Choose the motif</h2>
              <p className="rk-atelier__step-sub">The silver piece at the centre of his rakhi.</p>
              <div className="rk-atelier__design-grid">
                {DESIGNS.map((d) => (
                  <button
                    key={d.id}
                    className={`rk-atelier__design-card${state.design.id === d.id ? ' is-selected' : ''}`}
                    onClick={() => {
                      dispatch({ type: 'SET_DESIGN', payload: { id: d.id, name: d.name } })
                      autoAdvance()
                    }}
                    aria-pressed={state.design.id === d.id}
                  >
                    <i className={`ti ${d.icon} rk-atelier__design-icon`} aria-hidden="true" />
                    <p className="rk-atelier__design-name">{d.name}</p>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* ── STEP 2: Thread ── */}
          {step === 2 && (
            <div className="rk-atelier__step is-active">
              <p className="rk-eyebrow rk-atelier__step-eyebrow">02 — Thread</p>
              <h2 className="rk-atelier__step-heading">Choose the thread</h2>
              <p className="rk-atelier__step-sub">The colour that wraps the disc and ties at the wrist.</p>
              <div className="rk-atelier__swatch-grid">
                {THREADS.map((t) => (
                  <button
                    key={t.name}
                    className={`rk-atelier__swatch${state.thread.name === t.name ? ' is-selected' : ''}`}
                    onClick={() => {
                      dispatch({ type: 'SET_THREAD', payload: t })
                      autoAdvance()
                    }}
                    aria-pressed={state.thread.name === t.name}
                    aria-label={`Thread colour: ${t.name}`}
                  >
                    <span
                      className="rk-atelier__swatch-pip"
                      style={{ background: t.color }}
                      aria-hidden="true"
                    />
                    <span className="rk-atelier__swatch-label">{t.name}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* ── STEP 3: Typography ── */}
          {step === 3 && (
            <div className="rk-atelier__step is-active">
              <p className="rk-eyebrow rk-atelier__step-eyebrow">03 — Typography</p>
              <h2 className="rk-atelier__step-heading">Choose the engraving style</h2>
              <p className="rk-atelier__step-sub">How his name will appear on the disc.</p>
              <div className="rk-atelier__font-list">
                {FONTS.map((f) => (
                  <button
                    key={f.id}
                    className={`rk-atelier__font-row${state.font.name === f.name ? ' is-selected' : ''}`}
                    onClick={() => {
                      dispatch({ type: 'SET_FONT', payload: { name: f.name, family: f.family } })
                      autoAdvance()
                    }}
                    aria-pressed={state.font.name === f.name}
                  >
                    <span className="rk-atelier__font-preview" style={{ fontFamily: f.family }}>
                      {f.preview}
                    </span>
                    <span className="rk-atelier__font-label">{f.name}</span>
                    {state.font.name === f.name && (
                      <i className="ti ti-check rk-atelier__font-check" aria-hidden="true" />
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* ── STEP 4: Name ── */}
          {step === 4 && (
            <div className="rk-atelier__step is-active">
              <p className="rk-eyebrow rk-atelier__step-eyebrow">04 — Name</p>
              <h2 className="rk-atelier__step-heading">What is his name?</h2>
              <p className="rk-atelier__step-sub">Up to 12 characters — as it will appear on the disc.</p>
              <div className="rk-atelier__name-field">
                <input
                  type="text"
                  className="rk-atelier__name-input"
                  value={state.name}
                  maxLength={12}
                  placeholder="His name"
                  autoFocus
                  aria-label="His name"
                  onChange={(e) => dispatch({ type: 'SET_NAME', payload: e.target.value })}
                  onKeyDown={(e) => e.key === 'Enter' && state.name.trim() && next()}
                />
                <span className="rk-atelier__name-count" aria-live="polite">
                  {state.name.length}/12
                </span>
              </div>
              <button
                className="rk-atelier__cta-btn"
                onClick={next}
                disabled={!state.name.trim()}
              >
                Continue
                <i className="ti ti-arrow-right" aria-hidden="true" />
              </button>
            </div>
          )}

          {/* ── STEP 5: Hidden Message ── */}
          {step === 5 && (
            <div className="rk-atelier__step is-active">
              <p className="rk-eyebrow rk-atelier__step-eyebrow">05 — Hidden message</p>
              <h2 className="rk-atelier__step-heading">A note for him</h2>
              <p className="rk-atelier__step-sub">Printed on the card inside the box. Entirely optional.</p>
              <textarea
                className="rk-atelier__message-input"
                value={state.message}
                maxLength={200}
                placeholder="Write something from the heart…"
                aria-label="Gift message"
                onChange={(e) => dispatch({ type: 'SET_MESSAGE', payload: e.target.value })}
              />
              <p className="rk-atelier__char-count" aria-live="polite">{state.message.length}/200</p>
              <button className="rk-atelier__cta-btn" onClick={next}>
                {state.message.trim() ? 'Add message & continue' : 'Skip'}
                <i className="ti ti-arrow-right" aria-hidden="true" />
              </button>
            </div>
          )}

          {/* ── STEP 6: Reveal ── */}
          {step === 6 && (
            <div className="rk-atelier__step is-active">
              <div className="rk-atelier__reveal">
                <p className="rk-eyebrow rk-atelier__step-eyebrow">06 — Reveal</p>
                <p className="rk-atelier__reveal-heading">
                  {state.name ? `${state.name}'s rakhi` : 'His rakhi'}
                </p>
                <p className="rk-atelier__reveal-body">
                  {state.design.name} · {state.thread.name} thread · {state.font.name}
                </p>
                <p className="rk-atelier__reveal-price">{fmt(PRODUCT_PRICE)}</p>
                <button className="rk-atelier__cta-btn" onClick={next}>
                  Choose packaging
                  <i className="ti ti-arrow-right" aria-hidden="true" />
                </button>
                <button className="rk-atelier__save-btn" onClick={openSave}>
                  <i className="ti ti-bookmark" aria-hidden="true" />
                  Save your design
                </button>
              </div>
            </div>
          )}

          {/* ── STEP 7: Packaging ── */}
          {step === 7 && (
            <div className="rk-atelier__step is-active">
              <p className="rk-eyebrow rk-atelier__step-eyebrow">07 — Packaging</p>
              <h2 className="rk-atelier__step-heading">How shall it arrive?</h2>
              <p className="rk-atelier__step-sub">Every option is gift-ready from the first look.</p>
              <div className="rk-atelier__pkg-list">
                {PACKAGES.map((pkg) => (
                  <button
                    key={pkg.name}
                    className={`rk-atelier__pkg${state.packaging.name === pkg.name ? ' is-selected' : ''}`}
                    onClick={() => {
                      dispatch({ type: 'SET_PACKAGING', payload: { name: pkg.name, price: pkg.price } })
                      autoAdvance()
                    }}
                    aria-pressed={state.packaging.name === pkg.name}
                  >
                    <i className={`ti ${pkg.icon} rk-atelier__pkg-icon`} aria-hidden="true" />
                    <div className="rk-atelier__pkg-body">
                      <p className="rk-atelier__pkg-name">{pkg.name}</p>
                      <p className="rk-atelier__pkg-desc">{pkg.desc}</p>
                    </div>
                    <span className="rk-atelier__pkg-price">
                      {pkg.price === 0 ? 'Included' : `+${fmt(pkg.price)}`}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* ── STEP 8: Review ── */}
          {step === 8 && (
            <div className="rk-atelier__step is-active">
              <p className="rk-eyebrow rk-atelier__step-eyebrow">08 — Review</p>
              <h2 className="rk-atelier__step-heading">Ready to order</h2>
              <div className="rk-atelier__summary">
                {[
                  { k: 'Design',    v: state.design.name },
                  { k: 'Thread',    v: state.thread.name },
                  { k: 'Font',      v: state.font.name   },
                  { k: 'Name',      v: state.name || '—' },
                  { k: 'Message',   v: state.message || '—' },
                  {
                    k: 'Packaging',
                    v: state.packaging.price > 0
                      ? `${state.packaging.name} (+${fmt(state.packaging.price)})`
                      : state.packaging.name,
                  },
                ].map(({ k, v }) => (
                  <div key={k} className="rk-atelier__summary-row">
                    <span className="rk-atelier__summary-key">{k}</span>
                    <span className="rk-atelier__summary-val">{v}</span>
                  </div>
                ))}
              </div>
              <div className="rk-atelier__checkout-bar">
                <div>
                  <p className="rk-atelier__total-label">Total</p>
                  <p className="rk-atelier__total-amount">{fmt(totalPrice)}</p>
                </div>
                <button
                  className="rk-atelier__checkout-btn"
                  onClick={handleCheckout}
                  disabled={checking}
                  aria-busy={checking}
                >
                  <i className="ti ti-lock" aria-hidden="true" />
                  {checking ? 'Redirecting…' : 'Place Order'}
                </button>
              </div>
              <button className="rk-atelier__save-btn" onClick={openSave}>
                <i className="ti ti-bookmark" aria-hidden="true" />
                Save your design
              </button>
            </div>
          )}

        </div>
      </div>

      {checkoutError && (
        <p role="alert" className="rk-atelier__error">{checkoutError}</p>
      )}

      {/* ── Save / Share modal ── */}
      {saveOpen && (
        <div
          className="rk-save-overlay"
          role="dialog"
          aria-modal="true"
          aria-label="Save your design"
          onClick={(e) => { if (e.target === e.currentTarget) setSaveOpen(false) }}
        >
          <div className="rk-save-modal">
            <div className="rk-save-modal__header">
              <p className="rk-save-modal__title">Save your design</p>
              <button
                className="rk-save-modal__close"
                onClick={() => setSaveOpen(false)}
                aria-label="Close"
              >
                <i className="ti ti-x" aria-hidden="true" />
              </button>
            </div>

            <div className="rk-save-modal__url-wrap">
              <input
                readOnly
                className="rk-save-modal__url"
                value={shareUrl}
                aria-label="Design URL"
                onFocus={(e) => e.target.select()}
              />
              <button
                className={`rk-save-modal__copy-btn${copied ? ' is-copied' : ''}`}
                onClick={handleCopy}
              >
                {copied ? 'Copied' : 'Copy'}
              </button>
            </div>

            <hr className="rk-save-modal__divider" />

            <a
              href={`https://wa.me/?text=${waText}`}
              className="rk-save-modal__wa"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Share via WhatsApp"
            >
              <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18" aria-hidden="true">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
              </svg>
              Share via WhatsApp
            </a>

            <p className="rk-save-modal__wa-sub">
              Anyone with this link can open your exact design in the Atelier.
            </p>
          </div>
        </div>
      )}
    </>
  )
}
