"use client"

import { useState } from "react"
import { ProductCard } from "./product-card"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight } from "lucide-react"
import type { ProductWithDetails } from "@/lib/database.types"

interface MobileProductPaginationProps {
  products: ProductWithDetails[]
  title?: string
}

export function MobileProductPagination({ products, title }: MobileProductPaginationProps) {
  const [currentPage, setCurrentPage] = useState(0)
  const productsPerPage = 12
  const totalPages = Math.ceil(products.length / productsPerPage)

  if (products.length === 0) {
    return (
      <div className="text-center py-12">
        <h3 className="text-lg font-semibold mb-2">No products found</h3>
        <p className="text-text-muted">Try adjusting your filters or search terms.</p>
      </div>
    )
  }

  const handlePrev = () => {
    setCurrentPage((prev) => (prev > 0 ? prev - 1 : totalPages - 1))
  }

  const handleNext = () => {
    setCurrentPage((prev) => (prev < totalPages - 1 ? prev + 1 : 0))
  }

  const startIndex = currentPage * productsPerPage
  const endIndex = startIndex + productsPerPage
  const currentProducts = products.slice(startIndex, endIndex)

  return (
    <div className="space-y-6">
      {title && (
        <div className="text-center">
          <h2 className="text-2xl font-semibold text-text-primary">{title}</h2>
        </div>
      )}
      
      {/* Desktop Grid View - 4 products per row */}
      <div className="hidden lg:block">
        <div className="relative">
          {/* Products Grid */}
          <div className="grid grid-cols-4 gap-6 max-w-7xl mx-auto">
            {products.slice(0, 4).map((product) => (
              <div key={product.id} className="h-full">
                <ProductCard product={product} />
              </div>
            ))}
          </div>

          {/* Navigation Buttons - Only show if more than 4 products */}
          {products.length > 4 && (
            <>
              <Button
                variant="outline"
                size="icon"
                onClick={handlePrev}
                className="absolute left-4 top-1/2 -translate-y-1/2 z-20 bg-background border border-border hover:border-primary hover:text-primary shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              
              <Button
                variant="outline"
                size="icon"
                onClick={handleNext}
                className="absolute right-4 top-1/2 -translate-y-1/2 z-20 bg-background border border-border hover:border-primary hover:text-primary shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </>
          )}

          {/* Page Indicator - Only show if more than 4 products */}
          {products.length > 4 && (
            <div className="flex justify-center mt-6 space-x-2">
              {Array.from({ length: Math.ceil(products.length / 4) }, (_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentPage(index)}
                  className={`w-2 h-2 rounded-full transition-all duration-300 ${
                    index === currentPage
                      ? 'bg-primary scale-125'
                      : 'bg-border hover:bg-text-muted'
                  }`}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Mobile/Tablet Pagination View - 2 products per row, 12 per page */}
      <div className="lg:hidden">
        <div className="space-y-6">
          {/* Products Grid - 2 products per row */}
          <div className="grid grid-cols-2 gap-4">
            {currentProducts.map((product) => (
              <div key={product.id} className="h-full">
                <ProductCard product={product} />
              </div>
            ))}
          </div>

          {/* Pagination Controls - Only show if more than 12 products */}
          {products.length > 12 && (
            <div className="flex flex-col items-center space-y-4">
              {/* Navigation Buttons */}
              <div className="flex items-center justify-center space-x-4">
                <Button
                  variant="outline"
                  onClick={handlePrev}
                  disabled={currentPage === 0}
                  className="flex items-center space-x-2 bg-background border border-border hover:border-primary hover:text-primary disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronLeft className="h-4 w-4" />
                  <span>Previous</span>
                </Button>
                
                <Button
                  variant="outline"
                  onClick={handleNext}
                  disabled={currentPage === totalPages - 1}
                  className="flex items-center space-x-2 bg-background border border-border hover:border-primary hover:text-primary disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <span>Next</span>
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>

              {/* Page Indicator */}
              <div className="flex items-center space-x-2">
                <span className="text-sm text-text-muted">Page</span>
                <div className="flex space-x-1">
                  {Array.from({ length: totalPages }, (_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentPage(index)}
                      className={`w-8 h-8 rounded-full text-sm font-medium transition-all duration-300 ${
                        index === currentPage
                          ? 'bg-primary text-white'
                          : 'bg-background border border-border text-text-primary hover:border-primary hover:text-primary'
                      }`}
                    >
                      {index + 1}
                    </button>
                  ))}
                </div>
              </div>

              {/* Product Counter */}
              <div className="text-center">
                <p className="text-sm text-text-muted">
                  Showing {startIndex + 1}-{Math.min(endIndex, products.length)} of {products.length} products
                </p>
              </div>
            </div>
          )}

          {/* Product Counter for pages with 12 or fewer products */}
          {products.length <= 12 && (
            <div className="text-center">
              <p className="text-sm text-text-muted">
                {products.length} product{products.length !== 1 ? 's' : ''} available
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
