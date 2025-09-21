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

// Helper function to validate UUID
const isValidUUID = (uuid: string): boolean => {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i
  return uuidRegex.test(uuid)
}

// Update product stock quantity
export async function PUT(request: NextRequest) {
  try {
    const supabase = createSupabaseClient()
    const body = await request.json()
    
    const { productId, quantity, operation = 'set' } = body
    
    // Validate required fields
    if (!productId) {
      return NextResponse.json(
        { error: 'Product ID is required' },
        { status: 400 }
      )
    }
    
    if (typeof quantity !== 'number') {
      return NextResponse.json(
        { error: 'Quantity must be a number' },
        { status: 400 }
      )
    }
    
    // Validate UUID format
    if (!isValidUUID(productId)) {
      return NextResponse.json(
        { error: 'Invalid product ID format' },
        { status: 400 }
      )
    }
    
    // Get current product quantity
    const { data: product, error: fetchError } = await supabase
      .from('products')
      .select('quantity')
      .eq('id', productId)
      .single()
    
    if (fetchError || !product) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      )
    }
    
    let newQuantity: number
    
    // Calculate new quantity based on operation
    switch (operation) {
      case 'set':
        newQuantity = quantity
        break
      case 'add':
        newQuantity = product.quantity + quantity
        break
      case 'subtract':
        newQuantity = product.quantity - quantity
        break
      default:
        return NextResponse.json(
          { error: 'Invalid operation. Must be "set", "add", or "subtract"' },
          { status: 400 }
        )
    }
    
    // Ensure quantity doesn't go below 0
    if (newQuantity < 0) {
      return NextResponse.json(
        { error: 'Insufficient stock. Cannot reduce quantity below 0' },
        { status: 400 }
      )
    }
    
    // Update product quantity
    const { data: updatedProduct, error: updateError } = await supabase
      .from('products')
      .update({ 
        quantity: newQuantity,
        updated_at: new Date().toISOString()
      })
      .eq('id', productId)
      .select('id, name, quantity')
      .single()
    
    if (updateError) {
      console.error('Stock update error:', updateError)
      return NextResponse.json(
        { error: 'Failed to update stock' },
        { status: 500 }
      )
    }
    
    return NextResponse.json({ 
      success: true,
      product: updatedProduct,
      previousQuantity: product.quantity,
      newQuantity: newQuantity,
      operation: operation
    })
    
  } catch (error) {
    console.error('Stock update error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// Update stock for multiple products (for order confirmation)
export async function POST(request: NextRequest) {
  try {
    const supabase = createSupabaseClient()
    const body = await request.json()
    
    const { orderItems, operation = 'subtract' } = body
    
    // Validate required fields
    if (!Array.isArray(orderItems) || orderItems.length === 0) {
      return NextResponse.json(
        { error: 'Order items array is required' },
        { status: 400 }
      )
    }
    
    // Validate each order item
    for (const item of orderItems) {
      if (!item.productId || !isValidUUID(item.productId)) {
        return NextResponse.json(
          { error: 'Invalid product ID in order items' },
          { status: 400 }
        )
      }
      if (typeof item.quantity !== 'number' || item.quantity <= 0) {
        return NextResponse.json(
          { error: 'Invalid quantity in order items' },
          { status: 400 }
        )
      }
    }
    
    const results = []
    const errors = []
    
    // Process each order item
    for (const item of orderItems) {
      try {
        // Get current product quantity
        const { data: product, error: fetchError } = await supabase
          .from('products')
          .select('id, name, quantity')
          .eq('id', item.productId)
          .single()
        
        if (fetchError || !product) {
          errors.push({
            productId: item.productId,
            error: 'Product not found'
          })
          continue
        }
        
        let newQuantity: number
        
        // Calculate new quantity based on operation
        switch (operation) {
          case 'subtract':
            newQuantity = product.quantity - item.quantity
            break
          case 'add':
            newQuantity = product.quantity + item.quantity
            break
          case 'set':
            newQuantity = item.quantity
            break
          default:
            errors.push({
              productId: item.productId,
              error: 'Invalid operation'
            })
            continue
        }
        
        // Check if sufficient stock for subtraction
        if (operation === 'subtract' && newQuantity < 0) {
          errors.push({
            productId: item.productId,
            productName: product.name,
            error: `Insufficient stock. Available: ${product.quantity}, Required: ${item.quantity}`
          })
          continue
        }
        
        // Update product quantity
        const { data: updatedProduct, error: updateError } = await supabase
          .from('products')
          .update({ 
            quantity: newQuantity,
            updated_at: new Date().toISOString()
          })
          .eq('id', item.productId)
          .select('id, name, quantity')
          .single()
        
        if (updateError) {
          errors.push({
            productId: item.productId,
            error: 'Failed to update stock'
          })
          continue
        }
        
        results.push({
          productId: item.productId,
          productName: updatedProduct.name,
          previousQuantity: product.quantity,
          newQuantity: newQuantity,
          quantityChanged: item.quantity
        })
        
      } catch (itemError) {
        console.error(`Error processing item ${item.productId}:`, itemError)
        errors.push({
          productId: item.productId,
          error: 'Internal error processing item'
        })
      }
    }
    
    // If there are errors and no successful updates, return error
    if (errors.length > 0 && results.length === 0) {
      return NextResponse.json(
        { 
          error: 'Failed to update any stock',
          details: errors
        },
        { status: 400 }
      )
    }
    
    return NextResponse.json({ 
      success: true,
      results: results,
      errors: errors,
      summary: {
        totalItems: orderItems.length,
        successful: results.length,
        failed: errors.length
      }
    })
    
  } catch (error) {
    console.error('Bulk stock update error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
