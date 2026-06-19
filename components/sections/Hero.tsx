import Image from 'next/image'
import Link from 'next/link'

interface HeroMedia {
  type: 'image' | 'video'
  /** For type="image": the image URL. For type="video": unused. */
  src?: string
  alt?: string
  blur?: string
  /** For type="video": path without extension, e.g. "/videos/hero" → hero.mp4 + hero.webm */
  videoSrc?: string
}

interface HeroProps {
  eyebrow: string
  heading: string
  subheading: string
  primaryCta: { label: string; href: string }
  secondaryCta: { label: string; href: string }
  media: HeroMedia
}

export default function Hero({
  eyebrow,
  heading,
  subheading,
  primaryCta,
  secondaryCta,
  media,
}: HeroProps) {
  return (
    <section className="rk-hero" aria-labelledby="rk-hero-heading">

      {/* Full-bleed background — image or video */}
      <div className="rk-hero__bg" aria-hidden="true">
        {media.type === 'video' && media.videoSrc ? (
          <video
            className="rk-hero__video"
            autoPlay
            muted
            loop
            playsInline
            preload="metadata"
          >
            <source src={`${media.videoSrc}.mp4`} type="video/mp4" />
            <source src={`${media.videoSrc}.webm`} type="video/webm" />
          </video>
        ) : media.src ? (
          <Image
            src={media.src}
            alt={media.alt ?? ''}
            fill
            priority
            fetchPriority="high"
            sizes="100vw"
            style={{ objectFit: 'cover', objectPosition: 'center top' }}
            placeholder={media.blur ? 'blur' : undefined}
            blurDataURL={media.blur}
          />
        ) : (
          <div className="rk-hero__placeholder" />
        )}
        <div className="rk-hero__scrim" />
      </div>

      {/* Content — overlaid, bottom-anchored on mobile, centered on desktop */}
      <div className="rk-hero__content">
        <p className="rk-eyebrow rk-hero__eyebrow">{eyebrow}</p>
        <h1 className="rk-hero__heading" id="rk-hero-heading">{heading}</h1>
        <p className="rk-hero__subheading">{subheading}</p>
        <div className="rk-hero__ctas">
          <Link href={primaryCta.href} className="rk-hero__primary-cta">
            {primaryCta.label}
          </Link>
          <Link href={secondaryCta.href} className="rk-hero__secondary-cta">
            {secondaryCta.label}
          </Link>
        </div>
      </div>

    </section>
  )
}
