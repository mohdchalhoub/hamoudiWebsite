"use client"

import type { ProductWithDetails } from "@/lib/database.types"
import { ProductCard } from "./product-card"
import { AnimatedSection } from "./animated-section"

interface ProductGridClientProps {
  products: ProductWithDetails[]
  title?: string
}

export function ProductGridClient({ products, title }: ProductGridClientProps) {
  if (products.length === 0) {
    return (
      <AnimatedSection animation="fade-up" className="text-center py-12">
        <h3 className="text-lg font-semibold mb-2">No products found</h3>
        <p className="text-muted-foreground">Try adjusting your filters or search terms.</p>
      </AnimatedSection>
    )
  }

  return (
    <div className="space-y-6">
      {title && (
        <AnimatedSection animation="fade-up">
          <h2 className="text-2xl font-bold text-center text-balance">{title}</h2>
        </AnimatedSection>
      )}
      <AnimatedSection animation="fade-up" delay={200}>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 md:gap-4">
          {products.map((product, index) => (
            <AnimatedSection
              key={product.id}
              animation="scale-in"
              delay={100 + (index % 8) * 100}
              className="h-full"
            >
              <ProductCard product={product} />
            </AnimatedSection>
          ))}
        </div>
      </AnimatedSection>
    </div>
  )
}