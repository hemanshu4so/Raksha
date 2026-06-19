'use client'

import { useEffect, useRef, useState } from 'react'
import type { CartItem } from '@/lib/types'

function formatPrice(p: number) {
  return '₹' + p.toLocaleString('en-IN')
}

export default function CartDrawer() {
  const [open, setOpen] = useState(false)
  const [items, setItems] = useState<CartItem[]>([])
  const drawerRef = useRef<HTMLElement>(null)

  const load = () => {
    try {
      setItems(JSON.parse(localStorage.getItem('rk_cart') ?? '[]'))
    } catch {
      setItems([])
    }
  }

  useEffect(() => {
    load()
    const openHandler = () => { load(); setOpen(true) }
    window.addEventListener('rk:cart-open', openHandler)
    window.addEventListener('rk:cart-updated', load)
    return () => {
      window.removeEventListener('rk:cart-open', openHandler)
      window.removeEventListener('rk:cart-updated', load)
    }
  }, [])

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    if (open) drawerRef.current?.focus()
  }, [open])

  const close = () => setOpen(false)

  const total = items.reduce((s, i) => s + i.price * i.quantity, 0)

  return (
    <>
      <div
        className={`rk-cart-overlay${open ? ' is-open' : ''}`}
        onClick={close}
        aria-hidden="true"
      />
      <aside
        ref={drawerRef}
        className={`rk-cart-drawer${open ? ' is-open' : ''}`}
        role="dialog"
        aria-modal="true"
        aria-label="Shopping cart"
        aria-hidden={!open}
        tabIndex={-1}
      >
        <div className="rk-cart-drawer__header">
          <h2 className="rk-cart-drawer__title">Your Cart</h2>
          <button className="rk-cart-drawer__close" onClick={close} aria-label="Close cart">
            <i className="ti ti-x" aria-hidden="true" />
          </button>
        </div>

        <div className="rk-cart-drawer__body">
          {items.length === 0 ? (
            <div className="rk-cart-drawer__empty">
              <div className="rk-cart-drawer__empty-icon">
                <i className="ti ti-shopping-bag" aria-hidden="true" />
              </div>
              <p style={{ fontSize: 15 }}>Your cart is empty.</p>
              <p style={{ fontSize: 13, marginTop: 6 }}>
                <a
                  href="/create-rakhi"
                  onClick={close}
                  style={{ borderBottom: '1px solid currentColor', paddingBottom: 2 }}
                >
                  Create His Rakhi
                </a>
              </p>
            </div>
          ) : (
            items.map((item) => (
              <div key={item.id} className="rk-cart-drawer__item">
                <div className="rk-cart-drawer__item-info">
                  <p className="rk-cart-drawer__item-title">{item.title}</p>
                  {item.properties && (
                    <p className="rk-cart-drawer__item-props">
                      {Object.entries(item.properties)
                        .map(([k, v]) => `${k}: ${v}`)
                        .join(' · ')}
                    </p>
                  )}
                  <p className="rk-cart-drawer__item-price">
                    {formatPrice(item.price * item.quantity)}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>

        {items.length > 0 && (
          <div className="rk-cart-drawer__footer">
            <div className="rk-cart-drawer__subtotal">
              <span className="rk-cart-drawer__subtotal-label">Subtotal</span>
              <span className="rk-cart-drawer__subtotal-amount">{formatPrice(total)}</span>
            </div>
            <a href="/checkout" className="rk-cart-drawer__checkout">
              Proceed to Checkout
            </a>
          </div>
        )}
      </aside>
    </>
  )
}
