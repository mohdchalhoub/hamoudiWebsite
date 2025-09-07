/**
 * Code generation utilities for products and variants
 */

// Generate a unique 6-digit product code
export async function generateProductCode(): Promise<string> {
  const { supabaseAdmin } = await import('./supabase')
  
  let attempts = 0
  const maxAttempts = 100
  
  while (attempts < maxAttempts) {
    // Generate a random 6-digit number
    const code = Math.floor(100000 + Math.random() * 900000).toString()
    
    // Check if this code already exists
    const { data, error } = await supabaseAdmin
      .from('products')
      .select('id')
      .eq('product_code', code)
      .single()
    
    if (error && error.code === 'PGRST116') {
      // Code doesn't exist, we can use it
      return code
    }
    
    if (error) {
      throw error
    }
    
    attempts++
  }
  
  throw new Error('Unable to generate unique product code after maximum attempts')
}

// Generate a consistent 3-digit variant code based on size/age + color
export async function generateVariantCode(sizeOrAge: string, color: string): Promise<string> {
  const { supabaseAdmin } = await import('./supabase')
  
  // First, check if a code already exists for this combination
  const { data: existingVariant, error: checkError } = await supabaseAdmin
    .from('product_variants')
    .select('variant_code')
    .or(`size.eq.${sizeOrAge},age_range.eq.${sizeOrAge}`)
    .eq('color', color)
    .not('variant_code', 'is', null)
    .single()
  
  if (existingVariant && existingVariant.variant_code) {
    return existingVariant.variant_code
  }
  
  // If no existing code, generate a new one
  let attempts = 0
  const maxAttempts = 100
  
  while (attempts < maxAttempts) {
    // Generate a random 3-digit number
    const code = Math.floor(100 + Math.random() * 900).toString()
    
    // Check if this code already exists
    const { data, error } = await supabaseAdmin
      .from('product_variants')
      .select('id')
      .eq('variant_code', code)
      .single()
    
    if (error && error.code === 'PGRST116') {
      // Code doesn't exist, we can use it
      return code
    }
    
    if (error) {
      throw error
    }
    
    attempts++
  }
  
  throw new Error('Unable to generate unique variant code after maximum attempts')
}

// Helper function to get variant code for existing combinations
export async function getVariantCode(sizeOrAge: string, color: string): Promise<string | null> {
  const { supabaseAdmin } = await import('./supabase')
  
  const { data, error } = await supabaseAdmin
    .from('product_variants')
    .select('variant_code')
    .or(`size.eq.${sizeOrAge},age_range.eq.${sizeOrAge}`)
    .eq('color', color)
    .not('variant_code', 'is', null)
    .single()
  
  if (error && error.code === 'PGRST116') {
    return null
  }
  
  if (error) {
    throw error
  }
  
  return data?.variant_code || null
}
