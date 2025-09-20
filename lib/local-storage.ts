import type { CartItem } from "./types"

const CART_KEY = "kids-store-cart"
const CART_EXPIRY_MINUTES = 15

export const cartStorage = {
  get: (): CartItem[] => {
    if (typeof window === "undefined") return []
    try {
      const cart = localStorage.getItem(CART_KEY)
      if (!cart) return []
      
      const items: CartItem[] = JSON.parse(cart)
      const now = Date.now()
      const expiryTime = CART_EXPIRY_MINUTES * 60 * 1000 // Convert to milliseconds
      
      // Filter out expired items
      const validItems = items.filter(item => {
        const itemAge = now - item.addedAt
        return itemAge < expiryTime
      })
      
      // If any items were expired, update the storage
      if (validItems.length !== items.length) {
        cartStorage.set(validItems)
      }
      
      return validItems
    } catch {
      return []
    }
  },

  set: (cart: CartItem[]): void => {
    if (typeof window === "undefined") return
    try {
      localStorage.setItem(CART_KEY, JSON.stringify(cart))
    } catch (error) {
      console.error("Failed to save cart:", error)
    }
  },

  addItem: (item: Omit<CartItem, 'addedAt'>): void => {
    if (typeof window === "undefined") return
    try {
      const currentCart = cartStorage.get()
      const newItem: CartItem = {
        ...item,
        addedAt: Date.now()
      }
      
      // Check if item already exists (same product, size, color)
      const existingIndex = currentCart.findIndex(cartItem => 
        cartItem.productId === item.productId &&
        cartItem.selectedSize === item.selectedSize &&
        cartItem.selectedColor === item.selectedColor
      )
      
      if (existingIndex >= 0) {
        // Update quantity and reset timestamp
        currentCart[existingIndex] = newItem
      } else {
        // Add new item
        currentCart.push(newItem)
      }
      
      cartStorage.set(currentCart)
    } catch (error) {
      console.error("Failed to add item to cart:", error)
    }
  },

  removeItem: (productId: string, selectedSize: string, selectedColor: string): void => {
    if (typeof window === "undefined") return
    try {
      const currentCart = cartStorage.get()
      const filteredCart = currentCart.filter(item => 
        !(item.productId === productId && 
          item.selectedSize === selectedSize && 
          item.selectedColor === selectedColor)
      )
      cartStorage.set(filteredCart)
    } catch (error) {
      console.error("Failed to remove item from cart:", error)
    }
  },

  updateQuantity: (productId: string, selectedSize: string, selectedColor: string, quantity: number): void => {
    if (typeof window === "undefined") return
    try {
      const currentCart = cartStorage.get()
      const updatedCart = currentCart.map(item => {
        if (item.productId === productId && 
            item.selectedSize === selectedSize && 
            item.selectedColor === selectedColor) {
          return {
            ...item,
            quantity: Math.max(1, quantity),
            addedAt: Date.now() // Reset timestamp when quantity is updated
          }
        }
        return item
      })
      cartStorage.set(updatedCart)
    } catch (error) {
      console.error("Failed to update item quantity:", error)
    }
  },

  clear: (): void => {
    if (typeof window === "undefined") return
    localStorage.removeItem(CART_KEY)
  },

  // Check if cart has expired items and clean them up
  cleanupExpired: (): void => {
    cartStorage.get() // This will automatically clean up expired items
  }
}

