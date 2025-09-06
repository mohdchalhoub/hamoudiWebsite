import { supabase, supabaseAdmin } from './supabase'
import { Database, Product, ProductWithDetails, CartItem, CartItemWithProduct, Order, OrderWithItems, Category, CategoryWithProductCount, ProductVariantInsert, Review } from './database.types'

// Categories
export async function getCategories(): Promise<Category[]> {
  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .eq('is_active', true)
    .order('sort_order')

  if (error) throw error
  return data || []
}

export async function getAllCategories(): Promise<Category[]> {
  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .order('sort_order')

  if (error) throw error
  return data || []
}

export async function getCategory(slug: string): Promise<Category | null> {
  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .eq('slug', slug)
    .eq('is_active', true)
    .single()

  if (error) {
    if (error.code === 'PGRST116') return null
    throw error
  }
  return data
}

// Products
export async function getProducts(filters?: {
  gender?: 'boys' | 'girls' | 'unisex'
  category?: string
  featured?: boolean
  active?: boolean
  limit?: number
  offset?: number
  search?: string
  min_price?: number
  max_price?: number
  age_range?: string
  _cacheBust?: number // Add cache busting parameter
}): Promise<ProductWithDetails[]> {
  let query = supabase
    .from('products')
    .select(`
      *,
      category:categories(*),
      variants:product_variants(*),
      reviews:reviews(*)
    `)

  if (filters?.gender) {
    query = query.eq('gender', filters.gender)
  }

  if (filters?.category) {
    query = query.eq('category_id', filters.category)
  }

  if (filters?.featured !== undefined) {
    query = query.eq('is_featured', filters.featured)
  }

  if (filters?.active !== undefined) {
    query = query.eq('is_active', filters.active)
  }

  if (filters?.search) {
    query = query.or(`name.ilike.%${filters.search}%,description.ilike.%${filters.search}%,short_description.ilike.%${filters.search}%`)
  }

  if (filters?.min_price !== undefined) {
    query = query.gte('price', filters.min_price)
  }

  if (filters?.max_price !== undefined) {
    query = query.lte('price', filters.max_price)
  }

  if (filters?.age_range) {
    query = query.eq('age_range', filters.age_range)
  }

  if (filters?.limit) {
    query = query.limit(filters.limit)
  }

  if (filters?.offset) {
    query = query.range(filters.offset, filters.offset + (filters.limit || 10) - 1)
  }

  const { data, error } = await query.order('created_at', { ascending: false })

  if (error) throw error

  // Calculate average rating and review count
  const productsWithRatings = (data || []).map(product => {
    const reviews = product.reviews || []
    const average_rating = reviews.length > 0 
      ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length 
      : 0
    const review_count = reviews.length

    return {
      ...product,
      average_rating: Math.round(average_rating * 10) / 10, // Round to 1 decimal
      review_count
    }
  })

  return productsWithRatings
}

export async function getProduct(slug: string): Promise<ProductWithDetails | null> {
  const { data, error } = await supabase
    .from('products')
    .select(`
      *,
      category:categories(*),
      variants:product_variants(*),
      reviews:reviews(*)
    `)
    .eq('slug', slug)
    .eq('is_active', true)
    .single()

  if (error) {
    if (error.code === 'PGRST116') return null
    throw error
  }

  // Calculate average rating and review count
  const reviews = data.reviews || []
  const average_rating = reviews.length > 0 
    ? reviews.reduce((sum: number, review: any) => sum + review.rating, 0) / reviews.length 
    : 0
  const review_count = reviews.length

  return {
    ...data,
    average_rating: Math.round(average_rating * 10) / 10,
    review_count
  }
}

export async function getProductById(id: string): Promise<ProductWithDetails | null> {
  const { data, error } = await supabase
    .from('products')
    .select(`
      *,
      category:categories(*),
      variants:product_variants(*),
      reviews:reviews(*)
    `)
    .eq('id', id)
    .single()

  if (error) {
    if (error.code === 'PGRST116') return null
    throw error
  }

  // Calculate average rating and review count
  const reviews = data.reviews || []
  const average_rating = reviews.length > 0 
    ? reviews.reduce((sum: number, review: any) => sum + review.rating, 0) / reviews.length 
    : 0
  const review_count = reviews.length

  return {
    ...data,
    average_rating: Math.round(average_rating * 10) / 10,
    review_count
  }
}

