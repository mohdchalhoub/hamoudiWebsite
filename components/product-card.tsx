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
import { useState } from "react"

interface ProductCardProps {
  product: ProductWithDetails
}

export function ProductCard({ product }: ProductCardProps) {
  const { addItem } = useCart()
  
  // Get available sizes/ages and colors from variants
  const availableSizes = [...new Set(product.variants?.map(v => v.size).filter(Boolean) || [])]
  const availableAges = [...new Set(product.variants?.map(v => v.age_range).filter(Boolean) || [])]
  const availableColors = [...new Set(product.variants?.map(v => v.color) || [])]
  
  const [selectedSize, setSelectedSize] = useState(availableSizes[0] || '')
  const [selectedAge, setSelectedAge] = useState(availableAges[0] || '')
  const [selectedColor, setSelectedColor] = useState(availableColors[0] || '')
  const [isHovered, setIsHovered] = useState(false)
  const [isLiked, setIsLiked] = useState(false)

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault()
    const sizeOrAge = selectedSize || selectedAge
    if (sizeOrAge && selectedColor) {
      await addItem(product, sizeOrAge, selectedColor)
    }
  }

  const discountPercentage = product.compare_at_price
    ? Math.round(((product.compare_at_price - product.price) / product.compare_at_price) * 100)
    : 0

  // Check if product is in stock
  const isInStock = product.variants?.some(v => v.stock_quantity > 0) || false

  return (
    <div className="h-full animate-fade-in-up hover:-translate-y-3 transition-transform duration-500">
      <Link href={`/products/${product.id}`}>
        <Card 
          className="group premium-card cursor-pointer h-full border-0 overflow-hidden"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          <div className="relative aspect-[3/4] overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100">
            <div className="relative w-full h-full group-hover:scale-110 transition-transform duration-700">
              <Image
                src={product.image_url || "/placeholder.svg"}
                alt={product.name}
                fill
                className="object-cover transition-all duration-700"
              />
            </div>
            
            {/* Badges */}
            {product.is_featured && (
              <Badge className="absolute top-4 left-4 bg-gradient-to-r from-yellow-400 to-orange-500 text-white text-xs px-3 py-1.5 shadow-lg animate-scale-in rounded-full font-semibold" style={{ animationDelay: '0.2s' }}>
                ⭐ Featured
              </Badge>
            )}
            {discountPercentage > 0 && (
              <Badge className="absolute top-4 right-4 bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs px-3 py-1.5 shadow-lg animate-scale-in rounded-full font-semibold" style={{ animationDelay: '0.3s' }}>
                -{discountPercentage}%
              </Badge>
            )}

            {/* Overlay with actions */}
            <div className={`absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent transition-opacity duration-500 ${isHovered ? 'opacity-100' : 'opacity-0'}`}>
              <div className="absolute top-4 right-4 flex flex-col gap-3">
                <div className="hover:scale-110 transition-transform duration-500">
                  <Button
                    size="icon"
                    variant="secondary"
                    className="h-10 w-10 bg-white/95 hover:bg-white shadow-lg rounded-full"
                    onClick={(e) => {
                      e.preventDefault()
                      setIsLiked(!isLiked)
                    }}
                  >
                    <div className={`transition-transform duration-500 ${isLiked ? 'scale-125' : 'scale-100'}`}>
                      <Heart className={`h-4 w-4 ${isLiked ? 'fill-red-500 text-red-500' : ''}`} />
                    </div>
                  </Button>
                </div>
                
                <div className="hover:scale-110 transition-transform duration-500">
                  <Button
                    size="icon"
                    variant="secondary"
                    className="h-10 w-10 bg-white/95 hover:bg-white shadow-lg rounded-full"
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
          
          <CardContent className="p-6">
            <div className="animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
              <h3 className="font-semibold text-base mb-3 line-clamp-2 group-hover:text-primary transition-colors duration-300 font-body">
                {product.name}
              </h3>
            </div>
            
            {/* Season Badge */}
            {product.season && (
              <div className="mb-3 animate-scale-in" style={{ animationDelay: '0.2s' }}>
                <Badge className={`px-2 py-1 text-xs font-medium ${
                  product.season === 'summer' 
                    ? 'bg-gradient-to-r from-yellow-400 to-orange-500 text-white' 
                    : product.season === 'winter'
                    ? 'bg-gradient-to-r from-blue-400 to-blue-600 text-white'
                    : 'bg-gradient-to-r from-green-400 to-emerald-500 text-white'
                }`}>
                  {product.season === 'summer' ? '☀️ Summer' : product.season === 'winter' ? '❄️ Winter' : '🌍 All Season'}
                </Badge>
              </div>
            )}
            
            <div className="flex items-center justify-between mb-3 animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
              <div className="flex items-center gap-2">
                <span className="font-bold text-lg text-primary">${product.price}</span>
                {product.compare_at_price && (
                  <span className="text-sm text-muted-foreground line-through">${product.compare_at_price}</span>
                )}
              </div>
              <div className="flex gap-1">
                {availableColors.slice(0, 3).map((color, index) => {
                  const variant = product.variants?.find(v => v.color === color)
                  return (
                    <div
                      key={index}
                      className="w-4 h-4 rounded-full border-2 border-white shadow-sm hover:scale-110 transition-transform duration-200 animate-scale-in"
                      style={{ 
                        backgroundColor: variant?.color_hex || '#gray',
                        animationDelay: `${index * 0.1}s`
                      }}
                    />
                  )
                })}
                {availableColors.length > 3 && (
                  <span className="text-xs text-muted-foreground ml-1">+{availableColors.length - 3}</span>
                )}
              </div>
            </div>
            
            <div className="animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
              <Button
                size="sm"
                className="w-full premium-button text-sm h-11 transition-all duration-500 hover:scale-105"
                onClick={handleAddToCart}
                disabled={!isInStock}
              >
                <div className="hover:rotate-5 transition-transform duration-500">
                  <ShoppingCart className="h-4 w-4 mr-2" />
                </div>
                {isInStock ? "Add to Cart" : "Out of Stock"}
              </Button>
            </div>
          </CardContent>
        </Card>
      </Link>
    </div>
  )
}
