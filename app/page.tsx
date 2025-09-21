import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ServerHeader } from "@/components/server-header"
import { MobileSearchBar } from "@/components/mobile-search-bar"
import { Footer } from "@/components/footer"
import { EnhancedAnimatedSection } from "@/components/enhanced-animated-section"
import { PageTransition } from "@/components/page-transition"
import { Enhanced3DCarousel } from "@/components/enhanced-3d-carousel"
import { HeroProductCarousel } from "@/components/hero-product-carousel"
import { SectionHeader } from "@/components/section-header"
import { getProducts } from "@/lib/database"
import { ArrowRight, Shield, Truck, Heart, Sparkles, Star, Zap } from "lucide-react"

// Force dynamic rendering and disable caching
export const dynamic = 'force-dynamic'
export const revalidate = 0

export default async function HomePage() {
  // Fetch products from database with error handling and fallbacks
  const cacheBust = Date.now()
  
  // Helper function to safely fetch products with retry logic
  const safeGetProducts = async (filters: any, retries = 3): Promise<any[]> => {
    for (let i = 0; i < retries; i++) {
      try {
        const products = await getProducts(filters)
        return products || []
      } catch (error) {
        console.warn(`Attempt ${i + 1} failed for products:`, error)
        if (i === retries - 1) {
          console.error('All retry attempts failed, returning empty array')
          return []
        }
        // Wait before retrying
        await new Promise(resolve => setTimeout(resolve, 1000 * (i + 1)))
      }
    }
    return []
  }
  
  // Fetch products with error handling and small delays between requests
  const featuredProducts = await safeGetProducts({ featured: true, active: true, limit: 8, _cacheBust: cacheBust })
  await new Promise(resolve => setTimeout(resolve, 100)) // Small delay
  
  const boysProducts = await safeGetProducts({ gender: 'boys', active: true, limit: 6, _cacheBust: cacheBust })
  await new Promise(resolve => setTimeout(resolve, 100)) // Small delay
  
  const girlsProducts = await safeGetProducts({ gender: 'girls', active: true, limit: 6, _cacheBust: cacheBust })
  await new Promise(resolve => setTimeout(resolve, 100)) // Small delay
  
  const onSaleProducts = await safeGetProducts({ on_sale: true, active: true, limit: 8, _cacheBust: cacheBust })
  
  // Check if we have any products at all
  const hasAnyProducts = featuredProducts.length > 0 || boysProducts.length > 0 || girlsProducts.length > 0 || onSaleProducts.length > 0

  return (
    <PageTransition>
      <div className="min-h-screen">
        <ServerHeader />
        <MobileSearchBar />

        {/* Hero Section */}
        <section className="relative overflow-hidden bg-background min-h-screen flex items-start pt-4 lg:pt-6">

          <div className="container mx-auto px-4 py-4 lg:py-6 relative z-10">
            <EnhancedAnimatedSection animation="fade-up" className="text-center space-y-4 max-w-4xl mx-auto">
              <div className="space-y-3">
                <EnhancedAnimatedSection animation="bounce" delay={0.1}>
                  <div className="hover:scale-105 hover:rotate-1 transition-all duration-500">
                    <Badge className="bg-background text-text-primary border border-border px-6 py-2 text-sm font-semibold hover:border-primary hover:text-primary transition-all duration-300 rounded-none">
                      New Collection 2024
                    </Badge>
                  </div>
                </EnhancedAnimatedSection>
                
                <EnhancedAnimatedSection animation="fade-up" delay={0.2}>
                  <h1 className="text-3xl lg:text-5xl font-light text-text-primary leading-tight">
                    Quality Fashion for
                    <br />
                    <span className="font-normal">
                      Amazing Kids
                    </span>
                  </h1>
                </EnhancedAnimatedSection>
                
              </div>
              
              {/* Hero Product Carousel */}
              <EnhancedAnimatedSection animation="fade-up" delay={0.4}>
                <div className="my-4">
                  <HeroProductCarousel products={featuredProducts} />
                </div>
              </EnhancedAnimatedSection>
              
              <EnhancedAnimatedSection animation="bounce" delay={0.6}>
                <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
                  <div className="flex-1 hover:scale-105 transition-transform duration-500">
                    <Link href="/boys" className="block">
                      <Button 
                        size="lg" 
                        className="w-full bg-primary hover:bg-primary-hover text-white h-12 text-base font-medium rounded-none border-0"
                      >
                        Shop Boys
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </Link>
                  </div>
                  
                  <div className="flex-1 hover:scale-105 transition-transform duration-500">
                    <Link href="/girls" className="block">
                      <Button
                        size="lg"
                        variant="outline"
                        className="w-full border border-border text-text-primary hover:border-primary hover:text-primary bg-background h-12 text-base font-medium rounded-none"
                      >
                        Shop Girls
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </Link>
                  </div>
                </div>
              </EnhancedAnimatedSection>
            </EnhancedAnimatedSection>
          </div>
        </section>

        {/* Featured Products Section */}
        <EnhancedAnimatedSection animation="fade-up" className="bg-white">
          <div className="container mx-auto px-4">
            <EnhancedAnimatedSection animation="fade-up" className="mb-12">
              <SectionHeader 
                title="Featured Collection"
                subtitle="Discover the pieces that kids love and parents trust. Quality meets style in every design."
              />
            </EnhancedAnimatedSection>
            
            {hasAnyProducts ? (
              <Enhanced3DCarousel products={featuredProducts} title="Featured Products" />
            ) : (
              <div className="text-center py-12">
                <h3 className="text-lg font-semibold mb-2">Loading Products...</h3>
                <p className="text-text-muted">Please wait while we load our amazing collection for you.</p>
              </div>
            )}
          </div>
        </EnhancedAnimatedSection>

        {/* On Sale Products Section */}
        {onSaleProducts.length > 0 && (
          <EnhancedAnimatedSection animation="fade-up" className="bg-[#F9FAFB]">
            
            <div className="container mx-auto px-4 relative z-10">
              <EnhancedAnimatedSection animation="fade-up" className="mb-12">
                <SectionHeader 
                  title="On Sale"
                  subtitle="Limited time offers on our most popular items."
                />
              </EnhancedAnimatedSection>
              
              <Enhanced3DCarousel products={onSaleProducts} title="On Sale Products" />
            </div>
          </EnhancedAnimatedSection>
        )}

        {/* Boys Collection Section */}
        <EnhancedAnimatedSection animation="fade-up" className="bg-white">
          <div className="container mx-auto px-4">
            <div className="mb-12">
              <SectionHeader 
                title="Boys Collection"
                subtitle="Cool and comfortable clothes for adventurous boys. Perfect for playtime and everyday adventures."
              />
            </div>
            <div className="flex justify-center mb-8">
              <Link href="/boys">
                <Button className="bg-background border border-border text-text-primary hover:border-primary hover:text-primary h-10 px-6 rounded-none">
                  Shop Boys Collection
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
            {boysProducts.length > 0 ? (
              <Enhanced3DCarousel products={boysProducts} />
            ) : (
              <div className="text-center py-8">
                <p className="text-text-muted">Boys collection coming soon...</p>
              </div>
            )}
          </div>
        </EnhancedAnimatedSection>

        {/* Girls Collection Section */}
        <EnhancedAnimatedSection animation="fade-up" className="bg-[#F9FAFB]">
          <div className="container mx-auto px-4">
            <div className="mb-12">
              <SectionHeader 
                title="Girls Collection"
                subtitle="Beautiful and stylish clothes for amazing girls. Designed to spark joy and confidence."
              />
            </div>
            <div className="flex justify-center mb-8">
              <Link href="/girls">
                <Button className="bg-background border border-border text-text-primary hover:border-primary hover:text-primary h-10 px-6 rounded-none">
                  Shop Girls Collection
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
            {girlsProducts.length > 0 ? (
              <Enhanced3DCarousel products={girlsProducts} />
            ) : (
              <div className="text-center py-8">
                <p className="text-text-muted">Girls collection coming soon...</p>
              </div>
            )}
          </div>
        </EnhancedAnimatedSection>

        {/* Features Section */}
        <EnhancedAnimatedSection animation="fade-up" className="bg-white">
          <div className="container mx-auto px-4">
            <EnhancedAnimatedSection animation="fade-up" className="mb-12">
              <SectionHeader 
                title="Why Choose Us"
                subtitle="We're committed to providing the best experience for both kids and parents."
              />
            </EnhancedAnimatedSection>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
              {[
                {
                  icon: Shield,
                  title: "Safe & Quality",
                  description: "All our clothes are made with safe, high-quality materials that are gentle on kids' skin.",
                  color: "blue",
                  gradient: "from-gray-100 to-gray-200"
                },
                {
                  icon: Truck,
                  title: "Fast Delivery",
                  description: "Quick and reliable delivery to your doorstep. Free shipping on orders over $50.",
                  color: "gray",
                  gradient: "from-gray-100 to-gray-200"
                },
                {
                  icon: Heart,
                  title: "Kids Love It",
                  description: "Designed with kids in mind - comfortable, fun, and perfect for all their adventures.",
                  color: "gray",
                  gradient: "from-gray-100 to-gray-200"
                }
              ].map((feature, index) => (
                <div
                  key={feature.title}
                  className="text-center space-y-6 group animate-fade-in-up hover:-translate-y-2 transition-transform duration-300"
                  style={{ animationDelay: `${index * 0.2}s` }}
                >
                  <div className={`w-16 h-16 bg-background border border-border flex items-center justify-center mx-auto group-hover:border-primary transition-all duration-300`}>
                    <feature.icon className="h-6 w-6 text-text-muted group-hover:text-primary" />
                  </div>
                  <div className="space-y-3">
                    <h3 className="text-lg font-medium text-text-primary group-hover:text-primary transition-colors duration-300">
                      {feature.title}
                    </h3>
                    <p className="text-text-muted text-sm leading-relaxed max-w-sm mx-auto">
                      {feature.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </EnhancedAnimatedSection>

        <Footer />
      </div>
    </PageTransition>
  )
}
