import { ServerHeader } from "@/components/server-header"
import { Footer } from "@/components/footer"
import { ProductGridClient } from "@/components/product-grid-client"
import { AnimatedSection } from "@/components/animated-section"
import { getProducts } from "@/lib/database"
import { Badge } from "@/components/ui/badge"

// Force dynamic rendering and disable caching
export const dynamic = 'force-dynamic'
export const revalidate = 0

export default async function OnSalePage() {
  // Fetch all products that are on sale with cache busting
  const onSaleProducts = await getProducts({ 
    on_sale: true, 
    active: true,
    _cacheBust: Date.now()
  })

  return (
    <div className="min-h-screen">
      <ServerHeader />

      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-red-600 to-orange-600 text-white py-16 overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="container mx-auto px-4 text-center relative z-10">
          <AnimatedSection animation="fade-down" className="space-y-6">
            <div className="flex items-center justify-center gap-3 mb-4">
              <span className="text-6xl">🔥</span>
              <h1 className="text-4xl lg:text-5xl font-bold animate-gradient bg-gradient-to-r from-white to-orange-100 bg-clip-text text-transparent">
                On Sale
              </h1>
              <span className="text-6xl">🔥</span>
            </div>
            <p className="text-xl opacity-90 max-w-2xl mx-auto leading-relaxed">
              Limited time offers! Don't miss out on these amazing deals. Shop now before they're gone!
            </p>
            <Badge className="bg-white/20 text-white text-lg px-4 py-2 border-white/30">
              {onSaleProducts.length} Product{onSaleProducts.length !== 1 ? "s" : ""} on Sale
            </Badge>
          </AnimatedSection>
        </div>
        {/* Floating decorative elements */}
        <div className="absolute top-10 left-10 w-20 h-20 bg-white/10 rounded-full animate-float"></div>
        <div className="absolute bottom-10 right-10 w-16 h-16 bg-white/10 rounded-full animate-float-delayed"></div>
        <div className="absolute top-1/2 right-20 w-12 h-12 bg-white/5 rounded-full animate-bounce"></div>
        <div className="absolute top-1/3 left-20 w-8 h-8 bg-white/5 rounded-full animate-pulse"></div>
      </section>

      <div className="container mx-auto px-4 py-8">
        {onSaleProducts.length > 0 ? (
          <>
            <AnimatedSection animation="fade-up" className="mb-8">
              <h2 className="text-2xl font-bold mb-2 flex items-center gap-2">
                <span className="w-1 h-8 bg-red-600 rounded-full"></span>
                Amazing Deals Available
              </h2>
              <p className="text-muted-foreground">
                Save big on these limited-time offers. Prices won't stay this low for long!
              </p>
            </AnimatedSection>

            <ProductGridClient products={onSaleProducts} />
          </>
        ) : (
          <AnimatedSection animation="fade-up" className="text-center py-16">
            <div className="space-y-4">
              <div className="text-6xl">😔</div>
              <h2 className="text-2xl font-bold text-gray-600">No Sale Items Available</h2>
              <p className="text-muted-foreground max-w-md mx-auto">
                There are currently no products on sale. Check back soon for amazing deals!
              </p>
              <div className="pt-4">
                <a 
                  href="/" 
                  className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-pink-600 text-white font-medium rounded-lg hover:shadow-lg transition-all duration-300 hover:scale-105"
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
