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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, CreditCard } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { orderStorage } from "@/lib/local-storage"
import type { Order, CartItem } from "@/lib/types"
import { WhatsAppService } from "@/lib/whatsapp-service"
import { useToast } from "@/hooks/use-toast"
import { formatProductCode } from "@/lib/utils"

// Country codes data
const countryCodes = [
  { code: "+961", country: "Lebanon", flag: "🇱🇧" },
  { code: "+1", country: "United States", flag: "🇺🇸" },
  { code: "+44", country: "United Kingdom", flag: "🇬🇧" },
  { code: "+33", country: "France", flag: "🇫🇷" },
  { code: "+49", country: "Germany", flag: "🇩🇪" },
  { code: "+39", country: "Italy", flag: "🇮🇹" },
  { code: "+34", country: "Spain", flag: "🇪🇸" },
  { code: "+31", country: "Netherlands", flag: "🇳🇱" },
  { code: "+32", country: "Belgium", flag: "🇧🇪" },
  { code: "+41", country: "Switzerland", flag: "🇨🇭" },
  { code: "+43", country: "Austria", flag: "🇦🇹" },
  { code: "+45", country: "Denmark", flag: "🇩🇰" },
  { code: "+46", country: "Sweden", flag: "🇸🇪" },
  { code: "+47", country: "Norway", flag: "🇳🇴" },
  { code: "+358", country: "Finland", flag: "🇫🇮" },
  { code: "+351", country: "Portugal", flag: "🇵🇹" },
  { code: "+30", country: "Greece", flag: "🇬🇷" },
  { code: "+90", country: "Turkey", flag: "🇹🇷" },
  { code: "+20", country: "Egypt", flag: "🇪🇬" },
  { code: "+966", country: "Saudi Arabia", flag: "🇸🇦" },
  { code: "+971", country: "UAE", flag: "🇦🇪" },
  { code: "+965", country: "Kuwait", flag: "🇰🇼" },
  { code: "+973", country: "Bahrain", flag: "🇧🇭" },
  { code: "+974", country: "Qatar", flag: "🇶🇦" },
  { code: "+968", country: "Oman", flag: "🇴🇲" },
  { code: "+962", country: "Jordan", flag: "🇯🇴" },
  { code: "+963", country: "Syria", flag: "🇸🇾" },
  { code: "+964", country: "Iraq", flag: "🇮🇶" },
  { code: "+93", country: "Afghanistan", flag: "🇦🇫" },
  { code: "+98", country: "Iran", flag: "🇮🇷" },
  { code: "+92", country: "Pakistan", flag: "🇵🇰" },
  { code: "+91", country: "India", flag: "🇮🇳" },
  { code: "+86", country: "China", flag: "🇨🇳" },
  { code: "+81", country: "Japan", flag: "🇯🇵" },
  { code: "+82", country: "South Korea", flag: "🇰🇷" },
  { code: "+65", country: "Singapore", flag: "🇸🇬" },
  { code: "+60", country: "Malaysia", flag: "🇲🇾" },
  { code: "+66", country: "Thailand", flag: "🇹🇭" },
  { code: "+63", country: "Philippines", flag: "🇵🇭" },
  { code: "+61", country: "Australia", flag: "🇦🇺" },
  { code: "+64", country: "New Zealand", flag: "🇳🇿" },
  { code: "+55", country: "Brazil", flag: "🇧🇷" },
  { code: "+54", country: "Argentina", flag: "🇦🇷" },
  { code: "+56", country: "Chile", flag: "🇨🇱" },
  { code: "+57", country: "Colombia", flag: "🇨🇴" },
  { code: "+52", country: "Mexico", flag: "🇲🇽" },
  { code: "+1", country: "Canada", flag: "🇨🇦" },
  { code: "+27", country: "South Africa", flag: "🇿🇦" },
  { code: "+234", country: "Nigeria", flag: "🇳🇬" },
  { code: "+254", country: "Kenya", flag: "🇰🇪" },
  { code: "+212", country: "Morocco", flag: "🇲🇦" },
  { code: "+213", country: "Algeria", flag: "🇩🇿" },
  { code: "+216", country: "Tunisia", flag: "🇹🇳" },
  { code: "+218", country: "Libya", flag: "🇱🇾" },
  { code: "+249", country: "Sudan", flag: "🇸🇩" },
  { code: "+251", country: "Ethiopia", flag: "🇪🇹" },
  { code: "+20", country: "Egypt", flag: "🇪🇬" },
]

