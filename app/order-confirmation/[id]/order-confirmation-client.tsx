"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Mail, MessageCircle } from "lucide-react"
import { orderStorage } from "@/lib/local-storage"
import type { Order } from "@/lib/types"

interface OrderConfirmationClientProps {
  orderId: string
}

export function OrderConfirmationClient({ orderId }: OrderConfirmationClientProps) {
  const [order, setOrder] = useState<Order | null>(null)

  useEffect(() => {
    const orders = orderStorage.get()
    const foundOrder = orders.find((o) => o.id === orderId)
    setOrder(foundOrder || null)
  }, [orderId])

  if (!order) {
    return (
      <div className="text-center">
        <p className="text-muted-foreground">Order not found.</p>
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
              <span className="text-muted-foreground">Order ID:</span>
              <div className="font-mono">{order.id}</div>
            </div>
            <div>
              <span className="text-muted-foreground">Status:</span>
              <div>
                <Badge variant="secondary" className="bg-secondary-100 text-secondary-800">
                  {order.status}
                </Badge>
              </div>
            </div>
            <div>
              <span className="text-muted-foreground">Order Date:</span>
              <div>{new Date(order.createdAt).toLocaleDateString()}</div>
            </div>
            <div>
              <span className="text-muted-foreground">Total:</span>
              <div className="font-bold">${order.total.toFixed(2)}</div>
            </div>
          </div>
          <Separator />
          <div>
            <h4 className="font-semibold mb-2">Customer Information</h4>
            <div className="space-y-1 text-sm">
              <div>{order.customerInfo.name}</div>
              <div>{order.customerInfo.email}</div>
              <div>{order.customerInfo.phone}</div>
              <div className="text-muted-foreground">{order.customerInfo.address}</div>
            </div>
          </div>
          <Separator />
          <div>
            <h4 className="font-semibold mb-2">Confirmation Method</h4>
            <div className="flex items-center gap-2">
              {order.customerInfo.paymentMethod === "email" ? (
                <>
                  <Mail className="h-4 w-4" />
                  <span className="text-sm">Email Confirmation</span>
                </>
              ) : (
                <>
                  <MessageCircle className="h-4 w-4" />
                  <span className="text-sm">WhatsApp Confirmation</span>
                </>
              )}
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
          {order.items.map((item) => (
            <div key={`${item.product.id}-${item.selectedSize}-${item.selectedColor}`} className="flex gap-3">
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
                    {item.selectedSize}
                  </Badge>
                  <Badge variant="outline" className="text-xs px-1 py-0">
                    {item.selectedColor}
                  </Badge>
                  <span>Qty: {item.quantity}</span>
                </div>
                <div className="text-sm font-semibold mt-1">${(item.product.price * item.quantity).toFixed(2)}</div>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  )
}
