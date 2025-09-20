import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import type { CartItem } from '@/lib/types'

// Create Supabase client function
function createSupabaseClient() {
  // Fallback to hardcoded values if environment variables are not available
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://xsefkpirpfjkzxndoltl.supabase.co'
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhzZWZrcGlycGZqa3p4bmRvbHRsIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NzExMzA4MCwiZXhwIjoyMDcyNjg5MDgwfQ.KU9M-2I8yZlHiIDluQYGeGQdALTS4OYzu6kuZheunlI'
  
  return createClient(supabaseUrl, supabaseServiceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  })
}

// Helper function to sanitize string inputs
const sanitizeString = (input: string): string => {
  return input.trim().replace(/[<>]/g, '')
}

// Helper function to validate phone number
const validatePhone = (phone: string): boolean => {
  const phoneRegex = /^\+\d{1,4}\d{7,15}$/
  return phoneRegex.test(phone)
}

// Helper function to validate order items
const validateOrderItems = (items: CartItem[]): boolean => {
  return Array.isArray(items) && items.length > 0 && items.every(item => 
    item.product &&
    typeof item.product.id === 'string' &&
    typeof item.product.name === 'string' &&
    typeof item.quantity === 'number' &&
    item.quantity > 0 &&
    item.selectedSize &&
    item.selectedColor &&
    typeof item.product.price === 'number' &&
    item.product.price > 0
  )
}

export async function POST(request: NextRequest) {
  try {
    const supabase = createSupabaseClient()
    const body = await request.json()
    
    const { customerInfo, items, total } = body
    
    // Validate required fields
    if (!customerInfo?.name || !customerInfo?.phone || !customerInfo?.address) {
      return NextResponse.json(
        { error: 'Missing required customer information' },
        { status: 400 }
      )
    }
    
    // Validate and sanitize customer info
    const sanitizedCustomerInfo = {
      name: sanitizeString(customerInfo.name),
      phone: sanitizeString(customerInfo.phone),
      address: sanitizeString(customerInfo.address)
    }
    
    // Validate phone format
    if (!validatePhone(sanitizedCustomerInfo.phone)) {
      return NextResponse.json(
        { error: 'Invalid phone number format' },
        { status: 400 }
      )
    }
    
    // Validate order items
    if (!validateOrderItems(items)) {
      return NextResponse.json(
        { error: 'Invalid order items' },
        { status: 400 }
      )
    }
    
    // Validate total
    if (typeof total !== 'number' || total <= 0) {
      return NextResponse.json(
        { error: 'Invalid order total' },
        { status: 400 }
      )
    }
    
    // Generate order number
    const orderNumber = `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 5).toUpperCase()}`
    
    // Calculate shipping
    const subtotal = total
    const shippingAmount = subtotal > 50 ? 0 : 9.99
    const totalAmount = subtotal + shippingAmount
    
    // Create order in database
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .insert({
        order_number: orderNumber,
        email: 'no-email@placeholder.com', // Required field, using placeholder
        status: 'pending',
        payment_method: 'whatsapp',
        subtotal: subtotal,
        tax_amount: 0,
        shipping_amount: shippingAmount,
        discount_amount: 0,
        total_amount: totalAmount,
        currency: 'USD',
        shipping_address: {
          name: sanitizedCustomerInfo.name,
          phone: sanitizedCustomerInfo.phone,
          address: sanitizedCustomerInfo.address
        },
        notes: `WhatsApp order - Phone: ${sanitizedCustomerInfo.phone}`
      })
      .select()
      .single()
    
    if (orderError) {
      console.error('Order creation error:', orderError)
      return NextResponse.json(
        { error: 'Failed to create order' },
        { status: 500 }
      )
    }
    
    // Create order items
    const orderItems = items.map((item: CartItem) => {
      // Check if product_id is a valid UUID format, otherwise set to null
      const isValidUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(item.product.id)
      
      return {
        order_id: order.id,
        product_id: isValidUUID ? item.product.id : null,
        variant_id: item.variantId || null,
        product_name: item.product.name,
        product_sku: item.productCode || item.product.product_code || `${item.product.id}-${item.selectedSize}-${item.selectedColor}`,
        variant_description: `${item.selectedSize}, ${item.selectedColor}`,
        quantity: item.quantity,
        unit_price: item.product.price,
        total_price: item.product.price * item.quantity
      }
    })
    
    const { error: itemsError } = await supabase
      .from('order_items')
      .insert(orderItems)
    
    if (itemsError) {
      console.error('Order items creation error:', itemsError)
      console.error('Order items data:', JSON.stringify(orderItems, null, 2))
      // Try to delete the order if items failed
      await supabase.from('orders').delete().eq('id', order.id)
      return NextResponse.json(
        { 
          error: 'Failed to create order items',
          details: itemsError.message,
          data: orderItems
        },
        { status: 500 }
      )
    }
    
    // Return the order with items
    const orderWithItems = {
      id: order.id,
      orderNumber: order.order_number,
      items: items,
      total: totalAmount,
      customerInfo: sanitizedCustomerInfo,
      status: order.status,
      createdAt: order.created_at
    }
    
    return NextResponse.json({ order: orderWithItems }, { status: 201 })
    
  } catch (error) {
    console.error('Order creation error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const supabase = createSupabaseClient()
    const { searchParams } = new URL(request.url)
    const orderId = searchParams.get('id')
    
    if (orderId) {
      // Get single order
      const { data: order, error } = await supabase
        .from('orders')
        .select(`
          *,
          order_items(*)
        `)
        .eq('id', orderId)
        .single()
      
      if (error || !order) {
        return NextResponse.json(
          { error: 'Order not found' },
          { status: 404 }
        )
      }
      
      return NextResponse.json({ order })
    } else {
      // Get all orders
      const { data: orders, error } = await supabase
        .from('orders')
        .select(`
          *,
          order_items(*)
        `)
        .order('created_at', { ascending: false })
      
      if (error) {
        return NextResponse.json(
          { error: 'Failed to fetch orders' },
          { status: 500 }
        )
      }
      
      return NextResponse.json({ orders })
    }
  } catch (error) {
    console.error('Order fetch error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
