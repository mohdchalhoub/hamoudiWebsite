"use client"

import { useState, useEffect } from "react"
import { ServerHeader } from "@/components/server-header"
import { MobileSearchBar } from "@/components/mobile-search-bar"
import { Footer } from "@/components/footer"
import { MobileProductPagination } from "@/components/mobile-product-pagination"
import { ProductFilters } from "@/components/product-filters"
import { AnimatedSection } from "@/components/animated-section"
import { SectionHeader } from "@/components/section-header"
import { PageLoading } from "@/components/page-loading"
import { getProducts } from "@/lib/database"
import type { ProductWithDetails } from "@/lib/database.types"

export default function OnSalePage() {
  const [onSaleProducts, setOnSaleProducts] = useState<ProductWithDetails[]>([])
  const [filteredProducts, setFilteredProducts] = useState<ProductWithDetails[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadProducts = async () => {
      try {
        setLoading(true)
        const products = await getProducts({ 
          on_sale: true, 
          active: true,
          _cacheBust: Date.now()
        })
        setOnSaleProducts(products)
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
        <PageLoading message="Loading Sale Products..." />
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen">
      <ServerHeader />
      <MobileSearchBar />

      {/* Hero Section */}
      <section className="bg-background">
        <div className="container mx-auto px-4">
          <AnimatedSection animation="fade-up">
            <SectionHeader 
              title="On Sale"
              subtitle="Limited time offers! Don't miss out on these amazing deals. Shop now before they're gone!"
            />
          </AnimatedSection>
        </div>
      </section>

      <div className="container mx-auto px-4 py-8">
        {onSaleProducts.length > 0 ? (
          <>
            {/* Filter Section */}
            <ProductFilters 
              products={onSaleProducts}
              onFilteredProducts={handleFilteredProducts}
            />

            <AnimatedSection animation="fade-up" className="mb-8">
              <h2 className="text-2xl font-bold mb-2 flex items-center gap-2">
                <span className="w-1 h-8 bg-primary rounded-full"></span>
                {filteredProducts.length} Product{filteredProducts.length !== 1 ? "s" : ""} on Sale
              </h2>
              <p className="text-text-muted">Save big on these limited-time offers. Prices won't stay this low for long!</p>
            </AnimatedSection>

            <MobileProductPagination products={filteredProducts} />
          </>
        ) : (
          <AnimatedSection animation="fade-up" className="text-center py-16">
            <div className="space-y-4">
              <div className="text-6xl">😔</div>
              <h2 className="text-2xl font-bold text-text-primary">No Sale Items Available</h2>
              <p className="text-text-muted max-w-md mx-auto">
                There are currently no products on sale. Check back soon for amazing deals!
              </p>
              <div className="pt-4">
                <a 
                  href="/" 
                  className="inline-flex items-center px-6 py-3 bg-primary hover:bg-primary-hover text-white font-medium rounded-none hover:shadow-lg transition-all duration-300"
                >
                  Browse All Products
                </a>
              </div>
            </div>
          </AnimatedSection>
        )}
      </div>

      <Footer />
    </div>
  )
}
