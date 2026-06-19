import type { Metadata } from 'next'
import { SITE_URL, SITE_NAME } from '@/lib/config'
import CustomPDPClient from '@/components/builder/CustomPDPClient'

const TITLE = 'Your Custom Rakhi — Review & Order | Raksha by Silver Ocean'
const DESC = 'Review your personalised 925 silver rakhi before placing the order. Engraved with his name, gift-boxed, delivered before Rakshabandhan.'

const breadcrumbSchema = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Home', item: SITE_URL },
    { '@type': 'ListItem', position: 2, name: 'Create Rakhi', item: `${SITE_URL}/create-rakhi` },
    { '@type': 'ListItem', position: 3, name: 'Your Rakhi', item: `${SITE_URL}/product/custom` },
  ],
}

export const metadata: Metadata = {
  title: TITLE,
  description: DESC,
  alternates: { canonical: `${SITE_URL}/product/custom` },
  openGraph: {
    title: TITLE,
    description: DESC,
    url: `${SITE_URL}/product/custom`,
    type: 'website',
    images: [{ url: '/og-image.jpg', width: 1200, height: 630, alt: `Your Custom Rakhi | ${SITE_NAME}` }],
  },
  twitter: {
    card: 'summary_large_image',
    title: TITLE,
    description: DESC,
    images: ['/og-image.jpg'],
  },
  robots: { index: false, follow: false },
}

export default function CustomProductPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <CustomPDPClient />
    </>
  )
}
