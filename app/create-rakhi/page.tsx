import type { Metadata } from 'next'
import { Suspense } from 'react'
import { SITE_URL, SITE_NAME } from '@/lib/config'
import BuilderClient from '@/components/builder/BuilderClient'

const TITLE = 'Create His Rakhi — Custom Engraved 925 Silver Rakhi Builder'
const DESC = 'Design a personalised silver rakhi in 9 steps. Choose the motif, thread colour, engraving font, and his name. Preview before you order.'
const OG_IMAGE = { url: '/og-image.jpg', width: 1200, height: 630, alt: `Create Your Rakhi | ${SITE_NAME}` }

export const metadata: Metadata = {
  title: TITLE,
  description: DESC,
  alternates: { canonical: `${SITE_URL}/create-rakhi` },
  openGraph: {
    title: TITLE,
    description: DESC,
    url: `${SITE_URL}/create-rakhi`,
    type: 'website',
    images: [OG_IMAGE],
  },
  twitter: {
    card: 'summary_large_image',
    title: TITLE,
    description: DESC,
    images: ['/og-image.jpg'],
  },
  robots: { index: true, follow: true },
}

const breadcrumbSchema = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Home', item: SITE_URL },
    { '@type': 'ListItem', position: 2, name: 'Create Rakhi', item: `${SITE_URL}/create-rakhi` },
  ],
}

const productSchema = {
  '@context': 'https://schema.org',
  '@type': 'Product',
  name: 'Custom Engraved Silver Rakhi',
  description: 'Personalised 925 silver rakhi, custom engraved with his name. Choose motif, thread, font and packaging.',
  brand: { '@type': 'Brand', name: 'Silver Ocean' },
  material: '925 Sterling Silver',
  offers: {
    '@type': 'Offer',
    price: 1799,
    priceCurrency: 'INR',
    availability: 'https://schema.org/InStock',
    url: `${SITE_URL}/create-rakhi`,
    seller: { '@type': 'Organization', name: 'Silver Ocean' },
    shippingDetails: {
      '@type': 'OfferShippingDetails',
      shippingRate: { '@type': 'MonetaryAmount', value: '0', currency: 'INR' },
      deliveryTime: {
        '@type': 'ShippingDeliveryTime',
        handlingTime: { '@type': 'QuantitativeValue', minValue: 1, maxValue: 2, unitCode: 'DAY' },
        transitTime: { '@type': 'QuantitativeValue', minValue: 2, maxValue: 5, unitCode: 'DAY' },
      },
    },
  },
}

export default function CreateRakhiPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }} />
      <h1 className="sr-only">Create Your Personalised Silver Rakhi</h1>
      <Suspense fallback={<div className="rk-atelier" aria-busy="true" />}>
        <BuilderClient />
      </Suspense>
    </>
  )
}
