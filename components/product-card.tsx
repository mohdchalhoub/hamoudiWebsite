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
  
  // Get available sizes and colors from variants
  const availableSizes = [...new Set(product.variants?.map(v => v.size) || [])]
  const availableColors = [...new Set(product.variants?.map(v => v.color) || [])]
  
  const [selectedSize, setSelectedSize] = useState(availableSizes[0] || '')
  const [selectedColor, setSelectedColor] = useState(availableColors[0] || '')

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault()
    if (selectedSize && selectedColor) {
      await addItem(product, selectedSize, selectedColor)
    }
  }

  const discountPercentage = product.compare_at_price
    ? Math.round(((product.compare_at_price - product.price) / product.compare_at_price) * 100)
    : 0

  // Check if product is in stock
  const isInStock = product.variants?.some(v => v.stock_quantity > 0) || false

  return (
    <Link href={`/products/${product.id}`}>
      <Card className="group overflow-hidden transition-all duration-500 hover:shadow-2xl hover:-translate-y-2 hover-lift">
        <div className="relative aspect-square overflow-hidden">
          <Image
            src={product.image_url || "/placeholder.svg"}
            alt={product.name}
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-110"
          />
          {product.is_featured && (
            <Badge className="absolute top-2 left-2 bg-yellow-500 text-yellow-900 animate-float">Featured</Badge>
          )}
          {discountPercentage > 0 && (
            <Badge className="absolute top-2 right-2 bg-red-500 text-white animate-float-delayed">
              -{discountPercentage}%
            </Badge>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          <Button
            size="icon"
            variant="secondary"
            className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0 hover:scale-110"
            onClick={(e) => {
              e.preventDefault()
              // Add to wishlist functionality
            }}
          >
            <Heart className="h-4 w-4" />
          </Button>
        </div>
        <CardContent className="p-4">
          <h3 className="font-semibold text-lg mb-2 text-balance group-hover:text-primary transition-colors duration-300">
            {product.name}
          </h3>
          <p className="text-muted-foreground text-sm mb-3 line-clamp-2">{product.description}</p>
          <div className="flex items-center justify-between mb-3">
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
                    className="w-4 h-4 rounded-full border-2 border-white shadow-sm transition-transform duration-200 hover:scale-125"
                    style={{ backgroundColor: variant?.color_hex || '#gray' }}
                  />
                )
              })}
              {availableColors.length > 3 && (
                <span className="text-xs text-muted-foreground">+{availableColors.length - 3}</span>
              )}
            </div>
          </div>
          <Button
            className="w-full btn-press transition-all duration-200"
            onClick={handleAddToCart}
            disabled={!isInStock}
          >
            <ShoppingCart className="h-4 w-4 mr-2" />
            {isInStock ? "Add to Cart" : "Out of Stock"}
          </Button>
        </CardContent>
      </Card>
    </Link>
  )
}
