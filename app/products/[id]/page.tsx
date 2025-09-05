import { notFound } from "next/navigation"
import Image from "next/image"
import { mockProducts } from "@/lib/mock-data"
import { ProductDetailClient } from "./product-detail-client"
import { Badge } from "@/components/ui/badge"
import { ProductGrid } from "@/components/product-grid"

interface ProductPageProps {
  params: {
    id: string
  }
}

export default function ProductPage({ params }: ProductPageProps) {
  const product = mockProducts.find((p) => p.id === params.id)

  if (!product) {
    notFound()
  }

  // Get related products from the same category
  const relatedProducts = mockProducts.filter((p) => p.category === product.category && p.id !== product.id).slice(0, 4)

  const discountPercentage = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
        {/* Product Images */}
        <div className="space-y-4">
          <div className="relative aspect-square overflow-hidden rounded-lg">
            <Image
              src={product.images[0] || "/placeholder.svg"}
              alt={product.name}
              fill
              className="object-cover"
              priority
            />
            {product.featured && (
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
            {product.originalPrice && (
              <span className="text-xl text-muted-foreground line-through">${product.originalPrice}</span>
            )}
            {discountPercentage > 0 && <Badge variant="destructive">Save {discountPercentage}%</Badge>}
          </div>

          <div className="space-y-4">
            <div>
              <h3 className="font-semibold mb-2">Available Sizes</h3>
              <div className="flex flex-wrap gap-2">
                {product.sizes.map((size) => (
                  <Badge key={size} variant="outline" className="px-3 py-1">
                    {size}
                  </Badge>
                ))}
              </div>
            </div>

            <div>
              <h3 className="font-semibold mb-2">Available Colors</h3>
              <div className="flex flex-wrap gap-2">
                {product.colors.map((color) => (
                  <div key={color} className="flex items-center gap-2">
                    <div
                      className={`w-6 h-6 rounded-full border-2 border-white shadow-sm ${
                        color.toLowerCase().includes("blue")
                          ? "bg-blue-500"
                          : color.toLowerCase().includes("pink")
                            ? "bg-pink-500"
                            : color.toLowerCase().includes("purple")
                              ? "bg-purple-500"
                              : color.toLowerCase().includes("red")
                                ? "bg-red-500"
                                : color.toLowerCase().includes("green")
                                  ? "bg-green-500"
                                  : color.toLowerCase().includes("yellow")
                                    ? "bg-yellow-500"
                                    : color.toLowerCase().includes("black")
                                      ? "bg-black"
                                      : color.toLowerCase().includes("white")
                                        ? "bg-white border-gray-300"
                                        : "bg-gray-400"
                      }`}
                    />
                    <span className="text-sm">{color}</span>
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
          <ProductGrid products={relatedProducts} />
        </div>
      )}
    </div>
  )
}
