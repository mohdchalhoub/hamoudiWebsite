"use client"

import type React from "react"

import Image from "next/image"
import Link from "next/link"
import type { Product } from "@/lib/types"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ShoppingCart, Heart } from "lucide-react"
import { useCart } from "@/contexts/cart-context"
import { useState } from "react"

interface ProductCardProps {
  product: Product
}

export function ProductCard({ product }: ProductCardProps) {
  const { addItem } = useCart()
  const [selectedSize, setSelectedSize] = useState(product.sizes[0])
  const [selectedColor, setSelectedColor] = useState(product.colors[0])

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault()
    addItem(product, selectedSize, selectedColor)
  }

  const discountPercentage = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0

  return (
    <Link href={`/products/${product.id}`}>
      <Card className="group overflow-hidden transition-all duration-500 hover:shadow-2xl hover:-translate-y-2 hover-lift">
        <div className="relative aspect-square overflow-hidden">
          <Image
            src={product.images[0] || "/placeholder.svg"}
            alt={product.name}
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-110"
          />
          {product.featured && (
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
              {product.originalPrice && (
                <span className="text-sm text-muted-foreground line-through">${product.originalPrice}</span>
              )}
            </div>
            <div className="flex gap-1">
              {product.colors.slice(0, 3).map((color, index) => (
                <div
                  key={index}
                  className={`w-4 h-4 rounded-full border-2 border-white shadow-sm transition-transform duration-200 hover:scale-125 ${
                    color.toLowerCase().includes("blue")
                      ? "bg-blue-500"
                      : color.toLowerCase().includes("pink")
                        ? "bg-pink-500"
                        : color.toLowerCase().includes("purple")
                          ? "bg-purple-500"
                          : color.toLowerCase().includes("red")
                            ? "bg-red-500"
                            : color.toLowerCase().includes("green")
                              ? "bg-green-500"
                              : color.toLowerCase().includes("yellow")
                                ? "bg-yellow-500"
                                : color.toLowerCase().includes("black")
                                  ? "bg-black"
                                  : color.toLowerCase().includes("white")
                                    ? "bg-white border-gray-300"
                                    : "bg-gray-400"
                  }`}
                />
              ))}
              {product.colors.length > 3 && (
                <span className="text-xs text-muted-foreground">+{product.colors.length - 3}</span>
              )}
            </div>
          </div>
          <Button
            className="w-full btn-press transition-all duration-200"
            onClick={handleAddToCart}
            disabled={!product.inStock}
          >
            <ShoppingCart className="h-4 w-4 mr-2" />
            {product.inStock ? "Add to Cart" : "Out of Stock"}
          </Button>
        </CardContent>
      </Card>
    </Link>
  )
}
