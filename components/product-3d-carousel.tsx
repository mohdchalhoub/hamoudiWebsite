"use client"

import { useState, useRef, useEffect } from "react"
import { ProductCard } from "./product-card"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight } from "lucide-react"
import type { ProductWithDetails } from "@/lib/database.types"

interface Product3DCarouselProps {
  products: ProductWithDetails[]
  title?: string
}

export function Product3DCarousel({ products, title }: Product3DCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isDragging, setIsDragging] = useState(false)
  const [startX, setStartX] = useState(0)
  const [translateX, setTranslateX] = useState(0)
  const carouselRef = useRef<HTMLDivElement>(null)
  const [isInitialized, setIsInitialized] = useState(false)

  useEffect(() => {
    // Prevent initial render flicker
    const timer = setTimeout(() => setIsInitialized(true), 100)
    return () => clearTimeout(timer)
  }, [])

  if (products.length === 0) {
    return (
      <div className="text-center py-12">
        <h3 className="text-lg font-semibold mb-2">No products found</h3>
        <p className="text-muted-foreground">Try adjusting your filters or search terms.</p>
      </div>
    )
  }

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev > 0 ? prev - 1 : products.length - 1))
  }

  const handleNext = () => {
    setCurrentIndex((prev) => (prev < products.length - 1 ? prev + 1 : 0))
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
          <h2 className="text-2xl font-bold text-balance">{title}</h2>
        </div>
      )}
      
      {/* Desktop Grid View - Hidden on Mobile/Tablet */}
      <div className="hidden lg:block">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {products.map((product, index) => (
            <div key={product.id} className="h-full">
              <ProductCard product={product} />
            </div>
          ))}
        </div>
      </div>

      {/* Mobile/Tablet 3D Carousel View */}
      <div className="lg:hidden">
        <div className={`relative ${isInitialized ? 'opacity-100' : 'opacity-0'} transition-opacity duration-300`}>
          {/* Carousel Container */}
          <div
            ref={carouselRef}
            className="relative h-96 overflow-hidden"
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseLeave}
          >
            {/* 3D Carousel Cards */}
            <div
              className="flex transition-transform duration-300 ease-out will-change-transform"
              style={{
                transform: `translateX(calc(-${currentIndex * 100}% + ${translateX}px))`,
                backfaceVisibility: 'hidden',
                WebkitBackfaceVisibility: 'hidden',
              }}
            >
              {products.map((product, index) => {
                const isActive = index === currentIndex
                const isPrev = index === currentIndex - 1 || (currentIndex === 0 && index === products.length - 1)
                const isNext = index === currentIndex + 1 || (currentIndex === products.length - 1 && index === 0)
                
                return (
                  <div
                    key={product.id}
                    className="w-full flex-shrink-0 flex justify-center items-center px-4"
                    style={{
                      transform: isActive 
                        ? 'scale(1) rotateY(0deg)' 
                        : isPrev 
                        ? 'scale(0.85) rotateY(15deg) translateX(-20px)' 
                        : isNext 
                        ? 'scale(0.85) rotateY(-15deg) translateX(20px)' 
                        : 'scale(0.7) rotateY(0deg)',
                      opacity: isActive ? 1 : 0.6,
                      zIndex: isActive ? 10 : 1,
                      transition: 'all 0.3s ease-out',
                      backfaceVisibility: 'hidden',
                      WebkitBackfaceVisibility: 'hidden',
                      willChange: 'transform, opacity',
                    }}
                  >
                    <div className="w-full max-w-xs">
                      <div className="relative group">
                        <div
                          className={`bg-white rounded-2xl shadow-2xl overflow-hidden transition-all duration-300 ${
                            isActive 
                              ? 'shadow-primary-500/20 hover:shadow-primary-500/30' 
                              : 'shadow-gray-500/10'
                          }`}
                          style={{
                            transform: isActive ? 'translateY(-10px)' : 'translateY(0px)',
                          }}
                        >
                          <ProductCard product={product} />
                        </div>
                        
                        {/* Active Card Glow Effect */}
                        {isActive && (
                          <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-primary-500/10 via-secondary-500/10 to-accent-500/10 pointer-events-none animate-pulse" />
                        )}
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Navigation Buttons */}
          {products.length > 1 && (
            <>
              <Button
                variant="outline"
                size="icon"
                onClick={handlePrev}
                className="absolute left-2 top-1/2 -translate-y-1/2 z-20 bg-white/90 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              
              <Button
                variant="outline"
                size="icon"
                onClick={handleNext}
                className="absolute right-2 top-1/2 -translate-y-1/2 z-20 bg-white/90 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110"
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </>
          )}

          {/* Dots Indicator */}
          {products.length > 1 && (
            <div className="flex justify-center mt-6 space-x-2">
              {products.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentIndex(index)}
                  className={`w-2 h-2 rounded-full transition-all duration-300 ${
                    index === currentIndex
                      ? 'bg-primary-600 scale-125'
                      : 'bg-gray-300 hover:bg-gray-400'
                  }`}
                />
              ))}
            </div>
          )}

          {/* Product Counter */}
          <div className="text-center mt-4">
            <p className="text-sm text-gray-600">
              {currentIndex + 1} of {products.length}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
