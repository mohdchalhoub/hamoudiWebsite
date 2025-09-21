"use client"

import { useState, useEffect } from "react"
import { useCart } from "@/contexts/cart-context"
import { useWishlist } from "@/contexts/wishlist-context"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Label } from "@/components/ui/label"
import { Heart, ShoppingCart, Minus, Plus, Package, Truck, RotateCcw } from "lucide-react"
import type { ProductWithDetails } from "@/lib/database.types"

interface ProductDetailClientProps {
  product: ProductWithDetails
  onPriceChange?: (price: number) => void
}

export function ProductDetailClient({ product, onPriceChange }: ProductDetailClientProps) {
  const { addItem } = useCart()
  const { addItem: addToWishlist, isInWishlist } = useWishlist()
  
  // Get available sizes/ages and colors from variants
  const availableSizes = [...new Set(product.variants?.map(v => v.size).filter(size => size && size.trim() !== '') || [])]
  const availableAges = [...new Set(product.variants?.map(v => v.age_range).filter(age => age && age.trim() !== '') || [])]
  const availableColors = [...new Set(product.variants?.map(v => v.color).filter(color => color && color.trim() !== '') || [])]
  
  const [selectedSize, setSelectedSize] = useState(availableSizes[0] || '')
  const [selectedAge, setSelectedAge] = useState(availableAges[0] || '')
  const [selectedColor, setSelectedColor] = useState(availableColors[0] || '')
  const [quantity, setQuantity] = useState(1)
  const [isAddingToCart, setIsAddingToCart] = useState(false)
  const [isAddingToWishlist, setIsAddingToWishlist] = useState(false)

  // Find the selected variant
  const selectedVariant = product.variants?.find(v => {
    // For size-based variants: match size and color
    if (availableSizes.length > 0 && v.size) {
      return v.size === selectedSize && v.color === selectedColor
    }
    // For age-based variants: match age and color
    if (availableAges.length > 0 && v.age_range) {
      return v.age_range === selectedAge && v.color === selectedColor
    }
    // Fallback: just match color
    return v.color === selectedColor
  })

  // Check stock status - consider both product quantity and variant stock
  const isInStock = product.quantity > 0 || (selectedVariant ? selectedVariant.stock_quantity > 0 : false)
  const maxQuantity = selectedVariant 
    ? Math.min(Math.max(selectedVariant.stock_quantity, product.quantity), 10) 
    : Math.min(product.quantity, 10)
  const availableQuantity = selectedVariant 
    ? Math.max(selectedVariant.stock_quantity, product.quantity)
    : product.quantity

  // Calculate dynamic price based on selected variant and quantity
  const basePrice = selectedVariant 
    ? product.price + (selectedVariant.price_adjustment || 0)
    : product.price
  const currentPrice = basePrice * quantity
  
  // Check if price is different from base price
  const hasPriceAdjustment = selectedVariant && selectedVariant.price_adjustment !== 0

  // Notify parent component when price changes
  useEffect(() => {
    if (onPriceChange) {
      onPriceChange(currentPrice)
    }
  }, [currentPrice, onPriceChange, quantity, selectedSize, selectedAge, selectedColor])

  // Debug logging
  console.log('ProductDetailClient Debug:', {
    selectedSize,
    selectedAge,
    selectedColor,
    quantity,
    availableSizes,
    availableAges,
    availableColors,
    allVariants: product.variants?.map(v => ({
      id: v.id,
      size: v.size,
      age_range: v.age_range,
      color: v.color,
      price_adjustment: v.price_adjustment,
      stock_quantity: v.stock_quantity
    })),
    selectedVariant: selectedVariant ? {
      id: selectedVariant.id,
      size: selectedVariant.size,
      age_range: selectedVariant.age_range,
      color: selectedVariant.color,
      price_adjustment: selectedVariant.price_adjustment,
      stock_quantity: selectedVariant.stock_quantity
    } : null,
    baseProductPrice: product.price,
    basePrice,
    currentPrice,
    hasPriceAdjustment
  })

  const handleAddToCart = async () => {
    if (!isInStock) return
    
    setIsAddingToCart(true)
    try {
      const sizeOrAge = selectedSize || selectedAge
      if (sizeOrAge && selectedColor) {
        // Create product object with variant information
        const productWithVariant = {
          ...product,
          variantId: selectedVariant?.id,
          variant_code: selectedVariant?.variant_code,
          sku: selectedVariant?.sku
        }
        await addItem(productWithVariant, sizeOrAge, selectedColor, quantity)
        setQuantity(1) // Reset quantity after adding
      }
    } catch (error) {
      console.error('Failed to add to cart:', error)
    } finally {
      setIsAddingToCart(false)
    }
  }

  const handleAddToWishlist = async () => {
    if (!isInStock) return
    
    setIsAddingToWishlist(true)
    try {
      const sizeOrAge = selectedSize || selectedAge
      if (sizeOrAge && selectedColor) {
        // Add to wishlist (toggle behavior)
        addToWishlist(product, sizeOrAge, selectedColor, quantity)
      }
    } catch (error) {
      console.error('Failed to add to wishlist:', error)
    } finally {
      setIsAddingToWishlist(false)
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
    <div className="space-y-3">
      {/* Size/Age Selection */}
      {(availableSizes.length > 0 || availableAges.length > 0) && (
        <div className="space-y-1">
          <Label className="text-xs font-medium text-text-primary">
            {availableSizes.length > 0 ? 'Size' : 'Age Range'}
          </Label>
          <div className="flex flex-wrap gap-2">
            {availableSizes.length > 0 ? (
              availableSizes.map((size) => {
                const isSelected = selectedSize === size
                return (
                  <div 
                    key={size} 
                    onClick={() => setSelectedSize(size || '')}
                    className={`flex items-center space-x-1 p-1.5 border rounded-md transition-colors duration-200 cursor-pointer ${
                      isSelected 
                        ? 'bg-primary text-white border-primary' 
                        : 'bg-background border-border hover:border-text-muted text-text-primary'
                    }`}
                  >
                    <div className={`w-3 h-3 rounded-full border-2 ${
                      isSelected 
                        ? 'bg-white border-white' 
                        : 'border-primary'
                    }`}>
                      {isSelected && <div className="w-full h-full rounded-full bg-primary"></div>}
                    </div>
                    <span className="text-xs font-medium">
                      {size}
                    </span>
                  </div>
                )
              })
            ) : (
              availableAges.map((age) => {
                const isSelected = selectedAge === age
                return (
                  <div 
                    key={age} 
                    onClick={() => setSelectedAge(age || '')}
                    className={`flex items-center space-x-1 p-1.5 border rounded-md transition-colors duration-200 cursor-pointer ${
                      isSelected 
                        ? 'bg-primary text-white border-primary' 
                        : 'bg-background border-border hover:border-text-muted text-text-primary'
                    }`}
                  >
                    <div className={`w-3 h-3 rounded-full border-2 ${
                      isSelected 
                        ? 'bg-white border-white' 
                        : 'border-primary'
                    }`}>
                      {isSelected && <div className="w-full h-full rounded-full bg-primary"></div>}
                    </div>
                    <span className="text-xs font-medium">
                      {age} years
                    </span>
                  </div>
                )
              })
            )}
          </div>
        </div>
      )}

      {/* Color Selection */}
      {availableColors.length > 0 && (
        <div className="space-y-1">
          <Label className="text-xs font-medium text-text-primary">Color</Label>
          <div className="flex flex-wrap gap-2">
            {availableColors.map((color) => {
              const variant = product.variants?.find(v => v.color === color)
              const isSelected = selectedColor === color
              return (
                <div 
                  key={color} 
                  onClick={() => setSelectedColor(color)}
                  className={`flex items-center space-x-1 p-1.5 border rounded-md transition-colors duration-200 cursor-pointer ${
                    isSelected 
                      ? 'bg-primary text-white border-primary' 
                      : 'bg-background border-border hover:border-text-muted text-text-primary'
                  }`}
                >
                  <div
                    className={`w-3 h-3 rounded-full border-2 ${
                      isSelected ? 'border-white' : 'border-border'
                    }`}
                    style={{ backgroundColor: variant?.color_hex || '#6B7280' }}
                  />
                  <span className="text-xs font-medium">
                    {color}
                  </span>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* Stock Status */}
      <div className="flex items-center justify-center py-0.5">
        {isInStock ? (
          <div className="flex items-center gap-1 text-xs">
            <span className="text-green-600">✓</span>
            <span className="font-medium text-text-primary">In Stock</span>
            <span className="text-text-muted">({availableQuantity} available)</span>
          </div>
        ) : (
          <div className="flex items-center gap-1 text-xs">
            <span className="text-red-500">✗</span>
            <span className="font-medium text-text-primary">Out of Stock</span>
          </div>
        )}
      </div>

      {/* Quantity Selector */}
      <div className="space-y-1">
        <Label className="text-xs font-medium text-text-primary">Quantity</Label>
        <div className="flex items-center justify-center gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={decrementQuantity}
            disabled={quantity <= 1}
            className="h-7 w-7 border-border hover:border-text-muted transition-colors duration-200"
          >
            <Minus className="h-2.5 w-2.5" />
          </Button>
          <div className="bg-background border border-border rounded-md px-2 py-0.5">
            <span className="text-xs font-medium min-w-[1rem] text-center text-text-primary">
              {quantity}
            </span>
          </div>
          <Button
            variant="outline"
            size="icon"
            onClick={incrementQuantity}
            disabled={quantity >= maxQuantity}
            className="h-7 w-7 border-border hover:border-text-muted transition-colors duration-200"
          >
            <Plus className="h-2.5 w-2.5" />
          </Button>
        </div>
      </div>

      <Separator className="border-border" />

      {/* Action Buttons */}
      <div className="space-y-1">
        <Button
          onClick={handleAddToCart}
          disabled={!isInStock || isAddingToCart}
          className="w-full h-8 text-xs font-medium bg-primary hover:bg-primary-hover text-white transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <ShoppingCart className="mr-1 h-3 w-3" />
          {isAddingToCart ? "Adding..." : isInStock ? "Add to Cart" : "Out of Stock"}
        </Button>
        
        <Button
          variant="outline"
          onClick={handleAddToWishlist}
          disabled={!isInStock || isAddingToWishlist}
          className="w-full h-8 text-xs font-medium border-border hover:border-text-muted hover:bg-background-subtle text-text-primary transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Heart className={`mr-1 h-3 w-3 ${isInWishlist(product.id, selectedSize || selectedAge, selectedColor) ? 'fill-red-500 text-red-500' : ''}`} />
          {isAddingToWishlist ? "Adding..." : isInStock ? 
            (isInWishlist(product.id, selectedSize || selectedAge, selectedColor) ? "Remove from Wishlist" : "Add to Wishlist") : 
            "Out of Stock"}
        </Button>
      </div>

      {/* Enhanced Product Information */}
      <div className="space-y-2 pt-1">
        <Separator className="border-border" />
        
        {/* Product Details */}
        <div className="bg-background border border-border rounded-md p-0.5">
          <h3 className="text-xs font-medium text-text-primary mb-0.5">Product Details</h3>
          <div className="space-y-0.5 text-xs">
            {product.product_code && (
              <div className="flex justify-between items-center py-0.5 px-1 bg-slate-100 rounded text-xs">
                <span className="text-slate-600 font-medium">Code:</span>
                <span className="font-mono font-semibold text-slate-800">{product.product_code}</span>
              </div>
            )}
            <div className={`flex justify-between items-center py-0.5 px-1 rounded text-xs ${
              hasPriceAdjustment ? 'bg-blue-50 border border-blue-200' : 'bg-slate-100'
            }`}>
              <span className="text-slate-600 font-medium">Unit Price:</span>
              <div className="flex items-center gap-1">
                {hasPriceAdjustment ? (
                  <>
                    <span className="text-slate-400 line-through">${product.price.toFixed(2)}</span>
                    <span className="font-semibold text-blue-700">
                      ${basePrice.toFixed(2)}
                    </span>
                    <span className="text-xs text-slate-500">
                      ({selectedVariant.price_adjustment > 0 ? '+' : ''}${selectedVariant.price_adjustment.toFixed(2)})
                    </span>
                  </>
                ) : (
                  <span className="font-semibold text-slate-800">
                    ${basePrice.toFixed(2)}
                  </span>
                )}
              </div>
            </div>
            <div className="flex justify-between items-center py-0.5 px-1 bg-green-50 border border-green-200 rounded text-xs">
              <span className="text-slate-600 font-medium">Total Price:</span>
              <span className="font-bold text-green-700">
                ${currentPrice.toFixed(2)}
              </span>
            </div>
            <div className="flex justify-between items-center py-0.5 px-1 bg-slate-100 rounded text-xs">
              <span className="text-slate-600 font-medium">Season:</span>
              <span className="font-semibold text-slate-800 capitalize">{product.season}</span>
            </div>
            {product.brand && (
              <div className="flex justify-between items-center py-0.5 px-1 bg-slate-100 rounded text-xs">
                <span className="text-slate-600 font-medium">Brand:</span>
                <span className="font-semibold text-slate-800">{product.brand}</span>
              </div>
            )}
            {product.material && (
              <div className="flex justify-between items-center py-0.5 px-1 bg-slate-100 rounded text-xs">
                <span className="text-slate-600 font-medium">Material:</span>
                <span className="font-semibold text-slate-800">{product.material}</span>
              </div>
            )}
            {/* Display age range - STRICT: only if product.age_range exists and is not empty */}
            {product.age_range && product.age_range.trim() !== '' && (
              <div className="flex justify-between items-center py-0.5 px-1 bg-slate-100 rounded text-xs">
                <span className="text-slate-600 font-medium">Age Range:</span>
                <span className="font-semibold text-slate-800">
                  {product.age_range} years
                </span>
              </div>
            )}
            {/* Display size - STRICT: only if product.size exists and is not empty */}
            {product.size && product.size.trim() !== '' && (
              <div className="flex justify-between items-center py-0.5 px-1 bg-slate-100 rounded text-xs">
                <span className="text-slate-600 font-medium">Size:</span>
                <span className="font-semibold text-slate-800">{product.size}</span>
              </div>
            )}
            {product.gender && (
              <div className="flex justify-between items-center py-0.5 px-1 bg-slate-100 rounded text-xs">
                <span className="text-slate-600 font-medium">Gender:</span>
                <span className="font-semibold text-slate-800 capitalize">{product.gender}</span>
              </div>
            )}
            {product.weight_grams && (
              <div className="flex justify-between items-center py-0.5 px-1 bg-slate-100 rounded text-xs">
                <span className="text-slate-600 font-medium">Weight:</span>
                <span className="font-semibold text-slate-800">{product.weight_grams}g</span>
              </div>
            )}
          </div>
        </div>

        {/* Care Instructions */}
        {product.care_instructions && (
          <div className="bg-background border border-border rounded-md p-2">
            <h4 className="text-xs font-medium text-text-primary mb-0.5">Care Instructions</h4>
            <p className="text-xs text-text-secondary leading-relaxed">{product.care_instructions}</p>
          </div>
        )}

      </div>
    </div>
  )
}