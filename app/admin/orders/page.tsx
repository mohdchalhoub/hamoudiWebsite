"use client"

import { useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog"
import { Textarea } from "@/components/ui/textarea"
import { Search, Eye, Download, MessageCircle, Loader2, Edit, Trash2, Plus, Minus, Save, X } from "lucide-react"
import { WhatsAppService } from "@/lib/whatsapp-service"
import { useToast } from "@/hooks/use-toast"
import Link from "next/link"

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
    quantity: number
    unit_price: number
    total_price: number
  }>
}

// Status Badge Component
function StatusBadge({ status, orderId, onStatusChange }: {
  status: string
  orderId: string
  onStatusChange: (orderId: string, newStatus: string) => void
}) {
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

  return (
    <Select value={status} onValueChange={(newStatus) => onStatusChange(orderId, newStatus)}>
      <SelectTrigger className="w-[130px]">
        <SelectValue>
          <Badge variant={getStatusColor(status) as any}>
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </Badge>
        </SelectValue>
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="pending">Pending</SelectItem>
        <SelectItem value="confirmed">Confirmed</SelectItem>
        <SelectItem value="processing">Processing</SelectItem>
        <SelectItem value="shipped">Shipped</SelectItem>
        <SelectItem value="delivered">Delivered</SelectItem>
        <SelectItem value="cancelled">Cancelled</SelectItem>
      </SelectContent>
    </Select>
  )
}

