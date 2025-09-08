"use client"

import { useState, useEffect } from "react"
import { ServerHeader } from "@/components/server-header"
import { Footer } from "@/components/footer"
import { MobileProductPagination } from "@/components/mobile-product-pagination"
import { ProductFilters } from "@/components/product-filters"
import { AnimatedSection } from "@/components/animated-section"
import { SectionHeader } from "@/components/section-header"
import { PageLoading, ProductGridSkeleton } from "@/components/page-loading"
import { getProducts } from "@/lib/database"
import type { ProductWithDetails } from "@/lib/database.types"

export default function BoysPage() {
  const [boysProducts, setBoysProducts] = useState<ProductWithDetails[]>([])
  const [filteredProducts, setFilteredProducts] = useState<ProductWithDetails[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadProducts = async () => {
      try {
        setLoading(true)
        const products = await getProducts({ 
          gender: 'boys', 
          active: true,
          _cacheBust: Date.now()
        })
        setBoysProducts(products)
        setFilteredProducts(products)
      } catch (error) {
        console.error('Failed to load products:', error)
      } finally {
        setLoading(false)
      }
    }
    loadProducts()
  }, [])

  const handleFilteredProducts = (filtered: ProductWithDetails[]) => {
    setFilteredProducts(filtered)
  }

  if (loading) {
    return (
      <div className="min-h-screen">
        <ServerHeader />
        <PageLoading message="Loading Boys Collection..." />
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen">
      <ServerHeader />

      {/* Hero Section */}
      <section className="bg-background">
        <div className="container mx-auto px-4">
          <AnimatedSection animation="fade-up">
            <SectionHeader 
              title="Boys Collection"
              subtitle="Cool and comfortable clothes for adventurous boys. Find the perfect outfit for every occasion!"
            />
          </AnimatedSection>
        </div>
      </section>

      <div className="container mx-auto px-4 py-8">
        {/* Filter Section */}
        <ProductFilters 
          products={boysProducts}
          onFilteredProducts={handleFilteredProducts}
          gender="boys"
        />

        <AnimatedSection animation="fade-up" className="mb-8">
          <h2 className="text-2xl font-bold mb-2 flex items-center gap-2">
            <span className="w-1 h-8 bg-primary rounded-full"></span>
            {filteredProducts.length} Product{filteredProducts.length !== 1 ? "s" : ""} Available
          </h2>
          <p className="text-text-muted">Discover amazing clothes designed for active boys</p>
        </AnimatedSection>

        <MobileProductPagination products={filteredProducts} />
      </div>

      <Footer />
    </div>
  )
}