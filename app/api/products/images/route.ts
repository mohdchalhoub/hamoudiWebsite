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

export async function POST(request: NextRequest) {
  try {
    const supabase = createSupabaseClient()
    const body = await request.json()
    
    const { productIds } = body
    
    if (!Array.isArray(productIds) || productIds.length === 0) {
      return NextResponse.json(
        { error: 'Product IDs array is required' },
        { status: 400 }
      )
    }
    
    // Fetch products with their images
    const { data: products, error } = await supabase
      .from('products')
      .select('id, name, images')
      .in('id', productIds)
    
    if (error) {
      console.error('Error fetching product images:', error)
      return NextResponse.json(
        { error: 'Failed to fetch product images' },
        { status: 500 }
      )
    }
    
    // Create a map of product ID to image URL
    const imageMap: Record<string, string> = {}
    
    products?.forEach(product => {
      if (product.images && Array.isArray(product.images) && product.images.length > 0) {
        // Use the first image
        imageMap[product.id] = product.images[0]
      }
    })
    
    return NextResponse.json({ 
      images: imageMap,
      count: Object.keys(imageMap).length
    })
    
  } catch (error) {
    console.error('Product images API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
