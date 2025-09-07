import { getProductById } from "@/lib/database"
import { EditProductClient } from "./edit-product-client"
import { notFound } from "next/navigation"

interface EditProductPageProps {
  params: {
    id: string
  }
}

export const dynamic = 'force-dynamic'
export const revalidate = 0

export default async function EditProductPage({ params }: EditProductPageProps) {
  try {
    const product = await getProductById(params.id)
    
    if (!product) {
      notFound()
    }

    return <EditProductClient product={product} />
  } catch (error) {
    console.error('Failed to fetch product:', error)
    notFound()
  }
}
