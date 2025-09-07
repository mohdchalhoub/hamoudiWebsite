import { notFound } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { getProductById, getProducts } from "@/lib/database"
import { ProductDetailClient } from "./product-detail-client"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ProductGridClient } from "@/components/product-grid-client"
import { ProductImageGallery } from "@/components/product-image-gallery"
import { ServerHeader } from "@/components/server-header"
import { Footer } from "@/components/footer"
import { ArrowLeft } from "lucide-react"

interface ProductPageProps {
  params: {
    id: string
  }
}

export default async function ProductPage({ params }: ProductPageProps) {
  const product = await getProductById(params.id)

  if (!product) {
    notFound()
  }

  // Get related products from the same category
  const relatedProducts = await getProducts({ 
    category: product.category_id || undefined, 
    active: true,
    limit: 4 
  }).then(products => products.filter(p => p.id !== product.id))

  const discountPercentage = product.compare_at_price
    ? Math.round(((product.compare_at_price - product.price) / product.compare_at_price) * 100)
    : 0

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-slate-100 via-gray-50 to-slate-100">
      <ServerHeader />
      <main className="flex-1">
        <div className="container mx-auto px-3 py-3">
          {/* Back to Home Button */}
          <div className="mb-3">
            <Link href="/">
              <Button variant="outline" size="sm" className="flex items-center gap-2 hover:scale-105 transition-all duration-200 bg-slate-100/90 backdrop-blur-sm border-slate-300/50 shadow-sm hover:shadow-md text-slate-700">
                <ArrowLeft className="h-4 w-4" />
                Back to Home
              </Button>
            </Link>
          </div>

          {/* Main Product Section with Enhanced Desktop Layout */}
          <div className="bg-slate-50/80 backdrop-blur-sm rounded-xl shadow-lg border border-slate-200/30 p-4 mb-4 max-w-7xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8 items-start">
              {/* Product Images */}
              <div className="flex flex-col items-center lg:items-start">
                <ProductImageGallery
                  images={product.images || []}
                  productName={product.name}
                  isFeatured={product.is_featured}
                  discountPercentage={discountPercentage}
                  className="max-w-lg w-full"
                />
                
                {/* Additional product info below image */}
                <div className="mt-1 text-center lg:text-left">
                  <div className="flex items-center justify-center lg:justify-start gap-2 text-xs text-slate-600">
                    <div className="flex items-center gap-1">
                      <div className="w-1 h-1 bg-emerald-500 rounded-full animate-pulse"></div>
                      <span>In Stock</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <div className="w-1 h-1 bg-blue-500 rounded-full"></div>
                      <span>Free Shipping</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Product Details */}
              <div className="space-y-2">
                {/* Product Title and Code */}
                <div className="space-y-1">
                  <h1 className="text-xl lg:text-2xl font-bold text-slate-800 leading-tight">{product.name}</h1>
                  {product.product_code && (
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-slate-500">Product Code:</span>
                      <span className="font-mono font-semibold text-xs bg-slate-200 px-2 py-1 rounded border border-slate-300 text-slate-700">
                        {product.product_code}
                      </span>
                    </div>
                  )}
                  
                  {/* Season Badge */}
                  {product.season && (
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-slate-500">Season:</span>
                      <Badge className={`px-2 py-1 text-xs font-semibold ${
                        product.season === 'summer' 
                          ? 'bg-gradient-to-r from-yellow-400 to-orange-500 text-white' 
                          : product.season === 'winter'
                          ? 'bg-gradient-to-r from-blue-400 to-blue-600 text-white'
                          : 'bg-gradient-to-r from-green-400 to-emerald-500 text-white'
                      }`}>
                        {product.season === 'summer' ? '☀️ Summer' : product.season === 'winter' ? '❄️ Winter' : '🌍 All Season'}
                      </Badge>
                    </div>
                  )}
                  
                  <p className="text-slate-600 text-sm leading-relaxed line-clamp-2">{product.description}</p>
                </div>

                {/* Price Section */}
                <div className="bg-slate-100 rounded-lg p-2 border border-slate-200">
                  <div className="flex items-center gap-2">
                    <span className="text-xl lg:text-2xl font-bold text-slate-800">
                      ${product.price}
                    </span>
                    {product.compare_at_price && (
                      <span className="text-base text-slate-400 line-through">${product.compare_at_price}</span>
                    )}
                    {discountPercentage > 0 && (
                      <Badge className="bg-gradient-to-r from-red-500 to-red-600 text-white px-2 py-1 text-xs font-semibold shadow-lg">
                        Save {discountPercentage}%
                      </Badge>
                    )}
                  </div>
                </div>

                {/* Product Variants */}
                <div className="space-y-1">
                  {/* Show sizes if available, otherwise show ages */}
                  {product.variants?.some(v => v.size) ? (
                    <div className="bg-slate-100 rounded-md p-2 border border-slate-200">
                      <h3 className="font-semibold text-slate-700 mb-1 flex items-center gap-1 text-xs">
                        <span className="w-1 h-1 bg-blue-500 rounded-full"></span>
                        Available Sizes
                      </h3>
                      <div className="flex flex-wrap gap-1">
                        {[...new Set(product.variants?.map(v => v.size).filter(Boolean))].map((size) => (
                          <Badge key={size} variant="outline" className="px-1.5 py-0.5 text-xs font-medium hover:bg-blue-100 hover:border-blue-400 transition-colors bg-slate-50 border-slate-300 text-slate-700">
                            {size}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div className="bg-slate-100 rounded-md p-2 border border-slate-200">
                      <h3 className="font-semibold text-slate-700 mb-1 flex items-center gap-1 text-xs">
                        <span className="w-1 h-1 bg-pink-500 rounded-full"></span>
                        Available Ages
                      </h3>
                      <div className="flex flex-wrap gap-1">
                        {[...new Set(product.variants?.map(v => v.age_range).filter(Boolean))].map((age) => (
                          <Badge key={age} variant="outline" className="px-1.5 py-0.5 text-xs font-medium hover:bg-pink-100 hover:border-pink-400 transition-colors bg-slate-50 border-slate-300 text-slate-700">
                            {age} years
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Colors */}
                  <div className="bg-slate-100 rounded-md p-2 border border-slate-200">
                    <h3 className="font-semibold text-slate-700 mb-1 flex items-center gap-1 text-xs">
                      <span className="w-1 h-1 bg-emerald-500 rounded-full"></span>
                      Available Colors
                    </h3>
                    <div className="flex flex-wrap gap-1">
                      {[...new Set(product.variants?.map(v => v.color))].map((color) => {
                        const variant = product.variants?.find(v => v.color === color)
                        return (
                          <div key={color} className="flex items-center gap-1 bg-slate-50 rounded-sm px-1.5 py-0.5 border border-slate-300 hover:shadow-sm transition-shadow">
                            <div
                              className="w-3 h-3 rounded-full border border-slate-200 shadow-sm"
                              style={{ backgroundColor: variant?.color_hex || '#6B7280' }}
                            />
                            <span className="text-xs font-medium text-slate-700">{color}</span>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                </div>

                {/* Enhanced Product Detail Client */}
                <div className="bg-slate-100 rounded-lg p-2 border border-slate-200 shadow-sm">
                  <ProductDetailClient product={product} />
                </div>
              </div>
            </div>
          </div>

          {/* Related Products Section */}
          {relatedProducts.length > 0 && (
            <div className="bg-slate-50/80 backdrop-blur-sm rounded-xl shadow-lg border border-slate-200/30 p-4">
              <div className="text-center mb-4">
                <h2 className="text-xl lg:text-2xl font-bold text-slate-800 mb-1">
                  You Might Also Like
                </h2>
                <p className="text-slate-600 text-sm">Discover more amazing products</p>
              </div>
              <ProductGridClient products={relatedProducts} />
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  )
}
