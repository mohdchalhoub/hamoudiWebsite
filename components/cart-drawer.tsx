"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { useCart } from "@/contexts/cart-context"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { ShoppingCart, Plus, Minus, X } from "lucide-react"
import { Separator } from "@/components/ui/separator"

export function CartDrawer() {
  const { items, updateQuantity, removeItem, getTotalItems, getTotalPrice } = useCart()
  const [isOpen, setIsOpen] = useState(false)

  const totalItems = getTotalItems()
  const totalPrice = getTotalPrice()


  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button variant="outline" size="icon" className="relative bg-transparent">
          <ShoppingCart className="h-4 w-4" />
          {totalItems > 0 && (
            <Badge className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 text-xs">
              {totalItems}
            </Badge>
          )}
        </Button>
      </SheetTrigger>
      <SheetContent className="flex flex-col w-full sm:max-w-lg">
        <SheetHeader>
          <SheetTitle>Shopping Cart ({totalItems})</SheetTitle>
          <SheetDescription>Review your items before checkout</SheetDescription>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto py-4">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <ShoppingCart className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">Your cart is empty</h3>
              <p className="text-muted-foreground mb-4">Add some items to get started!</p>
              <Button onClick={() => setIsOpen(false)}>Continue Shopping</Button>
            </div>
          ) : (
            <div className="space-y-4">
              {items.map((item, index) => {
                const sizeOrAge = item.variant?.size || item.variant?.age_range || 'One Size'
                const color = item.variant?.color || 'Default'
                const unitPrice = (item.product?.price || 0) + (item.variant?.price_adjustment || 0)
                const totalPrice = unitPrice * item.quantity
                
                return (
                  <div key={`${item.product?.id}-${sizeOrAge}-${color}`} className="space-y-3">
                    <div className="flex gap-3">
                      <div className="relative w-16 h-16 rounded-md overflow-hidden flex-shrink-0">
                        <Image
                          src={item.product?.images?.[0] || "/placeholder.svg"}
                          alt={item.product?.name || 'Product'}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between">
                          <div className="flex-1 min-w-0">
                            <h4 className="font-medium text-sm line-clamp-2">{item.product?.name}</h4>
                            <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
                              <Badge variant="outline" className="text-xs px-1 py-0">
                                {item.variant?.size ? item.variant.size : 
                                 item.variant?.age_range ? `${item.variant.age_range} years` : 
                                 'One Size'}
                              </Badge>
                              <Badge variant="outline" className="text-xs px-1 py-0">
                                {item.variant?.color || 'Default'}
                              </Badge>
                            </div>
                            <div className="mt-2">
                              <span className="font-semibold text-sm">${unitPrice.toFixed(2)} each</span>
                            </div>
                          </div>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6 text-muted-foreground hover:text-destructive"
                            onClick={() => {
                              console.log('Remove item clicked:', {
                                productId: item.product?.id || '',
                                sizeOrAge,
                                color,
                                itemId: item.id
                              })
                              removeItem(item.product?.id || '', sizeOrAge, color)
                            }}
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
                          onClick={() => {
                            console.log('Decrement clicked:', {
                              productId: item.product?.id || '',
                              sizeOrAge,
                              color,
                              currentQuantity: item.quantity,
                              newQuantity: item.quantity - 1,
                              itemId: item.id
                            })
                            updateQuantity(item.product?.id || '', sizeOrAge, color, item.quantity - 1)
                          }}
                          disabled={item.quantity <= 1}
                        >
                          <Minus className="h-3 w-3" />
                        </Button>
                        <span className="text-sm font-medium min-w-[2rem] text-center">{item.quantity}</span>
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-7 w-7 bg-transparent hover:bg-muted"
                          onClick={() => {
                            console.log('Increment clicked:', {
                              productId: item.product?.id || '',
                              sizeOrAge,
                              color,
                              currentQuantity: item.quantity,
                              newQuantity: item.quantity + 1,
                              itemId: item.id
                            })
                            updateQuantity(item.product?.id || '', sizeOrAge, color, item.quantity + 1)
                          }}
                        >
                          <Plus className="h-3 w-3" />
                        </Button>
                      </div>
                      <span className="font-semibold text-sm">${totalPrice.toFixed(2)}</span>
                    </div>
                    {index < items.length - 1 && <Separator />}
                  </div>
                )
              })}
            </div>
          )}
        </div>

        {items.length > 0 && (
          <div className="border-t pt-4 space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between items-center text-sm">
                <span>Subtotal ({totalItems} items)</span>
                <span>${totalPrice.toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span>Shipping</span>
                <span>{totalPrice > 50 ? "FREE" : "$9.99"}</span>
              </div>
              {totalPrice > 50 && (
                <p className="text-xs text-green-600">🎉 Free shipping on orders over $50!</p>
              )}
              <Separator />
              <div className="flex justify-between items-center">
                <span className="text-lg font-semibold">Total</span>
                <span className="text-lg font-bold">${(totalPrice + (totalPrice > 50 ? 0 : 9.99)).toFixed(2)}</span>
              </div>
            </div>
            <div className="space-y-2">
              <Link href="/cart" onClick={() => setIsOpen(false)}>
                <Button variant="outline" className="w-full bg-transparent">
                  View Cart
                </Button>
              </Link>
              <Link href="/checkout" onClick={() => setIsOpen(false)}>
                <Button className="w-full">Checkout</Button>
              </Link>
            </div>
          </div>
        )}
      </SheetContent>
    </Sheet>
  )
}
