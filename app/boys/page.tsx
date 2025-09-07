import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { ProductGridClient } from "@/components/product-grid-client"
import { AnimatedSection } from "@/components/animated-section"
import { getProducts } from "@/lib/database"

// Force dynamic rendering and disable caching
export const dynamic = 'force-dynamic'
export const revalidate = 0

export default async function BoysPage() {
  // Fetch boys products from database
  const boysProducts = await getProducts({ 
    gender: 'boys', 
    active: true 
  })

  return (
    <div className="min-h-screen">
      <Header />

      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-blue-600 to-blue-800 text-white py-16 overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="container mx-auto px-4 text-center relative z-10">
          <AnimatedSection animation="fade-down" className="space-y-6">
            <h1 className="text-4xl lg:text-5xl font-bold mb-4 animate-gradient bg-gradient-to-r from-white to-blue-100 bg-clip-text text-transparent">
              Boys Collection
            </h1>
            <p className="text-xl opacity-90 max-w-2xl mx-auto leading-relaxed">
              Cool and comfortable clothes for adventurous boys. Find the perfect outfit for every occasion!
            </p>
          </AnimatedSection>
        </div>
        {/* Floating decorative elements */}
        <div className="absolute top-10 left-10 w-20 h-20 bg-white/10 rounded-full animate-float"></div>
        <div className="absolute bottom-10 right-10 w-16 h-16 bg-white/10 rounded-full animate-float-delayed"></div>
        <div className="absolute top-1/2 right-20 w-12 h-12 bg-white/5 rounded-full animate-bounce"></div>
      </section>

      <div className="container mx-auto px-4 py-8">
        <AnimatedSection animation="fade-up" className="mb-8">
          <h2 className="text-2xl font-bold mb-2 flex items-center gap-2">
            <span className="w-1 h-8 bg-blue-600 rounded-full"></span>
            {boysProducts.length} Product{boysProducts.length !== 1 ? "s" : ""} Available
          </h2>
          <p className="text-muted-foreground">Discover amazing clothes designed for active boys</p>
        </AnimatedSection>

        <ProductGridClient products={boysProducts} />
      </div>

      <Footer />
    </div>
  )
}