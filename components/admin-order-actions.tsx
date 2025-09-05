"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { EmailService } from "@/lib/email-service"
import { WhatsAppService } from "@/lib/whatsapp-service"
import { useToast } from "@/hooks/use-toast"
import type { Order } from "@/lib/types"
import { Mail, MessageCircle } from "lucide-react"

interface AdminOrderActionsProps {
  order: Order
  onStatusUpdate?: (newStatus: string) => void
}

export function AdminOrderActions({ order, onStatusUpdate }: AdminOrderActionsProps) {
  const { toast } = useToast()
  const [isUpdating, setIsUpdating] = useState(false)
  const [selectedStatus, setSelectedStatus] = useState(order.status)

  const handleStatusUpdate = async () => {
    if (selectedStatus === order.status) return

    setIsUpdating(true)
    try {
      // Send notification based on customer's preferred method
      let notificationSent = false

      if (order.customerInfo.paymentMethod === "email") {
        notificationSent = await EmailService.sendOrderUpdate(order, selectedStatus)
      } else {
        notificationSent = await WhatsAppService.sendOrderUpdate(order, selectedStatus)
      }

      if (notificationSent) {
        toast({
          title: "Status updated",
          description: `Customer notified via ${order.customerInfo.paymentMethod === "email" ? "email" : "WhatsApp"}`,
        })
      } else {
        toast({
          title: "Status updated",
          description: "Failed to send notification to customer",
          variant: "destructive",
        })
      }

      onStatusUpdate?.(selectedStatus)
    } catch (error) {
      console.error("[v0] Status update error:", error)
      toast({
        title: "Error",
        description: "Failed to update order status",
        variant: "destructive",
      })
    } finally {
      setIsUpdating(false)
    }
  }

  const handleSendCustomMessage = async (method: "email" | "whatsapp") => {
    try {
      let sent = false

      if (method === "email") {
        sent = await EmailService.sendOrderConfirmation(order)
        toast({
          title: "Email sent",
          description: `Order confirmation resent to ${order.customerInfo.email}`,
        })
      } else {
        sent = await WhatsAppService.sendOrderConfirmation(order)
        toast({
          title: "WhatsApp sent",
          description: `Order confirmation resent to ${order.customerInfo.phone}`,
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: `Failed to send ${method} message`,
        variant: "destructive",
      })
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Order Actions</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Status Update */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Update Status</label>
          <div className="flex gap-2">
            <Select value={selectedStatus} onValueChange={setSelectedStatus}>
              <SelectTrigger className="flex-1">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="confirmed">Confirmed</SelectItem>
                <SelectItem value="shipped">Shipped</SelectItem>
                <SelectItem value="delivered">Delivered</SelectItem>
              </SelectContent>
            </Select>
            <Button onClick={handleStatusUpdate} disabled={isUpdating || selectedStatus === order.status}>
              {isUpdating ? "Updating..." : "Update"}
            </Button>
          </div>
        </div>

        {/* Customer Communication */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Customer Communication</label>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={() => handleSendCustomMessage("email")} className="flex-1">
              <Mail className="h-4 w-4 mr-2" />
              Send Email
            </Button>
            <Button variant="outline" size="sm" onClick={() => handleSendCustomMessage("whatsapp")} className="flex-1">
              <MessageCircle className="h-4 w-4 mr-2" />
              Send WhatsApp
            </Button>
          </div>
        </div>

        {/* Customer Preferences */}
        <div className="p-3 bg-muted rounded-lg">
          <div className="text-sm font-medium mb-1">Customer Preferences</div>
          <div className="flex items-center gap-2">
            <Badge variant="outline">
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
            <span className="text-sm text-muted-foreground">Preferred contact method</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
