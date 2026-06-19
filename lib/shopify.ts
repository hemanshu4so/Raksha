/**
 * Shopify Storefront API — v2024-04
 * Only public Storefront API is used here. No Admin API.
 *
 * Required env vars:
 *   NEXT_PUBLIC_SHOPIFY_DOMAIN              e.g. your-store.myshopify.com
 *   NEXT_PUBLIC_SHOPIFY_STOREFRONT_TOKEN    public storefront access token
 *   NEXT_PUBLIC_SHOPIFY_BUILDER_VARIANT_ID  variant GID for the custom builder product
 */

import { SHOPIFY_DOMAIN, SHOPIFY_STOREFRONT_TOKEN } from './config'
import { PRODUCTS, getProduct } from './mockData'
import type { Product } from './types'
import type { BuilderState } from './types'

// ─── Types ───────────────────────────────────────────────────────────────────

export interface ShopifyProduct {
  id: string
  handle: string
  title: string
  description: string
  descriptionHtml: string
  priceRange: { minVariantPrice: { amount: string; currencyCode: string } }
  variants: { edges: Array<{ node: ShopifyVariant }> }
  images: { edges: Array<{ node: { url: string; altText: string | null } }> }
  metafields: Array<{ key: string; value: string } | null>
}

export interface ShopifyVariant {
  id: string
  title: string
  price: { amount: string; currencyCode: string }
  availableForSale: boolean
  selectedOptions: Array<{ name: string; value: string }>
}

export interface ShopifyCollection {
  id: string
  handle: string
  title: string
  products: { edges: Array<{ node: ShopifyProduct }> }
}

export interface ShopifyCart {
  id: string
  checkoutUrl: string
  lines: {
    edges: Array<{
      node: {
        id: string
        quantity: number
        merchandise: ShopifyVariant & { product: { title: string } }
        attributes: Array<{ key: string; value: string }>
        cost: { totalAmount: { amount: string; currencyCode: string } }
      }
    }>
  }
  cost: {
    subtotalAmount: { amount: string; currencyCode: string }
    totalAmount: { amount: string; currencyCode: string }
  }
}

interface LineItemInput {
  merchandiseId: string
  quantity: number
  attributes?: Array<{ key: string; value: string }>
}

// ─── Client ──────────────────────────────────────────────────────────────────

const isConfigured = Boolean(SHOPIFY_DOMAIN && SHOPIFY_STOREFRONT_TOKEN)
const ENDPOINT = `https://${SHOPIFY_DOMAIN}/api/2024-04/graphql.json`

async function storefrontFetch<T = unknown>(
  query: string,
  variables?: Record<string, unknown>,
): Promise<T> {
  if (!isConfigured) {
    throw new Error(
      'Shopify credentials not set. Define NEXT_PUBLIC_SHOPIFY_DOMAIN and NEXT_PUBLIC_SHOPIFY_STOREFRONT_TOKEN.',
    )
  }

  const res = await fetch(ENDPOINT, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Shopify-Storefront-Access-Token': SHOPIFY_STOREFRONT_TOKEN,
    },
    body: JSON.stringify({ query, variables }),
  })

  if (!res.ok) {
    throw new Error(`Shopify Storefront API HTTP ${res.status}`)
  }

  const json = await res.json()

  if (json.errors?.length) {
    throw new Error(json.errors.map((e: { message: string }) => e.message).join('; '))
  }

  return json.data as T
}

// ─── Fragments ───────────────────────────────────────────────────────────────

const VARIANT_FRAGMENT = `
  fragment VariantFields on ProductVariant {
    id
    title
    availableForSale
    price { amount currencyCode }
    selectedOptions { name value }
  }
`

const PRODUCT_FRAGMENT = `
  ${VARIANT_FRAGMENT}
  fragment ProductFields on Product {
    id
    handle
    title
    description
    descriptionHtml
    priceRange { minVariantPrice { amount currencyCode } }
    variants(first: 10) { edges { node { ...VariantFields } } }
    images(first: 5) { edges { node { url altText } } }
    metafields(identifiers: [
      { namespace: "raksha", key: "card_meta" }
      { namespace: "raksha", key: "card_desc" }
    ]) { key value }
  }
`

