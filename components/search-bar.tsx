"use client"

import { useState, useEffect, useRef } from "react"
import { Search, X, AlertTriangle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { getProducts, getAllCategories } from "@/lib/database"
import type { ProductWithDetails } from "@/lib/database.types"
import Link from "next/link"
import { 
  validateSearchInput, 
  processSearchTokens,
  logSecurityEvent 
} from "@/lib/security-utils"

interface SearchBarProps {
  className?: string
}

export function SearchBar({ className = "" }: SearchBarProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [searchResults, setSearchResults] = useState<ProductWithDetails[]>([])
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [categories, setCategories] = useState<any[]>([])
  const [error, setError] = useState<string | null>(null)
  const searchRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  // Load categories on mount
  useEffect(() => {
    const loadCategories = async () => {
      try {
        const cats = await getAllCategories()
        setCategories(cats)
      } catch (error) {
        console.error('Failed to load categories:', error)
      }
    }
    loadCategories()
  }, [])

  // Close search results when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsSearchOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const performSearch = async (query: string) => {
    // Clear previous errors
    setError(null)
    
    if (!query.trim()) {
      setSearchResults([])
      setIsSearchOpen(false)
      return
    }

    // Rate limiting removed as requested

    // Security: Input validation and sanitization
    const validation = validateSearchInput(query)
    if (!validation.isValid) {
      setError(validation.error || 'Invalid search query')
      logSecurityEvent('INVALID_SEARCH_INPUT', { query: query.substring(0, 50), error: validation.error })
      setIsLoading(false)
      return
    }

    // Security: Process search tokens with sanitization
    const tokenResult = processSearchTokens(query)
    if (tokenResult.error) {
      setError(tokenResult.error)
      logSecurityEvent('TOKEN_PROCESSING_ERROR', { query: query.substring(0, 50), error: tokenResult.error })
      setIsLoading(false)
      return
    }

    const searchTokens = tokenResult.tokens

    setIsLoading(true)
    try {
      // Get all products
      const allProducts = await getProducts({ active: true })
      
      // If all tokens were stop words, show no results
      if (searchTokens.length === 0) {
        setSearchResults([])
        setIsSearchOpen(true)
        setIsLoading(false)
        return
      }
      
      // Perform search across multiple criteria
      const filteredProducts = allProducts.filter(product => {
        // Get all searchable text for this product
        const searchableTexts = []
        
        // Product name
        if (product.name) searchableTexts.push(product.name.toLowerCase())
        
        // Product code - exact match for codes
        if (product.product_code) searchableTexts.push(product.product_code.toLowerCase())
        
        // Category name
        const category = categories.find(cat => cat.id === product.category_id)
        if (category?.name) searchableTexts.push(category.name.toLowerCase())
        
        // Season
        if (product.season) searchableTexts.push(product.season.toLowerCase())
        
        // Gender
        if (product.gender) searchableTexts.push(product.gender.toLowerCase())
        
        // Description
        if (product.description) searchableTexts.push(product.description.toLowerCase())
        
        // Variants (color, age)
        if (product.variants) {
          product.variants.forEach(variant => {
            if (variant.color) searchableTexts.push(variant.color.toLowerCase())
            if (variant.age_range) {
              // Add age as both number and "X years" format
              searchableTexts.push(variant.age_range.toLowerCase())
              searchableTexts.push(`${variant.age_range} years`)
            }
          })
        }
        
        // Check if all search tokens are found in any of the searchable texts
        const allTokensMatch = searchTokens.every(token => {
          // Handle numeric searches more precisely
          if (/^\d+$/.test(token)) {
            // For pure numbers, prioritize exact matches for product codes
            return searchableTexts.some(text => {
              // Exact number match (for product codes and ages)
              if (text === token) return true
              // Number with "years" (e.g., "3 years")
              if (text === `${token} years`) return true
              // Number at word boundary (e.g., "age 3" but not "13")
              try {
                const regex = new RegExp(`\\b${token}\\b`, 'g')
                return regex.test(text)
              } catch (e) {
                // Fallback to simple string matching if regex fails
                return text.includes(token)
              }
            })
          } else {
            // For non-numeric tokens, use substring matching
            return searchableTexts.some(text => text.includes(token))
          }
        })
        
        return allTokensMatch
      })
      
      setSearchResults(filteredProducts.slice(0, 8)) // Limit to 8 results
      setIsSearchOpen(true)
    } catch (error) {
      console.error('Search failed:', error)
      setError('Search failed. Please try again.')
      logSecurityEvent('SEARCH_ERROR', { error: error instanceof Error ? error.message : 'Unknown error' })
      setSearchResults([])
    } finally {
      setIsLoading(false)
    }
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    performSearch(searchQuery)
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    
    // Security: Basic input validation before setting state
    if (value.length > 100) {
      setError('Search query too long (max 100 characters)')
      return
    }
    
    setSearchQuery(value)
    setError(null) // Clear previous errors
    
    // Perform search as user types (debounced)
    if (value.trim()) {
      const timeoutId = setTimeout(() => {
        performSearch(value)
      }, 300)
      return () => clearTimeout(timeoutId)
    } else {
      setSearchResults([])
      setIsSearchOpen(false)
    }
  }

  const clearSearch = () => {
    setSearchQuery("")
    setSearchResults([])
    setIsSearchOpen(false)
    setError(null)
    inputRef.current?.focus()
  }

  const getCategoryName = (categoryId: string) => {
    return categories.find(cat => cat.id === categoryId)?.name || 'Unknown'
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(price)
  }

  return (
    <div ref={searchRef} className={`relative ${className}`}>
      {/* Search Input */}
      <form onSubmit={handleSearch} className="relative">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-text-muted" />
          <Input
            ref={inputRef}
            type="text"
            placeholder="Search products..."
            value={searchQuery}
            onChange={handleInputChange}
            maxLength={100}
            className={`pl-10 pr-10 bg-background border text-text-primary placeholder:text-text-muted focus:ring-1 ${
              error 
                ? 'border-red-500 focus:border-red-500 focus:ring-red-500' 
                : 'border-border focus:border-primary focus:ring-primary'
            }`}
          />
          {searchQuery && (
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={clearSearch}
              className="absolute right-1 top-1/2 transform -translate-y-1/2 h-6 w-6 text-text-muted hover:text-text-primary"
            >
              <X className="h-3 w-3" />
            </Button>
          )}
        </div>
      </form>

      {/* Error Display */}
      {error && (
        <div className="absolute top-full left-0 right-0 mt-1 z-50">
          <Card className="border-red-500 bg-red-50">
            <CardContent className="p-2">
              <div className="flex items-center space-x-2 text-red-700 text-sm">
                <AlertTriangle className="h-4 w-4 flex-shrink-0" />
                <span>{error}</span>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Rate limit info removed as requested */}

      {/* Search Results Dropdown */}
      {isSearchOpen && (
        <Card className="absolute top-full left-0 right-0 mt-2 z-50 max-h-96 overflow-y-auto shadow-lg border border-border">
          <CardContent className="p-0">
            {isLoading ? (
              <div className="p-4 text-center text-text-muted">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary mx-auto mb-2"></div>
                Searching...
              </div>
            ) : searchResults.length > 0 ? (
              <div className="py-2">
                {searchResults.map((product) => (
                  <Link
                    key={product.id}
                    href={`/products/${product.id}`}
                    className="block p-3 hover:bg-background-subtle border-b border-border last:border-b-0 transition-colors"
                    onClick={() => setIsSearchOpen(false)}
                  >
                    <div className="flex items-center space-x-3">
                      {/* Product Image */}
                      <div className="flex-shrink-0">
                        <div className="w-12 h-12 bg-background-subtle rounded border border-border overflow-hidden">
                          {product.image_url ? (
                            <img
                              src={product.image_url}
                              alt={product.name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-text-muted text-xs">
                              No Image
                            </div>
                          )}
                        </div>
                      </div>
                      
                      {/* Product Info */}
                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm font-medium text-text-primary truncate">
                          {product.name}
                        </h4>
                        <p className="text-xs text-text-muted">
                          {getCategoryName(product.category_id)} • {product.gender}
                        </p>
                        <div className="flex items-center space-x-2 mt-1">
                          <span className="text-sm font-semibold text-primary">
                            {formatPrice(product.price)}
                          </span>
                          {product.on_sale && (
                            <span className="text-xs bg-primary text-white px-2 py-0.5 rounded">
                              Sale
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
                
                {/* View All Results Link */}
                {searchResults.length >= 8 && (
                  <div className="p-3 border-t border-border bg-background-subtle">
                    <Link
                      href={`/search?q=${encodeURIComponent(searchQuery)}`}
                      className="text-sm text-primary hover:text-primary-hover font-medium"
                      onClick={() => setIsSearchOpen(false)}
                    >
                      View all results for "{searchQuery}"
                    </Link>
                  </div>
                )}
              </div>
            ) : searchQuery.trim() ? (
              <div className="p-4 text-center text-text-muted">
                <Search className="h-8 w-8 mx-auto mb-2 text-text-muted" />
                <p>No products found for "{searchQuery}"</p>
                <p className="text-xs mt-1">Try different keywords</p>
              </div>
            ) : null}
          </CardContent>
        </Card>
      )}
    </div>
  )
}
