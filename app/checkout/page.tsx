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
import { ArrowLeft, MessageCircle } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import type { CartItem } from "@/lib/types"
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
  const finalTotal = totalPrice
  
  // Calculate total from valid items only
  const validItems = items.filter(item => 
    item.product && 
    item.product.id && 
    item.product.name && 
    item.selectedSize && 
    item.selectedColor && 
    item.quantity > 0 && 
    item.product.price > 0
  )
  const validTotal = validItems.reduce((sum, item) => sum + (item.product.price * item.quantity), 0)
  const validFinalTotal = validTotal

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

    // Validate cart items
    if (items.length === 0) return 'No items in cart'
    
    for (const item of items) {
      if (!item.product) return 'Invalid product data in cart'
      if (!item.product.id || !item.product.name) return 'Missing product information'
      if (!item.selectedSize || !item.selectedColor) return 'Missing size or color selection'
      if (!item.quantity || item.quantity <= 0) return 'Invalid quantity'
      if (!item.product.price || item.product.price <= 0) return 'Invalid product price'
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

    // For iPhone: Open WhatsApp immediately (user-triggered action)
    const isIPhone = /iPhone/.test(navigator.userAgent)
    let whatsappWindow = null
    
    if (isIPhone) {
      // Generate the same detailed message as Android/Desktop
      const itemsList = validItems.map((item) => {
        const productName = item.product.name
        const selectedSize = item.selectedSize
        const selectedColor = item.selectedColor
        const quantity = item.quantity
        const unitPrice = item.product.price
        const lineTotal = unitPrice * quantity
        
        // Get product codes
        const productCode = item.productCode || item.product.product_code || 'N/A'
        const variantCode = item.variantCode || 'N/A'
        const fullCode = `${productCode}-${variantCode}`
        
        return `• ${quantity}x [${fullCode}] ${productName} (${selectedSize}, ${selectedColor}) - Unit: $${unitPrice.toFixed(2)} - Total: $${lineTotal.toFixed(2)}`
      }).join("\n")

      const orderMessage = `🛍️ *NEW ORDER - KidsCorner*

📋 *Order Reference:* ${Date.now()}
📅 *Date:* ${new Date().toLocaleDateString()}

👤 *Customer Details:*
Name: ${formData.name}
Phone: ${formData.countryCode}${formData.mobileNumber}
Address: ${formData.address}

🛒 *Order Items:*
${itemsList}

💰 *Order Summary:*
Subtotal: $${validFinalTotal.toFixed(2)}
Total: $${validFinalTotal.toFixed(2)}

Please process this order and contact the customer for delivery arrangements.

*KidsCorner Order Management* 👶👧👦`

      const encodedMessage = encodeURIComponent(orderMessage)
      const ownerPhone = '96171567228'
      const whatsappUrl = `https://wa.me/${ownerPhone}?text=${encodedMessage}`
      
      // Open WhatsApp immediately while we have user action context
      window.location.href = whatsappUrl
      
      // Return early to avoid API call since user is being redirected
      setIsSubmitting(false)
      return
    }

    try {
      // Prepare order data with validation
      const validItems = items.filter(item => 
        item.product && 
        item.product.id && 
        item.product.name && 
        item.selectedSize && 
        item.selectedColor && 
        item.quantity > 0 && 
        item.product.price > 0
      )
      
      if (validItems.length === 0) {
        throw new Error('No valid items in cart')
      }
      
      const orderData = {
        customerInfo: {
          name: sanitizeInput(formData.name),
          phone: `${formData.countryCode}${sanitizeInput(formData.mobileNumber)}`,
          address: sanitizeInput(formData.address),
        },
        items: validItems,
        total: validFinalTotal
      }
      
      console.log('Sending order data:', orderData)
      console.log('Cart items details:', items.map(item => ({
        productId: item.product?.id,
        productName: item.product?.name,
        quantity: item.quantity,
        selectedSize: item.selectedSize,
        selectedColor: item.selectedColor,
        price: item.product?.price,
        hasProduct: !!item.product
      })))
      
      // Create order via API
      const orderResponse = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(orderData)
      })

      if (!orderResponse.ok) {
        const errorData = await orderResponse.json()
        console.error('Order creation failed:', errorData)
        throw new Error(errorData.error || 'Failed to create order')
      }

      const { order: createdOrder } = await orderResponse.json()

      // Send WhatsApp order confirmation
      const whatsappOrder = {
        id: createdOrder.orderNumber,
        items: validItems,
        total: createdOrder.total,
        customerInfo: {
          name: sanitizeInput(formData.name),
          phone: `${formData.countryCode}${sanitizeInput(formData.mobileNumber)}`,
          address: sanitizeInput(formData.address),
        },
        status: createdOrder.status,
        createdAt: new Date(createdOrder.createdAt)
      }

      // Try to open WhatsApp (this will always return true now)
      const whatsappSent = await WhatsAppService.sendOrderConfirmation(whatsappOrder)

      // Calculate correct total from valid items
      const correctTotal = validItems.reduce((sum, item) => sum + (item.product.price * item.quantity), 0)
      
      // Store order items temporarily for confirmation page
      localStorage.setItem(`order_${createdOrder.id}`, JSON.stringify({
        items: validItems,
        total: correctTotal,
        orderNumber: createdOrder.orderNumber
      }))

      // Clear cart
      clearCart()

      // Show success message
      toast({
        title: "Order confirmed!",
        description: "Your order has been placed successfully. WhatsApp should open in a new tab.",
      })

      // Redirect to confirmation page (this will show regardless of WhatsApp success)
      router.push(`/order-confirmation/${createdOrder.id}`)
    } catch (error) {
      console.error("Order submission error:", error)
      console.error("Error details:", {
        message: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : undefined,
        cartItems: items.length,
        formData: formData
      })
      
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to place order. Please try again.",
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
                <MessageCircle className="h-4 w-4 mr-2" />
                {isSubmitting ? "Opening WhatsApp..." : "Place Order via WhatsApp"}
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