const CART_FRAGMENT = `
  fragment CartFields on Cart {
    id
    checkoutUrl
    lines(first: 50) {
      edges {
        node {
          id
          quantity
          attributes { key value }
          merchandise {
            ... on ProductVariant {
              id title
              price { amount currencyCode }
              product { title }
            }
          }
          cost { totalAmount { amount currencyCode } }
        }
      }
    }
    cost {
      subtotalAmount { amount currencyCode }
      totalAmount { amount currencyCode }
    }
  }
`

// ─── Queries ─────────────────────────────────────────────────────────────────

const GET_PRODUCTS_QUERY = `
  ${PRODUCT_FRAGMENT}
  query GetProducts($first: Int!) {
    products(first: $first) {
      edges { node { ...ProductFields } }
    }
  }
`

const GET_PRODUCT_BY_HANDLE_QUERY = `
  ${PRODUCT_FRAGMENT}
  query GetProductByHandle($handle: String!) {
    product(handle: $handle) { ...ProductFields }
  }
`

const GET_COLLECTIONS_QUERY = `
  ${PRODUCT_FRAGMENT}
  query GetCollections($first: Int!) {
    collections(first: $first) {
      edges {
        node {
          id handle title
          products(first: 20) { edges { node { ...ProductFields } } }
        }
      }
    }
  }
`

// ─── Mutations ───────────────────────────────────────────────────────────────

const CART_CREATE_MUTATION = `
  ${CART_FRAGMENT}
  mutation CartCreate($input: CartInput!) {
    cartCreate(input: $input) {
      cart { ...CartFields }
      userErrors { field message }
    }
  }
`

const CART_LINES_ADD_MUTATION = `
  ${CART_FRAGMENT}
  mutation CartLinesAdd($cartId: ID!, $lines: [CartLineInput!]!) {
    cartLinesAdd(cartId: $cartId, lines: $lines) {
      cart { ...CartFields }
      userErrors { field message }
    }
  }
`

const CART_LINES_REMOVE_MUTATION = `
  ${CART_FRAGMENT}
  mutation CartLinesRemove($cartId: ID!, $lineIds: [ID!]!) {
    cartLinesRemove(cartId: $cartId, lineIds: $lineIds) {
      cart { ...CartFields }
      userErrors { field message }
    }
  }
`

const GET_CART_QUERY = `
  ${CART_FRAGMENT}
  query GetCart($cartId: ID!) {
    cart(id: $cartId) { ...CartFields }
  }
`

// ─── Product helpers ─────────────────────────────────────────────────────────

function shopifyProductToLocal(p: ShopifyProduct): Product {
  const price = Math.round(parseFloat(p.priceRange.minVariantPrice.amount))
  return {
    handle: p.handle,
    title: p.title,
    price,
    priceFormatted: `₹${price.toLocaleString('en-IN')}`,
    description: p.descriptionHtml || p.description,
    shortDesc: p.description.slice(0, 60),
    weight: p.metafields?.find((m) => m?.key === 'weight')?.value ?? '',
    images: p.images.edges.map((e) => e.node.url),
    metaTitle: `${p.title} | Raksha by Silver Ocean`,
    metaDescription: p.description.slice(0, 160),
  }
}

// ─── Public API ──────────────────────────────────────────────────────────────

/** Fetch all products from Shopify. Falls back to mock data when unconfigured. */
export async function getProducts(first = 20): Promise<Product[]> {
  if (!isConfigured) return PRODUCTS

  const data = await storefrontFetch<{
    products: { edges: Array<{ node: ShopifyProduct }> }
  }>(GET_PRODUCTS_QUERY, { first })

  return data.products.edges.map((e) => shopifyProductToLocal(e.node))
}