// View Order Modal Component
function ViewOrderModal({ order, isOpen, onClose }: {
  order: SupabaseOrder | null
  isOpen: boolean
  onClose: () => void
}) {
  const [productImages, setProductImages] = useState<Record<string, string>>({})

  // Fetch product images when order changes
  useEffect(() => {
    if (order && isOpen) {
      const productIds = order.order_items
        .map(item => item.product_id)
        .filter((id): id is string => id !== null && id !== undefined)
      
      if (productIds.length > 0) {
        fetch('/api/products/images', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ productIds })
        })
        .then(response => response.ok ? response.json() : {})
        .then(data => setProductImages(data.images || {}))
        .catch(() => {}) // Ignore errors, use placeholders
      }
    }
  }, [order, isOpen])

  if (!order) return null

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Order Details - {order.order_number}</DialogTitle>
        </DialogHeader>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Customer Information */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Customer Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <span className="font-medium">Name:</span>
                <p className="text-muted-foreground">{order.shipping_address.name}</p>
              </div>
              <div>
                <span className="font-medium">Phone:</span>
                <p className="text-muted-foreground">{order.shipping_address.phone}</p>
              </div>
              <div>
                <span className="font-medium">Address:</span>
                <p className="text-muted-foreground">{order.shipping_address.address}</p>
              </div>
            </CardContent>
          </Card>

          {/* Order Information */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Order Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <span className="font-medium">Status:</span>
                <Badge variant="secondary" className="ml-2">
                  {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                </Badge>
              </div>
              <div>
                <span className="font-medium">Total:</span>
                <p className="text-lg font-bold">${order.total_amount.toFixed(2)}</p>
              </div>
              <div>
                <span className="font-medium">Created:</span>
                <p className="text-muted-foreground">
                  {new Date(order.created_at).toLocaleString()}
                </p>
              </div>
              {order.notes && (
                <div>
                  <span className="font-medium">Notes:</span>
                  <p className="text-muted-foreground">{order.notes}</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Order Items */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Order Items</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {order.order_items.map((item, index) => {
                const productImage = item.product_id ? productImages[item.product_id] : null
                
                return (
                  <div key={index} className="flex gap-3 p-3 border rounded-lg">
                    <div className="relative w-12 h-12 rounded-md overflow-hidden flex-shrink-0 border">
                      {productImage ? (
                        <Image
                          src={productImage}
                          alt={item.product_name}
                          fill
                          className="object-cover"
                          sizes="48px"
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center">
                          <div className="text-sm font-bold text-blue-600">
                            {item.product_name.charAt(0).toUpperCase()}
                          </div>
                        </div>
                      )}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium">{item.product_name}</h4>
                      <p className="text-sm text-muted-foreground">
                        {item.product_sku && `Code: ${item.product_sku}`}
                        {item.variant_description && ` • ${item.variant_description}`}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">
                        {item.quantity}x ${item.unit_price.toFixed(2)}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Total: ${item.total_price.toFixed(2)}
                      </p>
                    </div>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>
      </DialogContent>
    </Dialog>
  )
}

// Edit Order Modal Component
function EditOrderModal({ order, isOpen, onClose, onSave, isUpdating }: {
  order: SupabaseOrder | null
  isOpen: boolean
  onClose: () => void
  onSave: (order: SupabaseOrder) => void
  isUpdating: boolean
}) {
  const [editedOrder, setEditedOrder] = useState<SupabaseOrder | null>(null)

  useEffect(() => {
    if (order) {
      setEditedOrder(JSON.parse(JSON.stringify(order))) // Deep copy
    }
  }, [order])

  if (!editedOrder) return null

  const updateCustomerInfo = (field: string, value: string) => {
    setEditedOrder({
      ...editedOrder,
      shipping_address: {
        ...editedOrder.shipping_address,
        [field]: value
      }
    })
  }

  const updateItemQuantity = (index: number, newQuantity: number) => {
    const updatedItems = [...editedOrder.order_items]
    updatedItems[index] = {
      ...updatedItems[index],
      quantity: Math.max(1, newQuantity),
      total_price: updatedItems[index].unit_price * Math.max(1, newQuantity)
    }
    
    const newTotal = updatedItems.reduce((sum, item) => sum + item.total_price, 0)
    
    setEditedOrder({
      ...editedOrder,
      order_items: updatedItems,
      total_amount: newTotal
    })
  }

  const removeItem = (index: number) => {
    const updatedItems = editedOrder.order_items.filter((_, i) => i !== index)
    const newTotal = updatedItems.reduce((sum, item) => sum + item.total_price, 0)
    
    setEditedOrder({
      ...editedOrder,
      order_items: updatedItems,
      total_amount: newTotal
    })
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Order - {editedOrder.order_number}</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Customer Information */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Customer Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium">Name</label>
                <Input
                  value={editedOrder.shipping_address.name}
                  onChange={(e) => updateCustomerInfo('name', e.target.value)}
                />
              </div>
              <div>
                <label className="text-sm font-medium">Phone</label>
                <Input
                  value={editedOrder.shipping_address.phone}
                  onChange={(e) => updateCustomerInfo('phone', e.target.value)}
                />
              </div>
              <div>
                <label className="text-sm font-medium">Address</label>
                <Textarea
                  value={editedOrder.shipping_address.address}
                  onChange={(e) => updateCustomerInfo('address', e.target.value)}
                />
              </div>
            </CardContent>
          </Card>

          {/* Order Items */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Order Items</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {editedOrder.order_items.map((item, index) => (
                  <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex-1">
                      <h4 className="font-medium">{item.product_name}</h4>
                      <p className="text-sm text-muted-foreground">
                        {item.product_sku && `Code: ${item.product_sku}`}
                        {item.variant_description && ` • ${item.variant_description}`}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => updateItemQuantity(index, item.quantity - 1)}
                        disabled={item.quantity <= 1}
                      >
                        <Minus className="h-4 w-4" />
                      </Button>
                      <span className="w-8 text-center">{item.quantity}</span>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => updateItemQuantity(index, item.quantity + 1)}
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                      <span className="w-20 text-right">${item.total_price.toFixed(2)}</span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeItem(index)}
                        className="text-destructive hover:text-destructive"
                        disabled={editedOrder.order_items.length <= 1}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-4 pt-4 border-t">
                <div className="flex justify-between text-lg font-bold">
                  <span>Total:</span>
                  <span>${editedOrder.total_amount.toFixed(2)}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Notes */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Notes</CardTitle>
            </CardHeader>
            <CardContent>
              <Textarea
                value={editedOrder.notes || ''}
                onChange={(e) => setEditedOrder({ ...editedOrder, notes: e.target.value })}
                placeholder="Add any notes about this order..."
              />
            </CardContent>
          </Card>

          {/* Actions */}
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={onClose} disabled={isUpdating}>
              Cancel
            </Button>
            <Button onClick={() => onSave(editedOrder)} disabled={isUpdating}>
              {isUpdating ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  Save Changes
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default function AdminOrdersPage() {
  const { toast } = useToast()
  const searchParams = useSearchParams()
  const [orders, setOrders] = useState<SupabaseOrder[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [loading, setLoading] = useState(true)
  
  // Customer filtering from URL params
  const customerFilter = searchParams.get('customer')
  const phoneFilter = searchParams.get('phone')
  const [viewingOrder, setViewingOrder] = useState<SupabaseOrder | null>(null)
  const [editingOrder, setEditingOrder] = useState<SupabaseOrder | null>(null)
  const [deletingOrder, setDeletingOrder] = useState<SupabaseOrder | null>(null)
  const [isUpdating, setIsUpdating] = useState(false)

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await fetch('/api/orders')
        if (response.ok) {
          const data = await response.json()
          setOrders(data.orders || [])
        } else {
          throw new Error('Failed to fetch orders')
        }
      } catch (error) {
        console.error('Error fetching orders:', error)
        toast({
          title: "Error",
          description: "Failed to load orders. Please try again.",
          variant: "destructive"
        })
      } finally {
        setLoading(false)
      }
    }
    
    fetchOrders()
  }, [])

  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      order.order_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.shipping_address.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.shipping_address.phone.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesStatus = statusFilter === "all" || order.status === statusFilter
    
    // Customer filtering from URL params
    const matchesCustomer = !customerFilter || 
      order.shipping_address.name.toLowerCase() === customerFilter.toLowerCase()
    
    const matchesPhone = !phoneFilter || 
      order.shipping_address.phone === phoneFilter

    return matchesSearch && matchesStatus && matchesCustomer && matchesPhone
  })

  const handleBulkNotification = async (method: "whatsapp") => {
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
        // Convert Supabase order to format expected by WhatsApp service
        const whatsappOrder = {
          id: order.order_number,
          items: order.order_items.map(item => ({
            product: { name: item.product_name },
            quantity: item.quantity,
            selectedSize: '',
            selectedColor: '',
            productCode: '',
            variantCode: ''
          })),
          total: order.total_amount,
          customerInfo: {
            name: order.shipping_address.name,
            phone: order.shipping_address.phone,
            address: order.shipping_address.address,
          },
          status: order.status,
          createdAt: new Date(order.created_at)
        }
        
        const sent = await WhatsAppService.sendOrderUpdate(whatsappOrder, "confirmed")
        if (sent) successCount++
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

  const handleStatusChange = async (orderId: string, newStatus: string) => {
    setIsUpdating(true)
    try {
      const response = await fetch(`/api/orders/${orderId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
      })

      if (response.ok) {
        // Update the orders list
        setOrders(orders.map(order => 
          order.id === orderId 
            ? { ...order, status: newStatus as any }
            : order
        ))
        toast({
          title: "Success",
          description: "Order status updated successfully",
        })
      } else {
        throw new Error('Failed to update status')
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update order status",
        variant: "destructive",
      })
    } finally {
      setIsUpdating(false)
    }
  }

  const handleDeleteOrder = async (orderId: string) => {
    setIsUpdating(true)
    try {
      const response = await fetch(`/api/orders/${orderId}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        // Remove from orders list
        setOrders(orders.filter(order => order.id !== orderId))
        setDeletingOrder(null)
        toast({
          title: "Success",
          description: "Order deleted successfully",
        })
      } else {
        throw new Error('Failed to delete order')
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete order",
        variant: "destructive",
      })
    } finally {
      setIsUpdating(false)
    }
  }

  const handleEditOrder = async (updatedOrder: SupabaseOrder) => {
    setIsUpdating(true)
    try {
      const response = await fetch(`/api/orders/${updatedOrder.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          shipping_address: updatedOrder.shipping_address,
          notes: updatedOrder.notes,
          total_amount: updatedOrder.total_amount,
          order_items: updatedOrder.order_items
        }),
      })

      if (response.ok) {
        const { order } = await response.json()
        // Update the orders list
        setOrders(orders.map(o => o.id === order.id ? order : o))
        setEditingOrder(null)
        toast({
          title: "Success",
          description: "Order updated successfully",
        })
      } else {
        throw new Error('Failed to update order')
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update order",
        variant: "destructive",
      })
    } finally {
      setIsUpdating(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Orders</h1>
          <div className="flex items-center gap-2">
            <p className="text-muted-foreground">Manage customer orders and fulfillment</p>
            {(customerFilter || phoneFilter) && (
              <div className="flex items-center gap-2">
                <Badge variant="secondary" className="text-xs">
                  Filtered by: {customerFilter} {phoneFilter && `(${phoneFilter})`}
                </Badge>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => window.history.pushState({}, '', '/admin/orders')}
                  className="h-6 w-6 p-0"
                >
                  <X className="h-3 w-3" />
                </Button>
              </div>
            )}
          </div>
        </div>
        <div className="flex gap-2">
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
                placeholder="Search orders by number, customer name, or phone..."
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
          {loading ? (
            <div className="text-center py-8">
              <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
              <p className="text-muted-foreground">Loading orders...</p>
            </div>
          ) : filteredOrders.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground">
                {searchTerm || statusFilter !== "all" 
                  ? "No orders match your search criteria" 
                  : "No orders found"}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-3 font-semibold">Order ID</th>
                    <th className="text-left p-3 font-semibold">Customer</th>
                    <th className="text-left p-3 font-semibold">Phone</th>
                    <th className="text-left p-3 font-semibold">Total</th>
                    <th className="text-left p-3 font-semibold">Status</th>
                    <th className="text-left p-3 font-semibold">Date</th>
                    <th className="text-left p-3 font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredOrders.map((order) => (
                    <tr key={order.id} className="border-b hover:bg-muted/50">
                      <td className="p-3">
                        <div className="font-mono text-sm">{order.order_number}</div>
                      </td>
                      <td className="p-3">
                        <div className="font-medium">{order.shipping_address.name}</div>
                        <div className="text-sm text-muted-foreground truncate max-w-[200px]">
                          {order.shipping_address.address}
                        </div>
                      </td>
                      <td className="p-3">
                        <div className="text-sm">{order.shipping_address.phone}</div>
                      </td>
                      <td className="p-3">
                        <div className="font-semibold">${order.total_amount.toFixed(2)}</div>
                        <div className="text-xs text-muted-foreground">
                          {order.order_items.length} item{order.order_items.length !== 1 ? "s" : ""}
                        </div>
                      </td>
                      <td className="p-3">
                        <StatusBadge 
                          status={order.status} 
                          orderId={order.id}
                          onStatusChange={handleStatusChange}
                        />
                      </td>
                      <td className="p-3">
                        <div className="text-sm">
                          {new Date(order.created_at).toLocaleDateString()}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {new Date(order.created_at).toLocaleTimeString()}
                        </div>
                      </td>
                      <td className="p-3">
                        <div className="flex items-center gap-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setViewingOrder(order)}
                            className="h-8 px-2"
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setEditingOrder(order)}
                            className="h-8 px-2"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setDeletingOrder(order)}
                            className="h-8 px-2 text-destructive hover:text-destructive"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* View Order Modal */}
      <ViewOrderModal 
        order={viewingOrder}
        isOpen={!!viewingOrder}
        onClose={() => setViewingOrder(null)}
      />

      {/* Edit Order Modal */}
      <EditOrderModal 
        order={editingOrder}
        isOpen={!!editingOrder}
        onClose={() => setEditingOrder(null)}
        onSave={handleEditOrder}
        isUpdating={isUpdating}
      />

      {/* Delete Order Confirmation */}
      <AlertDialog open={!!deletingOrder} onOpenChange={() => setDeletingOrder(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Order</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete order {deletingOrder?.order_number}? 
              This action cannot be undone and will permanently remove the order and all its items.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isUpdating}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deletingOrder && handleDeleteOrder(deletingOrder.id)}
              disabled={isUpdating}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isUpdating ? "Deleting..." : "Delete Order"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
