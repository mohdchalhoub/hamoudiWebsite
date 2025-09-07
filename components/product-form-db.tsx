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
import { getAllCategories, createCategory } from "@/lib/database"
import { MultipleMediaUpload } from "@/components/multiple-media-upload"
import { generateProductCode } from "@/lib/code-generator"

interface ProductFormDbProps {
  onSubmit: (product: any) => Promise<void>
  onCancel: () => void
  isSubmitting?: boolean
  initialData?: any
}

export function ProductFormDb({ onSubmit, onCancel, isSubmitting = false, initialData }: ProductFormDbProps) {
  const [formData, setFormData] = useState({
    name: initialData?.name || "",
    description: initialData?.description || "",
    price: initialData?.price || 0,
    compare_at_price: initialData?.compare_at_price || 0,
    category_id: initialData?.category_id || "",
    gender: initialData?.gender || "boys",
    season: initialData?.season || "summer",
    quantity: initialData?.quantity || 0,
    images: initialData?.images || [],
    videos: initialData?.videos || [],
    is_active: initialData?.is_active ?? true,
    is_featured: initialData?.is_featured ?? false,
    on_sale: initialData?.on_sale ?? false,
    tags: initialData?.tags || [] as string[],
    variants: initialData?.variants || [] as Array<{
      size: string | null
      age_range: string | null
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
  const [variantType, setVariantType] = useState<'size' | 'age'>('size')
  const [generatedProductCode, setGeneratedProductCode] = useState<string | null>(null)
  const [isGeneratingCode, setIsGeneratingCode] = useState(false)
  const [showNewCategoryForm, setShowNewCategoryForm] = useState(false)
  const [newCategoryName, setNewCategoryName] = useState("")
  const [newCategoryDescription, setNewCategoryDescription] = useState("")
  const [isCreatingCategory, setIsCreatingCategory] = useState(false)
  const [newVariant, setNewVariant] = useState({
    size: "",
    age_range: "",
    color: "",
    color_hex: "#000000",
    stock_quantity: 0,
    price_adjustment: 0
  })

  // Generate product code function
  const generateCode = async () => {
    try {
      setIsGeneratingCode(true)
      const code = await generateProductCode()
      setGeneratedProductCode(code)
    } catch (error) {
      console.error('Failed to generate product code:', error)
    } finally {
      setIsGeneratingCode(false)
    }
  }

  // Create new category function
  const createNewCategory = async () => {
    if (!newCategoryName.trim()) {
      alert('Category name is required')
      return
    }

    try {
      setIsCreatingCategory(true)
      const newCategory = await createCategory({
        name: newCategoryName.trim(),
        description: newCategoryDescription.trim() || undefined
      })
      
      // Add the new category to the list
      setCategories(prev => [...prev, newCategory])
      
      // Select the new category
      setFormData(prev => ({ ...prev, category_id: newCategory.id }))
      
      // Reset form
      setNewCategoryName("")
      setNewCategoryDescription("")
      setShowNewCategoryForm(false)
      
      alert('Category created successfully!')
    } catch (error: any) {
      console.error('Failed to create category:', error)
      alert(`Failed to create category: ${error.message}`)
    } finally {
      setIsCreatingCategory(false)
    }
  }

  // Load categories and generate product code on mount
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
    
    const initializeForm = async () => {
      await loadCategories()
      await generateCode()
    }
    
    initializeForm()
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
    
    if (formData.images.length === 0 && formData.videos.length === 0) {
      alert('At least one image or video is required')
      return
    }
    
    if (formData.variants.length === 0) {
      alert('Please add at least one product variant (size/age and color)')
      return
    }
    
    // Validate that each variant has either size or age_range
    for (const variant of formData.variants) {
      if (!variant.size && !variant.age_range) {
        alert('Each variant must have either a size or age range')
        return
      }
      if (variant.size && variant.age_range) {
        alert('Each variant cannot have both size and age range')
        return
      }
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
    const sizeOrAge = variantType === 'size' ? newVariant.size : newVariant.age_range
    if (sizeOrAge && newVariant.color) {
      const variant = {
        size: variantType === 'size' ? newVariant.size : null,
        age_range: variantType === 'age' ? newVariant.age_range : null,
        color: newVariant.color,
        color_hex: newVariant.color_hex,
        stock_quantity: newVariant.stock_quantity,
        price_adjustment: newVariant.price_adjustment
      }
      
      setFormData((prev) => ({ 
        ...prev, 
        variants: [...prev.variants, variant] 
      }))
      setNewVariant({
        size: "",
        age_range: "",
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
                <Label htmlFor="name" className="text-xs font-medium text-text-primary">Product Name</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                  required
                  className="h-8 text-xs"
                />
              </div>

              {/* Generated Product Code Display */}
              <div>
                <Label className="text-xs font-medium text-text-primary">Generated Product Code</Label>
                <div className="flex items-center gap-1">
                  <div className="flex-1 p-1 bg-background border border-border rounded-md">
                    {isGeneratingCode ? (
                      <span className="text-text-muted text-xs">Generating...</span>
                    ) : generatedProductCode ? (
                      <span className="font-mono font-medium text-sm text-text-primary">
                        {generatedProductCode}
                      </span>
                    ) : (
                      <span className="text-text-muted text-xs">No code generated</span>
                    )}
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={generateCode}
                    disabled={isGeneratingCode}
                    className="h-7 text-xs px-2"
                  >
                    {isGeneratingCode ? "Generating..." : "Regenerate"}
                  </Button>
                </div>
                <p className="text-xs text-text-muted mt-0.5">
                  This unique 6-digit code will be assigned to your product
                </p>
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

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <Label htmlFor="price" className="text-xs font-medium text-text-primary">Price ($)</Label>
                  <Input
                    id="price"
                    type="number"
                    step="0.01"
                    value={formData.price}
                    onChange={(e) => setFormData((prev) => ({ ...prev, price: Number.parseFloat(e.target.value) }))}
                    required
                    className="h-8 text-xs"
                  />
                </div>
                <div>
                  <Label htmlFor="compare_at_price" className="text-xs font-medium text-text-primary">Compare at Price ($)</Label>
                  <Input
                    id="compare_at_price"
                    type="number"
                    step="0.01"
                    value={formData.compare_at_price}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, compare_at_price: Number.parseFloat(e.target.value) || 0 }))
                    }
                    className="h-8 text-xs"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="quantity" className="text-xs font-medium text-text-primary">Quantity Available</Label>
                <Input
                  id="quantity"
                  type="number"
                  min="0"
                  value={formData.quantity}
                  onChange={(e) => {
                    const value = Number.parseInt(e.target.value) || 0
                    setFormData((prev) => ({ ...prev, quantity: value }))
                  }}
                  placeholder="Enter total quantity available"
                  className="h-8 text-xs"
                />
                <p className="text-xs text-text-muted mt-0.5">
                  Total number of units available for this product
                </p>
              </div>

              <div>
                <MultipleMediaUpload
                  value={[
                    ...formData.images.map((url, index) => ({
                      id: `img-${index}`,
                      url,
                      type: 'image' as const,
                      name: `Image ${index + 1}`
                    })),
                    ...formData.videos.map((url, index) => ({
                      id: `vid-${index}`,
                      url,
                      type: 'video' as const,
                      name: `Video ${index + 1}`
                    }))
                  ]}
                  onChange={(media) => {
                    const images = media.filter(m => m.type === 'image').map(m => m.url)
                    const videos = media.filter(m => m.type === 'video').map(m => m.url)
                    setFormData((prev) => ({ ...prev, images, videos }))
                  }}
                  disabled={isSubmitting || categoriesLoading}
                  maxItems={10}
                />
              </div>
            </div>

            {/* Categories and Settings */}
            <div className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <Label htmlFor="category">Category</Label>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => setShowNewCategoryForm(!showNewCategoryForm)}
                    className="text-xs"
                  >
                    <Plus className="h-3 w-3 mr-1" />
                    Add New
                  </Button>
                </div>
                
                {showNewCategoryForm && (
                  <Card className="mb-3 p-3 bg-slate-50">
                    <div className="space-y-2">
                      <Input
                        placeholder="Category name"
                        value={newCategoryName}
                        onChange={(e) => setNewCategoryName(e.target.value)}
                        disabled={isCreatingCategory}
                      />
                      <Input
                        placeholder="Description (optional)"
                        value={newCategoryDescription}
                        onChange={(e) => setNewCategoryDescription(e.target.value)}
                        disabled={isCreatingCategory}
                      />
                      <div className="flex gap-2">
                        <Button
                          type="button"
                          size="sm"
                          onClick={createNewCategory}
                          disabled={isCreatingCategory || !newCategoryName.trim()}
                        >
                          {isCreatingCategory ? "Creating..." : "Create Category"}
                        </Button>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setShowNewCategoryForm(false)
                            setNewCategoryName("")
                            setNewCategoryDescription("")
                          }}
                        >
                          Cancel
                        </Button>
                      </div>
                    </div>
                  </Card>
                )}
                
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
                  onValueChange={(value) => setFormData((prev) => ({ ...prev, gender: value as "boys" | "girls" | "unisex" }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="boys">Boys</SelectItem>
                    <SelectItem value="girls">Girls</SelectItem>
                    <SelectItem value="unisex">Unisex</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="season" className="text-xs font-medium text-text-primary">Season</Label>
                <Select
                  value={formData.season}
                  onValueChange={(value) => setFormData((prev) => ({ ...prev, season: value as "summer" | "winter" | "all_season" }))}
                >
                  <SelectTrigger className="h-8 text-xs">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="summer">☀️ Summer</SelectItem>
                    <SelectItem value="winter">❄️ Winter</SelectItem>
                    <SelectItem value="all_season">🌍 All Season</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-3">
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
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="on_sale"
                      checked={formData.on_sale}
                      onCheckedChange={(checked) => setFormData((prev) => ({ ...prev, on_sale: checked }))}
                    />
                    <Label htmlFor="on_sale">On Sale</Label>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Product Variants */}
          <div>
            <Label>Product Variants</Label>
            <div className="text-xs text-green-600 mb-2">✅ Updated with Size/Age selector</div>
            <div className="space-y-4">
              {/* Variant Type Selector */}
              <div className="flex gap-4 items-center">
                <Label>Variant Type:</Label>
                <div className="flex gap-2">
                  <Button
                    type="button"
                    variant={variantType === 'size' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => {
                      setVariantType('size')
                      setNewVariant(prev => ({ ...prev, age_range: '' }))
                    }}
                  >
                    Size
                  </Button>
                  <Button
                    type="button"
                    variant={variantType === 'age' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => {
                      setVariantType('age')
                      setNewVariant(prev => ({ ...prev, size: '' }))
                    }}
                  >
                    Age
                  </Button>
                </div>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
                {variantType === 'size' ? (
                  <div className="space-y-1">
                    <Input
                      placeholder="Size (e.g., S, M, L)"
                      value={newVariant.size}
                      onChange={(e) => setNewVariant(prev => ({ ...prev, size: e.target.value }))}
                      className="transition-all duration-200"
                    />
                    <p className="text-xs text-muted-foreground">Enter size (S, M, L, etc.)</p>
                  </div>
                ) : (
                  <div className="space-y-1">
                    <Input
                      type="number"
                      placeholder="Age (e.g., 5, 8, 12)"
                      value={newVariant.age_range}
                      onChange={(e) => {
                        const value = e.target.value
                        // Only allow positive numbers
                        if (value === '' || (Number(value) > 0 && Number(value) <= 18)) {
                          setNewVariant(prev => ({ ...prev, age_range: value }))
                        }
                      }}
                      min="1"
                      max="18"
                      className="transition-all duration-200"
                    />
                    <p className="text-xs text-muted-foreground">Enter age (1-18 years)</p>
                  </div>
                )}
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
                  <div key={index} className="flex items-center gap-2 p-3 border rounded-lg bg-gray-50">
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary" className="font-semibold">
                        {variant.size || variant.age_range}
                      </Badge>
                      <Badge variant="outline">{variant.color}</Badge>
                      <div 
                        className="w-4 h-4 rounded border shadow-sm" 
                        style={{ backgroundColor: variant.color_hex }}
                      />
                    </div>
                    <div className="flex items-center gap-3 text-sm text-gray-600">
                      <span>Stock: {variant.stock_quantity}</span>
                      <span>Price: +${variant.price_adjustment}</span>
                      {variant.variant_code && (
                        <Badge variant="default" className="bg-primary-600 text-white font-mono">
                          {variant.variant_code}
                        </Badge>
                      )}
                    </div>
                    <Button 
                      type="button" 
                      variant="ghost" 
                      size="sm"
                      onClick={() => removeVariant(index)}
                      className="ml-auto hover:bg-red-100 hover:text-red-600"
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
              {isSubmitting 
                ? (initialData ? "Updating Product..." : "Adding Product...") 
                : categoriesLoading 
                  ? "Loading..." 
                  : (initialData ? "Save Changes" : "Add Product")
              }
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
