import Image from 'next/image'
import Link from 'next/link'
import type { Product } from '@/lib/types'
import { getProductImage } from '@/lib/images'

interface CollectionProps {
  products: Product[]
}

export default function Collection({ products }: CollectionProps) {
  return (
    <section className="rk-collection" aria-labelledby="rk-collection-title">

      <header className="rk-collection__header">
        <p className="rk-eyebrow rk-collection__eyebrow">The Collection</p>
        <h2 className="rk-collection__heading" id="rk-collection-title">
          Four pieces.<br />Each one, only his.
        </h2>
      </header>

      <ul className="rk-collection__list" role="list">
        {products.map((product, i) => {
          const img = getProductImage(product.handle)
          const index = String(i + 1).padStart(2, '0')

          return (
            <li key={product.handle} className="rk-collection__item">
              <Link
                href={`/product/ready/${product.handle}`}
                className="rk-collection__link"
                aria-label={`${product.title} — ${product.shortDesc}`}
              >
                {/* Photography */}
                <div className="rk-collection__img-wrap">
                  {img ? (
                    <Image
                      src={img.src}
                      alt={img.alt}
                      fill
                      sizes="(min-width: 900px) 45vw, 100vw"
                      style={{ objectFit: 'cover', objectPosition: 'center' }}
                      priority={img.priority ?? false}
                      placeholder="blur"
                      blurDataURL={img.blur}
                    />
                  ) : (
                    <div className="rk-collection__img-placeholder" aria-hidden="true">
                      <i className="ti ti-diamond" style={{ fontSize: 32, color: 'var(--rk-champagne)' }} />
                    </div>
                  )}
                </div>

                {/* Editorial text */}
                <div className="rk-collection__text">
                  <span className="rk-collection__index" aria-hidden="true">{index}</span>
                  <h3 className="rk-collection__title">{product.title}</h3>
                  <p className="rk-collection__line">{product.shortDesc}</p>
                  <p className="rk-collection__meta">
                    {product.priceFormatted}
                    <span className="rk-collection__weight"> · {product.weight}</span>
                  </p>
                  <span className="rk-collection__cta" aria-hidden="true">
                    View Piece
                  </span>
                </div>
              </Link>
            </li>
          )
        })}
      </ul>

    </section>
  )
}
