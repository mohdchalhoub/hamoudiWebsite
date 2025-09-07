import { ServerHeader } from "@/components/server-header"
import { Footer } from "@/components/footer"
import { Product3DCarousel } from "@/components/product-3d-carousel"
import { DesktopProductGrid } from "@/components/desktop-product-grid"
import { AnimatedSection } from "@/components/animated-section"
import { SectionHeader } from "@/components/section-header"
import { getProducts } from "@/lib/database"

// Force dynamic rendering and disable caching
export const dynamic = 'force-dynamic'
export const revalidate = 0

export default async function BoysPage() {
  // Fetch boys products from database with cache busting
  const boysProducts = await getProducts({ 
    gender: 'boys', 
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
              title="Boys Collection"
              subtitle="Cool and comfortable clothes for adventurous boys. Find the perfect outfit for every occasion!"
            />
          </AnimatedSection>
        </div>
      </section>

      <div className="container mx-auto px-4 py-8">
        <AnimatedSection animation="fade-up" className="mb-8">
          <h2 className="text-2xl font-bold mb-2 flex items-center gap-2">
            <span className="w-1 h-8 bg-primary rounded-full"></span>
            {boysProducts.length} Product{boysProducts.length !== 1 ? "s" : ""} Available
          </h2>
          <p className="text-text-muted">Discover amazing clothes designed for active boys</p>
        </AnimatedSection>

        <DesktopProductGrid products={boysProducts} />
      </div>

      <Footer />
    </div>
  )
}