/** Fetch a single product by handle. Falls back to mock data when unconfigured. */
export async function getProductByHandle(handle: string): Promise<Product | undefined> {
  if (!isConfigured) return getProduct(handle)

  const data = await storefrontFetch<{ product: ShopifyProduct | null }>(
    GET_PRODUCT_BY_HANDLE_QUERY,
    { handle },
  )

  return data.product ? shopifyProductToLocal(data.product) : undefined
}

/** Fetch all collections with their products. */
export async function getCollections(first = 10): Promise<ShopifyCollection[]> {
  if (!isConfigured) return []

  const data = await storefrontFetch<{
    collections: { edges: Array<{ node: ShopifyCollection }> }
  }>(GET_COLLECTIONS_QUERY, { first })

  return data.collections.edges.map((e) => e.node)
}

/** Create a new Shopify cart, optionally pre-populated with line items. */
export async function createCart(lines: LineItemInput[] = []): Promise<ShopifyCart> {
  const data = await storefrontFetch<{
    cartCreate: { cart: ShopifyCart; userErrors: Array<{ field: string; message: string }> }
  }>(CART_CREATE_MUTATION, { input: { lines } })

  if (data.cartCreate.userErrors.length) {
    throw new Error(data.cartCreate.userErrors.map((e) => e.message).join('; '))
  }

  return data.cartCreate.cart
}

/** Add a line item to an existing Shopify cart. */
export async function addLineItem(
  cartId: string,
  line: LineItemInput,
): Promise<ShopifyCart> {
  const data = await storefrontFetch<{
    cartLinesAdd: { cart: ShopifyCart; userErrors: Array<{ field: string; message: string }> }
  }>(CART_LINES_ADD_MUTATION, { cartId, lines: [line] })

  if (data.cartLinesAdd.userErrors.length) {
    throw new Error(data.cartLinesAdd.userErrors.map((e) => e.message).join('; '))
  }

  return data.cartLinesAdd.cart
}

/** Remove a line from an existing cart by line ID. */
export async function removeLineItem(
  cartId: string,
  lineId: string,
): Promise<ShopifyCart> {
  const data = await storefrontFetch<{
    cartLinesRemove: { cart: ShopifyCart; userErrors: Array<{ field: string; message: string }> }
  }>(CART_LINES_REMOVE_MUTATION, { cartId, lineIds: [lineId] })

  if (data.cartLinesRemove.userErrors.length) {
    throw new Error(data.cartLinesRemove.userErrors.map((e) => e.message).join('; '))
  }

  return data.cartLinesRemove.cart
}

/** Fetch an existing cart by ID. */
export async function getCart(cartId: string): Promise<ShopifyCart | null> {
  const data = await storefrontFetch<{ cart: ShopifyCart | null }>(GET_CART_QUERY, { cartId })
  return data.cart
}

/** Extract the checkout URL from a cart. */
export function getCheckoutUrl(cart: ShopifyCart): string {
  return cart.checkoutUrl
}

// ─── Builder checkout flow ────────────────────────────────────────────────────

/**
 * Create a Shopify cart with the builder product + all custom attributes,
 * then return the checkout URL to redirect the user.
 *
 * Requires NEXT_PUBLIC_SHOPIFY_BUILDER_VARIANT_ID to be set.
 */
export async function checkoutBuilder(
  state: BuilderState,
  variantId: string,
): Promise<string> {
  const attributes: Array<{ key: string; value: string }> = [
    { key: 'Design',    value: state.design.name },
    { key: 'Thread',    value: state.thread.name },
    { key: 'Font',      value: state.font.name },
    { key: 'Name',      value: state.name },
    { key: 'Packaging', value: state.packaging.name },
  ]
  if (state.message.trim()) {
    attributes.push({ key: 'Gift Message', value: state.message.trim() })
  }

  const cart = await createCart([
    { merchandiseId: variantId, quantity: 1, attributes },
  ])

  return getCheckoutUrl(cart)
}

/**
 * Create a Shopify cart for a ready-collection product and return the checkout URL.
 */
export async function checkoutReady(variantId: string): Promise<string> {
  const cart = await createCart([{ merchandiseId: variantId, quantity: 1 }])
  return getCheckoutUrl(cart)
}
