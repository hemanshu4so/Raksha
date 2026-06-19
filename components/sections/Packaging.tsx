import Image from 'next/image'
import { arrivalSequence } from '@/lib/images'

export default function Packaging() {
  return (
    <section className="rk-arrival" aria-labelledby="rk-arrival-heading">

      <header className="rk-arrival__header">
        <p className="rk-eyebrow rk-arrival__eyebrow">The Arrival</p>
        <h2 className="rk-arrival__heading" id="rk-arrival-heading">
          It arrives as an heirloom should.
        </h2>
      </header>

      <div className="rk-arrival__sequence" role="list">
        {arrivalSequence.map((step, i) => (
          <div key={step.label} className="rk-arrival__step" role="listitem">
            <div className="rk-arrival__img-wrap">
              <Image
                src={step.src}
                alt={step.alt}
                fill
                sizes="(min-width: 900px) 25vw, 80vw"
                style={{ objectFit: 'cover', objectPosition: 'center' }}
                loading="lazy"
                placeholder="blur"
                blurDataURL={step.blur}
              />
            </div>
            <div className="rk-arrival__step-foot">
              <span className="rk-arrival__step-num" aria-hidden="true">
                {String(i + 1).padStart(2, '0')}
              </span>
              <p className="rk-arrival__step-label">{step.label}</p>
            </div>
          </div>
        ))}
      </div>

    </section>
  )
}