// Cart
export async function getCartItems(customerId?: string, sessionId?: string): Promise<CartItemWithProduct[]> {
  let query = supabase
    .from('cart_items')
    .select(`
      *,
      product:products(*),
      variant:product_variants(*)
    `)

  if (customerId) {
    query = query.eq('customer_id', customerId)
  } else if (sessionId) {
    query = query.eq('session_id', sessionId)
  } else {
    throw new Error('Either customerId or sessionId must be provided')
  }

  const { data, error } = await query.order('created_at', { ascending: false })

  if (error) throw error
  return data || []
}

export async function addToCart(
  productId: string, 
  variantId: string, 
  quantity: number = 1,
  customerId?: string,
  sessionId?: string
): Promise<CartItem> {
  if (!customerId && !sessionId) {
    throw new Error('Either customerId or sessionId must be provided')
  }

  // Check if item already exists in cart
  const { data: existingItem } = await supabase
    .from('cart_items')
    .select('*')
    .eq('variant_id', variantId)
    .eq(customerId ? 'customer_id' : 'session_id', customerId || sessionId)
    .single()

  if (existingItem) {
    // Update quantity
    const { data, error } = await supabase
      .from('cart_items')
      .update({ quantity: existingItem.quantity + quantity })
      .eq('id', existingItem.id)
      .select()
      .single()

    if (error) throw error
    return data
  } else {
    // Add new item
    const { data, error } = await supabase
      .from('cart_items')
      .insert({
        customer_id: customerId,
        session_id: sessionId,
        product_id: productId,
        variant_id: variantId,
        quantity
      })
      .select()
      .single()

    if (error) throw error
    return data
  }
}

export async function updateCartItemQuantity(cartItemId: string, quantity: number): Promise<CartItem> {
  if (quantity <= 0) {
    return removeFromCart(cartItemId)
  }

  const { data, error } = await supabase
    .from('cart_items')
    .update({ quantity })
    .eq('id', cartItemId)
    .select()
    .single()

  if (error) throw error
  return data
}

export async function removeFromCart(cartItemId: string): Promise<void> {
  const { error } = await supabase
    .from('cart_items')
    .delete()
    .eq('id', cartItemId)

  if (error) throw error
}

export async function clearCart(customerId?: string, sessionId?: string): Promise<void> {
  let query = supabase
    .from('cart_items')
    .delete()

  if (customerId) {
    query = query.eq('customer_id', customerId)
  } else if (sessionId) {
    query = query.eq('session_id', sessionId)
  } else {
    throw new Error('Either customerId or sessionId must be provided')
  }

  const { error } = await query
  if (error) throw error
}

// Orders
export async function createOrder(orderData: {
  customer_id?: string
  email: string
  shipping_address: any
  billing_address?: any
  cart_items: CartItemWithProduct[]
  subtotal: number
  tax_amount?: number
  shipping_amount?: number
  discount_amount?: number
  total_amount: number
  notes?: string
  payment_method?: string
  payment_reference?: string
}): Promise<Order> {
  // Create order
  const { data: order, error: orderError } = await supabase
    .from('orders')
    .insert({
      customer_id: orderData.customer_id,
      email: orderData.email,
      shipping_address: orderData.shipping_address,
      billing_address: orderData.billing_address,
      subtotal: orderData.subtotal,
      tax_amount: orderData.tax_amount || 0,
      shipping_amount: orderData.shipping_amount || 0,
      discount_amount: orderData.discount_amount || 0,
      total_amount: orderData.total_amount,
      notes: orderData.notes,
      payment_method: orderData.payment_method,
      payment_reference: orderData.payment_reference,
      status: 'pending'
    })
    .select()
    .single()

  if (orderError) throw orderError

  // Create order items
  const orderItems = orderData.cart_items.map(item => ({
    order_id: order.id,
    product_id: item.product_id,
    variant_id: item.variant_id,
    product_name: item.product?.name || '',
    product_sku: item.variant?.sku || null,
    variant_description: item.variant ? `${item.variant.size}, ${item.variant.color}` : null,
    quantity: item.quantity,
    unit_price: (item.product?.price || 0) + (item.variant?.price_adjustment || 0),
    total_price: ((item.product?.price || 0) + (item.variant?.price_adjustment || 0)) * item.quantity
  }))

  const { error: itemsError } = await supabase
    .from('order_items')
    .insert(orderItems)

  if (itemsError) throw itemsError

  return order
}

