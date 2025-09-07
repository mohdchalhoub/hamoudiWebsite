"use client"

import { useState } from "react"
import { useCart } from "@/contexts/cart-context"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Heart, ShoppingCart, Minus, Plus, Package, Truck, RotateCcw } from "lucide-react"
import type { ProductWithDetails } from "@/lib/database.types"

interface ProductDetailClientProps {
  product: ProductWithDetails
}

export function ProductDetailClient({ product }: ProductDetailClientProps) {
  const { addItem } = useCart()
  
  // Get available sizes/ages and colors from variants
  const availableSizes = [...new Set(product.variants?.map(v => v.size).filter(Boolean) || [])]
  const availableAges = [...new Set(product.variants?.map(v => v.age_range).filter(Boolean) || [])]
  const availableColors = [...new Set(product.variants?.map(v => v.color) || [])]
  
  const [selectedSize, setSelectedSize] = useState(availableSizes[0] || '')
  const [selectedAge, setSelectedAge] = useState(availableAges[0] || '')
  const [selectedColor, setSelectedColor] = useState(availableColors[0] || '')
  const [quantity, setQuantity] = useState(1)
  const [isAddingToCart, setIsAddingToCart] = useState(false)

  // Find the selected variant
  const selectedVariant = product.variants?.find(v => {
    const sizeMatch = availableSizes.length > 0 ? v.size === selectedSize : true
    const ageMatch = availableAges.length > 0 ? v.age_range === selectedAge : true
    const colorMatch = v.color === selectedColor
    return sizeMatch && ageMatch && colorMatch
  })

  // Check stock status - use product quantity if no variants, otherwise use variant stock
  const isInStock = selectedVariant ? selectedVariant.stock_quantity > 0 : product.quantity > 0
  const maxQuantity = selectedVariant ? Math.min(selectedVariant.stock_quantity, 10) : Math.min(product.quantity, 10)
  const availableQuantity = selectedVariant ? selectedVariant.stock_quantity : product.quantity

  const handleAddToCart = async () => {
    if (!isInStock) return
    
    setIsAddingToCart(true)
    try {
      const sizeOrAge = selectedSize || selectedAge
      if (sizeOrAge && selectedColor) {
        await addItem(product, sizeOrAge, selectedColor, quantity)
        setQuantity(1) // Reset quantity after adding
      }
    } catch (error) {
      console.error('Failed to add to cart:', error)
    } finally {
      setIsAddingToCart(false)
    }
  }

  const incrementQuantity = () => {
    if (quantity < maxQuantity) {
      setQuantity(quantity + 1)
    }
  }

  const decrementQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1)
    }
  }

  return (
    <div className="space-y-6">
      {/* Size/Age Selection */}
      {(availableSizes.length > 0 || availableAges.length > 0) && (
        <div className="space-y-3">
          <Label className="text-sm font-medium text-text-primary">
            {availableSizes.length > 0 ? 'Size' : 'Age Range'}
          </Label>
          <RadioGroup
            value={availableSizes.length > 0 ? selectedSize : selectedAge}
            onValueChange={(value) => {
              if (availableSizes.length > 0) {
                setSelectedSize(value)
              } else {
                setSelectedAge(value)
              }
            }}
            className="flex flex-wrap gap-2"
          >
            {availableSizes.length > 0 ? (
              availableSizes.map((size) => (
                <div key={size} className="flex items-center space-x-2 p-2 bg-background border border-border rounded-md hover:border-text-muted transition-colors duration-200">
                  <RadioGroupItem value={size || ''} id={size || ''} className="text-primary" />
                  <Label htmlFor={size || ''} className="text-sm font-medium cursor-pointer text-text-primary">
                    {size}
                  </Label>
                </div>
              ))
            ) : (
              availableAges.map((age) => (
                <div key={age} className="flex items-center space-x-2 p-2 bg-background border border-border rounded-md hover:border-text-muted transition-colors duration-200">
                  <RadioGroupItem value={age || ''} id={age || ''} className="text-primary" />
                  <Label htmlFor={age || ''} className="text-sm font-medium cursor-pointer text-text-primary">
                    {age} years
                  </Label>
                </div>
              ))
            )}
          </RadioGroup>
        </div>
      )}

      {/* Color Selection */}
      {availableColors.length > 0 && (
        <div className="space-y-3">
          <Label className="text-sm font-medium text-text-primary">Color</Label>
          <RadioGroup
            value={selectedColor}
            onValueChange={setSelectedColor}
            className="flex flex-wrap gap-2"
          >
            {availableColors.map((color) => {
              const variant = product.variants?.find(v => v.color === color)
              return (
                <div key={color} className="flex items-center space-x-2 p-2 bg-background border border-border rounded-md hover:border-text-muted transition-colors duration-200">
                  <RadioGroupItem value={color} id={color} className="text-primary" />
                  <Label htmlFor={color} className="flex items-center gap-2 text-sm font-medium cursor-pointer text-text-primary">
                    <div
                      className="w-4 h-4 rounded-full border border-border"
                      style={{ backgroundColor: variant?.color_hex || '#6B7280' }}
                    />
                    {color}
                  </Label>
                </div>
              )
            })}
          </RadioGroup>
        </div>
      )}

      {/* Stock Status */}
      <div className="flex items-center justify-center py-2">
        {isInStock ? (
          <div className="flex items-center gap-2 text-sm">
            <span className="text-green-600">✓</span>
            <span className="font-medium text-text-primary">In Stock</span>
            <span className="text-text-muted">({availableQuantity} available)</span>
          </div>
        ) : (
          <div className="flex items-center gap-2 text-sm">
            <span className="text-red-500">✗</span>
            <span className="font-medium text-text-primary">Out of Stock</span>
          </div>
        )}
      </div>

      {/* Quantity Selector */}
      <div className="space-y-2">
        <Label className="text-sm font-medium text-text-primary">Quantity</Label>
        <div className="flex items-center justify-center gap-3">
          <Button
            variant="outline"
            size="icon"
            onClick={decrementQuantity}
            disabled={quantity <= 1}
            className="h-8 w-8 border-border hover:border-text-muted transition-colors duration-200"
          >
            <Minus className="h-3 w-3" />
          </Button>
          <div className="bg-background border border-border rounded-md px-3 py-1">
            <span className="text-sm font-medium min-w-[1.5rem] text-center text-text-primary">
              {quantity}
            </span>
          </div>
          <Button
            variant="outline"
            size="icon"
            onClick={incrementQuantity}
            disabled={quantity >= maxQuantity}
            className="h-8 w-8 border-border hover:border-text-muted transition-colors duration-200"
          >
            <Plus className="h-3 w-3" />
          </Button>
        </div>
      </div>

      <Separator className="border-border" />

      {/* Action Buttons */}
      <div className="space-y-2">
        <Button
          onClick={handleAddToCart}
          disabled={!isInStock || isAddingToCart}
          className="w-full h-10 text-sm font-medium bg-primary hover:bg-primary-hover text-white transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <ShoppingCart className="mr-2 h-4 w-4" />
          {isAddingToCart ? "Adding..." : isInStock ? "Add to Cart" : "Out of Stock"}
        </Button>
        
        <Button
          variant="outline"
          className="w-full h-10 text-sm font-medium border-border hover:border-text-muted hover:bg-background-subtle text-text-primary transition-colors duration-200"
        >
          <Heart className="mr-2 h-4 w-4" />
          Add to Wishlist
        </Button>
      </div>

      {/* Enhanced Product Information */}
      <div className="space-y-4 pt-4">
        <Separator className="border-border" />
        
        {/* Product Details */}
        <div className="bg-background border border-border rounded-md p-4">
          <h3 className="text-sm font-medium text-text-primary mb-3">Product Details</h3>
          <div className="space-y-2 text-sm">
            {product.brand && (
              <div className="flex justify-between items-center py-2 px-3 bg-background-subtle rounded-md">
                <span className="text-text-muted font-medium">Brand:</span>
                <span className="font-medium text-text-primary">{product.brand}</span>
              </div>
            )}
            {product.material && (
              <div className="flex justify-between items-center py-2 px-3 bg-background-subtle rounded-md">
                <span className="text-text-muted font-medium">Material:</span>
                <span className="font-medium text-text-primary">{product.material}</span>
              </div>
            )}
            {product.age_range && (
              <div className="flex justify-between items-center py-2 px-3 bg-background-subtle rounded-md">
                <span className="text-text-muted font-medium">Age Range:</span>
                <span className="font-medium text-text-primary">{product.age_range} years</span>
              </div>
            )}
            {product.gender && (
              <div className="flex justify-between items-center py-2 px-3 bg-background-subtle rounded-md">
                <span className="text-text-muted font-medium">Gender:</span>
                <span className="font-medium text-text-primary capitalize">{product.gender}</span>
              </div>
            )}
            {product.weight_grams && (
              <div className="flex justify-between items-center py-2 px-3 bg-background-subtle rounded-md">
                <span className="text-text-muted font-medium">Weight:</span>
                <span className="font-medium text-text-primary">{product.weight_grams}g</span>
              </div>
            )}
          </div>
        </div>

        {/* Care Instructions */}
        {product.care_instructions && (
          <div className="bg-background border border-border rounded-md p-4">
            <h4 className="text-sm font-medium text-text-primary mb-2">Care Instructions</h4>
            <p className="text-sm text-text-secondary leading-relaxed">{product.care_instructions}</p>
          </div>
        )}

        {/* Shipping & Returns */}
        <div className="bg-background border border-border rounded-md p-4">
          <h3 className="text-sm font-medium text-text-primary mb-3">Shipping & Returns</h3>
          <div className="space-y-2 text-sm">
            <div className="flex items-center gap-3 py-2 px-3 bg-background-subtle rounded-md">
              <Truck className="h-4 w-4 text-text-muted" />
              <span className="text-text-secondary font-medium">Free shipping on orders over $50</span>
            </div>
            <div className="flex items-center gap-3 py-2 px-3 bg-background-subtle rounded-md">
              <Package className="h-4 w-4 text-text-muted" />
              <span className="text-text-secondary font-medium">30-day return policy</span>
            </div>
            <div className="flex items-center gap-3 py-2 px-3 bg-background-subtle rounded-md">
              <RotateCcw className="h-4 w-4 text-text-muted" />
              <span className="text-text-secondary font-medium">Free exchanges within 14 days</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}