export default function CheckoutPage() {
  const { items, getTotalPrice, clearCart } = useCart()
  const router = useRouter()
  const { toast } = useToast()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    countryCode: "+961",
    mobileNumber: "",
    address: "",
  })

  const totalPrice = getTotalPrice()
  const shipping = totalPrice > 50 ? 0 : 9.99
  const finalTotal = totalPrice + shipping

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

  const validateForm = (): string | null => {
    // Validate required fields
    if (!formData.name.trim()) return 'Name is required'
    if (!formData.mobileNumber.trim()) return 'Mobile number is required'
    if (!formData.address.trim()) return 'Delivery address is required'

    // Validate Lebanese mobile number format (8 digits starting with 70, 71, 76, 78, 79, 81, 83, 84, 85, 86, 87, 88, 89)
    const lebaneseMobileRegex = /^(7[016789]|8[1-9])\d{6}$/
    if (!lebaneseMobileRegex.test(formData.mobileNumber)) {
      return 'Please enter a valid Lebanese mobile number (8 digits starting with 70, 71, 76, 78, 79, 81, 83, 84, 85, 86, 87, 88, or 89)'
    }

    return null
  }

  const sanitizeInput = (input: string): string => {
    return input.trim().replace(/[<>]/g, '')
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Validate form
    const validationError = validateForm()
    if (validationError) {
      toast({
        title: "Validation Error",
        description: validationError,
        variant: "destructive"
      })
      return
    }

    setIsSubmitting(true)

    try {
      // Items are already in the correct CartItem format from local storage
      const transformedItems: CartItem[] = items.map(item => ({
        ...item,
        addedAt: item.addedAt || Date.now() // Ensure timestamp exists
      }))

      // Create order with sanitized customer info
      const order: Order = {
        id: `order-${Date.now()}`,
        items: transformedItems,
        total: finalTotal,
        customerInfo: {
          name: sanitizeInput(formData.name),
          phone: `${formData.countryCode}${sanitizeInput(formData.mobileNumber)}`,
          address: sanitizeInput(formData.address),
        },
        status: "pending",
        createdAt: new Date(),
      }

      // Save order
      orderStorage.add(order)

      // Send order details via WhatsApp
      const whatsappSent = await WhatsAppService.sendOrderConfirmation(order)

      if (whatsappSent) {
        toast({
          title: "Order confirmed!",
          description: "Order details sent to WhatsApp. You'll be redirected to WhatsApp shortly.",
        })
      } else {
        toast({
          title: "Order placed",
          description: "Order saved but WhatsApp failed to open. We'll contact you soon.",
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
    const { name, value } = e.target
    
    if (name === 'mobileNumber') {
      // Remove any non-digit characters
      let digitsOnly = value.replace(/\D/g, '')
      
      // Remove leading zero if present
      if (digitsOnly.startsWith('0')) {
        digitsOnly = digitsOnly.substring(1)
      }
      
      // Limit to 8 digits (Lebanese mobile format)
      digitsOnly = digitsOnly.slice(0, 8)
      
      setFormData({ ...formData, [name]: digitsOnly })
    } else {
      setFormData({ ...formData, [name]: value })
    }
  }

  const handleCountryCodeChange = (value: string) => {
    setFormData({ ...formData, countryCode: value })
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
                  <div className="space-y-2">
                    <Label>Phone Number *</Label>
                    <div className="flex gap-2">
                      <div className="w-32">
                        <Select value={formData.countryCode} onValueChange={handleCountryCodeChange}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent className="max-h-60">
                            {countryCodes.map((country) => (
                              <SelectItem key={country.code} value={country.code}>
                                <div className="flex items-center gap-2">
                                  <span>{country.flag}</span>
                                  <span>{country.code}</span>
                                </div>
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="flex-1">
                        <Input
                          id="mobileNumber"
                          name="mobileNumber"
                          type="tel"
                          value={formData.mobileNumber}
                          onChange={handleInputChange}
                          required
                          placeholder="70 123 456"
                        />
                      </div>
                    </div>
                  </div>
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

          </div>

          {/* Order Summary */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {items.map((item) => {
                  const sizeOrAge = item.selectedSize
                  const color = item.selectedColor
                  return (
                    <div key={`${item.productId}-${sizeOrAge}-${color}`} className="flex gap-3">
                      <div className="relative w-16 h-16 rounded-md overflow-hidden flex-shrink-0">
                        <Image
                          src={item.product.images?.[0] || "/placeholder.svg"}
                          alt={item.product.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium text-sm">{item.product.name}</h4>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
                          <Badge variant="outline" className="text-xs px-1 py-0">
                            {sizeOrAge}
                          </Badge>
                          <Badge variant="outline" className="text-xs px-1 py-0">
                            {color}
                          </Badge>
                          <span>Qty: {item.quantity}</span>
                        </div>
                        <div className="text-xs text-muted-foreground mt-1">
                          Code: {formatProductCode(item.productCode || item.product.product_code, item.variantCode)}
                        </div>
                        <div className="text-sm font-semibold mt-1">
                          ${(item.product.price * item.quantity).toFixed(2)}
                        </div>
                      </div>
                    </div>
                  )
                })}
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
                disabled={isSubmitting || !formData.name || !formData.mobileNumber || !formData.address}
              >
                <CreditCard className="h-4 w-4 mr-2" />
                {isSubmitting ? "Opening WhatsApp..." : "Place Order"}
              </Button>
            </form>

            <p className="text-xs text-muted-foreground text-center">
              By placing your order, you agree to our terms and conditions. You'll be redirected to WhatsApp to complete your order. Payment will be collected upon delivery.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