export async function getOrder(orderNumber: string): Promise<OrderWithItems | null> {
  const { data, error } = await supabase
    .from('orders')
    .select(`
      *,
      order_items(*),
      customer:customers(*)
    `)
    .eq('order_number', orderNumber)
    .single()

  if (error) {
    if (error.code === 'PGRST116') return null
    throw error
  }
  return data
}

export async function getOrdersByCustomer(customerId: string): Promise<OrderWithItems[]> {
  const { data, error } = await supabase
    .from('orders')
    .select(`
      *,
      order_items(*)
    `)
    .eq('customer_id', customerId)
    .order('created_at', { ascending: false })

  if (error) throw error
  return data || []
}

// Search
export async function searchProducts(query: string, filters?: {
  gender?: 'boys' | 'girls' | 'unisex'
  category?: string
  min_price?: number
  max_price?: number
}): Promise<ProductWithDetails[]> {
  return getProducts({
    search: query,
    ...filters
  })
}

// Admin functions (using service role)
export async function createProduct(productData: any): Promise<Product> {
  // Extract variants from the product data
  const { variants, ...productInfo } = productData
  
  // Validate required fields
  if (!productInfo.name?.trim()) {
    throw new Error('Product name is required')
  }
  
  if (!productInfo.category_id) {
    throw new Error('Category is required')
  }
  
  if (!productInfo.image_url?.trim()) {
    throw new Error('Product image URL is required')
  }
  
  // Generate slug from name
  const slug = productInfo.name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')

  // Prepare product data for insertion
  const productInsertData = {
    ...productInfo,
    slug,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  }

  // Create the product
  const { data: product, error: productError } = await supabaseAdmin
    .from('products')
    .insert(productInsertData)
    .select()
    .single()

  if (productError) throw productError

  // Create variants if they exist
  if (variants && variants.length > 0) {
    const variantData = variants.map((variant: any) => ({
      product_id: product.id,
      size: variant.size,
      color: variant.color,
      color_hex: variant.color_hex,
      stock_quantity: variant.stock_quantity,
      price_adjustment: variant.price_adjustment || 0,
      sku: variant.sku || `${product.name.substring(0, 3).toUpperCase()}-${variant.size}-${variant.color.substring(0, 3).toUpperCase()}-${Date.now().toString().slice(-4)}`,
      created_at: new Date().toISOString()
    }))

    const { error: variantError } = await supabaseAdmin
      .from('product_variants')
      .insert(variantData)

    if (variantError) {
      // If variant creation fails, delete the product
      await supabaseAdmin.from('products').delete().eq('id', product.id)
      throw variantError
    }
  }

  return product
}

export async function updateProduct(id: string, updates: ProductUpdate): Promise<Product> {
  const { data, error } = await supabaseAdmin
    .from('products')
    .update(updates)
    .eq('id', id)
    .select()
    .single()

  if (error) throw error
  return data
}

export async function deleteProduct(id: string): Promise<void> {
  const { error } = await supabaseAdmin
    .from('products')
    .delete()
    .eq('id', id)

  if (error) throw error
}

export async function getAllOrders(): Promise<OrderWithItems[]> {
  const { data, error } = await supabaseAdmin
    .from('orders')
    .select(`
      *,
      order_items(*),
      customer:customers(*)
    `)
    .order('created_at', { ascending: false })

  if (error) throw error
  return data || []
}

export async function updateOrderStatus(orderId: string, status: string): Promise<Order> {
  const { data, error } = await supabaseAdmin
    .from('orders')
    .update({ status })
    .eq('id', orderId)
    .select()
    .single()

  if (error) throw error
  return data
}

// Reviews
export async function getProductReviews(productId: string): Promise<Review[]> {
  const { data, error } = await supabase
    .from('reviews')
    .select(`
      *,
      customer:customers(first_name, last_name)
    `)
    .eq('product_id', productId)
    .eq('is_approved', true)
    .order('created_at', { ascending: false })

  if (error) throw error
  return data || []
}

export async function createReview(reviewData: {
  product_id: string
  customer_id?: string
  order_id?: string
  rating: number
  title?: string
  comment?: string
}): Promise<Review> {
  const { data, error } = await supabase
    .from('reviews')
    .insert({
      ...reviewData,
      is_verified_purchase: !!reviewData.order_id,
      is_approved: false // Require approval
    })
    .select()
    .single()

  if (error) throw error
  return data
}
