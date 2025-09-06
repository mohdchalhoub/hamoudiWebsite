import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { ProductGridClient } from "@/components/product-grid-client"
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

  // Get unique values for filters from variants
  const availableSizes = [...new Set(boysProducts.flatMap((p) => p.variants?.map(v => v.size) || []))]
  const availableColors = [...new Set(boysProducts.flatMap((p) => p.variants?.map(v => v.color) || []))]
  const priceRange: [number, number] = [
    Math.min(...boysProducts.map((p) => p.price)),
    Math.max(...boysProducts.map((p) => p.price)),
  ]

  return (
    <div className="min-h-screen">
      <Header />

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl lg:text-5xl font-bold mb-4">Boys Collection</h1>
          <p className="text-xl opacity-90 max-w-2xl mx-auto">
            Cool and comfortable clothes for adventurous boys. Find the perfect outfit for every occasion!
          </p>
        </div>
      </section>

      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <h2 className="text-2xl font-bold">
            {boysProducts.length} Product{boysProducts.length !== 1 ? "s" : ""}
          </h2>
        </div>

        <ProductGridClient products={boysProducts} />
      </div>

      <Footer />
    </div>
  )
}
