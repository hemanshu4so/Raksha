'use client'

import { useState } from 'react'
import type { FaqItem } from '@/lib/types'

interface FAQProps {
  items: FaqItem[]
  eyebrow?: string
  heading?: string
}

export default function FAQ({ items, eyebrow = 'Good to know', heading = 'FAQ' }: FAQProps) {
  const [openIndex, setOpenIndex] = useState(0)

  const toggle = (i: number) => setOpenIndex(openIndex === i ? -1 : i)

  return (
    <section className="rk-faq" aria-labelledby="rk-faq-title">
      <div className="rk-faq__header">
        <p className="rk-eyebrow">{eyebrow}</p>
        <h2 className="rk-faq__title" id="rk-faq-title">{heading}</h2>
      </div>

      {items.map((item, i) => (
        <div key={i} className="rk-faq__item">
          <button
            className="rk-faq__trigger"
            aria-expanded={openIndex === i}
            aria-controls={`rk-faq-answer-${i}`}
            id={`rk-faq-trigger-${i}`}
            onClick={() => toggle(i)}
          >
            <span className="rk-faq__question">{item.question}</span>
            <i className="ti ti-plus rk-faq__icon" aria-hidden="true" />
          </button>
          <div
            className={`rk-faq__answer${openIndex === i ? ' is-open' : ''}`}
            id={`rk-faq-answer-${i}`}
            role="region"
            aria-labelledby={`rk-faq-trigger-${i}`}
          >
            {item.answer}
          </div>
        </div>
      ))}
    </section>
  )
}
