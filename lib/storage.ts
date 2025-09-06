import { supabase, supabaseAdmin } from './supabase'

export async function uploadImage(file: File, bucket: string = 'product-images'): Promise<string> {
  // Generate unique filename
  const fileExt = file.name.split('.').pop()
  const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`
  
  // Try with regular client first, fallback to admin client
  let uploadResult = await supabase.storage
    .from(bucket)
    .upload(fileName, file, {
      cacheControl: '3600',
      upsert: false
    })

  // If regular client fails due to RLS, try with admin client
  if (uploadResult.error && uploadResult.error.message.includes('row-level security')) {
    console.log('RLS error, retrying with admin client...')
    uploadResult = await supabaseAdmin.storage
      .from(bucket)
      .upload(fileName, file, {
        cacheControl: '3600',
        upsert: false
      })
  }

  if (uploadResult.error) {
    throw new Error(`Failed to upload image: ${uploadResult.error.message}`)
  }

  // Get public URL
  const { data: { publicUrl } } = supabase.storage
    .from(bucket)
    .getPublicUrl(uploadResult.data.path)

  return publicUrl
}

export async function deleteImage(url: string, bucket: string = 'product-images'): Promise<void> {
  try {
    // Extract file path from URL
    const urlParts = url.split('/')
    const fileName = urlParts[urlParts.length - 1]
    
    const { error } = await supabase.storage
      .from(bucket)
      .remove([fileName])

    if (error) {
      console.error('Failed to delete image:', error)
    }
  } catch (error) {
    console.error('Error deleting image:', error)
  }
}
