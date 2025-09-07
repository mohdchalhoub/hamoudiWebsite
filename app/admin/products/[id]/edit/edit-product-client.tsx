"use client"

import { ProductFormDb } from "@/components/product-form-db"
import { updateProduct } from "@/lib/database"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { useToast } from "@/hooks/use-toast"
import type { ProductWithDetails } from "@/lib/database.types"

interface EditProductClientProps {
  product: ProductWithDetails
}

export function EditProductClient({ product }: EditProductClientProps) {
  const router = useRouter()
  const { toast } = useToast()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (productData: any) => {
    setIsSubmitting(true)
    try {
      console.log("Updating product with data:", productData)
      await updateProduct(product.id, productData)
      toast({
        title: "Product Updated",
        description: "The product has been successfully updated.",
      })
      // Navigate back to products page
      router.push("/admin/products")
    } catch (error: any) {
      console.error("Failed to update product:", error)
      toast({
        title: "Error",
        description: `Failed to update product: ${error.message || 'Please try again.'}`,
        variant: "destructive"
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleCancel = () => {
    router.push("/admin/products")
  }

  // Transform product data to match form format
  const initialData = {
    name: product.name,
    description: product.description,
    price: product.price,
    compare_at_price: product.compare_at_price || 0,
    category_id: product.category_id || "",
    gender: product.gender || "boys",
    images: product.images || [],
    videos: product.videos || [],
    is_active: product.is_active,
    is_featured: product.is_featured,
    on_sale: product.on_sale || false,
    tags: product.tags || [],
    variants: product.variants || []
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Edit Product</h1>
        <p className="text-muted-foreground">Update the product information</p>
      </div>

      <ProductFormDb 
        initialData={initialData}
        onSubmit={handleSubmit}
        onCancel={handleCancel}
        isSubmitting={isSubmitting}
      />
    </div>
  )
}
