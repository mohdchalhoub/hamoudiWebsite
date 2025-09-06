import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Card, CardContent } from "@/components/ui/card"
import { Heart, Shield, Sparkles, Users } from "lucide-react"
import Image from "next/image"

export default function AboutPage() {
  return (
    <div className="min-h-screen">
      <Header />

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-50 via-white to-pink-50 py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl lg:text-5xl font-bold mb-6 text-balance">
            About{" "}
            <span className="bg-gradient-to-r from-blue-600 to-pink-600 bg-clip-text text-transparent">KidsWear</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto text-pretty">
            We're passionate about creating fun, comfortable, and stylish clothing that lets kids be kids while giving
            parents peace of mind about quality and safety.
          </p>
        </div>
      </section>

      {/* Our Story */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <h2 className="text-3xl font-bold">Our Story</h2>
              <div className="space-y-4 text-muted-foreground">
                <p>
                  KidsWear was born from a simple belief: children deserve clothing that's as vibrant and imaginative as
                  they are. As parents ourselves, we understand the challenge of finding clothes that are both fun for
                  kids and practical for families.
                </p>
                <p>
                  Our journey began when we noticed a gap in the market for truly playful, high-quality children's
                  clothing. We wanted to create pieces that would spark joy, encourage creativity, and stand up to all
                  the adventures childhood brings.
                </p>
                <p>
                  Today, we're proud to offer a carefully curated collection of boys' and girls' clothing that combines
                  modern design with timeless comfort. Every piece is chosen with love and designed to help kids express
                  their unique personalities.
                </p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-4">
                <div className="relative aspect-square rounded-lg overflow-hidden bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center">
                  <div className="text-center text-blue-600">
                    <div className="text-4xl mb-2">👕</div>
                    <div className="text-sm font-medium">Boys Collection</div>
                  </div>
                </div>
                <div className="relative aspect-square rounded-lg overflow-hidden bg-gradient-to-br from-pink-100 to-pink-200 flex items-center justify-center">
                  <div className="text-center text-pink-600">
                    <div className="text-4xl mb-2">👗</div>
                    <div className="text-sm font-medium">Girls Collection</div>
                  </div>
                </div>
              </div>
              <div className="space-y-4 mt-8">
                <div className="relative aspect-square rounded-lg overflow-hidden bg-gradient-to-br from-purple-100 to-purple-200 flex items-center justify-center">
                  <div className="text-center text-purple-600">
                    <div className="text-4xl mb-2">✨</div>
                    <div className="text-sm font-medium">Special Occasions</div>
                  </div>
                </div>
                <div className="relative aspect-square rounded-lg overflow-hidden bg-gradient-to-br from-green-100 to-green-200 flex items-center justify-center">
                  <div className="text-center text-green-600">
                    <div className="text-4xl mb-2">🌟</div>
                    <div className="text-sm font-medium">Everyday Comfort</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Our Values */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Our Values</h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Everything we do is guided by our commitment to quality, safety, creativity, and making childhood more
              magical.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <Card className="text-center">
              <CardContent className="p-6">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Shield className="h-6 w-6 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Safety First</h3>
                <p className="text-muted-foreground text-sm">
                  All our materials are carefully selected to be safe, non-toxic, and gentle on sensitive skin.
                </p>
              </CardContent>
            </Card>
            <Card className="text-center">
              <CardContent className="p-6">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Sparkles className="h-6 w-6 text-green-600" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Creative Design</h3>
                <p className="text-muted-foreground text-sm">
                  Our designs celebrate imagination with fun patterns, vibrant colors, and playful themes kids love.
                </p>
              </CardContent>
            </Card>
            <Card className="text-center">
              <CardContent className="p-6">
                <div className="w-12 h-12 bg-pink-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Heart className="h-6 w-6 text-pink-600" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Made with Love</h3>
                <p className="text-muted-foreground text-sm">
                  Every piece is crafted with attention to detail and genuine care for the children who will wear them.
                </p>
              </CardContent>
            </Card>
            <Card className="text-center">
              <CardContent className="p-6">
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="h-6 w-6 text-purple-600" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Family Focused</h3>
                <p className="text-muted-foreground text-sm">
                  We understand family life and create clothing that works for both kids and parents.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">Meet Our Team</h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto mb-12">
            We're a passionate team of parents, designers, and child development experts who believe in the power of
            great clothing to boost confidence and spark joy.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="text-center">
              <div className="w-24 h-24 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full mx-auto mb-4 flex items-center justify-center text-white text-2xl font-bold">
                SM
              </div>
              <h3 className="text-xl font-semibold mb-2">Sarah Miller</h3>
              <p className="text-muted-foreground">Founder & Creative Director</p>
            </div>
            <div className="text-center">
              <div className="w-24 h-24 bg-gradient-to-br from-pink-400 to-pink-600 rounded-full mx-auto mb-4 flex items-center justify-center text-white text-2xl font-bold">
                JD
              </div>
              <h3 className="text-xl font-semibold mb-2">James Davis</h3>
              <p className="text-muted-foreground">Head of Quality & Safety</p>
            </div>
            <div className="text-center">
              <div className="w-24 h-24 bg-gradient-to-br from-purple-400 to-purple-600 rounded-full mx-auto mb-4 flex items-center justify-center text-white text-2xl font-bold">
                EW
              </div>
              <h3 className="text-xl font-semibold mb-2">Emma Wilson</h3>
              <p className="text-muted-foreground">Lead Designer</p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
