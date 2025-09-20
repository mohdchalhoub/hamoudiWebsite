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

// GET - Fetch all customers from the customers table with their order statistics
export async function GET(request: NextRequest) {
  try {
    const supabase = createSupabaseClient()
    
    // First, get all customers from the customers table
    const { data: customers, error: customersError } = await supabase
      .from('customers')
      .select('*')
      .order('created_at', { ascending: false })
    
    if (customersError) {
      console.error('Error fetching customers:', customersError)
      return NextResponse.json(
        { error: 'Failed to fetch customers' },
        { status: 500 }
      )
    }
    
    // Get order statistics for each customer
    const customersWithStats = await Promise.all(
      (customers || []).map(async (customer) => {
        // Get order statistics for this customer
        const { data: orders, error: ordersError } = await supabase
          .from('orders')
          .select('total_amount, created_at, status')
          .eq('customer_id', customer.id)
        
        if (ordersError) {
          console.error(`Error fetching orders for customer ${customer.id}:`, ordersError)
        }
        
        const orderStats = orders || []
        const totalOrders = orderStats.length
        const totalSpent = orderStats.reduce((sum, order) => sum + (order.total_amount || 0), 0)
        const lastOrderDate = orderStats.length > 0 
          ? orderStats.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())[0].created_at
          : null
        const firstOrderDate = orderStats.length > 0
          ? orderStats.sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime())[0].created_at
          : null
        
        return {
          id: customer.id,
          name: `${customer.first_name} ${customer.last_name}`.trim(),
          email: customer.email,
          phone: customer.phone || 'N/A',
          address: 'N/A', // Customers table doesn't have address directly
          totalOrders,
          totalSpent,
          lastOrderDate: lastOrderDate || customer.created_at,
          firstOrderDate: firstOrderDate || customer.created_at,
          createdAt: customer.created_at
        }
      })
    )
    
    // If no customers in customers table, fallback to extracting from orders
    if (customersWithStats.length === 0) {
      console.log('No customers found in customers table, extracting from orders...')
      
      const { data: orders, error: ordersError } = await supabase
        .from('orders')
        .select(`
          shipping_address,
          created_at,
          total_amount,
          status
        `)
        .order('created_at', { ascending: false })
      
      if (ordersError) {
        console.error('Error fetching orders:', ordersError)
        return NextResponse.json(
          { error: 'Failed to fetch customer data' },
          { status: 500 }
        )
      }
      
      // Group orders by customer to create customer profiles
      const customerMap = new Map()
      
      orders?.forEach((order) => {
        const shippingAddress = order.shipping_address as any
        const customerKey = `${shippingAddress?.name}-${shippingAddress?.phone}` // Use name + phone as unique key
        
        if (!shippingAddress?.name) return // Skip orders without customer info
        
        const existing = customerMap.get(customerKey)
        if (existing) {
          existing.totalOrders += 1
          existing.totalSpent += order.total_amount || 0
          existing.orders.push({
            total: order.total_amount,
            status: order.status,
            date: order.created_at
          })
          if (new Date(order.created_at || '') > new Date(existing.lastOrderDate)) {
            existing.lastOrderDate = order.created_at
          }
        } else {
          customerMap.set(customerKey, {
            id: customerKey,
            name: shippingAddress.name,
            email: 'N/A',
            phone: shippingAddress.phone || 'N/A',
            address: shippingAddress.address || 'N/A',
            totalOrders: 1,
            totalSpent: order.total_amount || 0,
            lastOrderDate: order.created_at,
            firstOrderDate: order.created_at,
            orders: [{
              total: order.total_amount,
              status: order.status,
              date: order.created_at
            }]
          })
        }
      })
      
      const customerList = Array.from(customerMap.values()).sort((a, b) => 
        new Date(b.lastOrderDate).getTime() - new Date(a.lastOrderDate).getTime()
      )
      
      return NextResponse.json({ 
        customers: customerList,
        count: customerList.length,
        source: 'orders_fallback'
      })
    }
    
    return NextResponse.json({ 
      customers: customersWithStats,
      count: customersWithStats.length,
      source: 'customers_table'
    })
    
  } catch (error) {
    console.error('Customers API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// POST - Add new customer to the customers table
export async function POST(request: NextRequest) {
  try {
    const supabase = createSupabaseClient()
    const body = await request.json()
    
    const { firstName, lastName, email, phone } = body
    
    // Validate required fields
    if (!firstName || !lastName || !email) {
      return NextResponse.json(
        { error: 'First name, last name, and email are required' },
        { status: 400 }
      )
    }
    
    // Check if email already exists
    const { data: existingCustomer, error: checkError } = await supabase
      .from('customers')
      .select('id')
      .eq('email', email.trim().toLowerCase())
      .single()
    
    if (checkError && checkError.code !== 'PGRST116') { // PGRST116 = not found
      console.error('Error checking existing customer:', checkError)
      return NextResponse.json(
        { error: 'Failed to validate customer' },
        { status: 500 }
      )
    }
    
    if (existingCustomer) {
      return NextResponse.json(
        { error: 'Customer with this email already exists' },
        { status: 400 }
      )
    }
    
    // Create new customer
    const customerData = {
      first_name: firstName.trim(),
      last_name: lastName.trim(),
      email: email.trim().toLowerCase(),
      phone: phone?.trim() || null,
    }
    
    const { data: customer, error } = await supabase
      .from('customers')
      .insert([customerData])
      .select()
      .single()
    
    if (error) {
      console.error('Error creating customer:', error)
      return NextResponse.json(
        { error: 'Failed to create customer' },
        { status: 500 }
      )
    }
    
    return NextResponse.json({ 
      customer: {
        id: customer.id,
        name: `${customer.first_name} ${customer.last_name}`,
        email: customer.email,
        phone: customer.phone || 'N/A',
        address: 'N/A',
        totalOrders: 0,
        totalSpent: 0,
        lastOrderDate: customer.created_at,
        firstOrderDate: customer.created_at
      }
    })
    
  } catch (error) {
    console.error('Customer creation error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}