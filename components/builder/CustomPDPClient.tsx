'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Header from '@/components/Header'
import CartDrawer from '@/components/CartDrawer'
import { loadState } from '@/lib/builderState'
import type { BuilderState } from '@/lib/types'
import { DEFAULT_STATE } from '@/lib/builderState'

const PRODUCT_PRICE = 1799

function formatPrice(p: number) {
  return '₹' + p.toLocaleString('en-IN')
}

export default function CustomPDPClient() {
  const router = useRouter()
  const [state, setState] = useState<BuilderState>(DEFAULT_STATE)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setState(loadState())
    setMounted(true)
  }, [])

  const totalPrice = PRODUCT_PRICE + state.packaging.price

  const addToCart = () => {
    const item = {
      id: `custom-${Date.now()}`,
      title: `Custom Rakhi — ${state.design.name}`,
      price: totalPrice,
      quantity: 1,
      properties: {
        Design: state.design.name,
        Thread: state.thread.name,
        Font: state.font.name,
        Name: state.name,
        ...(state.message ? { Message: state.message } : {}),
        Packaging: state.packaging.name,
      },
    }
    try {
      const cart = JSON.parse(localStorage.getItem('rk_cart') ?? '[]')
      cart.push(item)
      localStorage.setItem('rk_cart', JSON.stringify(cart))
      window.dispatchEvent(new CustomEvent('rk:cart-updated'))
      window.dispatchEvent(new CustomEvent('rk:cart-open'))
    } catch {}
  }

  if (!mounted) return null

  const rows = [
    { key: 'Design',    val: state.design.name },
    { key: 'Thread',    val: state.thread.name },
    { key: 'Font',      val: state.font.name },
    { key: 'Name',      val: state.name || '—' },
    { key: 'Message',   val: state.message || '—' },
    { key: 'Packaging', val: state.packaging.name },
  ]

  return (
    <>
      <CartDrawer />
      <div className="rk-custom-pdp">
        <Header variant="pdp" pdpTitle="Your Rakhi" />

        {/* Hero */}
        <div className="rk-pdp__hero">
          <div className="rk-pdp__rakhi" aria-label={`Custom rakhi for ${state.name}`}>
            <div
              className="rk-pdp__rakhi-arch"
              style={{ borderColor: `${state.thread.color} ${state.thread.color} ${state.thread.color} transparent` }}
              aria-hidden="true"
            />
            <div className="rk-pdp__rakhi-disc" aria-hidden="true">
              <span
                className="rk-pdp__rakhi-name"
                style={{ fontFamily: state.font.family }}
              >
                {state.name || 'Name'}
              </span>
            </div>
          </div>
        </div>

        {/* Info */}
        <div className="rk-pdp__info">
          <p className="rk-eyebrow rk-pdp__eyebrow">One of one</p>
          <h1 className="rk-pdp__title">Your Rakhi</h1>
          <p className="rk-pdp__subtitle">
            Custom engraved · {state.design.name} · {state.thread.name} thread
          </p>
          <div className="rk-pdp__price-row">
            <p className="rk-pdp__price">{formatPrice(totalPrice)}</p>
            <p className="rk-pdp__delivery">Order by 22 August to arrive for Rakshabandhan.</p>
          </div>
        </div>

        {/* Summary */}
        <div className="rk-pdp__summary">
          <table className="rk-pdp__summary-table" aria-label="Your customisation summary">
            <tbody>
              {rows.map((row) => (
                <tr key={row.key} className="rk-pdp__summary-row">
                  <th className="rk-pdp__summary-key" scope="row">{row.key}</th>
                  <td className="rk-pdp__summary-val">{row.val}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Secondary actions */}
        <div className="rk-pdp__actions">
          <button
            className="rk-pdp__action-btn"
            onClick={() => router.push('/create-rakhi')}
          >
            <i className="ti ti-pencil" aria-hidden="true" /> Edit
          </button>
          <button
            className="rk-pdp__action-btn"
            onClick={() => {
              if (navigator.share) {
                navigator.share({ title: 'My Raksha Rakhi', url: window.location.href })
              }
            }}
          >
            <i className="ti ti-share" aria-hidden="true" /> Share
          </button>
        </div>

        <div className="rk-pdp__spacer" />

        {/* Sticky ATC */}
        <div className="rk-pdp__atc" aria-label="Add to cart bar">
          <div>
            <p className="rk-pdp__atc-label">Total</p>
            <p className="rk-pdp__atc-amount">{formatPrice(totalPrice)}</p>
          </div>
          <button
            className="rk-pdp__atc-btn"
            onClick={addToCart}
            aria-label={`Add your rakhi to cart for ${formatPrice(totalPrice)}`}
          >
            <i className="ti ti-shopping-bag" aria-hidden="true" />
            Add To Cart
          </button>
        </div>
      </div>
    </>
  )
}
