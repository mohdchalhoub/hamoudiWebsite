"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { orderStorage } from "@/lib/local-storage"
import type { Order } from "@/lib/types"
import { Search, Eye, Download, Mail, MessageCircle } from "lucide-react"
import { EmailService } from "@/lib/email-service"
import { WhatsAppService } from "@/lib/whatsapp-service"
import { useToast } from "@/hooks/use-toast"
import Link from "next/link"

export default function AdminOrdersPage() {
  const { toast } = useToast()
  const [orders, setOrders] = useState<Order[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")

  useEffect(() => {
    const allOrders = orderStorage.get()
    setOrders(allOrders)
  }, [])

  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customerInfo.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customerInfo.email.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesStatus = statusFilter === "all" || order.status === statusFilter

    return matchesSearch && matchesStatus
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "secondary"
      case "confirmed":
        return "default"
      case "shipped":
        return "outline"
      case "delivered":
        return "outline"
      default:
        return "secondary"
    }
  }

  const handleBulkNotification = async (method: "email" | "whatsapp") => {
    const pendingOrders = filteredOrders.filter((order) => order.status === "pending")

    if (pendingOrders.length === 0) {
      toast({
        title: "No pending orders",
        description: "No pending orders to send notifications for.",
      })
      return
    }

    try {
      let successCount = 0

      for (const order of pendingOrders) {
        if (method === "email") {
          const sent = await EmailService.sendOrderUpdate(order, "confirmed")
          if (sent) successCount++
        } else {
          const sent = await WhatsAppService.sendOrderUpdate(order, "confirmed")
          if (sent) successCount++
        }
      }

      toast({
        title: "Bulk notifications sent",
        description: `${successCount} out of ${pendingOrders.length} notifications sent successfully via ${method}`,
      })
    } catch (error) {
      toast({
        title: "Error",
        description: `Failed to send bulk ${method} notifications`,
        variant: "destructive",
      })
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Orders</h1>
          <p className="text-muted-foreground">Manage customer orders and fulfillment</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => handleBulkNotification("email")}>
            <Mail className="h-4 w-4 mr-2" />
            Bulk Email
          </Button>
          <Button variant="outline" onClick={() => handleBulkNotification("whatsapp")}>
            <MessageCircle className="h-4 w-4 mr-2" />
            Bulk WhatsApp
          </Button>
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center space-x-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search orders by ID, customer name, or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="confirmed">Confirmed</SelectItem>
                <SelectItem value="shipped">Shipped</SelectItem>
                <SelectItem value="delivered">Delivered</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Orders List */}
      <Card>
        <CardHeader>
          <CardTitle>Orders ({filteredOrders.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {filteredOrders.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground">No orders found</p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredOrders.map((order) => (
                <div key={order.id} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <h3 className="font-semibold">{order.id}</h3>
                      <p className="text-sm text-muted-foreground">
                        {new Date(order.createdAt).toLocaleDateString()} at{" "}
                        {new Date(order.createdAt).toLocaleTimeString()}
                      </p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge variant={getStatusColor(order.status)}>{order.status}</Badge>
                      <Badge variant="outline" className="text-xs">
                        {order.customerInfo.paymentMethod === "email" ? (
                          <>
                            <Mail className="h-3 w-3 mr-1" />
                            Email
                          </>
                        ) : (
                          <>
                            <MessageCircle className="h-3 w-3 mr-1" />
                            WhatsApp
                          </>
                        )}
                      </Badge>
                      <Link href={`/admin/orders/${order.id}`}>
                        <Button variant="ghost" size="icon">
                          <Eye className="h-4 w-4" />
                        </Button>
                      </Link>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <h4 className="font-medium mb-1">Customer</h4>
                      <p className="text-sm text-muted-foreground">{order.customerInfo.name}</p>
                      <p className="text-sm text-muted-foreground">{order.customerInfo.email}</p>
                      <p className="text-sm text-muted-foreground">{order.customerInfo.phone}</p>
                    </div>
                    <div>
                      <h4 className="font-medium mb-1">Items</h4>
                      <p className="text-sm text-muted-foreground">
                        {order.items.length} item{order.items.length !== 1 ? "s" : ""}
                      </p>
                      <div className="text-sm text-muted-foreground">
                        {order.items.slice(0, 2).map((item, index) => (
                          <div key={index}>
                            {item.quantity}x {item.product.name}
                          </div>
                        ))}
                        {order.items.length > 2 && <div>+{order.items.length - 2} more items</div>}
                      </div>
                    </div>
                    <div>
                      <h4 className="font-medium mb-1">Total</h4>
                      <p className="text-lg font-bold">${order.total.toFixed(2)}</p>
                      <p className="text-sm text-muted-foreground">
                        {order.customerInfo.paymentMethod === "email" ? "Email" : "WhatsApp"} confirmation
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
