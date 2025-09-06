// Cache utility functions for Next.js App Router

export function getCacheBustingParams() {
  return {
    _cacheBust: Date.now(),
    _t: Math.random().toString(36).substring(7)
  }
}

export function getCacheHeaders() {
  return {
    'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
    'Pragma': 'no-cache',
    'Expires': '0',
    'Surrogate-Control': 'no-store'
  }
}

// Revalidation tags for Next.js
export const REVALIDATION_TAGS = {
  PRODUCTS: 'products',
  ORDERS: 'orders',
  CUSTOMERS: 'customers',
  CATEGORIES: 'categories'
} as const

export function getRevalidationTag(tag: keyof typeof REVALIDATION_TAGS) {
  return REVALIDATION_TAGS[tag]
}
