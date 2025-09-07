// Security configuration and utilities

export const SECURITY_CONFIG = {
  // Admin email whitelist
  ADMIN_EMAILS: process.env.ADMIN_EMAILS?.split(',') || ['mohamadchalhoub24@gmail.com'],
  
  // Rate limiting configuration
  RATE_LIMIT: {
    LOGIN_ATTEMPTS: 5,
    LOGIN_WINDOW: 15 * 60 * 1000, // 15 minutes
    API_REQUESTS: 100,
    API_WINDOW: 60 * 1000, // 1 minute
  },
  
  // Session configuration
  SESSION: {
    MAX_AGE: 24 * 60 * 60 * 1000, // 24 hours
    REFRESH_THRESHOLD: 5 * 60 * 1000, // 5 minutes before expiry
  },
  
  // Input validation
  VALIDATION: {
    MAX_PRODUCT_NAME_LENGTH: 200,
    MAX_DESCRIPTION_LENGTH: 2000,
    MAX_IMAGE_SIZE: 5 * 1024 * 1024, // 5MB
    ALLOWED_IMAGE_TYPES: ['image/jpeg', 'image/png', 'image/webp'],
  }
}

// Rate limiting store (in production, use Redis or similar)
const rateLimitStore = new Map<string, { count: number; resetTime: number }>()

export function checkRateLimit(identifier: string, limit: number, window: number): boolean {
  const now = Date.now()
  const key = identifier
  const current = rateLimitStore.get(key)
  
  if (!current || now > current.resetTime) {
    rateLimitStore.set(key, { count: 1, resetTime: now + window })
    return true
  }
  
  if (current.count >= limit) {
    return false
  }
  
  current.count++
  return true
}

export function isAdminEmail(email: string): boolean {
  return SECURITY_CONFIG.ADMIN_EMAILS.includes(email.toLowerCase())
}

export function validateProductData(data: any): { valid: boolean; errors: string[] } {
  const errors: string[] = []
  
  if (!data.name || typeof data.name !== 'string' || data.name.trim().length === 0) {
    errors.push('Product name is required')
  } else if (data.name.length > SECURITY_CONFIG.VALIDATION.MAX_PRODUCT_NAME_LENGTH) {
    errors.push(`Product name must be less than ${SECURITY_CONFIG.VALIDATION.MAX_PRODUCT_NAME_LENGTH} characters`)
  }
  
  if (data.description && data.description.length > SECURITY_CONFIG.VALIDATION.MAX_DESCRIPTION_LENGTH) {
    errors.push(`Description must be less than ${SECURITY_CONFIG.VALIDATION.MAX_DESCRIPTION_LENGTH} characters`)
  }
  
  if (!data.category_id) {
    errors.push('Category is required')
  }
  
  if (typeof data.price !== 'number' || data.price < 0) {
    errors.push('Valid price is required')
  }
  
  return {
    valid: errors.length === 0,
    errors
  }
}

export function sanitizeInput(input: string): string {
  return input
    .trim()
    .replace(/[<>]/g, '') // Remove potential HTML tags
    .substring(0, 1000) // Limit length
}

// Security headers for API responses
export const SECURITY_HEADERS = {
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'DENY',
  'X-XSS-Protection': '1; mode=block',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
}
