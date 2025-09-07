import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ServerHeader } from "@/components/server-header"
import { Footer } from "@/components/footer"
import { AnimatedSection } from "@/components/animated-section"
import { getProducts } from "@/lib/database"
import { ArrowRight, Shield, Truck, Heart } from "lucide-react"

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
    <div className="min-h-screen">
      <ServerHeader />

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-blue-50 via-white to-pink-50">
        <div className="container mx-auto px-4 py-16 lg:py-24">
          <AnimatedSection animation="fade-up" className="text-center space-y-8 max-w-4xl mx-auto">
            <div className="space-y-4">
              <AnimatedSection animation="fade-down" delay={100}>
                <Badge className="bg-blue-600 text-white animate-float border-0 hover-wiggle">New Collection</Badge>
              </AnimatedSection>
              <AnimatedSection animation="fade-up" delay={200}>
                <h1 className="text-4xl lg:text-6xl font-bold text-balance">
                  Luxe Fashion for
                  <br />
                  <span className="bg-gradient-to-r from-blue-600 to-pink-600 bg-clip-text text-transparent animate-gradient">
                    Amazing Kids
                  </span>
                </h1>
              </AnimatedSection>
              <AnimatedSection animation="fade-up" delay={300}>
                <p className="text-xl text-muted-foreground text-pretty max-w-2xl mx-auto">
                  Discover our playful, modern collection of kids' clothing. Quality fashion that sparks imagination and
                  brings joy to every adventure.
                </p>
              </AnimatedSection>
            </div>
            <AnimatedSection animation="elastic" delay={400}>
              <div className="flex flex-row gap-4 max-w-md mx-auto">
                <Link href="/boys" className="flex-1">
                  <Button size="lg" className="w-full bg-blue-600 hover:bg-blue-700 hover-glow hover-bounce btn-press micro-bounce">
                    Shop Boys
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
                <Link href="/girls" className="flex-1">
                  <Button
                    size="lg"
                    variant="outline"
                    className="w-full border-pink-600 text-pink-600 hover:bg-pink-50 bg-transparent hover-glow-pink hover-bounce btn-press micro-bounce"
                  >
                    Shop Girls
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </AnimatedSection>
          </AnimatedSection>
        </div>
      </section>

      {/* Featured Products Section */}
      <AnimatedSection animation="fade-up" className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Featured Products</h2>
            <p className="text-muted-foreground text-lg">Our most popular items that kids absolutely love</p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 md:gap-4 max-w-6xl mx-auto">
            {featuredProducts.slice(0, 4).map((product, index) => (
              <AnimatedSection key={product.id} animation="scale-in" delay={(index + 1) * 100}>
                <Link href={`/products/${product.id}`}>
                  <Card className="group overflow-hidden hover:shadow-lg hover:-translate-y-1 transition-all duration-300 cursor-pointer">
                    <div className="relative aspect-[3/4] overflow-hidden">
                      <Image
                        src={product.images?.[0] || "/placeholder.svg"}
                        alt={product.name}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                      {product.is_featured && (
                        <Badge className="absolute top-1 left-1 bg-yellow-500 text-yellow-900 text-xs px-1.5 py-0.5">Featured</Badge>
                      )}
                    </div>
                    <CardContent className="p-2">
                      <h3 className="font-semibold text-xs mb-1 line-clamp-2 group-hover:text-primary transition-colors duration-200">{product.name}</h3>
                      <p className="text-blue-600 font-bold text-sm">${product.price}</p>
                    </CardContent>
                  </Card>
                </Link>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </AnimatedSection>

      {/* On Sale Products Section */}
      {onSaleProducts.length > 0 && (
        <AnimatedSection animation="fade-up" className="py-16 bg-gradient-to-r from-red-50 to-orange-50">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4 text-red-600">🔥 On Sale</h2>
              <p className="text-muted-foreground text-lg">Limited time offers - Don't miss out on these amazing deals!</p>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 md:gap-4 max-w-6xl mx-auto">
              {onSaleProducts.slice(0, 4).map((product, index) => {
                const discountPercentage = product.compare_at_price 
                  ? Math.round(((product.compare_at_price - product.price) / product.compare_at_price) * 100)
                  : 0
                
                return (
                  <AnimatedSection key={product.id} animation="scale-in" delay={(index + 1) * 100}>
                    <Link href={`/products/${product.id}`}>
                      <Card className="group overflow-hidden hover:shadow-lg hover:-translate-y-1 transition-all duration-300 cursor-pointer border-red-200">
                        <div className="relative aspect-[3/4] overflow-hidden">
                          <Image
                            src={product.images?.[0] || "/placeholder.svg"}
                            alt={product.name}
                            fill
                            className="object-cover transition-transform duration-500 group-hover:scale-105"
                          />
                          <Badge className="absolute top-1 left-1 bg-red-500 text-white text-xs px-1.5 py-0.5">
                            -{discountPercentage}%
                          </Badge>
                          <Badge className="absolute top-1 right-1 bg-orange-500 text-white text-xs px-1.5 py-0.5">
                            Sale
                          </Badge>
                        </div>
                        <CardContent className="p-2">
                          <h3 className="font-semibold text-xs mb-1 line-clamp-2 group-hover:text-primary transition-colors duration-200">{product.name}</h3>
                          <div className="flex items-center gap-2">
                            <p className="text-red-600 font-bold text-sm">${product.price}</p>
                            {product.compare_at_price && (
                              <p className="text-gray-400 text-xs line-through">${product.compare_at_price}</p>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    </Link>
                  </AnimatedSection>
                )
              })}
            </div>
          </div>
        </AnimatedSection>
      )}

      {/* Category Sections */}
      <AnimatedSection animation="fade-up" className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Boys Section */}
            <AnimatedSection animation="fade-right" className="space-y-6">
              <div className="text-center lg:text-left">
                <h2 className="text-3xl font-bold text-blue-600 mb-4">Boys Collection</h2>
                <p className="text-muted-foreground mb-6">
                  Cool and comfortable clothes for adventurous boys!
                </p>
                <Link href="/boys">
                  <Button className="bg-blue-600 hover:bg-blue-700 hover-glow btn-press">
                    Shop Boys Collection
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </div>
              <div className="grid grid-cols-2 gap-3">
                {boysProducts.map((product, index) => (
                  <AnimatedSection key={product.id} animation="scale-in" delay={(index + 1) * 100}>
                    <Link href={`/products/${product.id}`}>
                      <Card className="group overflow-hidden hover:shadow-lg hover:-translate-y-1 transition-all duration-300 cursor-pointer">
                        <div className="relative aspect-[3/4] overflow-hidden">
                          <Image
                            src={product.images?.[0] || "/placeholder.svg"}
                            alt={product.name}
                            fill
                            className="object-cover transition-transform duration-500 group-hover:scale-105"
                          />
                        </div>
                        <CardContent className="p-2">
                          <h3 className="font-semibold text-xs mb-1 line-clamp-2 group-hover:text-primary transition-colors duration-200">{product.name}</h3>
                          <p className="text-blue-600 font-bold text-sm">${product.price}</p>
                        </CardContent>
                      </Card>
                    </Link>
                  </AnimatedSection>
                ))}
              </div>
            </AnimatedSection>

            {/* Girls Section */}
            <AnimatedSection animation="fade-left" className="space-y-6">
              <div className="text-center lg:text-left">
                <h2 className="text-3xl font-bold text-pink-600 mb-4">Girls Collection</h2>
                <p className="text-muted-foreground mb-6">
                  Beautiful and stylish clothes for amazing girls!
                </p>
                <Link href="/girls">
                  <Button className="bg-pink-600 hover:bg-pink-700 hover-glow-pink btn-press">
                    Shop Girls Collection
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </div>
              <div className="grid grid-cols-2 gap-3">
                {girlsProducts.map((product, index) => (
                  <AnimatedSection key={product.id} animation="scale-in" delay={(index + 1) * 100}>
                    <Link href={`/products/${product.id}`}>
                      <Card className="group overflow-hidden hover:shadow-lg hover:-translate-y-1 transition-all duration-300 cursor-pointer">
                        <div className="relative aspect-[3/4] overflow-hidden">
                          <Image
                            src={product.images?.[0] || "/placeholder.svg"}
                            alt={product.name}
                            fill
                            className="object-cover transition-transform duration-500 group-hover:scale-105"
                          />
                        </div>
                        <CardContent className="p-2">
                          <h3 className="font-semibold text-xs mb-1 line-clamp-2 group-hover:text-primary transition-colors duration-200">{product.name}</h3>
                          <p className="text-pink-600 font-bold text-sm">${product.price}</p>
                        </CardContent>
                      </Card>
                    </Link>
                  </AnimatedSection>
                ))}
              </div>
            </AnimatedSection>
          </div>
        </div>
      </AnimatedSection>

      <AnimatedSection animation="fade-up" className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <AnimatedSection animation="scale-in" delay={100} className="text-center space-y-4">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto hover-lift">
                <Shield className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold">Safe & Quality</h3>
              <p className="text-muted-foreground">
                All our clothes are made with safe, high-quality materials that are gentle on kids' skin.
              </p>
            </AnimatedSection>
            <AnimatedSection animation="scale-in" delay={200} className="text-center space-y-4">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto hover-lift">
                <Truck className="h-6 w-6 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold">Fast Delivery</h3>
              <p className="text-muted-foreground">
                Quick and reliable delivery to your doorstep. Free shipping on orders over $50.
              </p>
            </AnimatedSection>
            <AnimatedSection animation="scale-in" delay={300} className="text-center space-y-4">
              <div className="w-12 h-12 bg-pink-100 rounded-full flex items-center justify-center mx-auto hover-lift">
                <Heart className="h-6 w-6 text-pink-600" />
              </div>
              <h3 className="text-xl font-semibold">Kids Love It</h3>
              <p className="text-muted-foreground">
                Designed with kids in mind - comfortable, fun, and perfect for all their adventures.
              </p>
            </AnimatedSection>
          </div>
        </div>
      </AnimatedSection>

      <Footer />
    </div>
  )
}
