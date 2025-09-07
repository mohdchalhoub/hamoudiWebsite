/**
 * Security utilities for input sanitization, validation, and protection
 * Implements OWASP Top 10 security measures
 */

// Rate limiting removed as requested

/**
 * Sanitize input to prevent XSS attacks
 * Removes or escapes potentially dangerous characters
 */
export function sanitizeInput(input: string): string {
  if (!input || typeof input !== 'string') {
    return ''
  }

  return input
    // Remove null bytes
    .replace(/\0/g, '')
    // Remove control characters except newlines and tabs
    .replace(/[\x01-\x08\x0B\x0C\x0E-\x1F\x7F]/g, '')
    // Escape HTML entities
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;')
    // Remove script tags and their content
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    // Remove javascript: protocols
    .replace(/javascript:/gi, '')
    // Remove data: protocols (except safe image types)
    .replace(/data:(?!image\/(png|jpg|jpeg|gif|webp|svg))/gi, '')
    // Remove vbscript: protocols
    .replace(/vbscript:/gi, '')
    // Remove on* event handlers
    .replace(/\bon\w+\s*=/gi, '')
    // Trim whitespace
    .trim()
}

/**
 * Validate search input for allowed characters and length
 * Prevents injection attacks and ensures reasonable input size
 */
export function validateSearchInput(input: string): { isValid: boolean; error?: string } {
  if (!input || typeof input !== 'string') {
    return { isValid: false, error: 'Invalid input type' }
  }

  // Check length limits
  if (input.length === 0) {
    return { isValid: false, error: 'Search query cannot be empty' }
  }

  if (input.length > 100) {
    return { isValid: false, error: 'Search query too long (max 100 characters)' }
  }

  // Check for minimum meaningful length after sanitization
  const sanitized = sanitizeInput(input)
  if (sanitized.length < 1) {
    return { isValid: false, error: 'Search query contains only invalid characters' }
  }

  // Allow only safe characters: letters, numbers, spaces, basic punctuation
  const allowedPattern = /^[a-zA-Z0-9\s\-_.,!?()]+$/
  if (!allowedPattern.test(sanitized)) {
    return { isValid: false, error: 'Search query contains invalid characters' }
  }

  // Check for suspicious patterns that might indicate injection attempts
  const suspiciousPatterns = [
    /union\s+select/i,
    /drop\s+table/i,
    /delete\s+from/i,
    /insert\s+into/i,
    /update\s+set/i,
    /exec\s*\(/i,
    /script\s*>/i,
    /<script/i,
    /javascript:/i,
    /vbscript:/i,
    /onload\s*=/i,
    /onerror\s*=/i,
    /onclick\s*=/i,
    /eval\s*\(/i,
    /expression\s*\(/i,
    /url\s*\(/i,
    /import\s+/i,
    /require\s*\(/i,
    /document\./i,
    /window\./i,
    /alert\s*\(/i,
    /confirm\s*\(/i,
    /prompt\s*\(/i
  ]

  for (const pattern of suspiciousPatterns) {
    if (pattern.test(input)) {
      return { isValid: false, error: 'Search query contains potentially malicious content' }
    }
  }

  return { isValid: true }
}

// Rate limiting functions removed as requested

/**
 * Escape special regex characters to prevent regex injection
 */
export function escapeRegexChars(input: string): string {
  return input.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

/**
 * Validate and sanitize search tokens
 */
export function processSearchTokens(input: string): { tokens: string[]; error?: string } {
  // First validate the input
  const validation = validateSearchInput(input)
  if (!validation.isValid) {
    return { tokens: [], error: validation.error }
  }

  // Sanitize the input
  const sanitized = sanitizeInput(input)
  
  // Define stop words
  const stopWords = new Set([
    'a', 'an', 'and', 'are', 'as', 'at', 'be', 'by', 'for', 'from', 'has', 'he', 'in', 'is', 'it', 'its',
    'of', 'on', 'that', 'the', 'to', 'was', 'will', 'with', 'would', 'you', 'your', 'i', 'me', 'my',
    'we', 'our', 'us', 'they', 'them', 'their', 'she', 'her', 'him', 'his', 'this', 'these', 'those',
    'or', 'but', 'so', 'if', 'when', 'where', 'why', 'how', 'what', 'which', 'who', 'whom', 'whose'
  ])
  
  // Split into tokens and filter
  const tokens = sanitized
    .toLowerCase()
    .split(/\s+/)
    .map(token => token.trim())
    .filter(token => token.length > 0 && !stopWords.has(token))
    .map(token => escapeRegexChars(token)) // Escape regex characters
  
  // Additional validation for tokens
  if (tokens.length === 0) {
    return { tokens: [], error: 'No meaningful search terms found' }
  }
  
  // Check for suspicious token patterns
  for (const token of tokens) {
    if (token.length > 50) {
      return { tokens: [], error: 'Search term too long' }
    }
    
    // Check for only special characters
    if (!/^[a-zA-Z0-9\-_.,!?()]+$/.test(token)) {
      return { tokens: [], error: 'Invalid characters in search term' }
    }
  }
  
  return { tokens }
}

/**
 * Log security events (in production, use proper logging service)
 */
export function logSecurityEvent(event: string, details: any) {
  console.warn(`[SECURITY] ${event}:`, details)
  
  // In production, send to security monitoring service
  // Example: send to logging service, SIEM, or security dashboard
}
