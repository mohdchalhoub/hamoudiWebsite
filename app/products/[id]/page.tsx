import { notFound } from "next/navigation"
import Image from "next/image"
import { getProduct, getProducts } from "@/lib/database"
import { ProductDetailClient } from "./product-detail-client"
import { Badge } from "@/components/ui/badge"
import { ProductGridClient } from "@/components/product-grid-client"

interface ProductPageProps {
  params: {
    id: string
  }
}

export default async function ProductPage({ params }: ProductPageProps) {
  const product = await getProduct(params.id)

  if (!product) {
    notFound()
  }

  // Get related products from the same category
  const relatedProducts = await getProducts({ 
    category: product.category_id, 
    active: true,
    limit: 4 
  }).then(products => products.filter(p => p.id !== product.id))

  const discountPercentage = product.compare_at_price
    ? Math.round(((product.compare_at_price - product.price) / product.compare_at_price) * 100)
    : 0

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
        {/* Product Images */}
        <div className="space-y-4">
          <div className="relative aspect-square overflow-hidden rounded-lg">
            <Image
              src={product.image_url || "/placeholder.svg"}
              alt={product.name}
              fill
              className="object-cover"
              priority
            />
            {product.is_featured && (
              <Badge className="absolute top-4 left-4 bg-yellow-500 text-yellow-900">Featured</Badge>
            )}
            {discountPercentage > 0 && (
              <Badge className="absolute top-4 right-4 bg-red-500 text-white">-{discountPercentage}%</Badge>
            )}
          </div>
        </div>

        {/* Product Details */}
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold text-balance mb-2">{product.name}</h1>
            <p className="text-muted-foreground text-lg">{product.description}</p>
          </div>

          <div className="flex items-center gap-4">
            <span className="text-3xl font-bold text-primary">${product.price}</span>
            {product.compare_at_price && (
              <span className="text-xl text-muted-foreground line-through">${product.compare_at_price}</span>
            )}
            {discountPercentage > 0 && <Badge variant="destructive">Save {discountPercentage}%</Badge>}
          </div>

          <div className="space-y-4">
            <div>
              <h3 className="font-semibold mb-2">Available Sizes</h3>
              <div className="flex flex-wrap gap-2">
                {product.variants?.map((variant) => (
                  <Badge key={variant.id} variant="outline" className="px-3 py-1">
                    {variant.size}
                  </Badge>
                ))}
              </div>
            </div>

            <div>
              <h3 className="font-semibold mb-2">Available Colors</h3>
              <div className="flex flex-wrap gap-2">
                {product.variants?.map((variant) => (
                  <div key={variant.id} className="flex items-center gap-2">
                    <div
                      className="w-6 h-6 rounded-full border-2 border-white shadow-sm"
                      style={{ backgroundColor: variant.color_hex || '#6B7280' }}
                    />
                    <span className="text-sm">{variant.color}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <ProductDetailClient product={product} />
        </div>
      </div>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-center">You Might Also Like</h2>
          <ProductGridClient products={relatedProducts} />
        </div>
      )}
    </div>
  )
}
