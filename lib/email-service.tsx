import type { Order } from "./types"

export interface EmailTemplate {
  subject: string
  html: string
  text: string
}

export class EmailService {
  static async sendOrderConfirmation(order: Order): Promise<boolean> {
    try {
      console.log("Opening email client for order to mohammad.hamad@hotmail.com")

      // Generate the same message format as WhatsApp
      const message = this.generateOrderConfirmationMessage(order)
      
      // Create mailto link
      const subject = `New Order - Order #${order.id}`
      const encodedSubject = encodeURIComponent(subject)
      const encodedBody = encodeURIComponent(message)
      
      const mailtoUrl = `mailto:mohammad.hamad@hotmail.com?subject=${encodedSubject}&body=${encodedBody}`
      
      console.log("Opening email client with mailto link:", {
        recipient: "mohammad.hamad@hotmail.com",
        subject: subject,
        url: mailtoUrl
      })

      // Open email client
      if (typeof window !== 'undefined') {
        window.open(mailtoUrl, '_self')
      }

      return true
    } catch (error) {
      console.error("Email service error:", error)
      return false
    }
  }

  static async sendOrderUpdate(order: Order, newStatus: string): Promise<boolean> {
    try {
      const template = this.generateOrderUpdateTemplate(order, newStatus)

      console.log("[v0] Sending order update email to:", order.customerInfo.email)
      console.log("[v0] Email subject:", template.subject)
      console.log("[v0] Email content:", template.text)

      await new Promise((resolve) => setTimeout(resolve, 1000))
      return true
    } catch (error) {
      console.error("[v0] Email service error:", error)
      return false
    }
  }

