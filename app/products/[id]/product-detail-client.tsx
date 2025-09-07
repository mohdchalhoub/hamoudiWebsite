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
          <Label className="text-base font-semibold text-gray-800">
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
            className="flex flex-wrap gap-3"
          >
            {availableSizes.length > 0 ? (
              availableSizes.map((size) => (
                <div key={size} className="flex items-center space-x-3 p-3 bg-white rounded-xl border border-gray-200 hover:border-primary-300 hover:shadow-md transition-all duration-300 hover:scale-105">
                  <RadioGroupItem value={size || ''} id={size || ''} className="text-primary-600" />
                  <Label htmlFor={size || ''} className="text-sm font-semibold cursor-pointer text-gray-700">
                    {size}
                  </Label>
                </div>
              ))
            ) : (
              availableAges.map((age) => (
                <div key={age} className="flex items-center space-x-3 p-3 bg-white rounded-xl border border-gray-200 hover:border-accent-300 hover:shadow-md transition-all duration-300 hover:scale-105">
                  <RadioGroupItem value={age || ''} id={age || ''} className="text-accent-600" />
                  <Label htmlFor={age || ''} className="text-sm font-semibold cursor-pointer text-gray-700">
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
          <Label className="text-base font-semibold text-gray-800">Color</Label>
          <RadioGroup
            value={selectedColor}
            onValueChange={setSelectedColor}
            className="flex flex-wrap gap-3"
          >
            {availableColors.map((color) => {
              const variant = product.variants?.find(v => v.color === color)
              return (
                <div key={color} className="flex items-center space-x-3 p-3 bg-white rounded-xl border border-gray-200 hover:border-emerald-300 hover:shadow-md transition-all duration-300 hover:scale-105">
                  <RadioGroupItem value={color} id={color} className="text-emerald-600" />
                  <Label htmlFor={color} className="flex items-center gap-3 text-sm font-semibold cursor-pointer text-gray-700">
                    <div
                      className="w-5 h-5 rounded-full border-2 border-gray-300 shadow-sm"
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
      <div className="flex items-center justify-center py-3">
        {isInStock ? (
          <div className="bg-green-50 rounded-xl p-4 border border-green-200">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                <span className="text-white text-sm font-bold">✓</span>
              </div>
              <div>
                <p className="font-semibold text-green-800">In Stock</p>
                <p className="text-sm text-green-600">{availableQuantity} available</p>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-accent-50 rounded-xl p-4 border border-accent-200">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-accent-500 rounded-full flex items-center justify-center">
                <span className="text-white text-sm font-bold">✗</span>
              </div>
              <div>
                <p className="font-semibold text-accent-800">Out of Stock</p>
                <p className="text-sm text-accent-600">Check back soon</p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Quantity Selector */}
      <div className="space-y-3">
        <Label className="text-base font-semibold text-gray-800">Quantity</Label>
        <div className="flex items-center justify-center gap-4">
          <Button
            variant="outline"
            size="icon"
            onClick={decrementQuantity}
            disabled={quantity <= 1}
            className="h-10 w-10 hover:bg-accent-50 hover:border-accent-300 transition-all duration-300 hover:scale-105"
          >
            <Minus className="h-4 w-4" />
          </Button>
          <div className="bg-white rounded-xl px-4 py-2 border border-gray-300 shadow-sm">
            <span className="text-xl font-bold min-w-[2rem] text-center text-gray-900">
              {quantity}
            </span>
          </div>
          <Button
            variant="outline"
            size="icon"
            onClick={incrementQuantity}
            disabled={quantity >= maxQuantity}
            className="h-10 w-10 hover:bg-green-50 hover:border-green-300 transition-all duration-300 hover:scale-105"
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <Separator className="border-gray-200" />

      {/* Action Buttons */}
      <div className="space-y-3">
        <Button
          onClick={handleAddToCart}
          disabled={!isInStock || isAddingToCart}
          className="w-full h-12 text-base font-semibold bg-primary-600 hover:bg-primary-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <ShoppingCart className="mr-2 h-5 w-5" />
          {isAddingToCart ? "Adding..." : isInStock ? "Add to Cart" : "Out of Stock"}
        </Button>
        
        <Button
          variant="outline"
          className="w-full h-12 text-base font-semibold border-2 border-accent-300 hover:border-accent-400 hover:bg-accent-50 text-accent-700 transition-all duration-300 hover:scale-105"
        >
          <Heart className="mr-2 h-5 w-5" />
          Add to Wishlist
        </Button>
      </div>

      {/* Enhanced Product Information */}
      <div className="space-y-4 pt-4">
        <Separator className="border-gray-200" />
        
        {/* Product Details */}
        <div className="bg-white rounded-xl p-4 border border-gray-200">
          <h3 className="text-base font-semibold text-gray-800 mb-3">Product Details</h3>
          <div className="space-y-2 text-sm">
            {product.brand && (
              <div className="flex justify-between items-center py-2 px-3 bg-gray-50 rounded-lg">
                <span className="text-gray-600 font-medium">Brand:</span>
                <span className="font-semibold text-gray-800">{product.brand}</span>
              </div>
            )}
            {product.material && (
              <div className="flex justify-between items-center py-2 px-3 bg-gray-50 rounded-lg">
                <span className="text-gray-600 font-medium">Material:</span>
                <span className="font-semibold text-gray-800">{product.material}</span>
              </div>
            )}
            {product.age_range && (
              <div className="flex justify-between items-center py-2 px-3 bg-gray-50 rounded-lg">
                <span className="text-gray-600 font-medium">Age Range:</span>
                <span className="font-semibold text-gray-800">{product.age_range} years</span>
              </div>
            )}
            {product.gender && (
              <div className="flex justify-between items-center py-2 px-3 bg-gray-50 rounded-lg">
                <span className="text-gray-600 font-medium">Gender:</span>
                <span className="font-semibold text-gray-800 capitalize">{product.gender}</span>
              </div>
            )}
            {product.weight_grams && (
              <div className="flex justify-between items-center py-2 px-3 bg-gray-50 rounded-lg">
                <span className="text-gray-600 font-medium">Weight:</span>
                <span className="font-semibold text-gray-800">{product.weight_grams}g</span>
              </div>
            )}
          </div>
        </div>

        {/* Care Instructions */}
        {product.care_instructions && (
          <div className="bg-amber-50 rounded-xl p-4 border border-amber-200">
            <h4 className="text-base font-semibold text-gray-800 mb-2">Care Instructions</h4>
            <p className="text-sm text-gray-700 leading-relaxed">{product.care_instructions}</p>
          </div>
        )}

        {/* Shipping & Returns */}
        <div className="bg-primary-50 rounded-xl p-4 border border-primary-200">
          <h3 className="text-base font-semibold text-gray-800 mb-3">Shipping & Returns</h3>
          <div className="space-y-2 text-sm">
            <div className="flex items-center gap-3 py-2 px-3 bg-white rounded-lg">
              <Truck className="h-4 w-4 text-emerald-500" />
              <span className="text-gray-700 font-medium">Free shipping on orders over $50</span>
            </div>
            <div className="flex items-center gap-3 py-2 px-3 bg-white rounded-lg">
              <Package className="h-4 w-4 text-primary-500" />
              <span className="text-gray-700 font-medium">30-day return policy</span>
            </div>
            <div className="flex items-center gap-3 py-2 px-3 bg-white rounded-lg">
              <RotateCcw className="h-4 w-4 text-primary-500" />
              <span className="text-gray-700 font-medium">Free exchanges within 14 days</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}