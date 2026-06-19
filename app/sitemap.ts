import type { MetadataRoute } from 'next'
import { SITE_URL } from '@/lib/config'
import { PRODUCTS } from '@/lib/mockData'

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date()

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: SITE_URL, lastModified: now, changeFrequency: 'weekly', priority: 1 },
    { url: `${SITE_URL}/create-rakhi`, lastModified: now, changeFrequency: 'monthly', priority: 0.9 },
    { url: `${SITE_URL}/product/custom`, lastModified: now, changeFrequency: 'monthly', priority: 0.8 },
  ]

  const productRoutes: MetadataRoute.Sitemap = PRODUCTS.map((p) => ({
    url: `${SITE_URL}/product/ready/${p.handle}`,
    lastModified: now,
    changeFrequency: 'monthly' as const,
    priority: 0.8,
  }))

  return [...staticRoutes, ...productRoutes]
}