  private static generateOrderConfirmationTemplate(order: Order): EmailTemplate {
    const itemsList = order.items
      .map(
        (item) =>
          `${item.quantity}x ${item.product.name} (${item.selectedSize}, ${item.selectedColor}) - $${(item.product.price * item.quantity).toFixed(2)}`,
      )
      .join("\n")

    const subject = `Order Confirmation - ${order.id}`

    const text = `
Hi ${order.customerInfo.name},

Thank you for your order! We're excited to get your KidsCorner items to you.

Order Details:
Order ID: ${order.id}
Order Date: ${new Date(order.createdAt).toLocaleDateString()}

Items Ordered:
${itemsList}

Total: $${order.total.toFixed(2)}

Delivery Address:
${order.customerInfo.address}

We'll process your order and contact you soon with delivery details.

Best regards,
The KidsCorner Team

---
KidsCorner - Luxe Fashion for Kids
Email: hello@kidscorner.com
Phone: +1 (555) 123-4567
    `.trim()

    const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>${subject}</title>
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
    .header { background: linear-gradient(135deg, #3b82f6, #ec4899); color: white; padding: 20px; text-align: center; }
    .content { padding: 20px; }
    .order-details { background: #f8f9fa; padding: 15px; border-radius: 8px; margin: 20px 0; }
    .items { margin: 15px 0; }
    .item { padding: 8px 0; border-bottom: 1px solid #eee; }
    .total { font-weight: bold; font-size: 18px; color: #3b82f6; }
    .footer { background: #f8f9fa; padding: 20px; text-align: center; color: #666; }
  </style>
</head>
<body>
  <div class="header">
    <h1>KidsCorner</h1>
    <h2>Order Confirmation</h2>
  </div>
  
  <div class="content">
    <p>Hi ${order.customerInfo.name},</p>
    
    <p>Thank you for your order! We're excited to get your KidsCorner items to you.</p>
    
    <div class="order-details">
      <h3>Order Details</h3>
      <p><strong>Order ID:</strong> ${order.id}</p>
      <p><strong>Order Date:</strong> ${new Date(order.createdAt).toLocaleDateString()}</p>
      
      <h4>Items Ordered:</h4>
      <div class="items">
        ${order.items
          .map(
            (item) => `
          <div class="item">
            ${item.quantity}x ${item.product.name} (${item.selectedSize}, ${item.selectedColor}) - $${(item.product.price * item.quantity).toFixed(2)}
          </div>
        `,
          )
          .join("")}
      </div>
      
      <p class="total">Total: $${order.total.toFixed(2)}</p>
      
      <h4>Delivery Address:</h4>
      <p>${order.customerInfo.address}</p>
    </div>
    
    <p>We'll process your order and contact you soon with delivery details.</p>
    
    <p>Best regards,<br>The KidsCorner Team</p>
  </div>
  
  <div class="footer">
    <p>KidsCorner - Luxe Fashion for Kids</p>
    <p>Email: hello@kidscorner.com | Phone: +1 (555) 123-4567</p>
  </div>
</body>
</html>
    `.trim()

    return { subject, html, text }
  }

  private static generateOrderUpdateTemplate(order: Order, newStatus: string): EmailTemplate {
    const subject = `Order Update - ${order.id}`

    const statusMessages = {
      confirmed: "Your order has been confirmed and is being prepared for shipment.",
      shipped: "Great news! Your order has been shipped and is on its way to you.",
      delivered: "Your order has been delivered! We hope you love your new KidsCorner items.",
    }

    const message =
      statusMessages[newStatus as keyof typeof statusMessages] || `Your order status has been updated to: ${newStatus}`

    const text = `
Hi ${order.customerInfo.name},

${message}

Order Details:
Order ID: ${order.id}
Status: ${newStatus.toUpperCase()}

If you have any questions, please don't hesitate to contact us.

Best regards,
The KidsCorner Team
    `.trim()

    const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>${subject}</title>
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
    .header { background: linear-gradient(135deg, #3b82f6, #ec4899); color: white; padding: 20px; text-align: center; }
    .content { padding: 20px; }
    .status { background: #f0f9ff; padding: 15px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #3b82f6; }
    .footer { background: #f8f9fa; padding: 20px; text-align: center; color: #666; }
  </style>
</head>
<body>
  <div class="header">
    <h1>KidsCorner</h1>
    <h2>Order Update</h2>
  </div>
  
  <div class="content">
    <p>Hi ${order.customerInfo.name},</p>
    
    <div class="status">
      <p><strong>${message}</strong></p>
      <p>Order ID: ${order.id}</p>
      <p>Status: <strong>${newStatus.toUpperCase()}</strong></p>
    </div>
    
    <p>If you have any questions, please don't hesitate to contact us.</p>
    
    <p>Best regards,<br>The KidsCorner Team</p>
  </div>
  
  <div class="footer">
    <p>KidsCorner - Luxe Fashion for Kids</p>
    <p>Email: hello@kidscorner.com | Phone: +1 (555) 123-4567</p>
  </div>
</body>
</html>
    `.trim()

    return { subject, html, text }
  }

  private static generateOrderConfirmationMessage(order: Order): string {
    // Sanitize customer inputs (same as WhatsApp)
    const customerName = this.sanitizeInput(order.customerInfo.name)
    const customerPhone = this.sanitizeInput(order.customerInfo.phone)
    const customerEmail = this.sanitizeInput(order.customerInfo.email)
    const customerAddress = this.sanitizeInput(order.customerInfo.address)

    const itemsList = order.items
      .map((item) => {
        const productName = this.sanitizeInput(item.product.name)
        const selectedSize = this.sanitizeInput(item.selectedSize)
        const selectedColor = this.sanitizeInput(item.selectedColor)
        const unitPrice = item.product.price.toFixed(2)
        const lineTotal = (item.product.price * item.quantity).toFixed(2)
        
        return `• ${item.quantity}x ${productName} (${selectedSize}, ${selectedColor}) - Unit: $${unitPrice} - Total: $${lineTotal}`
      })
      .join("\n")

    return `
🛍️ NEW ORDER - KidsCorner

📋 Order Reference: ${order.id}
📅 Date: ${new Date(order.createdAt).toLocaleDateString()}

👤 Customer Details:
Name: ${customerName}
Phone: ${customerPhone}
Email: ${customerEmail}
Address: ${customerAddress}

🛒 Order Items:
${itemsList}

💰 Order Summary:
Subtotal: $${order.total.toFixed(2)}
Total: $${order.total.toFixed(2)}

Please process this order and contact the customer for delivery arrangements.

KidsCorner Order Management 👶👧👦
    `.trim()
  }

  private static sanitizeInput(input: string): string {
    if (!input || typeof input !== 'string') return ''
    
    // Remove potentially harmful characters and scripts
    return input
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '') // Remove script tags
      .replace(/[<>]/g, '') // Remove < and >
      .replace(/javascript:/gi, '') // Remove javascript: protocol
      .replace(/on\w+\s*=/gi, '') // Remove event handlers
      .trim()
  }
}
