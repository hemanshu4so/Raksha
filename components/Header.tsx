'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

interface HeaderProps {
  variant?: 'default' | 'builder' | 'pdp'
  pdpTitle?: string
  backHref?: string
}

export default function Header({ variant = 'default', pdpTitle, backHref = '/' }: HeaderProps) {
  const [cartCount, setCartCount] = useState(0)
  const pathname = usePathname()

  useEffect(() => {
    const updateCount = () => {
      try {
        const cart = JSON.parse(localStorage.getItem('rk_cart') ?? '[]')
        setCartCount(cart.reduce((n: number, i: { quantity: number }) => n + i.quantity, 0))
      } catch {
        setCartCount(0)
      }
    }
    updateCount()
    window.addEventListener('rk:cart-updated', updateCount)
    return () => window.removeEventListener('rk:cart-updated', updateCount)
  }, [])

  const openCart = () => window.dispatchEvent(new CustomEvent('rk:cart-open'))

  if (variant === 'builder') {
    return (
      <header className="rk-header rk-header--builder">
        <div className="rk-header__left">
          <Link href={backHref} className="rk-header__btn" aria-label="Go back">
            <i className="ti ti-arrow-left" aria-hidden="true" />
          </Link>
        </div>
        <div className="rk-header__wordmark">{pdpTitle ?? 'Create His Rakhi'}</div>
        <div className="rk-header__right" style={{ width: 40 }} />
      </header>
    )
  }

  if (variant === 'pdp') {
    return (
      <header className="rk-header rk-header--pdp">
        <div className="rk-header__left">
          <Link href="/" className="rk-header__btn" aria-label="Go back">
            <i className="ti ti-arrow-left" aria-hidden="true" />
          </Link>
        </div>
        <div className="rk-header__wordmark">{pdpTitle ?? 'Raksha'}</div>
        <div className="rk-header__right">
          <button className="rk-header__btn" onClick={openCart} aria-label="Open cart">
            <i className="ti ti-shopping-bag" aria-hidden="true" />
            {cartCount > 0 && (
              <span className="rk-header__cart-count" aria-label={`${cartCount} items in cart`}>
                {cartCount}
              </span>
            )}
          </button>
        </div>
      </header>
    )
  }

  return (
    <header className="rk-header">
      <div className="rk-header__left">
        <button className="rk-header__btn" aria-label="Menu">
          <i className="ti ti-menu-2" aria-hidden="true" />
        </button>
      </div>
      <Link href="/" className="rk-header__wordmark">
        Raksha
      </Link>
      <div className="rk-header__right">
        <button className="rk-header__btn" aria-label="Search">
          <i className="ti ti-search" aria-hidden="true" />
        </button>
        <button
          className="rk-header__btn"
          style={{ position: 'relative' }}
          onClick={openCart}
          aria-label="Open cart"
        >
          <i className="ti ti-shopping-bag" aria-hidden="true" />
          {cartCount > 0 && (
            <span className="rk-header__cart-count" aria-label={`${cartCount} items`}>
              {cartCount}
            </span>
          )}
        </button>
      </div>
    </header>
  )
}
