import type { Metadata, Viewport } from 'next'
import { Cormorant_Garamond, Inter, Pinyon_Script, Noto_Sans_Gujarati, Noto_Sans_Devanagari } from 'next/font/google'
import StickyCTA from '@/components/StickyCTA'
import Analytics from '@/components/Analytics'
import WaitlistPopup from '@/components/WaitlistPopup'
import ServiceWorkerRegistration from '@/components/ServiceWorkerRegistration'
import './globals.css'
import { SITE_NAME, SITE_DESCRIPTION, SITE_URL } from '@/lib/config'

const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-cormorant',
  display: 'swap',
})

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

const pinyon = Pinyon_Script({
  subsets: ['latin'],
  weight: '400',
  variable: '--font-pinyon',
  display: 'swap',
})

const notoGujarati = Noto_Sans_Gujarati({
  subsets: ['gujarati'],
  weight: ['400', '500'],
  variable: '--font-gujarati',
  display: 'swap',
})

const notoDevanagari = Noto_Sans_Devanagari({
  subsets: ['devanagari'],
  weight: ['400', '500'],
  variable: '--font-devanagari',
  display: 'swap',
})

export const viewport: Viewport = {
  themeColor: '#F6F3EE',
  width: 'device-width',
  initialScale: 1,
}

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${SITE_NAME} — Personalised Silver Rakhi`,
    template: `%s | ${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION,
  keywords: [
    'personalised rakhi', 'custom rakhi', 'silver rakhi', '925 silver rakhi',
    'rakhi with name', 'engraved rakhi', 'rakshabandhan gift for brother',
    'luxury rakhi india', 'personalised rakshabandhan gift', 'custom silver jewellery gift',
  ],
  authors: [{ name: 'Silver Ocean', url: 'https://silverocean.co.in' }],
  creator: 'Silver Ocean',
  publisher: 'Silver Ocean',
  robots: { index: true, follow: true, googleBot: { index: true, follow: true } },
  openGraph: {
    type: 'website',
    siteName: SITE_NAME,
    title: `${SITE_NAME} — Personalised Silver Rakhi`,
    description: SITE_DESCRIPTION,
    url: SITE_URL,
    images: [{ url: '/og-image.jpg', width: 1200, height: 630, alt: SITE_NAME }],
    locale: 'en_IN',
  },
  twitter: {
    card: 'summary_large_image',
    title: `${SITE_NAME} — Personalised Silver Rakhi`,
    description: SITE_DESCRIPTION,
    images: ['/og-image.jpg'],
  },
  alternates: { canonical: SITE_URL },
  icons: {
    icon: [
      { url: '/favicon.svg', type: 'image/svg+xml' },
      { url: '/favicon.ico', sizes: '32x32' },
    ],
    apple: [{ url: '/apple-touch-icon.png', sizes: '180x180' }],
    other: [{ rel: 'mask-icon', url: '/favicon.svg', color: '#1B1F1B' }],
  },
  manifest: '/manifest.webmanifest',
  // Set NEXT_PUBLIC_GSC_VERIFICATION in .env.local to activate
  ...(process.env.NEXT_PUBLIC_GSC_VERIFICATION
    ? { verification: { google: process.env.NEXT_PUBLIC_GSC_VERIFICATION } }
    : {}),
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-IN" className={`${cormorant.variable} ${inter.variable} ${pinyon.variable} ${notoGujarati.variable} ${notoDevanagari.variable}`}>
      <head>
        <link rel="preconnect" href="https://cdn.jsdelivr.net" crossOrigin="anonymous" />
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/npm/@tabler/icons-webfont@3.1.0/dist/tabler-icons.min.css"
        />
      </head>
      <body>
        {children}
        <StickyCTA />
        <WaitlistPopup />
        <Analytics />
        <ServiceWorkerRegistration />
      </body>
    </html>
  )
}
