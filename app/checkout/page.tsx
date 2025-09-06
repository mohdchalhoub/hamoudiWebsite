"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useCart } from "@/contexts/cart-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, CreditCard, Mail, MessageCircle } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { orderStorage } from "@/lib/local-storage"
import type { Order } from "@/lib/types"
import { EmailService } from "@/lib/email-service"
import { WhatsAppService } from "@/lib/whatsapp-service"
import { useToast } from "@/hooks/use-toast"

export default function CheckoutPage() {
  const { items, getTotalPrice, clearCart } = useCart()
  const router = useRouter()
  const { toast } = useToast()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    paymentMethod: "email" as "email" | "whatsapp",
  })

  const totalPrice = getTotalPrice()
  const shipping = totalPrice > 50 ? 0 : 9.99
  const tax = totalPrice * 0.08
  const finalTotal = totalPrice + shipping + tax

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto text-center">
          <h1 className="text-3xl font-bold mb-4">No items to checkout</h1>
          <p className="text-muted-foreground mb-8">Add some items to your cart first.</p>
          <Link href="/products">
            <Button size="lg">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Continue Shopping
            </Button>
          </Link>
        </div>
      </div>
    )
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      // Create order
      const order: Order = {
        id: `order-${Date.now()}`,
        items,
        total: finalTotal,
        customerInfo: formData,
        status: "pending",
        createdAt: new Date(),
      }

      // Save order
      orderStorage.add(order)

      let confirmationSent = false

      if (formData.paymentMethod === "email") {
        confirmationSent = await EmailService.sendOrderConfirmation(order)
        if (confirmationSent) {
          toast({
            title: "Order confirmed!",
            description: "Confirmation email sent to " + formData.email,
          })
        }
      } else {
        confirmationSent = await WhatsAppService.sendOrderConfirmation(order)
        if (confirmationSent) {
          toast({
            title: "Order confirmed!",
            description: "WhatsApp confirmation sent to " + formData.phone,
          })
        }
      }

      if (!confirmationSent) {
        toast({
          title: "Order placed",
          description: "Order saved but confirmation failed to send. We'll contact you soon.",
          variant: "destructive",
        })
      }

      // Clear cart
      clearCart()

      // Redirect to confirmation
      router.push(`/order-confirmation/${order.id}`)
    } catch (error) {
      console.error("[v0] Order submission error:", error)
      toast({
        title: "Error",
        description: "Failed to place order. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center gap-4 mb-8">
          <Link href="/cart">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <h1 className="text-3xl font-bold">Checkout</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Checkout Form */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Contact Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name">Full Name *</Label>
                    <Input
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                      placeholder="Enter your full name"
                    />
                  </div>
                  <div>
                    <Label htmlFor="phone">Phone Number *</Label>
                    <Input
                      id="phone"
                      name="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={handleInputChange}
                      required
                      placeholder="Enter your phone number"
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="email">Email Address *</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    placeholder="Enter your email address"
                  />
                </div>
                <div>
                  <Label htmlFor="address">Delivery Address *</Label>
                  <Textarea
                    id="address"
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    required
                    placeholder="Enter your complete delivery address"
                    rows={3}
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Order Confirmation Method</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, paymentMethod: "email" })}
                    className={`p-4 border-2 rounded-lg transition-colors ${
                      formData.paymentMethod === "email"
                        ? "border-primary bg-primary/10"
                        : "border-border hover:border-primary/50"
                    }`}
                  >
                    <Mail className="h-6 w-6 mx-auto mb-2" />
                    <div className="text-sm font-medium">Email Confirmation</div>
                    <div className="text-xs text-muted-foreground">Receive order details via email</div>
                  </button>
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, paymentMethod: "whatsapp" })}
                    className={`p-4 border-2 rounded-lg transition-colors ${
                      formData.paymentMethod === "whatsapp"
                        ? "border-primary bg-primary/10"
                        : "border-border hover:border-primary/50"
                    }`}
                  >
                    <MessageCircle className="h-6 w-6 mx-auto mb-2" />
                    <div className="text-sm font-medium">WhatsApp Confirmation</div>
                    <div className="text-xs text-muted-foreground">Receive order details via WhatsApp</div>
                  </button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Order Summary */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {items.map((item) => (
                  <div key={`${item.product.id}-${item.selectedSize}-${item.selectedColor}`} className="flex gap-3">
                    <div className="relative w-16 h-16 rounded-md overflow-hidden flex-shrink-0">
                      <Image
                        src={item.product.image_url || "/placeholder.svg"}
                        alt={item.product.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium text-sm">{item.product.name}</h4>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
                        <Badge variant="outline" className="text-xs px-1 py-0">
                          {item.selectedSize}
                        </Badge>
                        <Badge variant="outline" className="text-xs px-1 py-0">
                          {item.selectedColor}
                        </Badge>
                        <span>Qty: {item.quantity}</span>
                      </div>
                      <div className="text-sm font-semibold mt-1">
                        ${(item.product.price * item.quantity).toFixed(2)}
                      </div>
                    </div>
                  </div>
                ))}
                <Separator />
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Subtotal</span>
                    <span>${totalPrice.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Shipping</span>
                    <span>{shipping === 0 ? "FREE" : `$${shipping.toFixed(2)}`}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Tax</span>
                    <span>${tax.toFixed(2)}</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between text-lg font-bold">
                    <span>Total</span>
                    <span>${finalTotal.toFixed(2)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <form onSubmit={handleSubmit}>
              <Button
                type="submit"
                className="w-full"
                size="lg"
                disabled={isSubmitting || !formData.name || !formData.email || !formData.phone || !formData.address}
              >
                <CreditCard className="h-4 w-4 mr-2" />
                {isSubmitting ? "Processing..." : "Place Order"}
              </Button>
            </form>

            <p className="text-xs text-muted-foreground text-center">
              By placing your order, you agree to our terms and conditions. Payment will be collected upon delivery.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
