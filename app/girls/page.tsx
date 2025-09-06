import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { ProductGridClient } from "@/components/product-grid-client"
import { getProducts } from "@/lib/database"

// Force dynamic rendering and disable caching
export const dynamic = 'force-dynamic'
export const revalidate = 0

export default async function GirlsPage() {
  // Fetch girls products from database
  const girlsProducts = await getProducts({ 
    gender: 'girls', 
    active: true 
  })
  


  return (
    <div className="min-h-screen">
      <Header />

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-pink-600 to-pink-800 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl lg:text-5xl font-bold mb-4">Girls Collection</h1>
        </div>
      </section>

      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <h2 className="text-2xl font-bold">
            {girlsProducts.length} Product{girlsProducts.length !== 1 ? "s" : ""}
          </h2>
        </div>

        {girlsProducts.length > 0 ? (
          <ProductGridClient products={girlsProducts} />
        ) : (
          <div className="text-center py-12">
            <h3 className="text-lg font-semibold mb-2">No products found</h3>
            <p className="text-muted-foreground">No girls products are currently available.</p>
          </div>
        )}
      </div>

      <Footer />
    </div>
  )
}
