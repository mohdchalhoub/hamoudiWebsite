"use client"

import { useState } from "react"
import { useCart } from "@/contexts/cart-context"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
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

  const isInStock = selectedVariant ? selectedVariant.stock_quantity > 0 : false
  const maxQuantity = selectedVariant ? Math.min(selectedVariant.stock_quantity, 10) : 1

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
    <div className="space-y-2">
      {/* Size/Age Selection */}
      {(availableSizes.length > 0 || availableAges.length > 0) && (
        <div className="bg-slate-100 rounded-md p-2 border border-slate-200">
          <h3 className="font-semibold text-slate-700 mb-1 flex items-center gap-1 text-xs">
            <span className="w-1 h-1 bg-blue-500 rounded-full"></span>
            {availableSizes.length > 0 ? 'Select Size' : 'Select Age Range'}
          </h3>
          <div className="flex flex-wrap gap-2">
            {availableSizes.length > 0 ? (
              availableSizes.map((size) => (
                <Button
                  key={size}
                  variant={selectedSize === size ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedSize(size || '')}
                  className={`min-w-[40px] h-7 text-xs font-medium transition-all duration-200 ${
                    selectedSize === size 
                      ? 'bg-blue-600 text-white shadow-md' 
                      : 'hover:bg-blue-100 hover:border-blue-400 bg-slate-50 border-slate-300 text-slate-700'
                  }`}
                >
                  {size}
                </Button>
              ))
            ) : (
              availableAges.map((age) => (
                <Button
                  key={age}
                  variant={selectedAge === age ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedAge(age || '')}
                  className={`min-w-[40px] h-7 text-xs font-medium transition-all duration-200 ${
                    selectedAge === age 
                      ? 'bg-pink-600 text-white shadow-md' 
                      : 'hover:bg-pink-100 hover:border-pink-400 bg-slate-50 border-slate-300 text-slate-700'
                  }`}
                >
                  {age}
                </Button>
              ))
            )}
          </div>
        </div>
      )}

      {/* Color Selection */}
      {availableColors.length > 0 && (
        <div className="bg-slate-100 rounded-md p-2 border border-slate-200">
          <h3 className="font-semibold text-slate-700 mb-1 flex items-center gap-1 text-xs">
            <span className="w-1 h-1 bg-emerald-500 rounded-full"></span>
            Select Color
          </h3>
          <div className="flex flex-wrap gap-2">
            {availableColors.map((color) => {
              const variant = product.variants?.find(v => v.color === color)
              return (
                <Button
                  key={color}
                  variant={selectedColor === color ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedColor(color)}
                  className={`flex items-center gap-1 min-w-[70px] h-7 text-xs font-medium transition-all duration-200 ${
                    selectedColor === color 
                      ? 'bg-emerald-600 text-white shadow-md' 
                      : 'hover:bg-emerald-100 hover:border-emerald-400 bg-slate-50 border-slate-300 text-slate-700'
                  }`}
                >
                  <div
                    className="w-3 h-3 rounded-full border border-white shadow-sm"
                    style={{ backgroundColor: variant?.color_hex || '#6B7280' }}
                  />
                  {color}
                </Button>
              )
            })}
          </div>
        </div>
      )}

      {/* Stock Status */}
      <div className="flex items-center justify-center">
        {isInStock ? (
          <Badge className="bg-gradient-to-r from-green-500 to-emerald-500 text-white px-4 py-2 text-sm font-semibold shadow-lg">
            ✅ In Stock ({selectedVariant?.stock_quantity} available)
          </Badge>
        ) : (
          <Badge variant="destructive" className="px-4 py-2 text-sm font-semibold">❌ Out of Stock</Badge>
        )}
      </div>

      {/* Quantity Selector */}
      <div className="bg-slate-100 rounded-md p-2 border border-slate-200">
        <h3 className="font-semibold text-slate-700 mb-1 text-center text-xs">Quantity</h3>
        <div className="flex items-center justify-center gap-3">
          <Button
            variant="outline"
            size="icon"
            onClick={decrementQuantity}
            disabled={quantity <= 1}
            className="h-7 w-7 hover:bg-red-100 hover:border-red-400 transition-colors bg-slate-50 border-slate-300"
          >
            <Minus className="h-4 w-4" />
          </Button>
          <span className="text-base font-bold min-w-[2rem] text-center bg-slate-50 rounded-sm px-2 py-1 border border-slate-300 text-slate-700">
            {quantity}
          </span>
          <Button
            variant="outline"
            size="icon"
            onClick={incrementQuantity}
            disabled={quantity >= maxQuantity}
            className="h-7 w-7 hover:bg-green-100 hover:border-green-400 transition-colors bg-slate-50 border-slate-300"
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <Separator className="my-2" />

      {/* Action Buttons */}
      <div className="space-y-1">
        <Button
          onClick={handleAddToCart}
          disabled={!isInStock || isAddingToCart}
          className="w-full h-9 text-xs font-semibold bg-blue-600 hover:bg-blue-700 text-white shadow-md hover:shadow-lg transition-all duration-300 hover:scale-105"
          size="sm"
        >
          <ShoppingCart className="mr-1 h-3 w-3" />
          {isAddingToCart ? "Adding..." : isInStock ? "Add to Cart" : "Out of Stock"}
        </Button>
        
        <Button
          variant="outline"
          className="w-full h-9 text-xs font-semibold border border-slate-300 hover:border-pink-400 hover:bg-pink-100 transition-all duration-300 hover:scale-105 bg-slate-50 text-slate-700"
          size="sm"
        >
          <Heart className="mr-1 h-3 w-3" />
          Add to Wishlist
        </Button>
      </div>

      {/* Product Information */}
      <div className="space-y-2 pt-2">
        <Separator />
        
        {/* Product Details */}
        <div className="space-y-1">
          <h3 className="font-semibold text-xs text-slate-700">Product Details</h3>
          
          {product.brand && (
            <div className="flex justify-between text-xs">
              <span className="text-slate-500">Brand:</span>
              <span className="font-medium text-slate-700">{product.brand}</span>
            </div>
          )}
          
          {product.material && (
            <div className="flex justify-between text-xs">
              <span className="text-slate-500">Material:</span>
              <span className="font-medium text-slate-700">{product.material}</span>
            </div>
          )}
          
          {product.age_range && (
            <div className="flex justify-between text-xs">
              <span className="text-slate-500">Age Range:</span>
              <span className="font-medium text-slate-700">{product.age_range} years</span>
            </div>
          )}
          
          {product.gender && (
            <div className="flex justify-between text-xs">
              <span className="text-slate-500">Gender:</span>
              <span className="font-medium capitalize text-slate-700">{product.gender}</span>
            </div>
          )}
          
          {product.weight_grams && (
            <div className="flex justify-between text-xs">
              <span className="text-slate-500">Weight:</span>
              <span className="font-medium text-slate-700">{product.weight_grams}g</span>
            </div>
          )}
        </div>

        {/* Care Instructions */}
        {product.care_instructions && (
          <div className="space-y-1">
            <h4 className="font-semibold text-xs text-slate-700">Care Instructions</h4>
            <p className="text-xs text-slate-600">{product.care_instructions}</p>
          </div>
        )}

        {/* Shipping & Returns */}
        <div className="space-y-1">
          <h3 className="font-semibold text-xs text-slate-700">Shipping & Returns</h3>
          
          <div className="flex items-start gap-2">
            <Truck className="h-3 w-3 text-emerald-500 mt-0.5" />
            <div>
              <p className="font-medium text-xs text-slate-700">Free Shipping</p>
              <p className="text-xs text-slate-500">On orders over $50</p>
            </div>
          </div>
          
          <div className="flex items-start gap-2">
            <Package className="h-3 w-3 text-blue-500 mt-0.5" />
            <div>
              <p className="font-medium text-xs text-slate-700">Easy Returns</p>
              <p className="text-xs text-slate-500">30-day return policy</p>
            </div>
          </div>
          
          <div className="flex items-start gap-2">
            <RotateCcw className="h-3 w-3 text-purple-500 mt-0.5" />
            <div>
              <p className="font-medium text-xs text-slate-700">Exchange Policy</p>
              <p className="text-xs text-slate-500">Free exchanges within 14 days</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}