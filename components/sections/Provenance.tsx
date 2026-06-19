import Image from 'next/image'

const WORKSHOP_IMAGE = {
  src: 'https://images.unsplash.com/photo-1631125915902-d8abe9225ff2?w=1400&h=1000&fit=crop&auto=format&q=85',
  alt: 'Karigar hand-finishing a silver piece in a Junagadh workshop',
  blur: 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAgGBgcGBQgHBwcJCQgKDBQNDAsLDBkSEw8UHRofHh0aHBwgJC4nICIsIxwcKDcpLDAxNDQ0Hyc5PTgyPC4zNDL/wAARCAAIAAoDASIAAhEBAxEB/8QAFgABAQEAAAAAAAAAAAAAAAAABgUE/8QAIxAAAQQCAgMBAAAAAAAAAAAAAQIDBBEhBRIxUf/EABUBAQEAAAAAAAAAAAAAAAAAAAIB/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECAxESIf/aAAwDAQACEQMRAD8Aqcvkr9Cx9hFdmjZlkADWNcQMknrHn6VtPw5jrNe5FLM58bHOaGS+wgj3H8qIipOhXKJSt//Z',
}

export default function Provenance() {
  return (
    <section className="rk-provenance" aria-labelledby="rk-provenance-heading">

      {/* Image — top on mobile, left on desktop */}
      <div className="rk-provenance__media">
        <Image
          src={WORKSHOP_IMAGE.src}
          alt={WORKSHOP_IMAGE.alt}
          fill
          sizes="(min-width: 900px) 50vw, 100vw"
          style={{ objectFit: 'cover', objectPosition: 'center' }}
          placeholder="blur"
          blurDataURL={WORKSHOP_IMAGE.blur}
        />
      </div>

      {/* Text — bottom on mobile, right on desktop */}
      <div className="rk-provenance__copy">
        <p className="rk-eyebrow rk-provenance__eyebrow">Craft &amp; Provenance</p>

        <h2 className="rk-provenance__heading" id="rk-provenance-heading">
          Every piece is hand-finished by our karigars in Junagadh.
        </h2>

        <div className="rk-provenance__body">
          <p>Made in honest 925 silver.</p>
          <p>Hallmarked and weighed.</p>
        </div>
      </div>

    </section>
  )
}
