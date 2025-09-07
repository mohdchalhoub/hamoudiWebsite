import { ServerHeader } from "@/components/server-header"
import { Footer } from "@/components/footer"
import { Product3DCarousel } from "@/components/product-3d-carousel"
import { DesktopProductGrid } from "@/components/desktop-product-grid"
import { MobileProductPagination } from "@/components/mobile-product-pagination"
import { AnimatedSection } from "@/components/animated-section"
import { SectionHeader } from "@/components/section-header"
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
      <section className="bg-background">
        <div className="container mx-auto px-4">
          <AnimatedSection animation="fade-up">
            <SectionHeader 
              title="Girls Collection"
              subtitle="Beautiful and stylish clothes for amazing girls. Express your unique style with confidence!"
            />
          </AnimatedSection>
        </div>
      </section>

      <div className="container mx-auto px-4 py-8">
        <AnimatedSection animation="fade-up" className="mb-8">
          <h2 className="text-2xl font-bold mb-2 flex items-center gap-2">
            <span className="w-1 h-8 bg-primary rounded-full"></span>
            {girlsProducts.length} Product{girlsProducts.length !== 1 ? "s" : ""} Available
          </h2>
          <p className="text-text-muted">Discover beautiful clothes designed for stylish girls</p>
        </AnimatedSection>

        <MobileProductPagination products={girlsProducts} />
      </div>

      <Footer />
    </div>
  )
}
