"use client"

import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import { ServerHeader } from "@/components/server-header"
import { MobileSearchBar } from "@/components/mobile-search-bar"
import { Footer } from "@/components/footer"
import { MobileProductPagination } from "@/components/mobile-product-pagination"
import { AnimatedSection } from "@/components/animated-section"
import { PageLoading } from "@/components/page-loading"
import { getProducts, getAllCategories } from "@/lib/database"
import type { ProductWithDetails } from "@/lib/database.types"
import { Search, AlertTriangle } from "lucide-react"
import { 
  validateSearchInput, 
  processSearchTokens,
  logSecurityEvent 
} from "@/lib/security-utils"

export default function SearchPage() {
  const searchParams = useSearchParams()
  const query = searchParams.get('q') || ''
  
  const [searchResults, setSearchResults] = useState<ProductWithDetails[]>([])
  const [loading, setLoading] = useState(true)
  const [categories, setCategories] = useState<any[]>([])
  const [error, setError] = useState<string | null>(null)

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

  useEffect(() => {
    const performSearch = async () => {
      setError(null)
      
      if (!query.trim()) {
        setSearchResults([])
        setLoading(false)
        return
      }

      // Security: Input validation
      const validation = validateSearchInput(query)
      if (!validation.isValid) {
        setError(validation.error || 'Invalid search query')
        logSecurityEvent('INVALID_SEARCH_INPUT', { query: query.substring(0, 50), error: validation.error })
        setSearchResults([])
        setLoading(false)
        return
      }

      // Security: Process search tokens with sanitization
      const tokenResult = processSearchTokens(query)
      if (tokenResult.error) {
        setError(tokenResult.error)
        logSecurityEvent('TOKEN_PROCESSING_ERROR', { query: query.substring(0, 50), error: tokenResult.error })
        setSearchResults([])
        setLoading(false)
        return
      }

      const searchTokens = tokenResult.tokens

      setLoading(true)
      try {
        // Get all products
        const allProducts = await getProducts({ active: true })
        
        // If all tokens were stop words, show no results
        if (searchTokens.length === 0) {
          setSearchResults([])
          setLoading(false)
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
        
        setSearchResults(filteredProducts)
      } catch (error) {
        console.error('Search failed:', error)
        setError('Search failed. Please try again.')
        logSecurityEvent('SEARCH_ERROR', { error: error instanceof Error ? error.message : 'Unknown error' })
        setSearchResults([])
      } finally {
        setLoading(false)
      }
    }

    performSearch()
  }, [query, categories])

  if (loading) {
    return (
      <div className="min-h-screen">
        <ServerHeader />
        <PageLoading message="Searching Products..." />
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen">
      <ServerHeader />
      <MobileSearchBar />

      {/* Search Results Header */}
      <section className="bg-background">
        <div className="container mx-auto px-4 py-8">
          <AnimatedSection animation="fade-up">
            <div className="text-center">
              <div className="flex items-center justify-center mb-4">
                <Search className="h-8 w-8 text-primary mr-3" />
                <h1 className="text-3xl font-semibold text-text-primary">Search Results</h1>
              </div>
              {query && (
                <p className="text-text-muted">
                  {searchResults.length} result{searchResults.length !== 1 ? 's' : ''} found for "{query}"
                </p>
              )}
            </div>
          </AnimatedSection>
        </div>
      </section>

      <div className="container mx-auto px-4 py-8">
        {/* Error Display */}
        {error && (
          <AnimatedSection animation="fade-up" className="mb-8">
            <div className="bg-red-50 border border-red-500 rounded-lg p-4">
              <div className="flex items-center space-x-2 text-red-700">
                <AlertTriangle className="h-5 w-5 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold">Search Error</h3>
                  <p className="text-sm">{error}</p>
                </div>
              </div>
            </div>
          </AnimatedSection>
        )}

        {!error && searchResults.length > 0 ? (
          <>
            <AnimatedSection animation="fade-up" className="mb-8">
              <h2 className="text-2xl font-bold mb-2 flex items-center gap-2">
                <span className="w-1 h-8 bg-primary rounded-full"></span>
                {searchResults.length} Product{searchResults.length !== 1 ? "s" : ""} Found
              </h2>
              <p className="text-text-muted">Products matching your search criteria</p>
            </AnimatedSection>

            <MobileProductPagination products={searchResults} />
          </>
        ) : !error && query ? (
          <AnimatedSection animation="fade-up" className="text-center py-16">
            <div className="space-y-4">
              <div className="text-6xl">🔍</div>
              <h2 className="text-2xl font-bold text-text-primary">No Results Found</h2>
              <p className="text-text-muted max-w-md mx-auto">
                We couldn't find any products matching "{query}". Try different keywords or browse our categories.
              </p>
              <div className="pt-4 space-x-4">
                <a 
                  href="/boys" 
                  className="inline-flex items-center px-6 py-3 bg-primary hover:bg-primary-hover text-white font-medium rounded-none hover:shadow-lg transition-all duration-300"
                >
                  Browse Boys
                </a>
                <a 
                  href="/girls" 
                  className="inline-flex items-center px-6 py-3 bg-background border border-border hover:border-primary text-text-primary font-medium rounded-none hover:shadow-lg transition-all duration-300"
                >
                  Browse Girls
                </a>
              </div>
            </div>
          </AnimatedSection>
        ) : (
          <AnimatedSection animation="fade-up" className="text-center py-16">
            <div className="space-y-4">
              <div className="text-6xl">🔍</div>
              <h2 className="text-2xl font-bold text-text-primary">Search Products</h2>
              <p className="text-text-muted max-w-md mx-auto">
                Use the search bar in the header to find products by name, category, color, age, or gender.
              </p>
            </div>
          </AnimatedSection>
        )}
      </div>

      <Footer />
    </div>
  )
}
