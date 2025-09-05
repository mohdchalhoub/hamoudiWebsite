import { notFound } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { AdminOrderActions } from "@/components/admin-order-actions"
import { ArrowLeft, User, MapPin, Phone, Mail } from "lucide-react"

// Mock order data - in a real app, this would fetch from database
const mockOrder = {
  id: "order-1234567890",
  items: [
    {
      product: {
        id: "1",
        name: "Space Explorer T-Shirt",
        price: 25.99,
        images: ["/boys-space-explorer-t-shirt.png"],
      },
      quantity: 2,
      selectedSize: "M",
      selectedColor: "Navy Blue",
    },
  ],
  total: 59.97,
  customerInfo: {
    name: "John Smith",
    email: "john@example.com",
    phone: "+1 (555) 123-4567",
    address: "123 Main St, Anytown, ST 12345",
    paymentMethod: "email" as const,
  },
  status: "pending" as const,
  createdAt: new Date("2024-01-15T10:30:00Z"),
}

interface OrderDetailPageProps {
  params: {
    id: string
  }
}

export default function OrderDetailPage({ params }: OrderDetailPageProps) {
  // In a real app, fetch order by ID
  const order = mockOrder

  if (!order) {
    notFound()
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/admin/orders">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold">Order Details</h1>
          <p className="text-muted-foreground">{order.id}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Order Information */}
        <div className="lg:col-span-2 space-y-6">
          {/* Order Items */}
          <Card>
            <CardHeader>
              <CardTitle>Order Items</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {order.items.map((item, index) => (
                <div key={index} className="flex gap-4 p-4 border rounded-lg">
                  <div className="relative w-20 h-20 rounded-md overflow-hidden flex-shrink-0">
                    <Image
                      src={item.product.images[0] || "/placeholder.svg"}
                      alt={item.product.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold">{item.product.name}</h4>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                      <Badge variant="outline">{item.selectedSize}</Badge>
                      <Badge variant="outline">{item.selectedColor}</Badge>
                      <span>Qty: {item.quantity}</span>
                    </div>
                    <div className="text-lg font-bold mt-2">${(item.product.price * item.quantity).toFixed(2)}</div>
                  </div>
                </div>
              ))}
              <Separator />
              <div className="flex justify-between items-center text-lg font-bold">
                <span>Total</span>
                <span>${order.total.toFixed(2)}</span>
              </div>
            </CardContent>
          </Card>

          {/* Customer Information */}
          <Card>
            <CardHeader>
              <CardTitle>Customer Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center gap-3">
                  <User className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="font-medium">{order.customerInfo.name}</p>
                    <p className="text-sm text-muted-foreground">Customer Name</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Mail className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="font-medium">{order.customerInfo.email}</p>
                    <p className="text-sm text-muted-foreground">Email Address</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Phone className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="font-medium">{order.customerInfo.phone}</p>
                    <p className="text-sm text-muted-foreground">Phone Number</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <MapPin className="h-5 w-5 text-muted-foreground mt-1" />
                  <div>
                    <p className="font-medium">{order.customerInfo.address}</p>
                    <p className="text-sm text-muted-foreground">Delivery Address</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Order Actions */}
        <div className="space-y-6">
          {/* Order Status */}
          <Card>
            <CardHeader>
              <CardTitle>Order Status</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <Badge
                  variant={
                    order.status === "pending" ? "secondary" : order.status === "confirmed" ? "default" : "outline"
                  }
                  className="text-sm px-3 py-1"
                >
                  {order.status.toUpperCase()}
                </Badge>
                <div className="text-sm text-muted-foreground">
                  <p>Created: {new Date(order.createdAt).toLocaleDateString()}</p>
                  <p>Time: {new Date(order.createdAt).toLocaleTimeString()}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Admin Actions */}
          <AdminOrderActions order={order} />
        </div>
      </div>
    </div>
  )
}
