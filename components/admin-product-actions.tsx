"use client"

import { Button } from "@/components/ui/button"
import { Trash2 } from "lucide-react"
import { deleteProduct } from "@/lib/database"
import { useRouter } from "next/navigation"
import { useToast } from "@/hooks/use-toast"

interface AdminProductActionsProps {
  productId: string
}

export function AdminProductActions({ productId }: AdminProductActionsProps) {
  const router = useRouter()
  const { toast } = useToast()

  const handleDelete = async () => {
    if (confirm("Are you sure you want to delete this product?")) {
      try {
        await deleteProduct(productId)
        toast({
          title: "Product Deleted",
          description: "The product has been successfully deleted.",
        })
        // Refresh the current page without redirecting
        router.refresh()
      } catch (error) {
        console.error('Failed to delete product:', error)
        toast({
          title: "Error",
          description: "Failed to delete product. Please try again.",
          variant: "destructive"
        })
      }
    }
  }

  return (
    <Button 
      variant="ghost" 
      size="icon" 
      onClick={handleDelete}
    >
      <Trash2 className="h-4 w-4" />
    </Button>
  )
}
