import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

// Create Supabase client function
function createSupabaseClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://xsefkpirpfjkzxndoltl.supabase.co'
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhzZWZrcGlycGZqa3p4bmRvbHRsIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NzExMzA4MCwiZXhwIjoyMDcyNjg5MDgwfQ.KU9M-2I8yZlHiIDluQYGeGQdALTS4OYzu6kuZheunlI'
  
  return createClient(supabaseUrl, supabaseServiceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  })
}

// Helper function to check if ID is a UUID
function isUUID(id: string): boolean {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i
  return uuidRegex.test(id)
}

// GET - Fetch specific customer with their orders
export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const supabase = createSupabaseClient()
    const customerId = decodeURIComponent(params.id)
    
    // Check if it's a UUID (from customers table) or a legacy composite ID
    if (isUUID(customerId)) {
      // Fetch from customers table
      const { data: customer, error: customerError } = await supabase
        .from('customers')
        .select('*')
        .eq('id', customerId)
        .single()
      
      if (customerError) {
        if (customerError.code === 'PGRST116') {
          return NextResponse.json(
            { error: 'Customer not found' },
            { status: 404 }
          )
        }
        console.error('Error fetching customer:', customerError)
        return NextResponse.json(
          { error: 'Failed to fetch customer details' },
          { status: 500 }
        )
      }
      
      // Fetch customer's orders
      const { data: orders, error: ordersError } = await supabase
        .from('orders')
        .select(`
          *,
          order_items(*)
        `)
        .eq('customer_id', customerId)
        .order('created_at', { ascending: false })
      
      if (ordersError) {
        console.error('Error fetching customer orders:', ordersError)
        return NextResponse.json(
          { error: 'Failed to fetch customer orders' },
          { status: 500 }
        )
      }
      
      // Build customer profile
      const customerProfile = {
        id: customer.id,
        name: `${customer.first_name} ${customer.last_name}`.trim(),
        email: customer.email,
        phone: customer.phone || 'N/A',
        address: 'N/A', // TODO: Get from addresses table if needed
        totalOrders: orders?.length || 0,
        totalSpent: orders?.reduce((sum, order) => sum + (order.total_amount || 0), 0) || 0,
        firstOrderDate: orders?.length > 0 ? orders[orders.length - 1].created_at : customer.created_at,
        lastOrderDate: orders?.length > 0 ? orders[0].created_at : customer.created_at,
        orders: orders?.map(order => ({
          id: order.id,
          orderNumber: order.order_number,
          total: order.total_amount,
          status: order.status,
          date: order.created_at,
          itemsCount: order.order_items?.length || 0
        })) || []
      }
      
      return NextResponse.json({ customer: customerProfile })
      
    } else {
      // Legacy fallback: Parse composite ID from orders data
      const [name, phone] = customerId.split('-')
      
      if (!name || !phone) {
        return NextResponse.json(
          { error: 'Invalid customer ID format' },
          { status: 400 }
        )
      }
      
      // Fetch all orders for this customer from shipping_address
      const { data: orders, error } = await supabase
        .from('orders')
        .select(`
          *,
          order_items(*)
        `)
        .contains('shipping_address', { name })
        .order('created_at', { ascending: false })
      
      if (error) {
        console.error('Error fetching customer orders:', error)
        return NextResponse.json(
          { error: 'Failed to fetch customer details' },
          { status: 500 }
        )
      }
      
      // Filter orders that exactly match the customer (name + phone)
      const customerOrders = orders?.filter(order => {
        const shippingAddress = order.shipping_address as any
        return shippingAddress?.name === name && shippingAddress?.phone === phone
      }) || []
      
      if (customerOrders.length === 0) {
        return NextResponse.json(
          { error: 'Customer not found' },
          { status: 404 }
        )
      }
      
      // Build customer profile from orders data
      const firstOrder = customerOrders[customerOrders.length - 1]
      const latestOrder = customerOrders[0]
      const shippingAddress = firstOrder.shipping_address as any
      
      const customer = {
        id: customerId,
        name: shippingAddress.name,
        email: 'N/A',
        phone: shippingAddress.phone || 'N/A',
        address: shippingAddress.address || 'N/A',
        totalOrders: customerOrders.length,
        totalSpent: customerOrders.reduce((sum, order) => sum + (order.total_amount || 0), 0),
        firstOrderDate: firstOrder.created_at,
        lastOrderDate: latestOrder.created_at,
        orders: customerOrders.map(order => ({
          id: order.id,
          orderNumber: order.order_number,
          total: order.total_amount,
          status: order.status,
          date: order.created_at,
          itemsCount: order.order_items?.length || 0
        }))
      }
      
      return NextResponse.json({ customer })
    }
    
  } catch (error) {
    console.error('Customer fetch error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// PUT - Update customer information
export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const supabase = createSupabaseClient()
    const customerId = decodeURIComponent(params.id)
    const body = await request.json()
    
    const { firstName, lastName, email, phone } = body
    
    // Validate required fields
    if (!firstName || !lastName || !email) {
      return NextResponse.json(
        { error: 'First name, last name, and email are required' },
        { status: 400 }
      )
    }
    
    if (isUUID(customerId)) {
      // Update in customers table
      const updateData = {
        first_name: firstName.trim(),
        last_name: lastName.trim(),
        email: email.trim().toLowerCase(),
        phone: phone?.trim() || null,
        updated_at: new Date().toISOString()
      }
      
      const { data: customer, error } = await supabase
        .from('customers')
        .update(updateData)
        .eq('id', customerId)
        .select()
        .single()
      
      if (error) {
        console.error('Error updating customer:', error)
        return NextResponse.json(
          { error: 'Failed to update customer' },
          { status: 500 }
        )
      }
      
      return NextResponse.json({ 
        success: true,
        message: 'Customer updated successfully',
        customer: {
          id: customer.id,
          name: `${customer.first_name} ${customer.last_name}`,
          email: customer.email,
          phone: customer.phone || 'N/A'
        }
      })
      
    } else {
      // Legacy update: Update shipping_address in orders
      return NextResponse.json(
        { error: 'Cannot update legacy customer records. Please create a new customer.' },
        { status: 400 }
      )
    }
    
  } catch (error) {
    console.error('Customer update error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// DELETE - Delete customer
export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const supabase = createSupabaseClient()
    const customerId = decodeURIComponent(params.id)
    
    if (isUUID(customerId)) {
      // Check if customer has orders
      const { data: orders, error: ordersError } = await supabase
        .from('orders')
        .select('id, status')
        .eq('customer_id', customerId)
      
      if (ordersError) {
        console.error('Error checking customer orders:', ordersError)
        return NextResponse.json(
          { error: 'Failed to check customer orders' },
          { status: 500 }
        )
      }
      
      // Check if customer has active orders
      const activeOrders = orders?.filter(order => 
        order.status !== 'cancelled' && order.status !== 'refunded'
      ) || []
      
      if (activeOrders.length > 0) {
        return NextResponse.json(
          { 
            error: 'Cannot delete customer with active orders',
            activeOrdersCount: activeOrders.length,
            suggestion: 'Cancel all active orders first'
          },
          { status: 400 }
        )
      }
      
      // Delete customer from customers table
      const { error } = await supabase
        .from('customers')
        .delete()
        .eq('id', customerId)
      
      if (error) {
        console.error('Error deleting customer:', error)
        return NextResponse.json(
          { error: 'Failed to delete customer' },
          { status: 500 }
        )
      }
      
      return NextResponse.json({ 
        success: true,
        message: 'Customer deleted successfully'
      })
      
    } else {
      // Legacy delete: Cannot delete composite ID customers
      return NextResponse.json(
        { error: 'Cannot delete legacy customer records' },
        { status: 400 }
      )
    }
    
  } catch (error) {
    console.error('Customer delete error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}