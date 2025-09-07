import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { getProducts } from "@/lib/database"
import { Plus, Edit, Eye, Package } from "lucide-react"
import Link from "next/link"
import { AdminProductActions } from "@/components/admin-product-actions"

// Force dynamic rendering and disable caching
export const dynamic = 'force-dynamic'
export const revalidate = 0

export default async function AdminProductsPage() {
  // Fetch all products from database
  const products = await getProducts({ active: true })
  

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Products</h1>
          <p className="text-muted-foreground">Manage your product catalog</p>
        </div>
        <Button asChild>
          <Link href="/admin/products/new">
            <Plus className="h-4 w-4 mr-2" />
            Add Product
          </Link>
        </Button>
      </div>

      {/* Products Summary */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold">Product Overview</h2>
              <p className="text-sm text-muted-foreground">
                {products.length} product{products.length !== 1 ? 's' : ''} in your catalog
              </p>
            </div>
            <div className="flex items-center space-x-4 text-sm text-muted-foreground">
              <span>Active: {products.filter(p => p.is_active).length}</span>
              <span>Featured: {products.filter(p => p.is_featured).length}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Products Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.length === 0 ? (
          <div className="col-span-full text-center py-12">
            <Package className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No products in your catalog</h3>
            <p className="text-muted-foreground mb-4">Start building your product catalog by adding your first product.</p>
            <Button asChild>
              <Link href="/admin/products/new">
                <Plus className="h-4 w-4 mr-2" />
                Add Your First Product
              </Link>
            </Button>
          </div>
        ) : (
          products.map((product) => (
          <Card key={product.id}>
            <CardHeader className="p-4">
              <div className="relative aspect-square rounded-lg overflow-hidden mb-4">
                <Image 
                  src={product.images?.[0] || "/placeholder.svg"} 
                  alt={product.name} 
                  fill 
                  className="object-cover"
                />
                {product.is_featured && (
                  <Badge className="absolute top-2 left-2 bg-yellow-500 text-yellow-900">Featured</Badge>
                )}
              </div>
              <CardTitle className="text-lg">{product.name}</CardTitle>
              {product.product_code && (
                <div className="mt-2">
                  <span className="text-xs text-muted-foreground">Code: </span>
                  <span className="font-mono font-semibold text-sm bg-gray-100 px-2 py-1 rounded">
                    {product.product_code}
                  </span>
                </div>
              )}
            </CardHeader>
            <CardContent className="p-4 pt-0">
              <div className="space-y-3">
                <p className="text-sm text-muted-foreground line-clamp-2">{product.description}</p>
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-lg font-bold text-primary">${product.price}</span>
                    {product.compare_at_price && (
                      <span className="text-sm text-muted-foreground line-through ml-2">${product.compare_at_price}</span>
                    )}
                  </div>
                  <Badge variant={product.is_active ? "default" : "destructive"}>
                    {product.is_active ? "Active" : "Inactive"}
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <div className="text-sm text-muted-foreground">
                    <span className="capitalize">{product.category?.name || 'Uncategorized'}</span>
                    {product.gender && (
                      <span className="ml-2 px-2 py-1 bg-gray-100 rounded text-xs">
                        {product.gender}
                      </span>
                    )}
                  </div>
                  <div className="flex space-x-1">
                    <Button variant="ghost" size="icon" asChild>
                      <Link href={`/products/${product.slug}`}>
                        <Eye className="h-4 w-4" />
                      </Link>
                    </Button>
                    <Button variant="ghost" size="icon" asChild>
                      <Link href={`/admin/products/${product.id}/edit`}>
                        <Edit className="h-4 w-4" />
                      </Link>
                    </Button>
                    <AdminProductActions productId={product.id} />
                  </div>
                </div>
                {product.variants && product.variants.length > 0 && (
                  <div className="space-y-2">
                    <div className="text-xs text-muted-foreground">
                      {product.variants.length} variant{product.variants.length !== 1 ? 's' : ''} • 
                      Stock: {product.variants.reduce((sum, v) => sum + (v.stock_quantity || 0), 0)} units
                    </div>
                    <div className="space-y-1">
                      <div className="text-xs font-medium text-slate-700">Variant Codes:</div>
                      <div className="flex flex-wrap gap-1">
                        {product.variants.map((variant, index) => (
                          <div key={variant.id || index} className="flex items-center gap-1">
                            <span className="text-xs font-mono bg-slate-100 px-1.5 py-0.5 rounded border">
                              {variant.variant_code || 'N/A'}
                            </span>
                            <span className="text-xs text-slate-500">
                              ({variant.size || variant.age_range} - {variant.color})
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
          ))
        )}
      </div>
    </div>
  )
}
