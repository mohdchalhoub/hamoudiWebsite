import type { Order } from "./types"

export class WhatsAppService {
  // Mock WhatsApp service - in production, this would use WhatsApp Business API
  static async sendOrderConfirmation(order: Order): Promise<boolean> {
    try {
      const message = this.generateOrderConfirmationMessage(order)

      // Mock API call - replace with actual WhatsApp Business API
      console.log("[v0] Sending WhatsApp confirmation to:", order.customerInfo.phone)
      console.log("[v0] WhatsApp message:", message)

      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Mock success response
      return true
    } catch (error) {
      console.error("[v0] WhatsApp service error:", error)
      return false
    }
  }

  static async sendOrderUpdate(order: Order, newStatus: string): Promise<boolean> {
    try {
      const message = this.generateOrderUpdateMessage(order, newStatus)

      console.log("[v0] Sending WhatsApp update to:", order.customerInfo.phone)
      console.log("[v0] WhatsApp message:", message)

      await new Promise((resolve) => setTimeout(resolve, 1000))
      return true
    } catch (error) {
      console.error("[v0] WhatsApp service error:", error)
      return false
    }
  }

  private static generateOrderConfirmationMessage(order: Order): string {
    const itemsList = order.items
      .map(
        (item) =>
          `• ${item.quantity}x ${item.product.name} (${item.selectedSize}, ${item.selectedColor}) - $${(item.product.price * item.quantity).toFixed(2)}`,
      )
      .join("\n")

    return `
🎉 *KidsWear Order Confirmation*

Hi ${order.customerInfo.name}! Thank you for your order.

📋 *Order Details:*
Order ID: ${order.id}
Date: ${new Date(order.createdAt).toLocaleDateString()}

🛍️ *Items Ordered:*
${itemsList}

💰 *Total: $${order.total.toFixed(2)}*

📍 *Delivery Address:*
${order.customerInfo.address}

We'll process your order and contact you soon with delivery details.

Questions? Reply to this message or call us at +1 (555) 123-4567

*KidsWear - Fun Fashion for Kids* 👶👧👦
    `.trim()
  }

  private static generateOrderUpdateMessage(order: Order, newStatus: string): string {
    const statusEmojis = {
      confirmed: "✅",
      shipped: "🚚",
      delivered: "📦",
    }

    const statusMessages = {
      confirmed: "Your order has been confirmed and is being prepared for shipment.",
      shipped: "Great news! Your order has been shipped and is on its way to you.",
      delivered: "Your order has been delivered! We hope you love your new KidsWear items.",
    }

    const emoji = statusEmojis[newStatus as keyof typeof statusEmojis] || "📋"
    const message =
      statusMessages[newStatus as keyof typeof statusMessages] || `Your order status has been updated to: ${newStatus}`

    return `
${emoji} *KidsWear Order Update*

Hi ${order.customerInfo.name}!

${message}

📋 *Order Details:*
Order ID: ${order.id}
Status: *${newStatus.toUpperCase()}*

Questions? Reply to this message or call us at +1 (555) 123-4567

*KidsWear - Fun Fashion for Kids* 👶👧👦
    `.trim()
  }

  static generateWhatsAppLink(phone: string, message: string): string {
    // Generate WhatsApp link for direct messaging
    const encodedMessage = encodeURIComponent(message)
    const cleanPhone = phone.replace(/\D/g, "") // Remove non-digits
    return `https://wa.me/${cleanPhone}?text=${encodedMessage}`
  }
}
