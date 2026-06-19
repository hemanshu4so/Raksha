'use client'

import { useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'
import Link from 'next/link'

export default function StickyCTA() {
  const pathname = usePathname()
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    if (pathname.startsWith('/create-rakhi')) return

    const onScroll = () => {
      const threshold = document.documentElement.scrollHeight * 0.3
      setVisible(window.scrollY > threshold)
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [pathname])

  if (pathname.startsWith('/create-rakhi')) return null

  return (
    <Link
      href="/create-rakhi"
      className={`rk-sticky-cta${visible ? ' is-visible' : ''}`}
      aria-label="Create his rakhi"
    >
      Create his rakhi
    </Link>
  )
}
