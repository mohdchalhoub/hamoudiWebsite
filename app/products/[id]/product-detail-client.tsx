"use client"

import { useState } from "react"
import type { Product } from "@/lib/types"
import { Button } from "@/components/ui/button"
import { useCart } from "@/contexts/cart-context"
import { ShoppingCart, Heart, Minus, Plus } from "lucide-react"
import { Badge } from "@/components/ui/badge"

interface ProductDetailClientProps {
  product: Product
}

export function ProductDetailClient({ product }: ProductDetailClientProps) {
  const { addItem } = useCart()
  const [selectedSize, setSelectedSize] = useState(product.sizes[0])
  const [selectedColor, setSelectedColor] = useState(product.colors[0])
  const [quantity, setQuantity] = useState(1)

  const handleAddToCart = () => {
    addItem(product, selectedSize, selectedColor, quantity)
  }

  return (
    <div className="space-y-6">
      {/* Size Selection */}
      <div>
        <h3 className="font-semibold mb-3">Select Size</h3>
        <div className="flex flex-wrap gap-2">
          {product.sizes.map((size) => (
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
          {product.colors.map((color) => (
            <button
              key={color}
              onClick={() => setSelectedColor(color)}
              className={`flex items-center gap-2 p-2 rounded-lg border-2 transition-colors ${
                selectedColor === color ? "border-primary bg-primary/10" : "border-border hover:border-primary/50"
              }`}
            >
              <div
                className={`w-6 h-6 rounded-full border-2 border-white shadow-sm ${
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
              <span className="text-sm">{color}</span>
            </button>
          ))}
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
        {product.inStock ? (
          <Badge variant="secondary" className="bg-green-100 text-green-800">
            In Stock
          </Badge>
        ) : (
          <Badge variant="destructive">Out of Stock</Badge>
        )}
      </div>

      {/* Action Buttons */}
      <div className="flex gap-4">
        <Button className="flex-1" size="lg" onClick={handleAddToCart} disabled={!product.inStock}>
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
