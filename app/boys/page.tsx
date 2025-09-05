"use client"

import { useState } from "react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { ProductGrid } from "@/components/product-grid"
import { ProductFilters, type FilterState } from "@/components/product-filters"
import { mockProducts } from "@/lib/mock-data"
import { Button } from "@/components/ui/button"
import { Filter } from "lucide-react"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"

export default function BoysPage() {
  const [filters, setFilters] = useState<FilterState>({
    sizes: [],
    colors: [],
    priceRange: [0, 100],
    inStockOnly: false,
    featuredOnly: false,
  })

  const boysProducts = mockProducts.filter((product) => product.category === "boys")

  // Apply filters
  const filteredProducts = boysProducts.filter((product) => {
    if (filters.sizes.length > 0 && !filters.sizes.some((size) => product.sizes.includes(size))) {
      return false
    }
    if (filters.colors.length > 0 && !filters.colors.some((color) => product.colors.includes(color))) {
      return false
    }
    if (product.price < filters.priceRange[0] || product.price > filters.priceRange[1]) {
      return false
    }
    if (filters.inStockOnly && !product.inStock) {
      return false
    }
    if (filters.featuredOnly && !product.featured) {
      return false
    }
    return true
  })

  // Get unique values for filters
  const availableSizes = [...new Set(boysProducts.flatMap((p) => p.sizes))]
  const availableColors = [...new Set(boysProducts.flatMap((p) => p.colors))]
  const priceRange: [number, number] = [
    Math.min(...boysProducts.map((p) => p.price)),
    Math.max(...boysProducts.map((p) => p.price)),
  ]

  return (
    <div className="min-h-screen">
      <Header />

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl lg:text-5xl font-bold mb-4">Boys Collection</h1>
          <p className="text-xl opacity-90 max-w-2xl mx-auto">
            Cool and comfortable clothes for adventurous boys. From space explorers to superheroes, find the perfect
            outfit for every adventure!
          </p>
        </div>
      </section>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Desktop Filters */}
          <div className="hidden lg:block">
            <ProductFilters
              onFiltersChange={setFilters}
              availableSizes={availableSizes}
              availableColors={availableColors}
              priceRange={priceRange}
            />
          </div>

          {/* Products */}
          <div className="lg:col-span-3">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold">
                {filteredProducts.length} Product{filteredProducts.length !== 1 ? "s" : ""}
              </h2>

              {/* Mobile Filter Button */}
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="outline" className="lg:hidden bg-transparent">
                    <Filter className="h-4 w-4 mr-2" />
                    Filters
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="w-[300px] sm:w-[400px]">
                  <ProductFilters
                    onFiltersChange={setFilters}
                    availableSizes={availableSizes}
                    availableColors={availableColors}
                    priceRange={priceRange}
                  />
                </SheetContent>
              </Sheet>
            </div>

            <ProductGrid products={filteredProducts} />
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}
