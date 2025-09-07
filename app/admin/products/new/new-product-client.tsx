"use client"

import { ProductFormDb } from "@/components/product-form-db"
import { createProduct } from "@/lib/database"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { useToast } from "@/hooks/use-toast"

export function NewProductClient() {
  const router = useRouter()
  const { toast } = useToast()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (productData: any) => {
    setIsSubmitting(true)
    try {
      console.log("Creating product with data:", productData)
      await createProduct(productData)
      toast({
        title: "Product Created",
        description: "The new product has been successfully created.",
      })
      // Force refresh with cache busting
      router.push("/admin/products?t=" + Date.now())
    } catch (error: any) {
      console.error("Failed to create product:", error)
      toast({
        title: "Error",
        description: `Failed to create product: ${error.message || 'Please try again.'}`,
        variant: "destructive"
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleCancel = () => {
    router.push("/admin/products")
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Add New Product</h1>
        <p className="text-muted-foreground">Create a new product for your catalog</p>
      </div>

      <ProductFormDb 
        key={`product-form-${Date.now()}`}
        onSubmit={handleSubmit}
        onCancel={handleCancel}
        isSubmitting={isSubmitting}
      />
    </div>
  )
}
