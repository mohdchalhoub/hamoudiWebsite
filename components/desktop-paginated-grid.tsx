"use client"

import { useState } from "react"
import { ProductCard } from "./product-card"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from "lucide-react"
import type { ProductWithDetails } from "@/lib/database.types"

interface DesktopPaginatedGridProps {
  products: ProductWithDetails[]
  title?: string
}

export function DesktopPaginatedGrid({ products, title }: DesktopPaginatedGridProps) {
  const [currentPage, setCurrentPage] = useState(0)
  const productsPerPage = 12 // 4 products per row × 3 rows = 12 products per page
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
    setCurrentPage((prev) => Math.max(0, prev - 1))
  }

  const handleNext = () => {
    setCurrentPage((prev) => Math.min(totalPages - 1, prev + 1))
  }

  const handleFirst = () => {
    setCurrentPage(0)
  }

  const handleLast = () => {
    setCurrentPage(totalPages - 1)
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
      
      {/* Desktop Grid View - 4 products per row, 12 products per page */}
      <div className="hidden lg:block">
        <div className="relative">
          {/* Products Grid */}
          <div className="grid grid-cols-4 gap-6 max-w-7xl mx-auto">
            {currentProducts.map((product) => (
              <div key={product.id} className="h-full">
                <ProductCard product={product} />
              </div>
            ))}
          </div>

          {/* Pagination Controls - Only show if more than 12 products */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center mt-8 space-x-2">
              {/* First Page Button */}
              <Button
                variant="outline"
                size="sm"
                onClick={handleFirst}
                disabled={currentPage === 0}
                className="h-8 w-8 p-0 bg-background border border-border hover:border-primary hover:text-primary"
              >
                <ChevronsLeft className="h-4 w-4" />
              </Button>

              {/* Previous Page Button */}
              <Button
                variant="outline"
                size="sm"
                onClick={handlePrev}
                disabled={currentPage === 0}
                className="h-8 w-8 p-0 bg-background border border-border hover:border-primary hover:text-primary"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>

              {/* Page Numbers */}
              <div className="flex items-center space-x-1">
                {Array.from({ length: Math.min(5, totalPages) }, (_, index) => {
                  let pageNumber
                  if (totalPages <= 5) {
                    pageNumber = index
                  } else if (currentPage <= 2) {
                    pageNumber = index
                  } else if (currentPage >= totalPages - 3) {
                    pageNumber = totalPages - 5 + index
                  } else {
                    pageNumber = currentPage - 2 + index
                  }

                  return (
                    <Button
                      key={pageNumber}
                      variant={currentPage === pageNumber ? "default" : "outline"}
                      size="sm"
                      onClick={() => setCurrentPage(pageNumber)}
                      className={`h-8 w-8 p-0 ${
                        currentPage === pageNumber
                          ? "bg-primary text-white border-primary"
                          : "bg-background border border-border hover:border-primary hover:text-primary"
                      }`}
                    >
                      {pageNumber + 1}
                    </Button>
                  )
                })}
              </div>

              {/* Next Page Button */}
              <Button
                variant="outline"
                size="sm"
                onClick={handleNext}
                disabled={currentPage === totalPages - 1}
                className="h-8 w-8 p-0 bg-background border border-border hover:border-primary hover:text-primary"
              >
                <ChevronRight className="h-4 w-4" />
              </Button>

              {/* Last Page Button */}
              <Button
                variant="outline"
                size="sm"
                onClick={handleLast}
                disabled={currentPage === totalPages - 1}
                className="h-8 w-8 p-0 bg-background border border-border hover:border-primary hover:text-primary"
              >
                <ChevronsRight className="h-4 w-4" />
              </Button>
            </div>
          )}

          {/* Page Info */}
          <div className="text-center mt-4">
            <p className="text-sm text-text-muted">
              Showing {startIndex + 1}-{Math.min(endIndex, products.length)} of {products.length} products
              {totalPages > 1 && ` • Page ${currentPage + 1} of ${totalPages}`}
            </p>
          </div>
        </div>
      </div>

      {/* Mobile View - Keep existing mobile pagination */}
      <div className="lg:hidden">
        <MobileProductPagination products={products} />
      </div>
    </div>
  )
}

// Import the existing mobile component for mobile view
import { MobileProductPagination } from "./mobile-product-pagination"
