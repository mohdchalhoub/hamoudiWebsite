"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { useWishlist } from "@/contexts/wishlist-context"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Heart, Plus, Minus, X, ShoppingCart } from "lucide-react"
import { Separator } from "@/components/ui/separator"
import { useCart } from "@/contexts/cart-context"
import { useToast } from "@/hooks/use-toast"

export function WishlistDrawer() {
  const { items, removeItem, updateQuantity, getTotalItems, clearWishlist } = useWishlist()
  const { addItem: addToCart } = useCart()
  const { toast } = useToast()
  const [isOpen, setIsOpen] = useState(false)

  const totalItems = getTotalItems()

  const handleMoveToCart = async (item: any) => {
    try {
      const sizeOrAge = item.selectedSize || item.selectedAge
      if (sizeOrAge && item.selectedColor) {
        // Use the complete product object stored in the wishlist item
        await addToCart(
          item.product,
          sizeOrAge,
          item.selectedColor,
          item.quantity
        )
        removeItem(item.productId, sizeOrAge, item.selectedColor)
        
        toast({
          title: "Added to cart",
          description: `${item.productName} has been moved to your cart.`,
        })
      }
    } catch (error) {
      console.error('Failed to move item to cart:', error)
      toast({
        title: "Error",
        description: "Failed to add item to cart. Please try again.",
        variant: "destructive",
      })
    }
  }

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button variant="outline" size="icon" className="relative bg-transparent">
          <Heart className="h-4 w-4" />
          {totalItems > 0 && (
            <Badge className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 text-xs bg-red-500 text-white">
              {totalItems}
            </Badge>
          )}
        </Button>
      </SheetTrigger>
      <SheetContent className="flex flex-col w-full sm:max-w-lg">
        <SheetHeader>
          <SheetTitle>My Wishlist ({totalItems})</SheetTitle>
          <SheetDescription>Your favorite items</SheetDescription>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto py-4">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <Heart className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">Your wishlist is empty</h3>
              <p className="text-muted-foreground mb-4">Add some items to your wishlist!</p>
              <Button onClick={() => setIsOpen(false)}>Continue Shopping</Button>
            </div>
          ) : (
            <div className="space-y-4">
              {items.map((item, index) => (
                <div key={item.id} className="space-y-3">
                  <div className="flex gap-3">
                    <div className="relative w-16 h-16 rounded-md overflow-hidden flex-shrink-0">
                      <Image
                        src={item.productImages[0] || "/placeholder.svg"}
                        alt={item.productName}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between">
                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium text-sm line-clamp-2">{item.productName}</h4>
                          <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
                            {item.selectedSize && (
                              <Badge variant="outline" className="text-xs px-1 py-0">
                                {item.selectedSize}
                              </Badge>
                            )}
                            {item.selectedAge && (
                              <Badge variant="outline" className="text-xs px-1 py-0">
                                {item.selectedAge} years
                              </Badge>
                            )}
                            {item.selectedColor && (
                              <Badge variant="outline" className="text-xs px-1 py-0">
                                {item.selectedColor}
                              </Badge>
                            )}
                          </div>
                          <div className="mt-2">
                            <span className="font-semibold text-sm">${item.productPrice.toFixed(2)} each</span>
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6 text-muted-foreground hover:text-destructive"
                          onClick={() => removeItem(item.productId, item.selectedSize || item.selectedAge, item.selectedColor)}
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-7 w-7 bg-transparent hover:bg-muted"
                        onClick={() => updateQuantity(item.productId, item.selectedSize || item.selectedAge, item.selectedColor, item.quantity - 1)}
                        disabled={item.quantity <= 1}
                      >
                        <Minus className="h-3 w-3" />
                      </Button>
                      <span className="text-sm font-medium min-w-[2rem] text-center">{item.quantity}</span>
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-7 w-7 bg-transparent hover:bg-muted"
                        onClick={() => updateQuantity(item.productId, item.selectedSize || item.selectedAge, item.selectedColor, item.quantity + 1)}
                      >
                        <Plus className="h-3 w-3" />
                      </Button>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-sm">${(item.productPrice * item.quantity).toFixed(2)}</span>
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-7 px-2 text-xs"
                        onClick={() => handleMoveToCart(item)}
                      >
                        <ShoppingCart className="h-3 w-3 mr-1" />
                        Add to Cart
                      </Button>
                    </div>
                  </div>
                  {index < items.length - 1 && <Separator />}
                </div>
              ))}
            </div>
          )}
        </div>

        {items.length > 0 && (
          <div className="border-t pt-4 space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-lg font-semibold">Total Items</span>
              <span className="text-lg font-bold">{totalItems}</span>
            </div>
            <div className="space-y-2">
              <Button
                variant="outline"
                className="w-full bg-transparent"
                onClick={clearWishlist}
              >
                Clear Wishlist
              </Button>
              <Link href="/" onClick={() => setIsOpen(false)}>
                <Button className="w-full">Continue Shopping</Button>
              </Link>
            </div>
          </div>
        )}
      </SheetContent>
    </Sheet>
  )
}
