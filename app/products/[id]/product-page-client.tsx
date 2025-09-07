"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { ProductDetailClient } from "./product-detail-client"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Product3DCarousel } from "@/components/product-3d-carousel"
import { ProductImageCarousel } from "@/components/product-image-carousel"
import { ArrowLeft } from "lucide-react"
import type { ProductWithDetails } from "@/lib/database.types"

interface ProductPageClientProps {
  product: ProductWithDetails
  relatedProducts: ProductWithDetails[]
}

export function ProductPageClient({ product, relatedProducts }: ProductPageClientProps) {
  const [currentPrice, setCurrentPrice] = useState(product.price)

  const discountPercentage = product.compare_at_price
    ? Math.round(((product.compare_at_price - product.price) / product.compare_at_price) * 100)
    : 0

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-50 via-gray-100 to-gray-50">
      <main className="flex-1">
        <div className="container mx-auto px-4 py-6 max-w-7xl">
          {/* Back to Home Button */}
          <div className="mb-6">
            <Link href="/">
              <Button variant="outline" size="sm" className="flex items-center gap-2 hover:scale-105 transition-all duration-300 bg-white/90 backdrop-blur-sm border-gray-300/50 shadow-sm hover:shadow-lg text-gray-700 hover:bg-gray-50">
                <ArrowLeft className="h-4 w-4" />
                Back to Home
              </Button>
            </Link>
          </div>

          {/* Main Product Section - Modern Design */}
          <div className="bg-white rounded-3xl shadow-xl border border-gray-200/50 p-8 mb-8 animate-fade-in-up">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
              {/* Product Images */}
              <div className="flex flex-col items-center lg:items-start animate-fade-in-left" data-aos="fade-right" data-aos-delay="200">
                <ProductImageCarousel
                  images={product.images || []}
                  productName={product.name}
                  isFeatured={product.is_featured}
                  discountPercentage={discountPercentage}
                  className="w-full max-w-md"
                />
                
                {/* Additional product info below image */}
                <div className="mt-4 text-center lg:text-left">
                  <div className="flex items-center justify-center lg:justify-start gap-3 text-sm text-gray-600">
                    <div className="flex items-center gap-2 bg-emerald-50 px-3 py-1.5 rounded-full border border-emerald-200">
                      <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                      <span className="font-medium">In Stock</span>
                    </div>
                    <div className="flex items-center gap-2 bg-primary-50 px-3 py-1.5 rounded-full border border-primary-200">
                      <div className="w-2 h-2 bg-primary-500 rounded-full"></div>
                      <span className="font-medium">Free Shipping</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Product Details */}
              <div className="space-y-6 animate-fade-in-right" data-aos="fade-left" data-aos-delay="400">
                {/* Product Title */}
                <div className="space-y-4">
                  <h1 className="text-3xl lg:text-4xl font-display font-bold text-gray-900 leading-tight">
                    {product.name}
                  </h1>
                  
                  {/* Product Code Display - Styled */}
                  {product.product_code && (
                    <div className="bg-gray-100 rounded-xl p-4 border border-gray-200">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
                          <span className="text-primary-600 font-bold text-sm">#</span>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-600">Product Code</p>
                          <p className="font-mono font-bold text-lg text-gray-900">{product.product_code}</p>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  {/* Season Badge - Enhanced */}
                  {product.season && (
                    <div className="flex items-center gap-3">
                      <span className="text-sm font-medium text-gray-600">Season:</span>
                      <Badge className={`px-4 py-2 text-sm font-semibold rounded-full shadow-sm ${
                        product.season === 'summer' 
                          ? 'bg-gradient-to-r from-yellow-400 to-orange-500 text-white' 
                          : product.season === 'winter'
                          ? 'bg-gradient-to-r from-primary-400 to-primary-600 text-white'
                          : 'bg-gradient-to-r from-green-400 to-emerald-500 text-white'
                      }`}>
                        {product.season === 'summer' ? '☀️ Summer' : product.season === 'winter' ? '❄️ Winter' : '🌍 All Season'}
                      </Badge>
                    </div>
                  )}
                  
                  {/* Description - Styled Box */}
                  <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                    <p className="text-gray-600 text-base leading-relaxed font-body">{product.description}</p>
                  </div>
                </div>

                {/* Price Section - Enhanced with Dynamic Price */}
                <div className="bg-gradient-to-r from-primary-50 to-primary-100 rounded-2xl p-6 border border-primary-200 shadow-sm">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <span className="text-3xl lg:text-4xl font-display font-bold text-gray-900 transition-colors duration-200">
                        ${currentPrice.toFixed(2)}
                      </span>
                      {product.compare_at_price && (
                        <span className="text-xl text-gray-400 line-through">${product.compare_at_price}</span>
                      )}
                    </div>
                    {discountPercentage > 0 && (
                      <Badge className="bg-gradient-to-r from-red-500 to-red-600 text-white px-4 py-2 text-sm font-bold shadow-lg">
                        🔥 Save {discountPercentage}%
                      </Badge>
                    )}
                  </div>
                </div>

                {/* Enhanced Product Detail Client */}
                <div className="bg-gray-50 rounded-2xl p-6 border border-gray-200">
                  <ProductDetailClient 
                    product={product} 
                    onPriceChange={setCurrentPrice}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Related Products Section */}
          {relatedProducts.length > 0 && (
            <div className="bg-white rounded-3xl shadow-xl border border-gray-200/50 p-8 animate-fade-in-up" data-aos="fade-up" data-aos-delay="600">
              <div className="text-center mb-8">
                <h2 className="text-3xl lg:text-4xl font-display font-bold text-gray-900 mb-3">
                  You Might Also Like
                </h2>
                <p className="text-gray-600 text-lg font-body">Discover more amazing products</p>
              </div>
              <Product3DCarousel products={relatedProducts} />
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
