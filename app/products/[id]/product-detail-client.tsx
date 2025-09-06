"use client"

import { useState } from "react"
import type { ProductWithDetails } from "@/lib/database.types"
import { Button } from "@/components/ui/button"
import { useCart } from "@/contexts/cart-context"
import { ShoppingCart, Heart, Minus, Plus } from "lucide-react"
import { Badge } from "@/components/ui/badge"

interface ProductDetailClientProps {
  product: ProductWithDetails
}

export function ProductDetailClient({ product }: ProductDetailClientProps) {
  const { addItem } = useCart()
  
  // Get unique sizes and colors from variants
  const sizes = [...new Set(product.variants?.map(v => v.size) || [])]
  const colors = [...new Set(product.variants?.map(v => v.color) || [])]
  
  const [selectedSize, setSelectedSize] = useState(sizes[0] || '')
  const [selectedColor, setSelectedColor] = useState(colors[0] || '')
  const [quantity, setQuantity] = useState(1)

  // Find the selected variant
  const selectedVariant = product.variants?.find(v => v.size === selectedSize && v.color === selectedColor)
  const isInStock = selectedVariant ? selectedVariant.stock_quantity > 0 : false

  const handleAddToCart = () => {
    if (selectedVariant) {
      addItem(product, selectedSize, selectedColor, quantity)
    }
  }

  return (
    <div className="space-y-6">
      {/* Size Selection */}
      <div>
        <h3 className="font-semibold mb-3">Select Size</h3>
        <div className="flex flex-wrap gap-2">
          {sizes.map((size) => (
            <Button
              key={size}
              variant={selectedSize === size ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedSize(size)}
            >
              {size}
            </Button>
          ))}
        </div>
      </div>

      {/* Color Selection */}
      <div>
        <h3 className="font-semibold mb-3">Select Color</h3>
        <div className="flex flex-wrap gap-3">
          {colors.map((color) => {
            const variant = product.variants?.find(v => v.color === color)
            return (
              <button
                key={color}
                onClick={() => setSelectedColor(color)}
                className={`flex items-center gap-2 p-2 rounded-lg border-2 transition-colors ${
                  selectedColor === color ? "border-primary bg-primary/10" : "border-border hover:border-primary/50"
                }`}
              >
                <div
                  className="w-6 h-6 rounded-full border-2 border-white shadow-sm"
                  style={{ backgroundColor: variant?.color_hex || '#6B7280' }}
                />
                <span className="text-sm">{color}</span>
              </button>
            )
          })}
        </div>
      </div>

      {/* Quantity Selection */}
      <div>
        <h3 className="font-semibold mb-3">Quantity</h3>
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="icon"
            onClick={() => setQuantity(Math.max(1, quantity - 1))}
            disabled={quantity <= 1}
          >
            <Minus className="h-4 w-4" />
          </Button>
          <span className="text-lg font-semibold min-w-[3rem] text-center">{quantity}</span>
          <Button variant="outline" size="icon" onClick={() => setQuantity(quantity + 1)}>
            <Plus className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Stock Status */}
      <div>
        {isInStock ? (
          <Badge variant="secondary" className="bg-green-100 text-green-800">
            In Stock ({selectedVariant?.stock_quantity} available)
          </Badge>
        ) : (
          <Badge variant="destructive">Out of Stock</Badge>
        )}
      </div>

      {/* Action Buttons */}
      <div className="flex gap-4">
        <Button className="flex-1" size="lg" onClick={handleAddToCart} disabled={!isInStock}>
          <ShoppingCart className="h-5 w-5 mr-2" />
          Add to Cart
        </Button>
        <Button variant="outline" size="lg">
          <Heart className="h-5 w-5" />
        </Button>
      </div>

      {/* Product Features */}
      <div className="border-t pt-6">
        <h3 className="font-semibold mb-3">Product Features</h3>
        <ul className="space-y-2 text-sm text-muted-foreground">
          <li>• High-quality materials</li>
          <li>• Machine washable</li>
          <li>• Comfortable fit</li>
          <li>• Durable construction</li>
          <li>• Safe for kids</li>
        </ul>
      </div>
    </div>
  )
}
