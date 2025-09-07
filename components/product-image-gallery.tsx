"use client"

import { useState } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ChevronLeft, ChevronRight, ZoomIn } from "lucide-react"

interface ProductImageGalleryProps {
  images: string[]
  productName: string
  isFeatured?: boolean
  discountPercentage?: number
  className?: string
}

export function ProductImageGallery({ 
  images, 
  productName, 
  isFeatured = false, 
  discountPercentage = 0,
  className = ""
}: ProductImageGalleryProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [isFullscreen, setIsFullscreen] = useState(false)

  if (!images || images.length === 0) {
    return (
      <div className={`relative aspect-[3/4] overflow-hidden rounded-lg bg-slate-100 flex items-center justify-center ${className}`}>
        <Image
          src="/placeholder.svg"
          alt={productName}
          fill
          className="object-cover"
          priority
        />
      </div>
    )
  }

  const currentImage = images[currentImageIndex]
  const hasMultipleImages = images.length > 1

  const goToPrevious = () => {
    setCurrentImageIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1))
  }

  const goToNext = () => {
    setCurrentImageIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1))
  }

  const goToImage = (index: number) => {
    setCurrentImageIndex(index)
  }

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen)
    // Reset to current image when opening fullscreen
    if (!isFullscreen) {
      setCurrentImageIndex(currentImageIndex)
    }
  }

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Main Image */}
      <div className="relative aspect-[3/4] overflow-hidden rounded-lg group shadow-md border border-slate-200/50 max-w-lg w-full bg-slate-100">
        <Image
          src={currentImage}
          alt={`${productName} - Image ${currentImageIndex + 1}`}
          fill
          className="object-cover transition-all duration-700 group-hover:scale-110 cursor-pointer"
          priority
          onClick={toggleFullscreen}
        />
        
        {/* Gradient overlay for better badge visibility */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        
        {/* Navigation arrows for multiple images */}
        {hasMultipleImages && (
          <>
            <Button
              variant="ghost"
              size="icon"
              className="absolute left-2 top-1/2 -translate-y-1/2 h-8 w-8 bg-white/80 hover:bg-white/90 shadow-md opacity-0 group-hover:opacity-100 transition-opacity"
              onClick={(e) => {
                e.stopPropagation()
                goToPrevious()
              }}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 bg-white/80 hover:bg-white/90 shadow-md opacity-0 group-hover:opacity-100 transition-opacity"
              onClick={(e) => {
                e.stopPropagation()
                goToNext()
              }}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </>
        )}

        
        {/* Product badges */}
        {isFeatured && (
          <Badge className="absolute top-1 left-1 bg-gradient-to-r from-amber-500 to-orange-500 text-white text-xs px-1.5 py-0.5 shadow-md">
            ⭐ Featured
          </Badge>
        )}
        {discountPercentage > 0 && (
          <Badge className="absolute top-1 right-1 bg-gradient-to-r from-red-500 to-red-600 text-white text-xs px-1.5 py-0.5 shadow-md">
            -{discountPercentage}%
          </Badge>
        )}

        {/* Image counter */}
        {hasMultipleImages && (
          <div className="absolute bottom-2 left-2 bg-black/60 text-white text-xs px-2 py-1 rounded">
            {currentImageIndex + 1} / {images.length}
          </div>
        )}
      </div>

      {/* Thumbnail Navigation */}
      {hasMultipleImages && (
        <div className="flex space-x-2 overflow-x-auto pb-2 max-w-lg">
          {images.map((image, index) => (
            <button
              key={index}
              onClick={() => goToImage(index)}
              className={`relative flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-all ${
                index === currentImageIndex
                  ? 'border-blue-500 shadow-md'
                  : 'border-slate-200 hover:border-slate-300'
              }`}
            >
              <Image
                src={image}
                alt={`${productName} thumbnail ${index + 1}`}
                fill
                className="object-cover"
              />
            </button>
          ))}
        </div>
      )}

      {/* Fullscreen Modal */}
      {isFullscreen && (
        <div 
          className="fixed inset-0 bg-black/95 z-50 flex flex-col items-center justify-center p-4"
          onClick={toggleFullscreen}
        >
          {/* Main Image Container */}
          <div className="relative flex-1 flex items-center justify-center w-full max-w-6xl">
            <Image
              src={currentImage}
              alt={`${productName} - Fullscreen ${currentImageIndex + 1}`}
              width={1200}
              height={800}
              className="object-contain max-w-full max-h-full rounded-lg"
              onClick={(e) => e.stopPropagation()}
            />
            
            {/* Close button */}
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-4 right-4 h-12 w-12 bg-white/20 hover:bg-white/30 text-white backdrop-blur-sm"
              onClick={toggleFullscreen}
            >
              <X className="h-6 w-6" />
            </Button>

            {/* Navigation arrows */}
            {hasMultipleImages && (
              <>
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute left-4 top-1/2 -translate-y-1/2 h-12 w-12 bg-white/20 hover:bg-white/30 text-white backdrop-blur-sm"
                  onClick={(e) => {
                    e.stopPropagation()
                    goToPrevious()
                  }}
                >
                  <ChevronLeft className="h-6 w-6" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute right-4 top-1/2 -translate-y-1/2 h-12 w-12 bg-white/20 hover:bg-white/30 text-white backdrop-blur-sm"
                  onClick={(e) => {
                    e.stopPropagation()
                    goToNext()
                  }}
                >
                  <ChevronRight className="h-6 w-6" />
                </Button>
              </>
            )}

            {/* Image counter */}
            {hasMultipleImages && (
              <div className="absolute top-4 left-4 bg-black/60 text-white text-sm px-3 py-2 rounded backdrop-blur-sm">
                {currentImageIndex + 1} / {images.length}
              </div>
            )}
          </div>

          {/* Thumbnail Gallery */}
          {hasMultipleImages && (
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/60 backdrop-blur-sm rounded-lg p-3">
              <div className="flex gap-2 max-w-2xl overflow-x-auto">
                {images.map((image, index) => (
                  <button
                    key={index}
                    onClick={(e) => {
                      e.stopPropagation()
                      goToImage(index)
                    }}
                    className={`relative flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-all duration-200 ${
                      index === currentImageIndex
                        ? 'border-white shadow-lg scale-110'
                        : 'border-transparent hover:border-white/50'
                    }`}
                  >
                    <Image
                      src={image}
                      alt={`${productName} thumbnail ${index + 1}`}
                      fill
                      className="object-cover"
                    />
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
