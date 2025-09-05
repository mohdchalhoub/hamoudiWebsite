import type { CartItem, Order } from "./types"

const CART_KEY = "kids-store-cart"
const ORDERS_KEY = "kids-store-orders"

export const cartStorage = {
  get: (): CartItem[] => {
    if (typeof window === "undefined") return []
    try {
      const cart = localStorage.getItem(CART_KEY)
      return cart ? JSON.parse(cart) : []
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

  clear: (): void => {
    if (typeof window === "undefined") return
    localStorage.removeItem(CART_KEY)
  },
}

export const orderStorage = {
  get: (): Order[] => {
    if (typeof window === "undefined") return []
    try {
      const orders = localStorage.getItem(ORDERS_KEY)
      return orders ? JSON.parse(orders) : []
    } catch {
      return []
    }
  },

  add: (order: Order): void => {
    if (typeof window === "undefined") return
    try {
      const orders = orderStorage.get()
      orders.push(order)
      localStorage.setItem(ORDERS_KEY, JSON.stringify(orders))
    } catch (error) {
      console.error("Failed to save order:", error)
    }
  },

  clear: (): void => {
    if (typeof window === "undefined") return
    localStorage.removeItem(ORDERS_KEY)
  },
}
