import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ServerHeader } from "@/components/server-header"
import { Footer } from "@/components/footer"
import { EnhancedAnimatedSection } from "@/components/enhanced-animated-section"
import { PageTransition } from "@/components/page-transition"
import { Product3DCarousel } from "@/components/product-3d-carousel"
import { getProducts } from "@/lib/database"
import { ArrowRight, Shield, Truck, Heart, Sparkles, Star, Zap } from "lucide-react"

// Force dynamic rendering and disable caching
export const dynamic = 'force-dynamic'
export const revalidate = 0

export default async function HomePage() {
  // Fetch products from database with cache busting
  const cacheBust = Date.now()
  const [featuredProducts, boysProducts, girlsProducts, onSaleProducts] = await Promise.all([
    getProducts({ featured: true, active: true, limit: 4, _cacheBust: cacheBust }),
    getProducts({ gender: 'boys', active: true, limit: 2, _cacheBust: cacheBust }),
    getProducts({ gender: 'girls', active: true, limit: 2, _cacheBust: cacheBust }),
    getProducts({ on_sale: true, active: true, limit: 4, _cacheBust: cacheBust })
  ])
  

  return (
    <PageTransition>
      <div className="min-h-screen">
        <ServerHeader />

        {/* Hero Section */}
        <section className="relative overflow-hidden bg-gradient-to-br from-gray-50 via-white to-gray-100 min-h-screen flex items-center">
          {/* Background Elements */}
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-400/20 to-pink-400/20 rounded-full blur-3xl animate-float-gentle" />
            <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-pink-400/20 to-purple-400/20 rounded-full blur-3xl animate-float-gentle" style={{ animationDelay: '2s' }} />
          </div>

          <div className="container mx-auto px-4 py-16 lg:py-24 relative z-10">
            <EnhancedAnimatedSection animation="fade-up" className="text-center space-y-8 max-w-4xl mx-auto">
              <div className="space-y-6">
                <EnhancedAnimatedSection animation="bounce" delay={0.1}>
                  <div className="hover:scale-105 hover:rotate-1 transition-all duration-500">
                    <Badge className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white px-6 py-2 text-sm font-semibold shadow-lg hover:shadow-xl transition-all duration-500 rounded-full">
                      <Sparkles className="w-4 h-4 mr-2" />
                      New Collection 2024
                    </Badge>
                  </div>
                </EnhancedAnimatedSection>
                
                <EnhancedAnimatedSection animation="fade-up" delay={0.2}>
                  <h1 className="text-display-2xl lg:text-display-2xl font-display text-balance leading-tight text-gray-900 text-shadow-premium">
                    Luxe Fashion for
                    <br />
                    <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent animate-gradient text-glow" style={{ backgroundSize: "200% 200%" }}>
                      Amazing Kids
                    </span>
                  </h1>
                </EnhancedAnimatedSection>
                
                <EnhancedAnimatedSection animation="fade-up" delay={0.4}>
                  <p className="text-xl text-gray-600 text-pretty max-w-2xl mx-auto leading-relaxed font-body">
                    Discover our playful, modern collection of kids' clothing. Quality fashion that sparks imagination and
                    brings joy to every adventure.
                  </p>
                </EnhancedAnimatedSection>
              </div>
              
              <EnhancedAnimatedSection animation="bounce" delay={0.6}>
                <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
                  <div className="flex-1 hover:scale-105 transition-transform duration-500">
                    <Link href="/boys" className="block">
                      <Button 
                        size="lg" 
                        className="w-full premium-button h-14 text-base font-semibold rounded-2xl"
                      >
                        <Zap className="mr-2 h-5 w-5" />
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
                        className="w-full border-2 border-pink-600 text-pink-600 hover:bg-pink-600 hover:text-white bg-transparent shadow-lg hover:shadow-xl transition-all duration-500 h-14 text-base font-semibold rounded-2xl hover:scale-105"
                      >
                        <Star className="mr-2 h-5 w-5" />
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
        <EnhancedAnimatedSection animation="fade-up" className="py-24 bg-gradient-to-b from-white to-gray-50">
          <div className="container mx-auto px-4">
            <EnhancedAnimatedSection animation="fade-up" className="text-center mb-16">
              <div>
                <Badge className="bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 text-white px-6 py-2 mb-4 text-sm font-semibold shadow-lg rounded-full">
                  <Star className="w-4 h-4 mr-2" />
                  Featured Collection
                </Badge>
                <h2 className="text-display-lg font-display mb-6 text-gray-900 text-shadow-premium">
                  Our Most Popular Items
                </h2>
                <p className="text-gray-600 text-lg max-w-2xl mx-auto leading-relaxed font-body">
                  Discover the pieces that kids absolutely love and parents trust. Quality meets style in every design.
                </p>
              </div>
            </EnhancedAnimatedSection>
            
            <Product3DCarousel products={featuredProducts.slice(0, 4)} title="Featured Products" />
          </div>
        </EnhancedAnimatedSection>

        {/* On Sale Products Section */}
        {onSaleProducts.length > 0 && (
          <EnhancedAnimatedSection animation="fade-up" className="py-20 bg-gradient-to-br from-red-50 via-orange-50 to-pink-50 relative overflow-hidden">
            {/* Background Elements */}
            <div className="absolute inset-0 overflow-hidden">
              <div className="absolute top-20 right-20 w-32 h-32 bg-gradient-to-br from-red-400/20 to-orange-400/20 rounded-full blur-2xl animate-float-gentle" />
            </div>
            
            <div className="container mx-auto px-4 relative z-10">
              <EnhancedAnimatedSection animation="fade-up" className="text-center mb-16">
                <div>
                  <div className="hover:scale-105 hover:rotate-1 transition-all duration-300">
                    <Badge className="bg-gradient-to-r from-red-500 to-orange-500 text-white px-6 py-2 mb-4 text-sm font-medium shadow-lg">
                      🔥 Limited Time Offers
                    </Badge>
                  </div>
                  <h2 className="text-4xl lg:text-5xl font-bold mb-6 bg-gradient-to-r from-red-600 to-orange-600 bg-clip-text text-transparent">
                    Amazing Deals
                  </h2>
                  <p className="text-muted-foreground text-lg max-w-2xl mx-auto leading-relaxed">
                    Don't miss out on these incredible savings! Limited time offers on our most popular items.
                  </p>
                </div>
              </EnhancedAnimatedSection>
              
              <Product3DCarousel products={onSaleProducts.slice(0, 4)} title="On Sale Products" />
            </div>
          </EnhancedAnimatedSection>
        )}

        {/* Category Sections */}
        <EnhancedAnimatedSection animation="fade-up" className="py-20 bg-gradient-to-b from-white to-gray-50">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
              {/* Boys Section */}
              <EnhancedAnimatedSection animation="fade-right" className="space-y-8">
                <div className="text-center lg:text-left">
                  <Badge className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-4 py-1 mb-4 text-sm font-medium">
                    <Zap className="w-4 h-4 mr-2" />
                    Boys Collection
                  </Badge>
                  <h2 className="text-4xl lg:text-5xl font-bold text-blue-600 mb-6">
                    Cool & Comfortable
                  </h2>
                  <p className="text-muted-foreground mb-8 text-lg leading-relaxed">
                    Cool and comfortable clothes for adventurous boys! Perfect for playtime and everyday adventures.
                  </p>
                  <div className="hover:scale-105 transition-transform duration-300">
                    <Link href="/boys">
                      <Button className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-lg hover:shadow-xl transition-all duration-300 h-12 px-8">
                        Shop Boys Collection
                        <ArrowRight className="ml-2 h-5 w-5" />
                      </Button>
                    </Link>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  {boysProducts.map((product, index) => (
                    <div key={product.id} className="animate-fade-in-up hover:-translate-y-1 transition-transform duration-300" style={{ animationDelay: `${index * 0.1}s` }}>
                      <Link href={`/products/${product.id}`}>
                        <Card className="group overflow-hidden hover:shadow-xl hover:-translate-y-2 transition-all duration-500 cursor-pointer border-0 shadow-lg">
                          <div className="relative aspect-[3/4] overflow-hidden bg-gradient-to-br from-blue-50 to-blue-100">
                            <div className="relative w-full h-full group-hover:scale-105 transition-transform duration-500">
                              <Image
                                src={product.images?.[0] || "/placeholder.svg"}
                                alt={product.name}
                                fill
                                className="object-cover transition-all duration-500"
                              />
                            </div>
                          </div>
                          <CardContent className="p-3">
                            <h3 className="font-semibold text-sm mb-2 line-clamp-2 group-hover:text-primary transition-colors duration-200">
                              {product.name}
                            </h3>
                            <p className="text-blue-600 font-bold text-lg">${product.price}</p>
                          </CardContent>
                        </Card>
                      </Link>
                    </div>
                  ))}
                </div>
              </EnhancedAnimatedSection>

              {/* Girls Section */}
              <EnhancedAnimatedSection animation="fade-left" className="space-y-8">
                <div className="text-center lg:text-left">
                  <Badge className="bg-gradient-to-r from-pink-500 to-pink-600 text-white px-4 py-1 mb-4 text-sm font-medium">
                    <Star className="w-4 h-4 mr-2" />
                    Girls Collection
                  </Badge>
                  <h2 className="text-4xl lg:text-5xl font-bold text-pink-600 mb-6">
                    Beautiful & Stylish
                  </h2>
                  <p className="text-muted-foreground mb-8 text-lg leading-relaxed">
                    Beautiful and stylish clothes for amazing girls! Designed to spark joy and confidence.
                  </p>
                  <div className="hover:scale-105 transition-transform duration-300">
                    <Link href="/girls">
                      <Button className="bg-gradient-to-r from-pink-600 to-pink-700 hover:from-pink-700 hover:to-pink-800 text-white shadow-lg hover:shadow-xl transition-all duration-300 h-12 px-8">
                        Shop Girls Collection
                        <ArrowRight className="ml-2 h-5 w-5" />
                      </Button>
                    </Link>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  {girlsProducts.map((product, index) => (
                    <div key={product.id} className="animate-fade-in-up hover:-translate-y-1 transition-transform duration-300" style={{ animationDelay: `${index * 0.1}s` }}>
                      <Link href={`/products/${product.id}`}>
                        <Card className="group overflow-hidden hover:shadow-xl hover:-translate-y-2 transition-all duration-500 cursor-pointer border-0 shadow-lg">
                          <div className="relative aspect-[3/4] overflow-hidden bg-gradient-to-br from-pink-50 to-pink-100">
                            <div className="relative w-full h-full group-hover:scale-105 transition-transform duration-500">
                              <Image
                                src={product.images?.[0] || "/placeholder.svg"}
                                alt={product.name}
                                fill
                                className="object-cover transition-all duration-500"
                              />
                            </div>
                          </div>
                          <CardContent className="p-3">
                            <h3 className="font-semibold text-sm mb-2 line-clamp-2 group-hover:text-primary transition-colors duration-200">
                              {product.name}
                            </h3>
                            <p className="text-pink-600 font-bold text-lg">${product.price}</p>
                          </CardContent>
                        </Card>
                      </Link>
                    </div>
                  ))}
                </div>
              </EnhancedAnimatedSection>
            </div>
          </div>
        </EnhancedAnimatedSection>

        {/* Features Section */}
        <EnhancedAnimatedSection animation="fade-up" className="py-20 bg-gradient-to-b from-gray-50 to-white">
          <div className="container mx-auto px-4">
            <EnhancedAnimatedSection animation="fade-up" className="text-center mb-16">
              <div>
                <Badge className="bg-gradient-to-r from-green-500 to-blue-500 text-white px-4 py-1 mb-4 text-sm font-medium">
                  <Shield className="w-4 h-4 mr-2" />
                  Why Choose Us
                </Badge>
                <h2 className="text-4xl lg:text-5xl font-bold mb-6 bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
                  What Makes Us Special
                </h2>
                <p className="text-muted-foreground text-lg max-w-2xl mx-auto leading-relaxed">
                  We're committed to providing the best experience for both kids and parents.
                </p>
              </div>
            </EnhancedAnimatedSection>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
              {[
                {
                  icon: Shield,
                  title: "Safe & Quality",
                  description: "All our clothes are made with safe, high-quality materials that are gentle on kids' skin.",
                  color: "blue",
                  gradient: "from-blue-500 to-blue-600"
                },
                {
                  icon: Truck,
                  title: "Fast Delivery",
                  description: "Quick and reliable delivery to your doorstep. Free shipping on orders over $50.",
                  color: "green",
                  gradient: "from-green-500 to-green-600"
                },
                {
                  icon: Heart,
                  title: "Kids Love It",
                  description: "Designed with kids in mind - comfortable, fun, and perfect for all their adventures.",
                  color: "pink",
                  gradient: "from-pink-500 to-pink-600"
                }
              ].map((feature, index) => (
                <div
                  key={feature.title}
                  className="text-center space-y-6 group animate-fade-in-up hover:-translate-y-2 transition-transform duration-300"
                  style={{ animationDelay: `${index * 0.2}s` }}
                >
                  <div className={`w-20 h-20 bg-gradient-to-br ${feature.gradient} rounded-2xl flex items-center justify-center mx-auto shadow-lg group-hover:shadow-xl group-hover:scale-110 group-hover:rotate-1 transition-all duration-300`}>
                    <feature.icon className="h-10 w-10 text-white" />
                  </div>
                  <div className="space-y-3">
                    <h3 className="text-2xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors duration-300">
                      {feature.title}
                    </h3>
                    <p className="text-muted-foreground leading-relaxed max-w-sm mx-auto">
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
