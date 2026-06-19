import type { Product, Review, FaqItem } from './types'
import { readyCollection } from './images'

function img(handle: string): string[] {
  const found = readyCollection.find((i) => i.handle === handle)
  return found ? [found.src] : []
}

export const PRODUCTS: Product[] = [
  {
    handle: 'forever-knot',
    title: 'Forever Knot',
    price: 1799,
    priceFormatted: '₹1,799',
    description:
      'Our signature knot design, hand-engraved in certified 925 silver. A timeless symbol of the bond between siblings, made to be worn every day.',
    shortDesc: 'A bond that does not tarnish.',
    weight: '5.4 g',
    images: img('forever-knot'),
    metaTitle: 'Forever Knot Silver Rakhi — Personalised 925 Silver Rakhi | Raksha',
    metaDescription:
      'The Forever Knot — our signature personalised silver rakhi. 5.4g of certified 925 silver, hand-engraved with his name. Free gift box. Order by 22 August.',
  },
  {
    handle: 'evil-eye',
    title: 'Evil Eye',
    price: 1699,
    priceFormatted: '₹1,699',
    description:
      'A protective charm cast in 925 silver. The evil eye rakhi shields your brother with every glance — a meaningful Rakshabandhan gift he will treasure.',
    shortDesc: 'Protection in silver.',
    weight: '5.1 g',
    images: img('evil-eye'),
    metaTitle: 'Evil Eye Silver Rakhi — Custom Engraved 925 Silver | Raksha',
    metaDescription:
      'Evil Eye rakhi in certified 925 silver. Personalised with his name. 5.1g, gift-boxed, delivered before Rakshabandhan. Order now.',
  },
  {
    handle: 'krishna',
    title: 'Krishna',
    price: 1899,
    priceFormatted: '₹1,899',
    description:
      'An engraved Krishna motif in certified 925 silver, combining devotion with artistry. A luxury rakshabandhan gift that carries blessings in every detail.',
    shortDesc: 'A blessing he keeps.',
    weight: '4.8 g',
    images: img('krishna'),
    metaTitle: 'Krishna Silver Rakhi — Engraved 925 Silver Rakshabandhan Gift | Raksha',
    metaDescription:
      'Krishna motif rakhi in certified 925 silver. 4.8g, personalised with his name, delivered in a Raksha Signature Box. Order by 22 August.',
  },
  {
    handle: 'initial',
    title: 'Initial',
    price: 1499,
    priceFormatted: '₹1,499',
    description:
      'His first initial, hand-crafted in 925 silver. Clean, modern and deeply personal — the perfect silver rakhi for a brother who appreciates understated luxury.',
    shortDesc: 'Made only for him.',
    weight: '4.5 g',
    images: img('initial'),
    metaTitle: 'Initial Silver Rakhi — Custom 925 Silver Rakhi with Name | Raksha',
    metaDescription:
      'Initial rakhi in certified 925 silver. Personalised with his initial and name. Gift-boxed and ready for Rakshabandhan. ₹1,499.',
  },
]

export const REVIEWS: Review[] = [
  {
    author: 'Meera S.',
    location: 'Pune',
    quote: 'He still wears it every day.',
    rating: 5,
    date: '2025-08-10',
    portrait: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=200&h=200&fit=crop&auto=format&q=80',
  },
  {
    author: 'Anjali R.',
    location: 'Mumbai',
    quote: 'He said it was the first gift he would actually keep.',
    rating: 5,
    date: '2025-08-09',
    portrait: 'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=200&h=200&fit=crop&auto=format&q=80',
  },
  {
    author: 'Priya K.',
    location: 'London → Ahmedabad',
    quote: 'I made it from London. He received it in Ahmedabad.',
    rating: 5,
    date: '2025-08-08',
    portrait: 'https://images.unsplash.com/photo-1488716820095-cbe80883c496?w=200&h=200&fit=crop&auto=format&q=80',
  },
]

export const FAQ_ITEMS: FaqItem[] = [
  {
    question: 'Is this real silver?',
    answer:
      'Every rakhi is made in certified 925 silver jewellery, weighed and hallmarked before it ships to you.',
  },
  {
    question: 'Will it arrive before Rakshabandhan?',
    answer:
      'Order by 22 August for guaranteed delivery before Rakshabandhan. Express shipping available at checkout.',
  },
  {
    question: 'Can I personalise the name?',
    answer:
      'Yes — every rakhi can be engraved with his name (up to 12 characters, letters and spaces only).',
  },
  {
    question: 'How do I care for it?',
    answer:
      'Store in the ivory box when not in use. Clean gently with a soft dry cloth. Avoid moisture and perfume.',
  },
  {
    question: 'What is the return policy?',
    answer:
      'Because each rakhi is personalised, we do not accept returns. If there is a manufacturing defect, we will replace it — contact us within 7 days of delivery.',
  },
]

export const HOW_STEPS = [
  { icon: 'diamond', label: 'Choose Design' },
  { icon: 'thread', label: 'Choose Thread' },
  { icon: 'typography', label: 'Choose Font' },
  { icon: 'signature', label: 'Add Name' },
  { icon: 'eye', label: 'Preview' },
  { icon: 'gift', label: 'Gift Ready' },
]

export const TRUST_ITEMS = [
  { icon: 'certificate', label: 'Certified Silver' },
  { icon: 'hand', label: 'Made by Hand' },
  { icon: 'gift', label: 'Gift Ready' },
]

export function getProduct(handle: string): Product | undefined {
  return PRODUCTS.find((p) => p.handle === handle)
}
