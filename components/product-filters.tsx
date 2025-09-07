"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Badge } from "@/components/ui/badge"
import { X, Sun, Snowflake } from "lucide-react"

interface ProductFiltersProps {
  onFiltersChange: (filters: FilterState) => void
  availableSizes: string[]
  availableColors: string[]
  priceRange: [number, number]
}

export interface FilterState {
  sizes: string[]
  colors: string[]
  seasons: string[]
  priceRange: [number, number]
  inStockOnly: boolean
  featuredOnly: boolean
}

export function ProductFilters({ onFiltersChange, availableSizes, availableColors, priceRange }: ProductFiltersProps) {
  const [filters, setFilters] = useState<FilterState>({
    sizes: [],
    colors: [],
    seasons: [],
    priceRange: priceRange,
    inStockOnly: false,
    featuredOnly: false,
  })

  const updateFilters = (newFilters: Partial<FilterState>) => {
    const updated = { ...filters, ...newFilters }
    setFilters(updated)
    onFiltersChange(updated)
  }

  const clearAllFilters = () => {
    const cleared: FilterState = {
      sizes: [],
      colors: [],
      seasons: [],
      priceRange: priceRange,
      inStockOnly: false,
      featuredOnly: false,
    }
    setFilters(cleared)
    onFiltersChange(cleared)
  }

  const hasActiveFilters =
    filters.sizes.length > 0 ||
    filters.colors.length > 0 ||
    filters.seasons.length > 0 ||
    filters.inStockOnly ||
    filters.featuredOnly ||
    filters.priceRange[0] !== priceRange[0] ||
    filters.priceRange[1] !== priceRange[1]

  return (
    <Card className="sticky top-4">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
        <CardTitle className="text-lg">Filters</CardTitle>
        {hasActiveFilters && (
          <Button variant="ghost" size="sm" onClick={clearAllFilters}>
            <X className="h-4 w-4 mr-1" />
            Clear All
          </Button>
        )}
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Season */}
        <div className="space-y-3">
          <Label className="text-sm font-medium">Season</Label>
          <div className="flex gap-2">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="season-summer"
                checked={filters.seasons.includes("summer")}
                onCheckedChange={(checked) => {
                  if (checked) {
                    updateFilters({ seasons: [...filters.seasons, "summer"] })
                  } else {
                    updateFilters({ seasons: filters.seasons.filter((s) => s !== "summer") })
                  }
                }}
              />
              <Label htmlFor="season-summer" className="text-sm flex items-center gap-2">
                <Sun className="h-4 w-4 text-yellow-500" />
                Summer
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="season-winter"
                checked={filters.seasons.includes("winter")}
                onCheckedChange={(checked) => {
                  if (checked) {
                    updateFilters({ seasons: [...filters.seasons, "winter"] })
                  } else {
                    updateFilters({ seasons: filters.seasons.filter((s) => s !== "winter") })
                  }
                }}
              />
              <Label htmlFor="season-winter" className="text-sm flex items-center gap-2">
                <Snowflake className="h-4 w-4 text-primary-500" />
                Winter
              </Label>
            </div>
          </div>
        </div>

        {/* Price Range */}
        <div className="space-y-3">
          <Label className="text-sm font-medium">Price Range</Label>
          <div className="px-2">
            <Slider
              value={filters.priceRange}
              onValueChange={(value) => updateFilters({ priceRange: value as [number, number] })}
              max={priceRange[1]}
              min={priceRange[0]}
              step={1}
              className="w-full"
            />
          </div>
          <div className="flex justify-between text-sm text-muted-foreground">
            <span>${filters.priceRange[0]}</span>
            <span>${filters.priceRange[1]}</span>
          </div>
        </div>

        {/* Sizes */}
        <div className="space-y-3">
          <Label className="text-sm font-medium">Sizes</Label>
          <div className="flex flex-wrap gap-2">
            {availableSizes.map((size) => (
              <div key={size} className="flex items-center space-x-2">
                <Checkbox
                  id={`size-${size}`}
                  checked={filters.sizes.includes(size)}
                  onCheckedChange={(checked) => {
                    if (checked) {
                      updateFilters({ sizes: [...filters.sizes, size] })
                    } else {
                      updateFilters({ sizes: filters.sizes.filter((s) => s !== size) })
                    }
                  }}
                />
                <Label htmlFor={`size-${size}`} className="text-sm">
                  {size}
                </Label>
              </div>
            ))}
          </div>
        </div>

        {/* Colors */}
        <div className="space-y-3">
          <Label className="text-sm font-medium">Colors</Label>
          <div className="space-y-2">
            {availableColors.map((color) => (
              <div key={color} className="flex items-center space-x-2">
                <Checkbox
                  id={`color-${color}`}
                  checked={filters.colors.includes(color)}
                  onCheckedChange={(checked) => {
                    if (checked) {
                      updateFilters({ colors: [...filters.colors, color] })
                    } else {
                      updateFilters({ colors: filters.colors.filter((c) => c !== color) })
                    }
                  }}
                />
                <Label htmlFor={`color-${color}`} className="text-sm flex items-center gap-2">
                  <div
                    className={`w-4 h-4 rounded-full border-2 border-white shadow-sm ${
                      color.toLowerCase().includes("blue")
                        ? "bg-primary-500"
                        : color.toLowerCase().includes("pink")
                          ? "bg-accent-500"
                          : color.toLowerCase().includes("purple")
                            ? "bg-primary-500"
                            : color.toLowerCase().includes("red")
                              ? "bg-red-500"
                              : color.toLowerCase().includes("green")
                                ? "bg-green-500"
                                : color.toLowerCase().includes("yellow")
                                  ? "bg-yellow-500"
                                  : color.toLowerCase().includes("black")
                                    ? "bg-black"
                                    : color.toLowerCase().includes("white")
                                      ? "bg-white border-gray-300"
                                      : "bg-gray-400"
                    }`}
                  />
                  {color}
                </Label>
              </div>
            ))}
          </div>
        </div>

        {/* Special Filters */}
        <div className="space-y-3">
          <Label className="text-sm font-medium">Special</Label>
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="in-stock"
                checked={filters.inStockOnly}
                onCheckedChange={(checked) => updateFilters({ inStockOnly: !!checked })}
              />
              <Label htmlFor="in-stock" className="text-sm">
                In Stock Only
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="featured"
                checked={filters.featuredOnly}
                onCheckedChange={(checked) => updateFilters({ featuredOnly: !!checked })}
              />
              <Label htmlFor="featured" className="text-sm">
                Featured Items
              </Label>
            </div>
          </div>
        </div>

        {/* Active Filters */}
        {hasActiveFilters && (
          <div className="space-y-2">
            <Label className="text-sm font-medium">Active Filters</Label>
            <div className="flex flex-wrap gap-1">
              {filters.seasons.map((season) => (
                <Badge key={season} variant="secondary" className="text-xs">
                  {season === "summer" ? "☀️" : "❄️"} {season.charAt(0).toUpperCase() + season.slice(1)}
                  <X
                    className="h-3 w-3 ml-1 cursor-pointer"
                    onClick={() => updateFilters({ seasons: filters.seasons.filter((s) => s !== season) })}
                  />
                </Badge>
              ))}
              {filters.sizes.map((size) => (
                <Badge key={size} variant="secondary" className="text-xs">
                  Size: {size}
                  <X
                    className="h-3 w-3 ml-1 cursor-pointer"
                    onClick={() => updateFilters({ sizes: filters.sizes.filter((s) => s !== size) })}
                  />
                </Badge>
              ))}
              {filters.colors.map((color) => (
                <Badge key={color} variant="secondary" className="text-xs">
                  {color}
                  <X
                    className="h-3 w-3 ml-1 cursor-pointer"
                    onClick={() => updateFilters({ colors: filters.colors.filter((c) => c !== color) })}
                  />
                </Badge>
              ))}
              {filters.inStockOnly && (
                <Badge variant="secondary" className="text-xs">
                  In Stock
                  <X className="h-3 w-3 ml-1 cursor-pointer" onClick={() => updateFilters({ inStockOnly: false })} />
                </Badge>
              )}
              {filters.featuredOnly && (
                <Badge variant="secondary" className="text-xs">
                  Featured
                  <X className="h-3 w-3 ml-1 cursor-pointer" onClick={() => updateFilters({ featuredOnly: false })} />
                </Badge>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
