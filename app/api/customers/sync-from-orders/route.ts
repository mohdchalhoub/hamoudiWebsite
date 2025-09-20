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

// POST - Sync customers from existing orders
export async function POST(request: NextRequest) {
  try {
    const supabase = createSupabaseClient()
    
    console.log('Starting customer sync from orders...')
    
    // Get all orders that don't have customer_id
    const { data: ordersWithoutCustomers, error: ordersError } = await supabase
      .from('orders')
      .select('id, shipping_address, created_at')
      .is('customer_id', null)
      .order('created_at', { ascending: false })
    
    if (ordersError) {
      console.error('Error fetching orders:', ordersError)
      return NextResponse.json(
        { error: 'Failed to fetch orders' },
        { status: 500 }
      )
    }
    
    if (!ordersWithoutCustomers || ordersWithoutCustomers.length === 0) {
      return NextResponse.json({
        message: 'No orders without customer records found',
        created: 0,
        updated: 0
      })
    }
    
    console.log(`Found ${ordersWithoutCustomers.length} orders without customer records`)
    
    let customersCreated = 0
    let ordersUpdated = 0
    const customerMap = new Map() // Track customers by phone to avoid duplicates
    
    for (const order of ordersWithoutCustomers) {
      try {
        const shippingAddress = order.shipping_address as any
        
        if (!shippingAddress?.name || !shippingAddress?.phone) {
          console.log(`Skipping order ${order.id} - missing customer info`)
          continue
        }
        
        const phone = shippingAddress.phone
        let customerId = customerMap.get(phone)
        
        if (!customerId) {
          // Check if customer already exists in database
          const { data: existingCustomer } = await supabase
            .from('customers')
            .select('id')
            .eq('phone', phone)
            .single()
          
          if (existingCustomer) {
            customerId = existingCustomer.id
            customerMap.set(phone, customerId)
            console.log(`Found existing customer for phone ${phone}: ${customerId}`)
          } else {
            // Create new customer
            const nameParts = shippingAddress.name.trim().split(' ')
            const firstName = nameParts[0] || 'Customer'
            const lastName = nameParts.slice(1).join(' ') || ''
            
            // Generate email from name and phone
            const email = `${firstName.toLowerCase()}.${lastName.toLowerCase()}.${phone.replace(/\+/g, '').slice(-4)}@customer.placeholder`.replace(/\.\./g, '.')
            
            const { data: newCustomer, error: customerError } = await supabase
              .from('customers')
              .insert({
                first_name: firstName,
                last_name: lastName,
                email: email,
                phone: phone,
              })
              .select('id')
              .single()
            
            if (customerError) {
              console.error(`Error creating customer for order ${order.id}:`, customerError)
              continue
            }
            
            customerId = newCustomer.id
            customerMap.set(phone, customerId)
            customersCreated++
            console.log(`Created customer: ${firstName} ${lastName} (${customerId})`)
          }
        }
        
        // Update order with customer_id
        const { error: updateError } = await supabase
          .from('orders')
          .update({ customer_id: customerId })
          .eq('id', order.id)
        
        if (updateError) {
          console.error(`Error updating order ${order.id}:`, updateError)
        } else {
          ordersUpdated++
          console.log(`Updated order ${order.id} with customer ${customerId}`)
        }
        
      } catch (error) {
        console.error(`Error processing order ${order.id}:`, error)
      }
    }
    
    return NextResponse.json({
      message: 'Customer sync completed',
      ordersProcessed: ordersWithoutCustomers.length,
      customersCreated,
      ordersUpdated,
      uniqueCustomers: customerMap.size
    })
    
  } catch (error) {
    console.error('Customer sync error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
