"use client"

import type React from "react"

import Image from "next/image"
import Link from "next/link"
// Removed framer-motion imports to use CSS animations instead
import type { ProductWithDetails } from "@/lib/database.types"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ShoppingCart, Heart, Eye, Star } from "lucide-react"
import { useCart } from "@/contexts/cart-context"
import { useWishlist } from "@/contexts/wishlist-context"
import { useState } from "react"

interface ProductCardProps {
  product: ProductWithDetails
}

export function ProductCard({ product }: ProductCardProps) {
  const { addItem } = useCart()
  const { addItem: addToWishlist, isInWishlist } = useWishlist()
  
  // Get available sizes/ages and colors from variants
  const availableSizes = [...new Set(product.variants?.map(v => v.size).filter(Boolean) || [])]
  const availableAges = [...new Set(product.variants?.map(v => v.age_range).filter(Boolean) || [])]
  const availableColors = [...new Set(product.variants?.map(v => v.color) || [])]
  
  const [selectedSize, setSelectedSize] = useState(availableSizes[0] || '')
  const [selectedAge, setSelectedAge] = useState(availableAges[0] || '')
  const [selectedColor, setSelectedColor] = useState(availableColors[0] || '')
  const [isHovered, setIsHovered] = useState(false)
  
  // Check if product is in wishlist
  const sizeOrAge = selectedSize || selectedAge
  const isLiked = isInWishlist(product.id, sizeOrAge, selectedColor)

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation() // Prevent the Link from navigating
    const sizeOrAge = selectedSize || selectedAge
    if (sizeOrAge && selectedColor) {
      console.log('Adding to cart:', { 
        productId: product.id, 
        productName: product.name, 
        sizeOrAge, 
        color: selectedColor 
      })
      await addItem(product, sizeOrAge, selectedColor)
    } else {
      console.warn('Cannot add to cart: missing size/age or color', { 
        selectedSize, 
        selectedAge, 
        selectedColor 
      })
    }
  }

  const handleToggleWishlist = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation() // Prevent the Link from navigating
    const sizeOrAge = selectedSize || selectedAge
    addToWishlist(product, sizeOrAge, selectedColor)
  }

  const handleCardClick = (e: React.MouseEvent) => {
    // Only navigate if the click is not on a button or interactive element
    const target = e.target as HTMLElement
    if (target.closest('button') || target.closest('[data-product-card] button')) {
      e.preventDefault()
      e.stopPropagation()
      console.log('Button click detected, preventing navigation')
      return
    }
    console.log('Card click detected, allowing navigation to:', `/products/${product.id}`)
    // Allow the Link to handle navigation
  }

  const discountPercentage = product.compare_at_price > 0
    ? Math.round(((product.compare_at_price - product.price) / product.compare_at_price) * 100)
    : 0

  // Check if product is in stock - consider both product quantity and variant stock
  const isInStock = product.quantity > 0 || (product.variants?.length > 0 
    ? product.variants.some(v => v.stock_quantity > 0) 
    : false)

  return (
    <div className="h-full animate-fade-in-up hover:-translate-y-3 transition-transform duration-500">
      <Link href={`/products/${product.id}`}>
        <Card 
          data-product-card
          className="group cursor-pointer h-full border border-border overflow-hidden hover:border-primary transition-all duration-200 bg-background shadow-card rounded-card"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          onClick={handleCardClick}
        >
          <div className="relative aspect-[3/4] overflow-hidden bg-background-subtle">
            <div className="relative w-full h-full group-hover:scale-110 transition-transform duration-700">
              <Image
                src={product.images?.[0] || "/placeholder.svg"}
                alt={product.name}
                fill
                className="object-cover transition-all duration-700"
              />
            </div>
            
            {/* Product Labels - Top Left */}
            <div className="absolute top-2 left-2 sm:top-3 sm:left-3 flex flex-col gap-1.5 sm:gap-2 z-10">
              {product.is_featured && (
                <Badge className="bg-black text-white border-0 text-xs px-2 py-1 sm:px-3 sm:py-1.5 font-semibold rounded-md shadow-lg">
                  Featured
                </Badge>
              )}
              {discountPercentage > 0 && (
                <Badge className="bg-red-600 text-white border-0 text-xs px-2 py-1 sm:px-3 sm:py-1.5 font-semibold rounded-md shadow-lg">
                  -{discountPercentage}%
                </Badge>
              )}
            </div>

            {/* Stock Status Badge - Bottom Left */}
            {!isInStock && (
              <Badge className="absolute bottom-2 left-2 sm:bottom-3 sm:left-3 bg-red-600 text-white border-0 text-xs px-2 py-1 sm:px-3 sm:py-1.5 font-semibold rounded-md shadow-lg z-10">
                Out of Stock
              </Badge>
            )}

            {/* Action Icons - Top Right */}
            <div className="absolute top-2 right-2 sm:top-3 sm:right-3 flex flex-col gap-1.5 sm:gap-2 z-10">
              <Button
                size="icon"
                variant="ghost"
                className="h-8 w-8 sm:h-9 sm:w-9 bg-white/90 backdrop-blur-sm hover:bg-white hover:shadow-lg border-0 rounded-full transition-all duration-200"
                onClick={handleToggleWishlist}
              >
                <Heart className={`h-3.5 w-3.5 sm:h-4 sm:w-4 ${isLiked ? 'fill-red-500 text-red-500' : 'text-gray-600'}`} />
              </Button>
              
              <Button
                size="icon"
                variant="ghost"
                className="h-8 w-8 sm:h-9 sm:w-9 bg-white/90 backdrop-blur-sm hover:bg-white hover:shadow-lg border-0 rounded-full transition-all duration-200"
                onClick={(e) => {
                  e.preventDefault()
                  e.stopPropagation()
                }}
              >
                <Eye className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-gray-600" />
              </Button>
            </div>

            {/* Hover Overlay */}
            <div className={`absolute inset-0 bg-black/10 transition-opacity duration-300 ${isHovered ? 'opacity-100' : 'opacity-0'}`} />
          </div>
          
          <CardContent className="p-4">
            <div className="animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
              <h3 className="font-medium text-base mb-2 line-clamp-2 group-hover:text-primary transition-colors duration-200 text-text-primary">
                {product.name}
              </h3>
            </div>
            
            {/* Season Badge */}
            {product.season && (
              <div className="mb-2">
                <Badge className="bg-background text-text-muted border border-border px-2 py-1 text-xs font-medium rounded-none">
                  {product.season === 'summer' ? 'Summer' : product.season === 'winter' ? 'Winter' : 'All Season'}
                </Badge>
              </div>
            )}
            
            <div className="flex items-center justify-between mb-3 animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
              <div className="flex items-center gap-2">
                <span className="font-medium text-base text-text-primary">${Number(product.price).toFixed(2)}</span>
                {product.compare_at_price > 0 && (
                  <span className="text-sm text-text-muted line-through">${Number(product.compare_at_price).toFixed(2)}</span>
                )}
              </div>
              <div className="flex gap-1.5">
                {availableColors.slice(0, 3).map((color, index) => {
                  const variant = product.variants?.find(v => v.color === color)
                  return (
                    <div
                      key={index}
                      className="w-5 h-5 rounded-full border-2 border-gray-200 shadow-sm hover:scale-110 transition-transform duration-200 animate-scale-in"
                      style={{ 
                        backgroundColor: variant?.color_hex || '#gray',
                        animationDelay: `${index * 0.1}s`
                      }}
                    />
                  )
                })}
                {availableColors.length > 3 && (
                  <span className="text-xs text-gray-500 ml-1 font-medium">+{availableColors.length - 3}</span>
                )}
              </div>
            </div>
            
            <div className="animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
              <Button
                size="sm"
                className={`w-full text-sm h-9 transition-all duration-200 ${
                  isInStock 
                    ? 'bg-primary hover:bg-primary-hover text-white border-0' 
                    : 'bg-background-subtle text-text-muted cursor-not-allowed border border-border'
                }`}
                onClick={handleAddToCart}
                disabled={!isInStock}
              >
                <ShoppingCart className="h-3 w-3 mr-2" />
                {isInStock ? "Add to Cart" : "Out of Stock"}
              </Button>
            </div>
          </CardContent>
        </Card>
      </Link>
    </div>
  )
}
