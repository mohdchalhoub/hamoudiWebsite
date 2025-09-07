import { createClient } from '@supabase/supabase-js'

// Use environment variables for security
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://xsefkpirpfjkzxndoltl.supabase.co'
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhzZWZrcGlycGZqa3p4bmRvbHRsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTcxMTMwODAsImV4cCI6MjA3MjY4OTA4MH0.nfhVwyA0WVClb3K3rmvPa4qSMGZ_HfFVDdW-fXoSlKI'
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhzZWZrcGlycGZqa3p4bmRvbHRsIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NzExMzA4MCwiZXhwIjoyMDcyNjg5MDgwfQ.KU9M-2I8yZlHiIDluQYGeGQdALTS4OYzu6kuZheunlI'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// For server-side operations that need elevated permissions
export const supabaseAdmin = createClient(
  supabaseUrl,
  serviceRoleKey,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  }
)
