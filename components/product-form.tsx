"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { X, Plus } from "lucide-react"
import type { Product } from "@/lib/types"

interface ProductFormProps {
  product?: Product
  onSubmit: (product: Omit<Product, "id">) => void
  onCancel: () => void
}

export function ProductForm({ product, onSubmit, onCancel }: ProductFormProps) {
  const [formData, setFormData] = useState({
    name: product?.name || "",
    description: product?.description || "",
    price: product?.price || 0,
    originalPrice: product?.originalPrice || 0,
    category: product?.category || "boys",
    subcategory: product?.subcategory || "summer",
    type: product?.type || "t-shirt",
    images: product?.images || ["/colorful-kids-clothing.png"],
    sizes: product?.sizes || ["S", "M", "L"],
    colors: product?.colors || ["Blue"],
    inStock: product?.inStock ?? true,
    featured: product?.featured || false,
    tags: product?.tags || [],
  })

  const [newSize, setNewSize] = useState("")
  const [newColor, setNewColor] = useState("")
  const [newTag, setNewTag] = useState("")
  const [newImage, setNewImage] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(formData)
  }

  const addSize = () => {
    if (newSize && !formData.sizes.includes(newSize)) {
      setFormData((prev) => ({ ...prev, sizes: [...prev.sizes, newSize] }))
      setNewSize("")
    }
  }

  const removeSize = (size: string) => {
    setFormData((prev) => ({ ...prev, sizes: prev.sizes.filter((s) => s !== size) }))
  }

  const addColor = () => {
    if (newColor && !formData.colors.includes(newColor)) {
      setFormData((prev) => ({ ...prev, colors: [...prev.colors, newColor] }))
      setNewColor("")
    }
  }

  const removeColor = (color: string) => {
    setFormData((prev) => ({ ...prev, colors: prev.colors.filter((c) => c !== color) }))
  }

  const addTag = () => {
    if (newTag && !formData.tags.includes(newTag)) {
      setFormData((prev) => ({ ...prev, tags: [...prev.tags, newTag] }))
      setNewTag("")
    }
  }

  const removeTag = (tag: string) => {
    setFormData((prev) => ({ ...prev, tags: prev.tags.filter((t) => t !== tag) }))
  }

  const addImage = () => {
    if (newImage && !formData.images.includes(newImage)) {
      setFormData((prev) => ({ ...prev, images: [...prev.images, newImage] }))
      setNewImage("")
    }
  }

  const removeImage = (image: string) => {
    setFormData((prev) => ({ ...prev, images: prev.images.filter((i) => i !== image) }))
  }

  return (
    <Card className="max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle>{product ? "Edit Product" : "Add New Product"}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Basic Information */}
            <div className="space-y-4">
              <div>
                <Label htmlFor="name">Product Name</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                  required
                />
              </div>

              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
                  rows={3}
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="price">Price ($)</Label>
                  <Input
                    id="price"
                    type="number"
                    step="0.01"
                    value={formData.price}
                    onChange={(e) => setFormData((prev) => ({ ...prev, price: Number.parseFloat(e.target.value) }))}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="originalPrice">Original Price ($)</Label>
                  <Input
                    id="originalPrice"
                    type="number"
                    step="0.01"
                    value={formData.originalPrice}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, originalPrice: Number.parseFloat(e.target.value) || 0 }))
                    }
                  />
                </div>
              </div>
            </div>

            {/* Categories and Type */}
            <div className="space-y-4">
              <div>
                <Label htmlFor="category">Category</Label>
                <Select
                  value={formData.category}
                  onValueChange={(value) => setFormData((prev) => ({ ...prev, category: value as "boys" | "girls" }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="boys">Boys</SelectItem>
                    <SelectItem value="girls">Girls</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="subcategory">Season</Label>
                <Select
                  value={formData.subcategory}
                  onValueChange={(value) =>
                    setFormData((prev) => ({ ...prev, subcategory: value as "summer" | "winter" }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="summer">Summer</SelectItem>
                    <SelectItem value="winter">Winter</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="type">Type</Label>
                <Select
                  value={formData.type}
                  onValueChange={(value) => setFormData((prev) => ({ ...prev, type: value }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="t-shirt">T-Shirt</SelectItem>
                    <SelectItem value="pants">Pants</SelectItem>
                    <SelectItem value="jacket">Jacket</SelectItem>
                    <SelectItem value="dress">Dress</SelectItem>
                    <SelectItem value="shorts">Shorts</SelectItem>
                    <SelectItem value="hoodie">Hoodie</SelectItem>
                    <SelectItem value="skirt">Skirt</SelectItem>
                    <SelectItem value="sweater">Sweater</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Switch
                    id="inStock"
                    checked={formData.inStock}
                    onCheckedChange={(checked) => setFormData((prev) => ({ ...prev, inStock: checked }))}
                  />
                  <Label htmlFor="inStock">In Stock</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch
                    id="featured"
                    checked={formData.featured}
                    onCheckedChange={(checked) => setFormData((prev) => ({ ...prev, featured: checked }))}
                  />
                  <Label htmlFor="featured">Featured</Label>
                </div>
              </div>
            </div>
          </div>

          {/* Images */}
          <div>
            <Label>Product Images</Label>
            <div className="space-y-2">
              <div className="flex gap-2">
                <Input placeholder="Image URL" value={newImage} onChange={(e) => setNewImage(e.target.value)} />
                <Button type="button" onClick={addImage}>
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {formData.images.map((image, index) => (
                  <Badge key={index} variant="secondary" className="flex items-center gap-1">
                    Image {index + 1}
                    <X className="h-3 w-3 cursor-pointer" onClick={() => removeImage(image)} />
                  </Badge>
                ))}
              </div>
            </div>
          </div>

          {/* Sizes */}
          <div>
            <Label>Available Sizes</Label>
            <div className="space-y-2">
              <div className="flex gap-2">
                <Input
                  placeholder="Size (e.g., S, M, L, XL)"
                  value={newSize}
                  onChange={(e) => setNewSize(e.target.value)}
                />
                <Button type="button" onClick={addSize}>
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {formData.sizes.map((size) => (
                  <Badge key={size} variant="secondary" className="flex items-center gap-1">
                    {size}
                    <X className="h-3 w-3 cursor-pointer" onClick={() => removeSize(size)} />
                  </Badge>
                ))}
              </div>
            </div>
          </div>

          {/* Colors */}
          <div>
            <Label>Available Colors</Label>
            <div className="space-y-2">
              <div className="flex gap-2">
                <Input placeholder="Color name" value={newColor} onChange={(e) => setNewColor(e.target.value)} />
                <Button type="button" onClick={addColor}>
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {formData.colors.map((color) => (
                  <Badge key={color} variant="secondary" className="flex items-center gap-1">
                    {color}
                    <X className="h-3 w-3 cursor-pointer" onClick={() => removeColor(color)} />
                  </Badge>
                ))}
              </div>
            </div>
          </div>

          {/* Tags */}
          <div>
            <Label>Tags</Label>
            <div className="space-y-2">
              <div className="flex gap-2">
                <Input placeholder="Tag name" value={newTag} onChange={(e) => setNewTag(e.target.value)} />
                <Button type="button" onClick={addTag}>
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {formData.tags.map((tag) => (
                  <Badge key={tag} variant="secondary" className="flex items-center gap-1">
                    {tag}
                    <X className="h-3 w-3 cursor-pointer" onClick={() => removeTag(tag)} />
                  </Badge>
                ))}
              </div>
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex justify-end space-x-4 pt-6">
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancel
            </Button>
            <Button type="submit">{product ? "Update Product" : "Add Product"}</Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
