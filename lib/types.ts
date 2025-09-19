export interface Product {
  id: string
  name: string
  description: string
  price: number
  originalPrice?: number
  images: string[]
  category: "boys" | "girls"
  season: "summer" | "winter"
  sizes: string[]
  colors: string[]
  inStock: boolean
  featured?: boolean
  product_code?: string
}

export interface CartItem {
  product: Product
  quantity: number
  selectedSize: string
  selectedColor: string
  productId?: string
  variantId?: string
  sku?: string
  productCode?: string // The actual product code (6-digit)
  variantCode?: string // The actual variant code (3-digit)
  addedAt: number // Timestamp when item was added to cart
}

export interface Order {
  id: string
  items: CartItem[]
  total: number
  customerInfo: {
    name: string
    phone: string
    address: string
  }
  status: "pending" | "confirmed" | "shipped" | "delivered"
  createdAt: Date
}

export interface Category {
  id: string
  name: string
  slug: "boys" | "girls"
  color: string
  description: string
}
