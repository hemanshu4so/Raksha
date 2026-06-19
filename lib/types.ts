export interface Product {
  handle: string
  title: string
  price: number
  priceFormatted: string
  description: string
  shortDesc: string
  weight: string
  images: string[]
  metaTitle: string
  metaDescription: string
}

export interface Review {
  author: string
  location: string
  quote: string
  rating: number
  date: string
  portrait?: string
}

export interface BuilderState {
  step: number
  design: { id: string; name: string }
  thread: { name: string; color: string }
  font: { name: string; family: string }
  name: string
  message: string
  packaging: { name: string; price: number }
}

export interface CartItem {
  id: string
  title: string
  price: number
  quantity: number
  properties?: Record<string, string>
}

export interface FaqItem {
  question: string
  answer: string
}
