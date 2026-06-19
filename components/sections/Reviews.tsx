import Image from 'next/image'
import type { Review } from '@/lib/types'

interface ReviewsProps {
  reviews: Review[]
}

export default function Reviews({ reviews }: ReviewsProps) {
  return (
    <section className="rk-words" aria-labelledby="rk-words-heading">

      <header className="rk-words__header">
        <p className="rk-eyebrow rk-words__eyebrow">In Their Words</p>
      </header>

      <ul className="rk-words__list" role="list">
        {reviews.map((review) => (
          <li key={review.author} className="rk-words__item" role="listitem">
            {review.portrait && (
              <div className="rk-words__portrait" aria-hidden="true">
                <Image
                  src={review.portrait}
                  alt=""
                  fill
                  sizes="80px"
                  style={{ objectFit: 'cover', objectPosition: 'center top' }}
                />
              </div>
            )}
            <blockquote className="rk-words__quote">
              {review.quote}
            </blockquote>
            <p className="rk-words__byline">
              {review.author}
              {review.location && (
                <span className="rk-words__location">&ensp;·&ensp;{review.location}</span>
              )}
            </p>
          </li>
        ))}
      </ul>

    </section>
  )
}
