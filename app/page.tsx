import type { Metadata } from 'next'
import { SITE_URL, SITE_NAME, SITE_DESCRIPTION } from '@/lib/config'
import { PRODUCTS, REVIEWS, FAQ_ITEMS } from '@/lib/mockData'
import { heroImage } from '@/lib/images'
import Header from '@/components/Header'
import CartDrawer from '@/components/CartDrawer'
import Hero from '@/components/sections/Hero'
import TrustStrip from '@/components/sections/TrustStrip'
import Collection from '@/components/sections/Collection'
import HowItWorks from '@/components/sections/HowItWorks'
import Packaging from '@/components/sections/Packaging'
import Reviews from '@/components/sections/Reviews'
import FAQ from '@/components/sections/FAQ'
import Provenance from '@/components/sections/Provenance'
import PrivateClient from '@/components/sections/PrivateClient'
import VideoStories from '@/components/sections/VideoStories'

const OG_IMAGE = { url: '/og-image.jpg', width: 1200, height: 630, alt: `${SITE_NAME} — Personalised Silver Rakhi` }

export const metadata: Metadata = {
  title: `${SITE_NAME} — Personalised Silver Rakhi for Rakshabandhan 2026`,
  description: SITE_DESCRIPTION,
  alternates: { canonical: SITE_URL },
  openGraph: {
    title: `${SITE_NAME} — Personalised Silver Rakhi`,
    description: SITE_DESCRIPTION,
    url: SITE_URL,
    type: 'website',
    images: [OG_IMAGE],
  },
  twitter: {
    card: 'summary_large_image',
    title: `${SITE_NAME} — Personalised Silver Rakhi`,
    description: SITE_DESCRIPTION,
    images: ['/og-image.jpg'],
  },
}

const organizationSchema = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: SITE_NAME,
  url: SITE_URL,
  logo: `${SITE_URL}/logo.png`,
  contactPoint: {
    '@type': 'ContactPoint',
    telephone: '+91-9999999999',
    contactType: 'customer service',
    areaServed: 'IN',
    availableLanguage: ['English', 'Hindi'],
  },
  sameAs: ['https://silverocean.co.in'],
}

const websiteSchema = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: SITE_NAME,
  url: SITE_URL,
  potentialAction: {
    '@type': 'SearchAction',
    target: { '@type': 'EntryPoint', urlTemplate: `${SITE_URL}/search?q={search_term_string}` },
    'query-input': 'required name=search_term_string',
  },
}

const collectionPageSchema = {
  '@context': 'https://schema.org',
  '@type': 'CollectionPage',
  name: 'Personalised Silver Rakhi Collection — Raksha by Silver Ocean',
  description: SITE_DESCRIPTION,
  url: SITE_URL,
  hasPart: PRODUCTS.map((p) => ({
    '@type': 'Product',
    name: p.title,
    url: `${SITE_URL}/product/ready/${p.handle}`,
    offers: {
      '@type': 'Offer',
      price: p.price,
      priceCurrency: 'INR',
      availability: 'https://schema.org/InStock',
    },
  })),
}

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: FAQ_ITEMS.map((item) => ({
    '@type': 'Question',
    name: item.question,
    acceptedAnswer: { '@type': 'Answer', text: item.answer },
  })),
}

const aggregateRatingSchema = {
  '@context': 'https://schema.org',
  '@type': 'LocalBusiness',
  name: SITE_NAME,
  url: SITE_URL,
  aggregateRating: {
    '@type': 'AggregateRating',
    ratingValue: '5',
    reviewCount: String(REVIEWS.length),
    bestRating: '5',
    worstRating: '1',
  },
  review: REVIEWS.map((r) => ({
    '@type': 'Review',
    author: { '@type': 'Person', name: r.author },
    reviewBody: r.quote,
    reviewRating: { '@type': 'Rating', ratingValue: String(r.rating), bestRating: '5' },
    datePublished: r.date,
  })),
}

const breadcrumbSchema = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Home', item: SITE_URL },
  ],
}

export default function HomePage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionPageSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(aggregateRatingSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />

      <Header />
      <CartDrawer />

      <main>
        <Hero
          eyebrow="Rakshabandhan 2026"
          heading={"This year,\ndon't choose a rakhi for him.\n\nMake one."}
          subheading="Real 925 silver keepsakes, made in Junagadh."
          primaryCta={{ label: 'Begin his keepsake', href: '/create-rakhi' }}
          secondaryCta={{ label: 'Explore the Collection', href: '#collection' }}
          media={{
            type: 'image',
            src: heroImage.src,
            alt: heroImage.alt,
            blur: heroImage.blur,
          }}
        />
        <VideoStories />
        <TrustStrip />
        <div id="collection">
          <Collection products={PRODUCTS} />
        </div>
        <Provenance />
        <HowItWorks />
        <Packaging />
        <Reviews reviews={REVIEWS} />
        <PrivateClient />
        <FAQ items={FAQ_ITEMS} />
      </main>
    </>
  )
}
