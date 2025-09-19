"use client"

import type React from "react"
import { createContext, useContext, useEffect, useState } from "react"
import type { CartItem } from "@/lib/types"
import { cartStorage } from "@/lib/local-storage"
import { useToast } from "@/hooks/use-toast"

interface LocalCartContextType {
  items: CartItem[]
  loading: boolean
  addItem: (product: any, sizeOrAge: string, color: string, quantity?: number) => void
  removeItem: (productId: string, size: string, color: string) => void
  updateQuantity: (productId: string, size: string, color: string, quantity: number) => void
  clearCartItems: () => void
  clearCart: () => void // Alias for clearCartItems for compatibility
  getTotalItems: () => number
  getTotalPrice: () => number
  refreshCart: () => void
}

const LocalCartContext = createContext<LocalCartContextType | undefined>(undefined)

export function LocalCartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([])
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()

  const refreshCart = () => {
    setLoading(true)
    try {
      // This will automatically clean up expired items
      const cartItems = cartStorage.get()
      setItems(cartItems)
    } catch (error) {
      console.error('Failed to fetch cart items:', error)
    } finally {
      setLoading(false)
    }
  }

  // Load cart from local storage on mount and set up periodic cleanup
  useEffect(() => {
    refreshCart()
    
    // Set up periodic cleanup every 5 minutes
    const cleanupInterval = setInterval(() => {
      cartStorage.cleanupExpired()
      refreshCart()
    }, 5 * 60 * 1000) // 5 minutes

    return () => clearInterval(cleanupInterval)
  }, [])

  const addItem = (product: any, sizeOrAge: string, color: string, quantity = 1) => {
    try {
      const newItem: Omit<CartItem, 'addedAt'> = {
        product: {
          id: product.id || '',
          name: product.name || '',
          description: product.description || '',
          price: product.price || 0,
          originalPrice: product.originalPrice || undefined,
          images: product.images || [],
          category: product.category || 'boys',
          season: product.season || 'summer',
          sizes: product.sizes || [],
          colors: product.colors || [],
          inStock: product.inStock !== false,
          featured: product.featured || false,
        },
        quantity,
        selectedSize: sizeOrAge,
        selectedColor: color,
        productId: product.id,
        variantId: product.variantId,
        sku: product.sku || product.id,
      }

      cartStorage.addItem(newItem)
      refreshCart()
      
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

  const removeItem = (productId: string, size: string, color: string) => {
    try {
      cartStorage.removeItem(productId, size, color)
      refreshCart()
      
      toast({
        title: "Item removed",
        description: "Item has been removed from your cart.",
      })
    } catch (error) {
      console.error('Failed to remove item from cart:', error)
      toast({
        title: "Error",
        description: "Failed to remove item from cart. Please try again.",
        variant: "destructive"
      })
    }
  }

  const updateQuantity = (productId: string, size: string, color: string, quantity: number) => {
    try {
      if (quantity <= 0) {
        removeItem(productId, size, color)
      } else {
        cartStorage.updateQuantity(productId, size, color, quantity)
        refreshCart()
      }
    } catch (error) {
      console.error('Failed to update item quantity:', error)
      toast({
        title: "Error",
        description: "Failed to update item quantity. Please try again.",
        variant: "destructive"
      })
    }
  }

  const clearCartItems = () => {
    try {
      cartStorage.clear()
      refreshCart()
    } catch (error) {
      console.error('Failed to clear cart:', error)
    }
  }

  const getTotalItems = () => {
    return items.reduce((total, item) => total + item.quantity, 0)
  }

  const getTotalPrice = () => {
    return items.reduce((total, item) => {
      return total + (item.product.price * item.quantity)
    }, 0)
  }

  return (
    <LocalCartContext.Provider
      value={{
        items,
        loading,
        addItem,
        removeItem,
        updateQuantity,
        clearCartItems,
        clearCart: clearCartItems, // Alias for compatibility
        getTotalItems,
        getTotalPrice,
        refreshCart,
      }}
    >
      {children}
    </LocalCartContext.Provider>
  )
}

export function useLocalCart() {
  const context = useContext(LocalCartContext)
  if (context === undefined) {
    throw new Error("useLocalCart must be used within a LocalCartProvider")
  }
  return context
}
