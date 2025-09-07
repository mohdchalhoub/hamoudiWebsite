"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent } from "@/components/ui/card"
import { Search, X } from "lucide-react"
import { getAllCategories } from "@/lib/database"
import type { ProductWithDetails } from "@/lib/database.types"

interface ProductFiltersProps {
  products: ProductWithDetails[]
  onFilteredProducts: (filteredProducts: ProductWithDetails[]) => void
  gender?: 'boys' | 'girls' | 'unisex'
}

interface FilterState {
  category: string
  season: string
  age: string
  color: string
}

export function ProductFilters({ products, onFilteredProducts, gender }: ProductFiltersProps) {
  const [categories, setCategories] = useState<any[]>([])
  const [filters, setFilters] = useState<FilterState>({
    category: '',
    season: '',
    age: '',
    color: ''
  })
  const [isFiltered, setIsFiltered] = useState(false)

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

  // Get unique values for filter options
  const getUniqueValues = (key: keyof ProductWithDetails) => {
    const values = new Set<string>()
    products.forEach(product => {
      if (product[key]) {
        values.add(String(product[key]))
      }
    })
    return Array.from(values).sort()
  }

  // Get unique colors from variants
  const getUniqueColors = () => {
    const colors = new Set<string>()
    products.forEach(product => {
      product.variants?.forEach(variant => {
        if (variant.color) {
          colors.add(variant.color)
        }
      })
    })
    return Array.from(colors).sort()
  }

  // Get unique ages from variants
  const getUniqueAges = () => {
    const ages = new Set<string>()
    products.forEach(product => {
      product.variants?.forEach(variant => {
        if (variant.age_range) {
          ages.add(variant.age_range)
        }
      })
    })
    return Array.from(ages).sort((a, b) => Number(a) - Number(b))
  }

  const handleFilterChange = (filterType: keyof FilterState, value: string) => {
    setFilters(prev => ({
      ...prev,
      [filterType]: value
    }))
  }

  const applyFilters = () => {
    let filteredProducts = products

    // Apply category filter
    if (filters.category) {
      filteredProducts = filteredProducts.filter(product => 
        product.category_id === filters.category
      )
    }

    // Apply season filter
    if (filters.season) {
      filteredProducts = filteredProducts.filter(product => 
        product.season === filters.season
      )
    }

    // Apply age filter
    if (filters.age) {
      filteredProducts = filteredProducts.filter(product => 
        product.variants?.some(variant => variant.age_range === filters.age)
      )
    }

    // Apply color filter
    if (filters.color) {
      filteredProducts = filteredProducts.filter(product => 
        product.variants?.some(variant => variant.color === filters.color)
      )
    }

    onFilteredProducts(filteredProducts)
    setIsFiltered(true)
  }

  const clearFilters = () => {
    setFilters({
      category: '',
      season: '',
      age: '',
      color: ''
    })
    onFilteredProducts(products)
    setIsFiltered(false)
  }

  const hasActiveFilters = Object.values(filters).some(value => value !== '')

  return (
    <Card className="mb-6">
      <CardContent className="p-4">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-text-primary">Filter Products</h3>
        {hasActiveFilters && (
              <Button
                variant="outline"
                size="sm"
                onClick={clearFilters}
                className="text-text-muted hover:text-text-primary"
              >
            <X className="h-4 w-4 mr-1" />
            Clear All
          </Button>
        )}
        </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Category Filter */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-text-primary">Category</label>
              <Select
                value={filters.category || "all"}
                onValueChange={(value) => handleFilterChange('category', value === "all" ? "" : value)}
              >
                <SelectTrigger className="bg-background border border-border">
                  <SelectValue placeholder="All Categories" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {categories.map((category) => (
                    <SelectItem key={category.id} value={category.id}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
        </div>

            {/* Season Filter */}
          <div className="space-y-2">
              <label className="text-sm font-medium text-text-primary">Season</label>
              <Select
                value={filters.season || "all"}
                onValueChange={(value) => handleFilterChange('season', value === "all" ? "" : value)}
              >
                <SelectTrigger className="bg-background border border-border">
                  <SelectValue placeholder="All Seasons" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Seasons</SelectItem>
                  <SelectItem value="summer">☀️ Summer</SelectItem>
                  <SelectItem value="winter">❄️ Winter</SelectItem>
                  <SelectItem value="all_season">🌍 All Season</SelectItem>
                </SelectContent>
              </Select>
        </div>

            {/* Age Filter */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-text-primary">Age</label>
              <Select
                value={filters.age || "all"}
                onValueChange={(value) => handleFilterChange('age', value === "all" ? "" : value)}
              >
                <SelectTrigger className="bg-background border border-border">
                  <SelectValue placeholder="All Ages" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Ages</SelectItem>
                  {getUniqueAges().map((age) => (
                    <SelectItem key={age} value={age}>
                      {age} years
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Color Filter */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-text-primary">Color</label>
              <Select
                value={filters.color || "all"}
                onValueChange={(value) => handleFilterChange('color', value === "all" ? "" : value)}
              >
                <SelectTrigger className="bg-background border border-border">
                  <SelectValue placeholder="All Colors" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Colors</SelectItem>
                  {getUniqueColors().map((color) => (
                    <SelectItem key={color} value={color}>
                      {color}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Search Button */}
          <div className="flex justify-center pt-2">
            <Button
              onClick={applyFilters}
              className="bg-primary hover:bg-primary-hover text-white px-8"
            >
              <Search className="h-4 w-4 mr-2" />
              Search
            </Button>
        </div>

          {/* Active Filters Display */}
        {hasActiveFilters && (
            <div className="pt-2 border-t border-border">
              <div className="flex flex-wrap gap-2">
                {filters.category && (
                  <div className="flex items-center gap-1 bg-background-subtle border border-border px-2 py-1 rounded text-sm">
                    <span className="text-text-muted">Category:</span>
                    <span className="text-text-primary">
                      {categories.find(c => c.id === filters.category)?.name}
                    </span>
                    <button
                      onClick={() => handleFilterChange('category', '')}
                      className="text-text-muted hover:text-text-primary ml-1"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                )}
                {filters.season && (
                  <div className="flex items-center gap-1 bg-background-subtle border border-border px-2 py-1 rounded text-sm">
                    <span className="text-text-muted">Season:</span>
                    <span className="text-text-primary">
                      {filters.season === 'summer' ? 'Summer' : 
                       filters.season === 'winter' ? 'Winter' : 'All Season'}
                    </span>
                    <button
                      onClick={() => handleFilterChange('season', '')}
                      className="text-text-muted hover:text-text-primary ml-1"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                )}
                {filters.age && (
                  <div className="flex items-center gap-1 bg-background-subtle border border-border px-2 py-1 rounded text-sm">
                    <span className="text-text-muted">Age:</span>
                    <span className="text-text-primary">{filters.age} years</span>
                    <button
                      onClick={() => handleFilterChange('age', '')}
                      className="text-text-muted hover:text-text-primary ml-1"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                )}
                {filters.color && (
                  <div className="flex items-center gap-1 bg-background-subtle border border-border px-2 py-1 rounded text-sm">
                    <span className="text-text-muted">Color:</span>
                    <span className="text-text-primary">{filters.color}</span>
                    <button
                      onClick={() => handleFilterChange('color', '')}
                      className="text-text-muted hover:text-text-primary ml-1"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
              )}
            </div>
          </div>
        )}
        </div>
      </CardContent>
    </Card>
  )
}