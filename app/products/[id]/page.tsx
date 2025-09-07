import { notFound } from "next/navigation"
import { getProductById, getProducts } from "@/lib/database"
import { ServerHeader } from "@/components/server-header"
import { Footer } from "@/components/footer"
import { ProductPageClient } from "./product-page-client"

interface ProductPageProps {
  params: {
    id: string
  }
}

export default async function ProductPage({ params }: ProductPageProps) {
  const product = await getProductById(params.id)

  if (!product) {
    notFound()
  }

  // Get related products from the same category
  const relatedProducts = await getProducts({ 
    category: product.category_id || undefined, 
    active: true,
    limit: 4 
  }).then(products => products.filter(p => p.id !== product.id))


  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-50 via-gray-100 to-gray-50">
      <ServerHeader />
      <ProductPageClient product={product} relatedProducts={relatedProducts} />
      <Footer />
    </div>
  )
}
