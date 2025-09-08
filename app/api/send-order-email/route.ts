import { NextRequest, NextResponse } from 'next/server'
import nodemailer from 'nodemailer'
import type { Order } from '@/lib/types'

// Email configuration
const EMAIL_CONFIG = {
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: false, // true for 465, false for other ports
  auth: {
    user: process.env.SMTP_USER || 'your-email@gmail.com',
    pass: process.env.SMTP_PASS || 'your-app-password',
  },
}

// Create transporter
const transporter = nodemailer.createTransport(EMAIL_CONFIG)

export async function POST(request: NextRequest) {
  try {
    const order: Order = await request.json()

    // Validate input
    if (!order || !order.customerInfo || !order.items || order.items.length === 0) {
      return NextResponse.json(
        { error: 'Invalid order data' },
        { status: 400 }
      )
    }

    // Sanitize and validate customer info
    const customerInfo = {
      name: sanitizeString(order.customerInfo.name),
      email: sanitizeEmail(order.customerInfo.email),
      phone: sanitizePhone(order.customerInfo.phone),
      address: sanitizeString(order.customerInfo.address),
    }

    // Validate required fields
    if (!customerInfo.name || !customerInfo.email || !customerInfo.phone || !customerInfo.address) {
      return NextResponse.json(
        { error: 'Missing required customer information' },
        { status: 400 }
      )
    }

    // Generate email content
    const emailContent = generateOrderEmail(order, customerInfo)

    // Send email
    const mailOptions = {
      from: `"KidsCorner" <${EMAIL_CONFIG.auth.user}>`,
      to: 'mohammad.hamad@hotmail.com',
      replyTo: customerInfo.email,
      subject: emailContent.subject,
      text: emailContent.text,
      html: emailContent.html,
    }

    await transporter.sendMail(mailOptions)

    return NextResponse.json(
      { success: true, message: 'Order email sent successfully' },
      { status: 200 }
    )

  } catch (error) {
    console.error('Email sending error:', error)
    return NextResponse.json(
      { error: 'Failed to send order email' },
      { status: 500 }
    )
  }
}

function sanitizeString(input: string): string {
  if (!input || typeof input !== 'string') return ''
  return input.trim().replace(/[<>]/g, '')
}

function sanitizeEmail(email: string): string {
  if (!email || typeof email !== 'string') return ''
  const sanitized = email.trim().toLowerCase()
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(sanitized) ? sanitized : ''
}

function sanitizePhone(phone: string): string {
  if (!phone || typeof phone !== 'string') return ''
  return phone.replace(/[^\d+\-\s()]/g, '').trim()
}

function generateOrderEmail(order: Order, customerInfo: any) {
  const itemsList = order.items
    .map((item) => {
      const sizeInfo = item.selectedSize || 'One Size'
      const colorInfo = item.selectedColor || 'Default'
      const totalPrice = (item.product.price * item.quantity).toFixed(2)
      return `${item.quantity}x ${item.product.name} (${sizeInfo}, ${colorInfo}) - $${totalPrice}`
    })
    .join('\n')

  const subject = `New Order #${order.id} - ${customerInfo.name}`

  const text = `
NEW ORDER RECEIVED - KidsCorner

Customer Information:
Name: ${customerInfo.name}
Email: ${customerInfo.email}
Phone: ${customerInfo.phone}
Address: ${customerInfo.address}

Order Details:
Order ID: ${order.id}
Order Date: ${new Date(order.createdAt).toLocaleString()}
Status: ${order.status.toUpperCase()}

Items Ordered:
${itemsList}

Total Amount: $${order.total.toFixed(2)}

Please process this order and contact the customer for delivery arrangements.

---
KidsCorner Order Management System
  `.trim()

  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>${subject}</title>
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; }
    .header { background: linear-gradient(135deg, #3b82f6, #ec4899); color: white; padding: 20px; text-align: center; }
    .content { padding: 20px; }
    .customer-info { background: #f8f9fa; padding: 15px; border-radius: 8px; margin: 20px 0; }
    .order-details { background: #e3f2fd; padding: 15px; border-radius: 8px; margin: 20px 0; }
    .items { margin: 15px 0; }
    .item { padding: 8px 0; border-bottom: 1px solid #eee; }
    .total { font-weight: bold; font-size: 18px; color: #3b82f6; }
    .footer { background: #f8f9fa; padding: 20px; text-align: center; color: #666; }
  </style>
</head>
<body>
  <div class="header">
    <h1>KidsCorner</h1>
    <h2>New Order Received</h2>
  </div>
  
  <div class="content">
    <div class="customer-info">
      <h3>Customer Information</h3>
      <p><strong>Name:</strong> ${customerInfo.name}</p>
      <p><strong>Email:</strong> ${customerInfo.email}</p>
      <p><strong>Phone:</strong> ${customerInfo.phone}</p>
      <p><strong>Address:</strong> ${customerInfo.address}</p>
    </div>
    
    <div class="order-details">
      <h3>Order Details</h3>
      <p><strong>Order ID:</strong> ${order.id}</p>
      <p><strong>Order Date:</strong> ${new Date(order.createdAt).toLocaleString()}</p>
      <p><strong>Status:</strong> ${order.status.toUpperCase()}</p>
      
      <h4>Items Ordered:</h4>
      <div class="items">
        ${order.items
          .map((item) => {
            const sizeInfo = item.selectedSize || 'One Size'
            const colorInfo = item.selectedColor || 'Default'
            const totalPrice = (item.product.price * item.quantity).toFixed(2)
            return `
          <div class="item">
            ${item.quantity}x ${item.product.name} (${sizeInfo}, ${colorInfo}) - $${totalPrice}
          </div>
        `
          })
          .join('')}
      </div>
      
      <p class="total">Total Amount: $${order.total.toFixed(2)}</p>
    </div>
    
    <p><strong>Action Required:</strong> Please process this order and contact the customer for delivery arrangements.</p>
  </div>
  
  <div class="footer">
    <p>KidsCorner Order Management System</p>
  </div>
</body>
</html>
  `.trim()

  return { subject, html, text }
}
