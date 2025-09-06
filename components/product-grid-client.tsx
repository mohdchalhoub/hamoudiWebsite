"use client"

import type { ProductWithDetails } from "@/lib/database.types"
import { ProductCard } from "./product-card"

interface ProductGridClientProps {
  products: ProductWithDetails[]
  title?: string
}

export function ProductGridClient({ products, title }: ProductGridClientProps) {
  if (products.length === 0) {
    return (
      <div className="text-center py-12">
        <h3 className="text-lg font-semibold mb-2">No products found</h3>
        <p className="text-muted-foreground">Try adjusting your filters or search terms.</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {title && <h2 className="text-2xl font-bold text-center text-balance">{title}</h2>}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  )
}
