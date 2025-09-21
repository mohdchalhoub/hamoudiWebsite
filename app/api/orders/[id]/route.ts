import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

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

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = createSupabaseClient()
    const orderId = params.id
    
    if (!orderId) {
      return NextResponse.json(
        { error: 'Order ID is required' },
        { status: 400 }
      )
    }
    
    // Get single order with order items
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
  } catch (error) {
    console.error('Order fetch error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = createSupabaseClient()
    const orderId = params.id
    const body = await request.json()
    
    if (!orderId) {
      return NextResponse.json(
        { error: 'Order ID is required' },
        { status: 400 }
      )
    }
    
    const { status, notes, shipping_address, total_amount, order_items } = body
    
    // Validate status
    const validStatuses = ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled', 'refunded']
    if (status && !validStatuses.includes(status)) {
      return NextResponse.json(
        { error: 'Invalid status' },
        { status: 400 }
      )
    }
    
    // Get current order to check previous status
    const { data: currentOrder, error: currentOrderError } = await supabase
      .from('orders')
      .select('status, order_items(*)')
      .eq('id', orderId)
      .single()
    
    if (currentOrderError || !currentOrder) {
      return NextResponse.json(
        { error: 'Order not found' },
        { status: 404 }
      )
    }
    
    // Update order
    const updateData: any = {
      updated_at: new Date().toISOString()
    }
    
    if (status) updateData.status = status
    if (notes !== undefined) updateData.notes = notes?.trim() || null
    if (shipping_address) updateData.shipping_address = shipping_address
    if (total_amount) updateData.total_amount = total_amount
    
    // Update order items if provided
    if (order_items && Array.isArray(order_items)) {
      // Delete existing order items
      const { error: deleteError } = await supabase
        .from('order_items')
        .delete()
        .eq('order_id', orderId)
      
      if (deleteError) {
        return NextResponse.json(
          { error: 'Failed to update order items' },
          { status: 500 }
        )
      }
      
      // Insert new order items
      const newOrderItems = order_items.map((item: any) => ({
        order_id: orderId,
        product_id: item.product_id || null,
        variant_id: item.variant_id || null,
        product_name: item.product_name,
        product_sku: item.product_sku || null,
        variant_description: item.variant_description || null,
        quantity: item.quantity,
        unit_price: item.unit_price,
        total_price: item.total_price
      }))
      
      const { error: insertError } = await supabase
        .from('order_items')
        .insert(newOrderItems)
      
      if (insertError) {
        return NextResponse.json(
          { error: 'Failed to update order items' },
          { status: 500 }
        )
      }
    }

    const { data: order, error } = await supabase
      .from('orders')
      .update(updateData)
      .eq('id', orderId)
      .select(`
        *,
        order_items(*)
      `)
      .single()
    
    if (error || !order) {
      return NextResponse.json(
        { error: 'Failed to update order' },
        { status: 500 }
      )
    }
    
    // Handle stock updates based on status changes
    if (status && status !== currentOrder.status) {
      try {
        // If order is being confirmed, reduce stock
        if (status === 'confirmed' && currentOrder.status !== 'confirmed') {
          const orderItems = order_items || currentOrder.order_items || []
          const stockUpdateItems = orderItems
            .filter((item: any) => item.product_id) // Only items with valid product_id
            .map((item: any) => ({
              productId: item.product_id,
              quantity: item.quantity
            }))
          
          if (stockUpdateItems.length > 0) {
            const stockResponse = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/api/products/stock`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                orderItems: stockUpdateItems,
                operation: 'subtract'
              })
            })
            
            if (!stockResponse.ok) {
              console.error('Failed to update stock:', await stockResponse.text())
              // Don't fail the order update, just log the error
            }
          }
        }
        
        // If order is being cancelled and was previously confirmed, restore stock
        if (status === 'cancelled' && currentOrder.status === 'confirmed') {
          const orderItems = order_items || currentOrder.order_items || []
          const stockUpdateItems = orderItems
            .filter((item: any) => item.product_id) // Only items with valid product_id
            .map((item: any) => ({
              productId: item.product_id,
              quantity: item.quantity
            }))
          
          if (stockUpdateItems.length > 0) {
            const stockResponse = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/api/products/stock`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                orderItems: stockUpdateItems,
                operation: 'add'
              })
            })
            
            if (!stockResponse.ok) {
              console.error('Failed to restore stock:', await stockResponse.text())
              // Don't fail the order update, just log the error
            }
          }
        }
      } catch (stockError) {
        console.error('Stock update error:', stockError)
        // Don't fail the order update, just log the error
      }
    }
    
    return NextResponse.json({ order })
  } catch (error) {
    console.error('Order update error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = createSupabaseClient()
    const orderId = params.id
    
    if (!orderId) {
      return NextResponse.json(
        { error: 'Order ID is required' },
        { status: 400 }
      )
    }
    
    // Delete order items first (due to foreign key constraint)
    const { error: itemsError } = await supabase
      .from('order_items')
      .delete()
      .eq('order_id', orderId)
    
    if (itemsError) {
      console.error('Order items deletion error:', itemsError)
      return NextResponse.json(
        { error: 'Failed to delete order items' },
        { status: 500 }
      )
    }
    
    // Delete order
    const { error: orderError } = await supabase
      .from('orders')
      .delete()
      .eq('id', orderId)
    
    if (orderError) {
      console.error('Order deletion error:', orderError)
      return NextResponse.json(
        { error: 'Failed to delete order' },
        { status: 500 }
      )
    }
    
    return NextResponse.json({ message: 'Order deleted successfully' })
  } catch (error) {
    console.error('Order deletion error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
