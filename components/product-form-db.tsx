"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { X, Plus } from "lucide-react"
import { getAllCategories } from "@/lib/database"
import { ImageUpload } from "@/components/image-upload"

interface ProductFormDbProps {
  onSubmit: (product: any) => Promise<void>
  onCancel: () => void
  isSubmitting?: boolean
}

export function ProductFormDb({ onSubmit, onCancel, isSubmitting = false }: ProductFormDbProps) {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: 0,
    compare_at_price: 0,
    category_id: "",
    gender: "boys",
    image_url: "",
    is_active: true,
    is_featured: false,
    tags: [] as string[],
    variants: [] as Array<{
      size: string
      color: string
      color_hex: string
      stock_quantity: number
      price_adjustment: number
    }>
  })

  const [categories, setCategories] = useState<any[]>([])
  const [categoriesLoading, setCategoriesLoading] = useState(true)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [newTag, setNewTag] = useState("")
  const [newVariant, setNewVariant] = useState({
    size: "",
    color: "",
    color_hex: "#000000",
    stock_quantity: 0,
    price_adjustment: 0
  })

  // Load categories on mount
  useEffect(() => {
    const loadCategories = async () => {
      try {
        setCategoriesLoading(true)
        const cats = await getAllCategories()
        setCategories(cats)
        if (cats.length > 0) {
          setFormData(prev => ({ ...prev, category_id: cats[0].id }))
        }
      } catch (error) {
        console.error('Failed to load categories:', error)
      } finally {
        setCategoriesLoading(false)
      }
    }
    loadCategories()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Validate required fields
    if (!formData.name.trim()) {
      alert('Product name is required')
      return
    }
    
    if (!formData.category_id) {
      alert('Please select a category')
      return
    }
    
    if (!formData.image_url.trim()) {
      alert('Product image URL is required')
      return
    }
    
    if (formData.variants.length === 0) {
      alert('Please add at least one product variant (size and color)')
      return
    }
    
    try {
      await onSubmit(formData)
    } catch (error) {
      console.error('Failed to submit product:', error)
    }
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

  const addVariant = () => {
    if (newVariant.size && newVariant.color) {
      setFormData((prev) => ({ 
        ...prev, 
        variants: [...prev.variants, { ...newVariant }] 
      }))
      setNewVariant({
        size: "",
        color: "",
        color_hex: "#000000",
        stock_quantity: 0,
        price_adjustment: 0
      })
    }
  }

  const removeVariant = (index: number) => {
    setFormData((prev) => ({ 
      ...prev, 
      variants: prev.variants.filter((_, i) => i !== index) 
    }))
  }

  return (
    <Card className="max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle>Add New Product</CardTitle>
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
                  <Label htmlFor="compare_at_price">Compare at Price ($)</Label>
                  <Input
                    id="compare_at_price"
                    type="number"
                    step="0.01"
                    value={formData.compare_at_price}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, compare_at_price: Number.parseFloat(e.target.value) || 0 }))
                    }
                  />
                </div>
              </div>

              <div>
                <ImageUpload
                  value={formData.image_url}
                  onChange={(url) => setFormData((prev) => ({ ...prev, image_url: url }))}
                  onFileSelect={(file) => setSelectedFile(file)}
                  disabled={isSubmitting || categoriesLoading}
                />
              </div>
            </div>

            {/* Categories and Settings */}
            <div className="space-y-4">
              <div>
                <Label htmlFor="category">Category</Label>
                <Select
                  value={formData.category_id}
                  onValueChange={(value) => setFormData((prev) => ({ ...prev, category_id: value }))}
                  disabled={categoriesLoading}
                >
                  <SelectTrigger>
                    <SelectValue placeholder={categoriesLoading ? "Loading categories..." : "Select a category"} />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category.id} value={category.id}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="gender">Gender</Label>
                <Select
                  value={formData.gender}
                  onValueChange={(value) => setFormData((prev) => ({ ...prev, gender: value as "boys" | "girls" }))}
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

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Switch
                    id="is_active"
                    checked={formData.is_active}
                    onCheckedChange={(checked) => setFormData((prev) => ({ ...prev, is_active: checked }))}
                  />
                  <Label htmlFor="is_active">Active</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch
                    id="is_featured"
                    checked={formData.is_featured}
                    onCheckedChange={(checked) => setFormData((prev) => ({ ...prev, is_featured: checked }))}
                  />
                  <Label htmlFor="is_featured">Featured</Label>
                </div>
              </div>
            </div>
          </div>

          {/* Product Variants */}
          <div>
            <Label>Product Variants (Sizes & Colors)</Label>
            <div className="space-y-4">
              <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
                <Input
                  placeholder="Size (e.g., S, M, L)"
                  value={newVariant.size}
                  onChange={(e) => setNewVariant(prev => ({ ...prev, size: e.target.value }))}
                />
                <Input
                  placeholder="Color name"
                  value={newVariant.color}
                  onChange={(e) => setNewVariant(prev => ({ ...prev, color: e.target.value }))}
                />
                <Input
                  type="color"
                  value={newVariant.color_hex}
                  onChange={(e) => setNewVariant(prev => ({ ...prev, color_hex: e.target.value }))}
                />
                <Input
                  type="number"
                  placeholder="Stock Qty"
                  value={newVariant.stock_quantity}
                  onChange={(e) => setNewVariant(prev => ({ ...prev, stock_quantity: Number(e.target.value) }))}
                />
                <Input
                  type="number"
                  step="0.01"
                  placeholder="Price Adj."
                  value={newVariant.price_adjustment}
                  onChange={(e) => setNewVariant(prev => ({ ...prev, price_adjustment: Number(e.target.value) }))}
                />
              </div>
              <Button type="button" onClick={addVariant}>
                <Plus className="h-4 w-4 mr-2" />
                Add Variant
              </Button>
              
              <div className="space-y-2">
                {formData.variants.map((variant, index) => (
                  <div key={index} className="flex items-center gap-2 p-2 border rounded">
                    <Badge variant="secondary">{variant.size}</Badge>
                    <Badge variant="secondary">{variant.color}</Badge>
                    <div 
                      className="w-4 h-4 rounded border" 
                      style={{ backgroundColor: variant.color_hex }}
                    />
                    <span className="text-sm">Stock: {variant.stock_quantity}</span>
                    <span className="text-sm">Price: +${variant.price_adjustment}</span>
                    <Button 
                      type="button" 
                      variant="ghost" 
                      size="sm"
                      onClick={() => removeVariant(index)}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
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
            <Button type="submit" disabled={isSubmitting || categoriesLoading}>
              {isSubmitting ? "Adding Product..." : categoriesLoading ? "Loading..." : "Add Product"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
