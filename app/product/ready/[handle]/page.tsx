import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { SITE_URL, SITE_NAME } from '@/lib/config'
import { PRODUCTS, REVIEWS } from '@/lib/mockData'
import { getProductByHandle } from '@/lib/shopify'
import { getProductImage } from '@/lib/images'
import ReadyPDPClient from '@/components/builder/ReadyPDPClient'

interface Props {
  params: Promise<{ handle: string }>
}

export async function generateStaticParams() {
  return PRODUCTS.map((p) => ({ handle: p.handle }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { handle } = await params
  const product = await getProductByHandle(handle)
  if (!product) return {}

  const productImg = getProductImage(handle)
  const ogImage = productImg
    ? { url: productImg.src, width: 900, height: 1125, alt: productImg.alt }
    : { url: '/og-image.jpg', width: 1200, height: 630, alt: product.metaTitle }

  return {
    title: product.metaTitle,
    description: product.metaDescription,
    alternates: { canonical: `${SITE_URL}/product/ready/${handle}` },
    openGraph: {
      title: product.metaTitle,
      description: product.metaDescription,
      url: `${SITE_URL}/product/ready/${handle}`,
      type: 'website',
      siteName: SITE_NAME,
      images: [ogImage],
    },
    twitter: {
      card: 'summary_large_image',
      title: product.metaTitle,
      description: product.metaDescription,
      images: [ogImage.url],
    },
  }
}

export default async function ReadyProductPage({ params }: Props) {
  const { handle } = await params
  const product = await getProductByHandle(handle)
  if (!product) notFound()

  const productImg = getProductImage(handle)
  const productReviews = REVIEWS.slice(0, 3)

  const productSchema = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.title,
    description: product.metaDescription,
    url: `${SITE_URL}/product/ready/${handle}`,
    brand: { '@type': 'Brand', name: 'Silver Ocean' },
    material: '925 Sterling Silver',
    ...(productImg ? { image: productImg.src } : {}),
    offers: {
      '@type': 'Offer',
      price: product.price,
      priceCurrency: 'INR',
      availability: 'https://schema.org/InStock',
      url: `${SITE_URL}/product/ready/${handle}`,
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
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '5',
      reviewCount: String(productReviews.length),
      bestRating: '5',
      worstRating: '1',
    },
    review: productReviews.map((r) => ({
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
      { '@type': 'ListItem', position: 2, name: 'Collection', item: `${SITE_URL}/#collection` },
      { '@type': 'ListItem', position: 3, name: product.title, item: `${SITE_URL}/product/ready/${handle}` },
    ],
  }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <ReadyPDPClient product={product} />
    </>
  )
}
