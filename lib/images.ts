const U = 'https://images.unsplash.com'

export interface ProductImage {
  src: string
  alt: string
  /** blurDataURL — tiny base64 placeholder shown while loading */
  blur: string
}

const BLUR =
  'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAgGBgcGBQgHBwcJCQgKDBQNDAsLDBkSEw8UHRofHh0aHBwgJC4nICIsIxwcKDcpLDAxNDQ0Hyc5PTgyPC4zNDL/2wBDAQkJCQwLDBgNDRgyIRwhMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjL/wAARCAAIAAoDASIAAhEBAxEB/8QAFgABAQEAAAAAAAAAAAAAAAAABgUE/8QAIxAAAQQCAgMBAAAAAAAAAAAAAQIDBBEhBRIxUf/EABUBAQEAAAAAAAAAAAAAAAAAAAIB/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECAxESIf/aAAwDAQACEQMRAD8Aqcvkr9Cx9hFdmjZlkADWNcQMknrHn6VtPw5jrNe5FLM58bHOaGS+wgj3H8qIipOhXKJSt//Z'

export const readyCollection: (ProductImage & { handle: string; priority?: boolean })[] = [
  {
    handle: 'forever-knot',
    src: `${U}/photo-1611591437281-460bfbe1220a?w=900&h=1125&fit=crop&auto=format&q=80`,
    alt: 'Forever Knot — personalised 925 silver rakhi',
    blur: BLUR,
    priority: true,
  },
  {
    handle: 'evil-eye',
    src: `${U}/photo-1602173574767-37ac01994b2a?w=900&h=1125&fit=crop&auto=format&q=80`,
    alt: 'Evil Eye — protective charm silver rakhi',
    blur: BLUR,
    priority: true,
  },
  {
    handle: 'krishna',
    src: `${U}/photo-1583267746897-2cf415887172?w=900&h=1125&fit=crop&auto=format&q=80`,
    alt: 'Krishna motif — engraved 925 silver rakhi',
    blur: BLUR,
  },
  {
    handle: 'initial',
    src: `${U}/photo-1515562141207-7a88fb7ce338?w=900&h=1125&fit=crop&auto=format&q=80`,
    alt: 'Initial — custom letter 925 silver rakhi',
    blur: BLUR,
  },
]

export const packagingImage: ProductImage = {
  src: `${U}/photo-1549465220-1a8b9238cd48?w=800&h=800&fit=crop&auto=format&q=80`,
  alt: 'Raksha Signature Box — gift packaging for silver rakhi',
  blur: BLUR,
}

export const arrivalSequence: (ProductImage & { label: string })[] = [
  {
    label: 'Outer sleeve',
    src: `${U}/photo-1549465220-1a8b9238cd48?w=700&h=1050&fit=crop&auto=format&q=80`,
    alt: 'Ivory outer sleeve — the first thing he sees',
    blur: BLUR,
  },
  {
    label: 'Magnetic box',
    src: `${U}/photo-1607344645866-009c320b63e0?w=700&h=1050&fit=crop&auto=format&q=80`,
    alt: 'Magnetic gift box opening to reveal the rakhi inside',
    blur: BLUR,
  },
  {
    label: 'Silver tray',
    src: `${U}/photo-1599643478518-a784e5dc4c8f?w=700&h=1050&fit=crop&auto=format&q=80`,
    alt: 'Silver rakhi resting on a cloth-lined tray',
    blur: BLUR,
  },
  {
    label: 'Hidden card',
    src: `${U}/photo-1455390582262-044cdead277a?w=700&h=1050&fit=crop&auto=format&q=80`,
    alt: 'Handwritten message card tucked beneath the tray',
    blur: BLUR,
  },
]

export const heroImage: ProductImage = {
  src: `${U}/photo-1588775291046-ff13d3a8e3e8?w=1400&h=1800&fit=crop&auto=format&q=85`,
  alt: 'Personalised 925 silver rakhi resting on cloth — silver catching morning light, name visible on the disc',
  blur: BLUR,
}

/** Lookup helper */
export function getProductImage(handle: string): (ProductImage & { priority?: boolean }) | undefined {
  return readyCollection.find((img) => img.handle === handle)
}
