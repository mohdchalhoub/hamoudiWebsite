"use client"

import type React from "react"
import { createContext, useContext, useEffect, useState } from "react"
import type { CartItemWithProduct } from "@/lib/database.types"
import { getCartItems, addToCart, updateCartItemQuantity, removeFromCart, clearCart } from "@/lib/database"
import { useToast } from "@/hooks/use-toast"

interface CartContextType {
  items: CartItemWithProduct[]
  loading: boolean
  addItem: (product: any, sizeOrAge: string, color: string, quantity?: number) => Promise<void>
  removeItem: (productId: string, size: string, color: string) => Promise<void>
  updateQuantity: (productId: string, size: string, color: string, quantity: number) => Promise<void>
  clearCartItems: () => Promise<void>
  getTotalItems: () => number
  getTotalPrice: () => number
  refreshCart: () => Promise<void>
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItemWithProduct[]>([])
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()

  // Generate a session ID for guest users
  const getSessionId = () => {
    let sessionId = localStorage.getItem('cart-session-id')
    if (!sessionId) {
      sessionId = 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9)
      localStorage.setItem('cart-session-id', sessionId)
    }
    return sessionId
  }

  const refreshCart = async () => {
    setLoading(true)
    try {
      const sessionId = getSessionId()
      const cartItems = await getCartItems(undefined, sessionId)
      setItems(cartItems)
    } catch (error) {
      console.error('Failed to fetch cart items:', error)
    } finally {
      setLoading(false)
    }
  }

  // Load cart from database on mount
  useEffect(() => {
    refreshCart()
  }, [])

  const addItem = async (product: any, sizeOrAge: string, color: string, quantity = 1) => {
    try {
      const sessionId = getSessionId()
      
      // Find the variant that matches the selected size/age and color
      const variant = product.variants?.find((v: any) => {
        const sizeMatch = v.size === sizeOrAge
        const ageMatch = v.age_range === sizeOrAge
        const colorMatch = v.color === color
        return (sizeMatch || ageMatch) && colorMatch
      })
      
      if (!variant) {
        throw new Error('Selected variant not found')
      }

      await addToCart(product.id, variant.id, quantity, undefined, sessionId)
      await refreshCart()
      
      toast({
        title: "Added to cart",
        description: `${product.name} has been added to your cart.`,
      })
    } catch (error) {
      console.error('Failed to add item to cart:', error)
      toast({
        title: "Error",
        description: "Failed to add item to cart. Please try again.",
        variant: "destructive"
      })
    }
  }

  const removeItem = async (productId: string, size: string, color: string) => {
    try {
      const item = items.find(item => 
        item.product_id === productId && 
        item.variant?.size === size && 
        item.variant?.color === color
      )
      
      if (item) {
        await removeFromCart(item.id)
        await refreshCart()
      }
    } catch (error) {
      console.error('Failed to remove item from cart:', error)
    }
  }

  const updateQuantity = async (productId: string, size: string, color: string, quantity: number) => {
    try {
      const item = items.find(item => 
        item.product_id === productId && 
        item.variant?.size === size && 
        item.variant?.color === color
      )
      
      if (item) {
        if (quantity <= 0) {
          await removeItem(productId, size, color)
        } else {
          await updateCartItemQuantity(item.id, quantity)
          await refreshCart()
        }
      }
    } catch (error) {
      console.error('Failed to update item quantity:', error)
    }
  }

  const clearCartItems = async () => {
    try {
      const sessionId = getSessionId()
      await clearCart(undefined, sessionId)
      await refreshCart()
    } catch (error) {
      console.error('Failed to clear cart:', error)
    }
  }

  const getTotalItems = () => {
    return items.reduce((total, item) => total + item.quantity, 0)
  }

  const getTotalPrice = () => {
    return items.reduce((total, item) => {
      const price = (item.product?.price || 0) + (item.variant?.price_adjustment || 0)
      return total + (price * item.quantity)
    }, 0)
  }

  return (
    <CartContext.Provider
      value={{
        items,
        loading,
        addItem,
        removeItem,
        updateQuantity,
        clearCartItems,
        getTotalItems,
        getTotalPrice,
        refreshCart,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider")
  }
  return context
}
