"use client"

import type React from "react"
import { createContext, useContext, useEffect, useState } from "react"
import { useToast } from "@/hooks/use-toast"

export interface WishlistItem {
  id: string
  productId: string
  productName: string
  productImages: string[]
  productPrice: number
  selectedSize?: string
  selectedAge?: string
  selectedColor?: string
  quantity: number
  addedAt: Date
  product: any // Store the complete product object for cart operations
}

interface WishlistContextType {
  items: WishlistItem[]
  addItem: (product: any, sizeOrAge?: string, color?: string, quantity?: number) => void
  removeItem: (productId: string, sizeOrAge?: string, color?: string) => void
  isInWishlist: (productId: string, sizeOrAge?: string, color?: string) => boolean
  updateQuantity: (productId: string, sizeOrAge?: string, color?: string, quantity: number) => void
  clearWishlist: () => void
  getTotalItems: () => number
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined)

export function WishlistProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<WishlistItem[]>([])
  const { toast } = useToast()

  // Load wishlist from localStorage on mount
  useEffect(() => {
    const savedWishlist = localStorage.getItem('wishlist')
    if (savedWishlist) {
      try {
        const parsedItems = JSON.parse(savedWishlist).map((item: any) => ({
          ...item,
          addedAt: new Date(item.addedAt)
        }))
        setItems(parsedItems)
      } catch (error) {
        console.error('Failed to parse wishlist from localStorage:', error)
      }
    }
  }, [])

  // Save wishlist to localStorage whenever items change
  useEffect(() => {
    localStorage.setItem('wishlist', JSON.stringify(items))
  }, [items])

  const generateItemId = (productId: string, sizeOrAge?: string, color?: string): string => {
    return `${productId}-${sizeOrAge || 'default'}-${color || 'default'}`
  }

  const addItem = (product: any, sizeOrAge?: string, color?: string, quantity = 1) => {
    const itemId = generateItemId(product.id, sizeOrAge, color)
    
    // Check if item already exists
    const existingItem = items.find(item => item.id === itemId)
    
    if (existingItem) {
      // If item exists, remove it (toggle behavior)
      removeItem(product.id, sizeOrAge, color)
      toast({
        title: "Removed from wishlist",
        description: `${product.name} has been removed from your wishlist.`,
      })
    } else {
      // Add new item
      const newItem: WishlistItem = {
        id: itemId,
        productId: product.id,
        productName: product.name,
        productImages: product.images || [],
        productPrice: product.price,
        selectedSize: sizeOrAge,
        selectedAge: sizeOrAge,
        selectedColor: color,
        quantity,
        addedAt: new Date(),
        product: product, // Store the complete product object
      }
      
      setItems(prev => [...prev, newItem])
      toast({
        title: "Added to wishlist",
        description: `${product.name} has been added to your wishlist.`,
      })
    }
  }

  const removeItem = (productId: string, sizeOrAge?: string, color?: string) => {
    const itemId = generateItemId(productId, sizeOrAge, color)
    setItems(prev => prev.filter(item => item.id !== itemId))
  }

  const isInWishlist = (productId: string, sizeOrAge?: string, color?: string): boolean => {
    const itemId = generateItemId(productId, sizeOrAge, color)
    return items.some(item => item.id === itemId)
  }

  const updateQuantity = (productId: string, sizeOrAge?: string, color?: string, quantity: number) => {
    const itemId = generateItemId(productId, sizeOrAge, color)
    setItems(prev => 
      prev.map(item => 
        item.id === itemId 
          ? { ...item, quantity: Math.max(1, quantity) }
          : item
      )
    )
  }

  const clearWishlist = () => {
    setItems([])
    toast({
      title: "Wishlist cleared",
      description: "All items have been removed from your wishlist.",
    })
  }

  const getTotalItems = (): number => {
    return items.length
  }

  return (
    <WishlistContext.Provider
      value={{
        items,
        addItem,
        removeItem,
        isInWishlist,
        updateQuantity,
        clearWishlist,
        getTotalItems,
      }}
    >
      {children}
    </WishlistContext.Provider>
  )
}

export function useWishlist() {
  const context = useContext(WishlistContext)
  if (context === undefined) {
    throw new Error("useWishlist must be used within a WishlistProvider")
  }
  return context
}
