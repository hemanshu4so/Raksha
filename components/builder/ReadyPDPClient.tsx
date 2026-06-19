'use client'

import { useState } from 'react'
import Image from 'next/image'
import Header from '@/components/Header'
import CartDrawer from '@/components/CartDrawer'
import type { Product } from '@/lib/types'
import { getProductImage } from '@/lib/images'
import { checkoutReady } from '@/lib/shopify'

interface Props {
  product: Product
  /** Shopify variant GID — passed from the server page once Storefront API is live */
  variantId?: string
}

function formatPrice(p: number) {
  return '₹' + p.toLocaleString('en-IN')
}

type BtnState = 'idle' | 'loading' | 'done' | 'error'

export default function ReadyPDPClient({ product, variantId }: Props) {
  const [btnState, setBtnState] = useState<BtnState>('idle')
  const productImg = getProductImage(product.handle)

  const handleAddToCart = async () => {
    setBtnState('loading')

    // If a Shopify variant ID is available, go straight to checkout
    if (variantId) {
      try {
        const url = await checkoutReady(variantId)
        window.location.href = url
        return
      } catch (err) {
        console.error('Shopify checkout error:', err)
        setBtnState('error')
        setTimeout(() => setBtnState('idle'), 3000)
        return
      }
    }

    // Fallback: add to local cart drawer
    const item = {
      id: `${product.handle}-${Date.now()}`,
      title: product.title,
      price: product.price,
      quantity: 1,
    }
    try {
      const cart = JSON.parse(localStorage.getItem('rk_cart') ?? '[]')
      cart.push(item)
      localStorage.setItem('rk_cart', JSON.stringify(cart))
      window.dispatchEvent(new CustomEvent('rk:cart-updated'))
      setBtnState('done')
      setTimeout(() => {
        window.dispatchEvent(new CustomEvent('rk:cart-open'))
        setBtnState('idle')
      }, 600)
    } catch {
      setBtnState('error')
      setTimeout(() => setBtnState('idle'), 3000)
    }
  }

  const btnLabel =
    btnState === 'loading' ? 'Adding…'
    : btnState === 'done'    ? 'Added!'
    : btnState === 'error'   ? 'Try again'
    : 'Add To Cart'

  const btnIcon =
    btnState === 'done'  ? 'ti-check'
    : btnState === 'error' ? 'ti-alert-circle'
    : 'ti-shopping-bag'

  return (
    <>
      <CartDrawer />
      <div className="rk-ready-pdp">
        <Header variant="pdp" pdpTitle={product.title} />

        {/* Gallery */}
        <div className="rk-ready-pdp__gallery">
          {productImg ? (
            <Image
              src={productImg.src}
              alt={productImg.alt}
              fill
              priority
              fetchPriority="high"
              sizes="(min-width: 768px) 50vw, 100vw"
              style={{ objectFit: 'cover' }}
              placeholder="blur"
              blurDataURL={productImg.blur}
            />
          ) : (
            <>
              <i className="ti ti-diamond" style={{ fontSize: 32, color: 'var(--rk-champagne)' }} aria-hidden="true" />
              <span style={{ fontSize: 10, letterSpacing: '.14em', textTransform: 'uppercase', color: 'var(--rk-muted)', marginTop: 8 }}>
                Product photo
              </span>
            </>
          )}
        </div>

        {/* Info */}
        <div className="rk-ready-pdp__info">
          <p className="rk-eyebrow rk-ready-pdp__eyebrow">Ready to gift</p>
          <h1 className="rk-ready-pdp__title">{product.title}</h1>
          <div
            className="rk-ready-pdp__desc"
            dangerouslySetInnerHTML={{ __html: product.description }}
          />
          <p className="rk-ready-pdp__price">{product.priceFormatted}</p>
          <p className="rk-ready-pdp__meta">{product.weight} · Certified 925 Silver</p>
        </div>

        <div style={{ height: 88, background: 'var(--rk-ivory)' }} />

        {/* Sticky ATC */}
        <div className="rk-ready-pdp__atc" aria-label="Add to cart bar">
          <div>
            <p className="rk-pdp__atc-label">Total</p>
            <p className="rk-pdp__atc-amount">{product.priceFormatted}</p>
          </div>
          <button
            className="rk-ready-pdp__atc-btn"
            onClick={handleAddToCart}
            disabled={btnState === 'loading'}
            aria-busy={btnState === 'loading'}
            aria-label={`Add ${product.title} to cart`}
          >
            <i className={`ti ${btnIcon}`} aria-hidden="true" />
            {btnLabel}
          </button>
        </div>
      </div>
    </>
  )
}
