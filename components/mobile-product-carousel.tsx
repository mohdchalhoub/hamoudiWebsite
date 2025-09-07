"use client"

import { useState, useRef, useEffect } from "react"
import { ProductCard } from "./product-card"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight } from "lucide-react"
import type { ProductWithDetails } from "@/lib/database.types"

interface MobileProductCarouselProps {
  products: ProductWithDetails[]
  title?: string
}

export function MobileProductCarousel({ products, title }: MobileProductCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isDragging, setIsDragging] = useState(false)
  const [startX, setStartX] = useState(0)
  const [translateX, setTranslateX] = useState(0)
  const carouselRef = useRef<HTMLDivElement>(null)

  // Calculate how many slides we need (2 products per slide)
  const productsPerSlide = 2
  const totalSlides = Math.ceil(products.length / productsPerSlide)

  if (products.length === 0) {
    return (
      <div className="text-center py-12">
        <h3 className="text-lg font-semibold mb-2">No products found</h3>
        <p className="text-text-muted">Try adjusting your filters or search terms.</p>
      </div>
    )
  }

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev > 0 ? prev - 1 : totalSlides - 1))
  }

  const handleNext = () => {
    setCurrentIndex((prev) => (prev < totalSlides - 1 ? prev + 1 : 0))
  }

  const handleTouchStart = (e: React.TouchEvent) => {
    setIsDragging(true)
    setStartX(e.touches[0].clientX)
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging) return
    
    const currentX = e.touches[0].clientX
    const diffX = startX - currentX
    setTranslateX(diffX)
  }

  const handleTouchEnd = () => {
    if (!isDragging) return
    
    setIsDragging(false)
    
    if (Math.abs(translateX) > 50) {
      if (translateX > 0) {
        handleNext()
      } else {
        handlePrev()
      }
    }
    
    setTranslateX(0)
  }

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true)
    setStartX(e.clientX)
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return
    
    const currentX = e.clientX
    const diffX = startX - currentX
    setTranslateX(diffX)
  }

  const handleMouseUp = () => {
    if (!isDragging) return
    
    setIsDragging(false)
    
    if (Math.abs(translateX) > 50) {
      if (translateX > 0) {
        handleNext()
      } else {
        handlePrev()
      }
    }
    
    setTranslateX(0)
  }

  const handleMouseLeave = () => {
    setIsDragging(false)
    setTranslateX(0)
  }

  return (
    <div className="space-y-6">
      {title && (
        <div className="text-center">
          <h2 className="text-2xl font-semibold text-text-primary">{title}</h2>
        </div>
      )}
      
      {/* Desktop Grid View - 4 products per row */}
      <div className="hidden lg:block">
        <div className="relative">
          {/* Products Grid */}
          <div className="grid grid-cols-4 gap-6 max-w-7xl mx-auto">
            {products.slice(0, 4).map((product) => (
              <div key={product.id} className="h-full">
                <ProductCard product={product} />
              </div>
            ))}
          </div>

          {/* Navigation Buttons - Only show if more than 4 products */}
          {products.length > 4 && (
            <>
              <Button
                variant="outline"
                size="icon"
                onClick={handlePrev}
                className="absolute left-4 top-1/2 -translate-y-1/2 z-20 bg-background border border-border hover:border-primary hover:text-primary shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              
              <Button
                variant="outline"
                size="icon"
                onClick={handleNext}
                className="absolute right-4 top-1/2 -translate-y-1/2 z-20 bg-background border border-border hover:border-primary hover:text-primary shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </>
          )}

          {/* Page Indicator - Only show if more than 4 products */}
          {products.length > 4 && (
            <div className="flex justify-center mt-6 space-x-2">
              {Array.from({ length: Math.ceil(products.length / 4) }, (_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentIndex(index)}
                  className={`w-2 h-2 rounded-full transition-all duration-300 ${
                    index === currentIndex
                      ? 'bg-primary scale-125'
                      : 'bg-border hover:bg-text-muted'
                  }`}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Mobile/Tablet 3D Carousel View - 2 products per row */}
      <div className="lg:hidden">
        <div className="relative">
          {/* Carousel Container */}
          <div
            ref={carouselRef}
            className="relative overflow-hidden"
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseLeave}
          >
            {/* 3D Carousel Slides */}
            <div
              className="flex transition-transform duration-300 ease-out"
              style={{
                transform: `translateX(calc(-${currentIndex * 100}% + ${translateX}px))`,
              }}
            >
              {Array.from({ length: totalSlides }, (_, slideIndex) => {
                const startProductIndex = slideIndex * productsPerSlide
                const endProductIndex = Math.min(startProductIndex + productsPerSlide, products.length)
                const slideProducts = products.slice(startProductIndex, endProductIndex)
                
                return (
                  <div
                    key={slideIndex}
                    className="w-full flex-shrink-0 px-2"
                  >
                    <div className="grid grid-cols-2 gap-4">
                      {slideProducts.map((product, productIndex) => {
                        const isActive = slideIndex === currentIndex
                        const isPrev = slideIndex === currentIndex - 1 || (currentIndex === 0 && slideIndex === totalSlides - 1)
                        const isNext = slideIndex === currentIndex + 1 || (currentIndex === totalSlides - 1 && slideIndex === 0)
                        
                        return (
                          <div
                            key={product.id}
                            className="h-full"
                            style={{
                              transform: isActive 
                                ? 'scale(1) rotateY(0deg)' 
                                : isPrev 
                                ? 'scale(0.9) rotateY(10deg) translateX(-10px)' 
                                : isNext 
                                ? 'scale(0.9) rotateY(-10deg) translateX(10px)' 
                                : 'scale(0.8) rotateY(0deg)',
                              opacity: isActive ? 1 : 0.7,
                              zIndex: isActive ? 10 : 1,
                              transition: 'all 0.3s ease-out',
                            }}
                          >
                            <div className="relative group">
                              <div
                                className={`bg-background rounded-card overflow-hidden transition-all duration-300 ${
                                  isActive 
                                    ? 'shadow-card hover:shadow-xl' 
                                    : 'shadow-sm'
                                }`}
                                style={{
                                  transform: isActive ? 'translateY(-5px)' : 'translateY(0px)',
                                }}
                              >
                                <ProductCard product={product} />
                              </div>
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Navigation Buttons */}
          {totalSlides > 1 && (
            <>
              <Button
                variant="outline"
                size="icon"
                onClick={handlePrev}
                className="absolute left-2 top-1/2 -translate-y-1/2 z-20 bg-background/90 backdrop-blur-sm border border-border hover:border-primary hover:text-primary shadow-lg hover:shadow-xl transition-all duration-300 h-8 w-8"
              >
                <ChevronLeft className="h-3 w-3" />
              </Button>
              
              <Button
                variant="outline"
                size="icon"
                onClick={handleNext}
                className="absolute right-2 top-1/2 -translate-y-1/2 z-20 bg-background/90 backdrop-blur-sm border border-border hover:border-primary hover:text-primary shadow-lg hover:shadow-xl transition-all duration-300 h-8 w-8"
              >
                <ChevronRight className="h-3 w-3" />
              </Button>
            </>
          )}

          {/* Dots Indicator */}
          {totalSlides > 1 && (
            <div className="flex justify-center mt-6 space-x-2">
              {Array.from({ length: totalSlides }, (_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentIndex(index)}
                  className={`w-2 h-2 rounded-full transition-all duration-300 ${
                    index === currentIndex
                      ? 'bg-primary scale-125'
                      : 'bg-border hover:bg-text-muted'
                  }`}
                />
              ))}
            </div>
          )}

          {/* Product Counter */}
          <div className="text-center mt-4">
            <p className="text-sm text-text-muted">
              {currentIndex + 1} of {totalSlides} • {products.length} products
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
