import { ServerHeader } from "@/components/server-header"
import { Footer } from "@/components/footer"
import { Card, CardContent } from "@/components/ui/card"
import { Heart, Shield, Sparkles, Users } from "lucide-react"
import { SectionHeader } from "@/components/section-header"

export default function AboutPage() {
  return (
    <div className="min-h-screen">
      <ServerHeader />

      {/* Hero Section */}
      <section className="bg-background">
        <div className="container mx-auto px-4">
          <SectionHeader 
            title="About KidsCorner"
            subtitle="We're passionate about creating fun, comfortable, and stylish clothing that lets kids be kids while giving parents peace of mind about quality and safety."
          />
        </div>
      </section>

      {/* Our Story */}
      <section className="py-16 bg-[#F9FAFB]">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-semibold text-text-primary mb-4">Our Story</h2>
              <div className="h-1 w-16 bg-primary mx-auto mb-6"></div>
            </div>
            <div className="space-y-6 text-text-muted text-lg leading-relaxed">
              <p>
                KidsCorner was born from a simple belief: children deserve clothing that's as vibrant and imaginative as
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
        </div>
      </section>

      {/* Our Values */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-semibold text-text-primary mb-4">Our Values</h2>
            <div className="h-1 w-16 bg-primary mx-auto mb-6"></div>
            <p className="text-text-muted text-lg max-w-2xl mx-auto">
              Everything we do is guided by our commitment to quality, safety, creativity, and making childhood more
              magical.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            <Card className="text-center bg-background border border-border hover:border-primary transition-all duration-200">
              <CardContent className="p-6">
                <div className="w-12 h-12 bg-background-subtle border border-border rounded-full flex items-center justify-center mx-auto mb-4">
                  <Shield className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2 text-text-primary">Safety First</h3>
                <p className="text-text-muted text-sm leading-relaxed">
                  All our materials are carefully selected to be safe, non-toxic, and gentle on sensitive skin.
                </p>
              </CardContent>
            </Card>
            <Card className="text-center bg-background border border-border hover:border-primary transition-all duration-200">
              <CardContent className="p-6">
                <div className="w-12 h-12 bg-background-subtle border border-border rounded-full flex items-center justify-center mx-auto mb-4">
                  <Sparkles className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2 text-text-primary">Creative Design</h3>
                <p className="text-text-muted text-sm leading-relaxed">
                  Our designs celebrate imagination with fun patterns, vibrant colors, and playful themes kids love.
                </p>
              </CardContent>
            </Card>
            <Card className="text-center bg-background border border-border hover:border-primary transition-all duration-200">
              <CardContent className="p-6">
                <div className="w-12 h-12 bg-background-subtle border border-border rounded-full flex items-center justify-center mx-auto mb-4">
                  <Heart className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2 text-text-primary">Made with Love</h3>
                <p className="text-text-muted text-sm leading-relaxed">
                  Every piece is crafted with attention to detail and genuine care for the children who will wear them.
                </p>
              </CardContent>
            </Card>
            <Card className="text-center bg-background border border-border hover:border-primary transition-all duration-200">
              <CardContent className="p-6">
                <div className="w-12 h-12 bg-background-subtle border border-border rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2 text-text-primary">Family Focused</h3>
                <p className="text-text-muted text-sm leading-relaxed">
                  We understand family life and create clothing that works for both kids and parents.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-16 bg-[#F9FAFB]">
        <div className="container mx-auto px-4 text-center">
          <div className="mb-12">
            <h2 className="text-3xl font-semibold text-text-primary mb-4">Meet Our Team</h2>
            <div className="h-1 w-16 bg-primary mx-auto mb-6"></div>
            <p className="text-text-muted text-lg max-w-2xl mx-auto">
              We're a passionate team of parents, designers, and child development experts who believe in the power of
              great clothing to boost confidence and spark joy.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <div className="text-center">
              <div className="w-24 h-24 bg-background border border-border rounded-full mx-auto mb-4 flex items-center justify-center text-text-primary text-2xl font-semibold">
                SM
              </div>
              <h3 className="text-xl font-semibold mb-2 text-text-primary">Sarah Miller</h3>
              <p className="text-text-muted">Founder & Creative Director</p>
            </div>
            <div className="text-center">
              <div className="w-24 h-24 bg-background border border-border rounded-full mx-auto mb-4 flex items-center justify-center text-text-primary text-2xl font-semibold">
                JD
              </div>
              <h3 className="text-xl font-semibold mb-2 text-text-primary">James Davis</h3>
              <p className="text-text-muted">Head of Quality & Safety</p>
            </div>
            <div className="text-center sm:col-span-2 lg:col-span-1">
              <div className="w-24 h-24 bg-background border border-border rounded-full mx-auto mb-4 flex items-center justify-center text-text-primary text-2xl font-semibold">
                EW
              </div>
              <h3 className="text-xl font-semibold mb-2 text-text-primary">Emma Wilson</h3>
              <p className="text-text-muted">Lead Designer</p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
