import type { Order } from "./types"

export class WhatsAppService {
  static async sendOrderConfirmation(order: Order): Promise<boolean> {
    try {
      const message = this.generateOrderConfirmationMessage(order)
      const ownerPhoneNumber = this.getOwnerPhoneNumber()
      
      if (!ownerPhoneNumber) {
        console.error('Owner phone number not configured')
        return false
      }

      // Generate WhatsApp URL using owner's number
      const whatsappUrl = this.generateWhatsAppUrl(ownerPhoneNumber, message)
      
      console.log("Redirecting to WhatsApp for order confirmation:", {
        ownerPhone: ownerPhoneNumber,
        customerPhone: order.customerInfo.phone,
        url: whatsappUrl
      })

      // Open WhatsApp with iPhone-compatible method
      if (typeof window !== 'undefined') {
        // Detect if we're on iPhone
        const isIPhone = /iPhone/.test(navigator.userAgent)
        
        if (isIPhone) {
          // For iPhone: Use direct navigation to avoid Safari blocking
          window.location.href = whatsappUrl
        } else {
          // For Android and Desktop: Use window.open to open in new tab
          window.open(whatsappUrl, '_blank', 'noopener,noreferrer')
        }
      }

      return true
    } catch (error) {
      console.error("WhatsApp service error:", error)
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
    // Sanitize customer inputs
    const customerName = this.sanitizeInput(order.customerInfo.name)
    const customerPhone = this.sanitizeInput(order.customerInfo.phone)
    const customerAddress = this.sanitizeInput(order.customerInfo.address)

    const itemsList = order.items
      .map((item) => {
        const productName = this.sanitizeInput(item.product.name)
        const selectedSize = this.sanitizeInput(item.selectedSize)
        const selectedColor = this.sanitizeInput(item.selectedColor)
        const unitPrice = item.product.price.toFixed(2)
        const lineTotal = (item.product.price * item.quantity).toFixed(2)
        
        // Use the actual product code + variation code format
        const productCode = item.productCode || item.product.product_code
        const variationCode = item.variantCode || item.variant_code
        
        // Format: 123456-101 (product code + variation code)
        let fullCode = 'N/A'
        if (productCode && variationCode) {
          fullCode = `${productCode}-${variationCode}`
        } else if (productCode) {
          fullCode = productCode
        }
        
        return `• ${item.quantity}x [${fullCode}] ${productName} (${selectedSize}, ${selectedColor}) - Unit: $${unitPrice} - Total: $${lineTotal}`
      })
      .join("\n")

    return `
🛍️ *NEW ORDER - KidsCorner*

📋 *Order Reference:* ${order.id}
📅 *Date:* ${new Date(order.createdAt).toLocaleDateString()}

👤 *Customer Details:*
Name: ${customerName}
Phone: ${customerPhone}
Address: ${customerAddress}

🛒 *Order Items:*
${itemsList}

💰 *Order Summary:*
Subtotal: $${order.total.toFixed(2)}
Total: $${order.total.toFixed(2)}

Please process this order and contact the customer for delivery arrangements.

*KidsCorner Order Management* 👶👧👦
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
      delivered: "Your order has been delivered! We hope you love your new KidsCorner items.",
    }

    const emoji = statusEmojis[newStatus as keyof typeof statusEmojis] || "📋"
    const message =
      statusMessages[newStatus as keyof typeof statusMessages] || `Your order status has been updated to: ${newStatus}`

    return `
${emoji} *KidsCorner Order Update*

Hi ${order.customerInfo.name}!

${message}

📋 *Order Details:*
Order ID: ${order.id}
Status: *${newStatus.toUpperCase()}*

Questions? Reply to this message or call us at +1 (555) 123-4567

*KidsCorner - Luxe Fashion for Kids* 👶👧👦
    `.trim()
  }

  static generateWhatsAppLink(phone: string, message: string): string {
    // Generate WhatsApp link for direct messaging
    const encodedMessage = encodeURIComponent(message)
    const cleanPhone = this.sanitizePhoneNumber(phone)
    return `https://wa.me/${cleanPhone}?text=${encodedMessage}`
  }

  static redirectToWhatsApp(phone: string, message: string): void {
    // iOS Safari-compatible WhatsApp opening
    const encodedMessage = encodeURIComponent(message)
    const cleanPhone = this.sanitizePhoneNumber(phone)
    const whatsappUrl = `https://wa.me/${cleanPhone}?text=${encodedMessage}`
    
    if (typeof window !== 'undefined') {
      console.log('Attempting to open WhatsApp:', whatsappUrl)
      
      // Detect if we're on iOS Safari
      const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent)
      const isSafari = /Safari/.test(navigator.userAgent) && !/Chrome/.test(navigator.userAgent)
      
      if (isIOS && isSafari) {
        // For iOS Safari, show a button for user to click
        console.log('iOS Safari detected, using user-triggered method')
        
        const button = document.createElement('button')
        button.innerHTML = 'Open WhatsApp'
        button.style.cssText = `
          position: fixed;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          z-index: 9999;
          background: #25D366;
          color: white;
          border: none;
          padding: 15px 30px;
          border-radius: 8px;
          font-size: 16px;
          font-weight: bold;
          cursor: pointer;
          box-shadow: 0 4px 12px rgba(0,0,0,0.3);
        `
        
        button.onclick = () => {
          window.location.href = whatsappUrl
          document.body.removeChild(button)
        }
        
        document.body.appendChild(button)
        
        setTimeout(() => {
          if (document.body.contains(button)) {
            document.body.removeChild(button)
          }
        }, 10000)
        
      } else {
        // For other browsers, use the link method
        console.log('Non-iOS Safari detected, using link method')
        const link = document.createElement('a')
        link.href = whatsappUrl
        link.target = '_blank'
        link.rel = 'noopener noreferrer'
        link.style.position = 'fixed'
        link.style.top = '0'
        link.style.left = '0'
        link.style.width = '1px'
        link.style.height = '1px'
        link.style.opacity = '0'
        link.style.pointerEvents = 'none'
        
        document.body.appendChild(link)
        link.click()
        
        setTimeout(() => {
          if (document.body.contains(link)) {
            document.body.removeChild(link)
          }
        }, 100)
      }
      
      console.log('WhatsApp link triggered')
    }
  }

  private static getOwnerPhoneNumber(): string {
    // Always use the specified owner phone number
    const ownerPhone = '+96171567228'
    return this.sanitizePhoneNumber(ownerPhone)
  }

  private static sanitizePhoneNumber(phone: string): string {
    if (!phone || typeof phone !== 'string') return ''
    
    // Remove all non-digit characters
    let cleanPhone = phone.replace(/\D/g, '')
    
    // Remove leading 00 if present (international format)
    if (cleanPhone.startsWith('00')) {
      cleanPhone = cleanPhone.substring(2)
    }
    
    // Remove leading + if present (shouldn't happen after \D replacement, but just in case)
    if (cleanPhone.startsWith('+')) {
      cleanPhone = cleanPhone.substring(1)
    }
    
    return cleanPhone
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

  private static generateWhatsAppUrl(phone: string, message: string): string {
    const encodedMessage = encodeURIComponent(message)
    
    // Always use wa.me format - it works for both mobile and desktop
    // wa.me automatically detects the device and opens the appropriate interface
    return `https://wa.me/${phone}?text=${encodedMessage}`
  }
}

