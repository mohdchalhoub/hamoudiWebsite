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
}

export interface CartItem {
  product: Product
  quantity: number
  selectedSize: string
  selectedColor: string
}

export interface Order {
  id: string
  items: CartItem[]
  total: number
  customerInfo: {
    name: string
    email: string
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
