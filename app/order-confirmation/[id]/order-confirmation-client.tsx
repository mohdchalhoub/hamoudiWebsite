"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { MessageCircle, Loader2 } from "lucide-react"
import { formatProductCode } from "@/lib/utils"

interface OrderConfirmationClientProps {
  orderId: string
}

interface SupabaseOrder {
  id: string
  order_number: string
  status: string
  total_amount: number
  shipping_address: {
    name: string
    phone: string
    address: string
  }
  created_at: string
  order_items: Array<{
    id: string
    product_name: string
    product_sku: string | null
    variant_description: string | null
    quantity: number
    unit_price: number
    total_price: number
  }>
}

export function OrderConfirmationClient({ orderId }: OrderConfirmationClientProps) {
  const [order, setOrder] = useState<SupabaseOrder | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [productImages, setProductImages] = useState<Record<string, string>>({})
  const [storedItems, setStoredItems] = useState<any[]>([])
  const [storedTotal, setStoredTotal] = useState<number | null>(null)

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        // First, try to get stored items from localStorage
        const storedData = localStorage.getItem(`order_${orderId}`)
        if (storedData) {
          const parsed = JSON.parse(storedData)
          setStoredItems(parsed.items || [])
          setStoredTotal(parsed.total || null)
          // Clean up localStorage after use
          localStorage.removeItem(`order_${orderId}`)
        }

        const response = await fetch(`/api/orders?id=${orderId}`)
        
        if (!response.ok) {
          throw new Error('Order not found')
        }
        
        const data = await response.json()
        setOrder(data.order)
        
        // Fetch product images for items that have product IDs
        const productIds = [
          ...(data.order.order_items || []).map((item: any) => item.product_id),
          ...storedItems.map((item: any) => item.product?.id)
        ].filter((id: string | null) => id && id !== 'null' && id !== undefined)
        
        console.log('Product IDs for images:', productIds)
        console.log('Stored items:', storedItems)
        
        if (productIds.length > 0) {
          try {
            const imagesResponse = await fetch('/api/products/images', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ productIds })
            })
            
            if (imagesResponse.ok) {
              const imagesData = await imagesResponse.json()
              console.log('Fetched images:', imagesData.images)
              setProductImages(imagesData.images || {})
            } else {
              console.log('Images API failed:', imagesResponse.status)
            }
          } catch (imageError) {
            // Ignore image fetch errors - we'll use placeholders
            console.log('Could not fetch product images:', imageError)
          }
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load order')
      } finally {
        setLoading(false)
      }
    }

    fetchOrder()
  }, [orderId])

  if (loading) {
    return (
      <div className="text-center py-8">
        <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
        <p className="text-muted-foreground">Loading order details...</p>
      </div>
    )
  }

  if (error || !order) {
    return (
      <div className="text-center py-8">
        <p className="text-destructive">{error || "Order not found."}</p>
        <p className="text-muted-foreground mt-2">Please check your order ID and try again.</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* Order Details */}
      <Card>
        <CardHeader>
          <CardTitle>Order Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-muted-foreground">Order Number:</span>
              <div className="font-mono">{order.order_number}</div>
            </div>
            <div>
              <span className="text-muted-foreground">Status:</span>
              <div>
                <Badge variant="secondary" className="bg-secondary-100 text-secondary-800">
                  {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                </Badge>
              </div>
            </div>
            <div>
              <span className="text-muted-foreground">Order Date:</span>
              <div>{new Date(order.created_at).toLocaleDateString()}</div>
            </div>
            <div>
              <span className="text-muted-foreground">Total:</span>
              <div className="font-bold">
                ${storedTotal !== null 
                  ? storedTotal.toFixed(2)
                  : (storedItems.length > 0 
                    ? storedItems.reduce((sum, item) => sum + (item.product?.price * item.quantity || 0), 0).toFixed(2)
                    : order.total_amount.toFixed(2)
                  )
                }
              </div>
            </div>
          </div>
          <Separator />
          <div>
            <h4 className="font-semibold mb-2">Customer Information</h4>
            <div className="space-y-1 text-sm">
              <div>{order.shipping_address.name}</div>
              <div>{order.shipping_address.phone}</div>
              <div className="text-muted-foreground">{order.shipping_address.address}</div>
            </div>
          </div>
          <Separator />
          <div>
            <h4 className="font-semibold mb-2">Confirmation Method</h4>
            <div className="flex items-center gap-2">
              <MessageCircle className="h-4 w-4" />
              <span className="text-sm">WhatsApp Confirmation</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Order Items */}
      <Card>
        <CardHeader>
          <CardTitle>Items Ordered</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {(storedItems.length > 0 || (order.order_items && order.order_items.length > 0)) ? (
            (storedItems.length > 0 ? storedItems : order.order_items).map((item, index) => {
            const productId = item.product_id || item.product?.id
            const productName = item.product?.name || item.product_name
            let productImage = productId ? productImages[productId] : null
            
            // If no image from API, try to use the product's images directly
            if (!productImage && item.product?.images && item.product.images.length > 0) {
              productImage = item.product.images[0]
            }
            
            // If still no image, try to construct a path from the product name
            if (!productImage && productName) {
              // Try common image paths
              const possiblePaths = [
                `/products/${productName.toLowerCase().replace(/\s+/g, '-')}.jpg`,
                `/products/${productName.toLowerCase().replace(/\s+/g, '-')}.png`,
                `/products/${productName.toLowerCase().replace(/\s+/g, '-')}.webp`,
                `/boys-${productName.toLowerCase().replace(/\s+/g, '-')}.png`,
                `/girls-${productName.toLowerCase().replace(/\s+/g, '-')}.png`
              ]
              productImage = possiblePaths[0] // Use first possible path as fallback
            }
            
            console.log(`Item ${index}:`, {
              productId,
              productImage,
              productName,
              hasImages: !!item.product?.images,
              images: item.product?.images
            })
            const selectedSize = item.selectedSize || (item.variant_description?.split(', ')[0])
            const selectedColor = item.selectedColor || (item.variant_description?.split(', ')[1])
            const quantity = item.quantity
            const unitPrice = item.product?.price || item.unit_price
            const totalPrice = item.product?.price * item.quantity || item.total_price
            const productCode = item.productCode || item.product_sku || 'N/A'
            
            return (
              <div key={item.id || index} className="flex gap-3">
                <div className="relative w-16 h-16 rounded-md overflow-hidden flex-shrink-0 border">
                  {productImage && productImage !== 'null' && productImage !== '' ? (
                    <Image
                      src={productImage}
                      alt={productName}
                      fill
                      className="object-cover"
                      sizes="64px"
                      onError={(e) => {
                        // If image fails to load, we'll keep the placeholder
                        console.log('Failed to load image for:', productName, 'URL:', productImage)
                        console.log('Image error:', e)
                      }}
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center">
                      <div className="text-center">
                        <div className="text-lg font-bold text-blue-600">
                          {productName.charAt(0).toUpperCase()}
                        </div>
                        <div className="text-xs text-blue-500 font-medium">
                          {quantity}x
                        </div>
                      </div>
                    </div>
                  )}
                </div>
                <div className="flex-1">
                  <h4 className="font-medium text-sm">{productName}</h4>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
                    {selectedSize && (
                      <Badge variant="outline" className="text-xs px-1 py-0">
                        {selectedSize}
                      </Badge>
                    )}
                    {selectedColor && (
                      <Badge variant="outline" className="text-xs px-1 py-0">
                        {selectedColor}
                      </Badge>
                    )}
                    <span>Qty: {quantity}</span>
                  </div>
                  <div className="text-xs text-muted-foreground mt-1">
                    Code: {productCode}
                  </div>
                  <div className="text-sm font-semibold mt-1">${totalPrice.toFixed(2)}</div>
                </div>
              </div>
            )
          })
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <p>Order items not available.</p>
              <p className="text-sm mt-2">This order was placed successfully via WhatsApp.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
