import { ServerHeader } from "@/components/server-header"
import { Footer } from "@/components/footer"
import { ProductGridClient } from "@/components/product-grid-client"
import { AnimatedSection } from "@/components/animated-section"
import { getProducts } from "@/lib/database"

// Force dynamic rendering and disable caching
export const dynamic = 'force-dynamic'
export const revalidate = 0

export default async function GirlsPage() {
  // Fetch girls products from database with cache busting
  const girlsProducts = await getProducts({ 
    gender: 'girls', 
    active: true,
    _cacheBust: Date.now()
  })

  return (
    <div className="min-h-screen">
      <ServerHeader />

      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-pink-600 to-purple-800 text-white py-16 overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="container mx-auto px-4 text-center relative z-10">
          <AnimatedSection animation="fade-down" className="space-y-6">
            <h1 className="text-4xl lg:text-5xl font-bold mb-4 animate-gradient bg-gradient-to-r from-white to-pink-100 bg-clip-text text-transparent">
              Girls Collection
            </h1>
            <p className="text-xl opacity-90 max-w-2xl mx-auto leading-relaxed">
              Beautiful and stylish clothes for amazing girls. Express your unique style with confidence!
            </p>
          </AnimatedSection>
        </div>
        {/* Floating decorative elements */}
        <div className="absolute top-10 right-10 w-20 h-20 bg-white/10 rounded-full animate-float"></div>
        <div className="absolute bottom-10 left-10 w-16 h-16 bg-white/10 rounded-full animate-float-delayed"></div>
        <div className="absolute top-1/2 left-20 w-12 h-12 bg-white/5 rounded-full animate-bounce"></div>
      </section>

      <div className="container mx-auto px-4 py-8">
        <AnimatedSection animation="fade-up" className="mb-8">
          <h2 className="text-2xl font-bold mb-2 flex items-center gap-2">
            <span className="w-1 h-8 bg-pink-600 rounded-full"></span>
            {girlsProducts.length} Product{girlsProducts.length !== 1 ? "s" : ""} Available
          </h2>
          <p className="text-muted-foreground">Discover beautiful clothes designed for stylish girls</p>
        </AnimatedSection>

        <ProductGridClient products={girlsProducts} />
      </div>

      <Footer />
    </div>
  )
}
