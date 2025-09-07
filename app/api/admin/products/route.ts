import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { headers } from 'next/headers'

// Create Supabase client for server-side operations
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
})

// Admin email whitelist
const ADMIN_EMAILS = process.env.ADMIN_EMAILS?.split(',') || ['mohamadchalhoub24@gmail.com']

async function verifyAdminAuth(request: NextRequest) {
  try {
    // Get the authorization header
    const authHeader = request.headers.get('authorization')
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return { error: 'Missing or invalid authorization header', user: null }
    }

    const token = authHeader.substring(7)
    
    // Verify the JWT token with Supabase
    const { data: { user }, error } = await supabase.auth.getUser(token)
    
    if (error || !user) {
      return { error: 'Invalid token', user: null }
    }

    // Check if user is in admin whitelist
    if (!ADMIN_EMAILS.includes(user.email!)) {
      return { error: 'Unauthorized: Not an admin user', user: null }
    }

    return { error: null, user }
  } catch (error) {
    console.error('Auth verification error:', error)
    return { error: 'Authentication failed', user: null }
  }
}

export async function GET(request: NextRequest) {
  try {
    const { error, user } = await verifyAdminAuth(request)
    if (error) {
      return NextResponse.json({ error }, { status: 401 })
    }

    // Fetch products with admin privileges
    const { data: products, error: dbError } = await supabase
      .from('products')
      .select(`
        *,
        category:categories(*),
        variants:product_variants(*),
        reviews:reviews(*)
      `)
      .eq('is_active', true)
      .order('created_at', { ascending: false })

    if (dbError) {
      return NextResponse.json({ error: 'Failed to fetch products' }, { status: 500 })
    }

    return NextResponse.json({ products })
  } catch (error) {
    console.error('GET /api/admin/products error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const { error, user } = await verifyAdminAuth(request)
    if (error) {
      return NextResponse.json({ error }, { status: 401 })
    }

    const productData = await request.json()
    
    // Validate required fields
    if (!productData.name?.trim()) {
      return NextResponse.json({ error: 'Product name is required' }, { status: 400 })
    }
    
    if (!productData.category_id) {
      return NextResponse.json({ error: 'Category is required' }, { status: 400 })
    }

    // Create product with admin privileges
    const { data: product, error: dbError } = await supabase
      .from('products')
      .insert({
        ...productData,
        created_by: user.id,
        updated_by: user.id
      })
      .select()
      .single()

    if (dbError) {
      return NextResponse.json({ error: 'Failed to create product' }, { status: 500 })
    }

    return NextResponse.json({ product }, { status: 201 })
  } catch (error) {
    console.error('POST /api/admin/products error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
