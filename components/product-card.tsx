"use client"

import type React from "react"

import Image from "next/image"
import Link from "next/link"
import type { ProductWithDetails } from "@/lib/database.types"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ShoppingCart, Heart } from "lucide-react"
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
    <Link href={`/products/${product.id}`}>
      <Card className="group overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1 cursor-pointer h-full">
        <div className="relative aspect-[3/4] overflow-hidden">
          <Image
            src={product.image_url || "/placeholder.svg"}
            alt={product.name}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
          {product.is_featured && (
            <Badge className="absolute top-1 left-1 bg-yellow-500 text-yellow-900 text-xs px-1.5 py-0.5">Featured</Badge>
          )}
          {discountPercentage > 0 && (
            <Badge className="absolute top-1 right-1 bg-red-500 text-white text-xs px-1.5 py-0.5">
              -{discountPercentage}%
            </Badge>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          <Button
            size="icon"
            variant="secondary"
            className="absolute top-1 right-1 h-6 w-6 opacity-0 group-hover:opacity-100 transition-all duration-200 hover:scale-110"
            onClick={(e) => {
              e.preventDefault()
              // Add to wishlist functionality
            }}
          >
            <Heart className="h-3 w-3" />
          </Button>
        </div>
        <CardContent className="p-3">
          <h3 className="font-semibold text-sm mb-1 line-clamp-2 group-hover:text-primary transition-colors duration-200">
            {product.name}
          </h3>
          
          {/* Season Badge */}
          {product.season && (
            <div className="mb-2">
              <Badge className={`px-2 py-0.5 text-xs font-medium ${
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
          
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-1">
              <span className="font-bold text-base text-primary">${product.price}</span>
              {product.compare_at_price && (
                <span className="text-xs text-muted-foreground line-through">${product.compare_at_price}</span>
              )}
            </div>
            <div className="flex gap-0.5">
              {availableColors.slice(0, 2).map((color, index) => {
                const variant = product.variants?.find(v => v.color === color)
                return (
                  <div
                    key={index}
                    className="w-3 h-3 rounded-full border border-white shadow-sm transition-transform duration-200 hover:scale-125"
                    style={{ backgroundColor: variant?.color_hex || '#gray' }}
                  />
                )
              })}
              {availableColors.length > 2 && (
                <span className="text-xs text-muted-foreground">+{availableColors.length - 2}</span>
              )}
            </div>
          </div>
          <Button
            size="sm"
            className="w-full text-xs h-8 transition-all duration-200 hover:scale-105"
            onClick={handleAddToCart}
            disabled={!isInStock}
          >
            <ShoppingCart className="h-3 w-3 mr-1" />
            {isInStock ? "Add to Cart" : "Out of Stock"}
          </Button>
        </CardContent>
      </Card>
    </Link>
  )
}
