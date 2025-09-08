"use client"

import { useState, useRef, useEffect } from "react"
import { ProductCard } from "./product-card"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight } from "lucide-react"
import type { ProductWithDetails } from "@/lib/database.types"

interface Enhanced3DCarouselProps {
  products: ProductWithDetails[]
  title?: string
}

export function Enhanced3DCarousel({ products, title }: Enhanced3DCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isDragging, setIsDragging] = useState(false)
  const [startX, setStartX] = useState(0)
  const [translateX, setTranslateX] = useState(0)
  const carouselRef = useRef<HTMLDivElement>(null)

  // Responsive products per slide
  const productsPerSlide = {
    mobile: 2,
    desktop: 4
  }

  // Calculate total slides based on screen size
  const [screenSize, setScreenSize] = useState<'mobile' | 'desktop'>('desktop')
  
  useEffect(() => {
    const handleResize = () => {
      setScreenSize(window.innerWidth >= 1024 ? 'desktop' : 'mobile')
    }
    
    handleResize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const currentProductsPerSlide = productsPerSlide[screenSize]
  const totalSlides = Math.ceil(products.length / currentProductsPerSlide)

  if (products.length === 0) {
    return (
      <div className="text-center py-12">
        <h3 className="text-lg font-semibold mb-2">No products found</h3>
        <p className="text-text-muted">Try adjusting your filters or search terms.</p>
      </div>
    )
  }

  // If products fit in one slide, show static grid
  if (products.length <= currentProductsPerSlide) {
    return (
      <div className="space-y-6">
        {title && (
          <div className="text-center">
            <h2 className="text-2xl font-semibold text-text-primary">{title}</h2>
          </div>
        )}
        
        <div className={`grid gap-6 max-w-7xl mx-auto ${
          screenSize === 'desktop' ? 'grid-cols-4' : 'grid-cols-2'
        }`}>
          {products.map((product) => (
            <div key={product.id} className="h-full">
              <ProductCard product={product} />
            </div>
          ))}
        </div>
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
    // Only start dragging if it's not a touch on a product card
    const target = e.target as HTMLElement
    if (target.closest('[data-product-card]')) {
      return
    }
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
    // Only start dragging if it's not a click on a product card
    const target = e.target as HTMLElement
    if (target.closest('[data-product-card]')) {
      return
    }
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
            className="flex transition-transform duration-500 ease-out"
            style={{
              transform: `translateX(calc(-${currentIndex * 100}% + ${translateX}px))`,
            }}
          >
            {Array.from({ length: totalSlides }, (_, slideIndex) => {
              const startProductIndex = slideIndex * currentProductsPerSlide
              const endProductIndex = Math.min(startProductIndex + currentProductsPerSlide, products.length)
              const slideProducts = products.slice(startProductIndex, endProductIndex)
              
              return (
                <div
                  key={slideIndex}
                  className="w-full flex-shrink-0 px-2"
                >
                  <div className={`grid gap-6 max-w-7xl mx-auto ${
                    screenSize === 'desktop' ? 'grid-cols-4' : 'grid-cols-2'
                  }`}>
                    {slideProducts.map((product, productIndex) => {
                      const isActive = slideIndex === currentIndex
                      const isPrev = slideIndex === currentIndex - 1 || (currentIndex === 0 && slideIndex === totalSlides - 1)
                      const isNext = slideIndex === currentIndex + 1 || (currentIndex === totalSlides - 1 && slideIndex === 0)
                      
                      // Enhanced 3D effects
                      let transform = 'scale(1) rotateY(0deg) translateZ(0px)'
                      let opacity = 1
                      let zIndex = 10
                      
                      if (isActive) {
                        transform = 'scale(1) rotateY(0deg) translateZ(20px)'
                        opacity = 1
                        zIndex = 20
                      } else if (isPrev) {
                        transform = 'scale(0.95) rotateY(15deg) translateZ(-10px) translateX(-20px)'
                        opacity = 0.8
                        zIndex = 5
                      } else if (isNext) {
                        transform = 'scale(0.95) rotateY(-15deg) translateZ(-10px) translateX(20px)'
                        opacity = 0.8
                        zIndex = 5
                      } else {
                        transform = 'scale(0.9) rotateY(0deg) translateZ(-20px)'
                        opacity = 0.6
                        zIndex = 1
                      }
                      
                      return (
                        <div
                          key={product.id}
                          className="h-full"
                          style={{
                            transform,
                            opacity,
                            zIndex,
                            transition: 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
                            transformStyle: 'preserve-3d',
                          }}
                        >
                          <div className="relative group">
                            <div
                              className={`bg-background rounded-card overflow-hidden transition-all duration-500 ${
                                isActive 
                                  ? 'shadow-2xl hover:shadow-3xl' 
                                  : 'shadow-lg'
                              }`}
                              style={{
                                transform: isActive ? 'translateY(-8px)' : 'translateY(0px)',
                                filter: isActive ? 'brightness(1.05)' : 'brightness(1)',
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
        <Button
          variant="outline"
          size="icon"
          onClick={handlePrev}
          className={`absolute top-1/2 -translate-y-1/2 z-30 bg-background/95 backdrop-blur-sm border border-border hover:border-primary hover:text-primary shadow-xl hover:shadow-2xl transition-all duration-300 ${
            screenSize === 'desktop' 
              ? 'left-4 h-12 w-12' 
              : 'left-2 h-10 w-10'
          }`}
        >
          <ChevronLeft className={`${screenSize === 'desktop' ? 'h-5 w-5' : 'h-4 w-4'}`} />
        </Button>
        
        <Button
          variant="outline"
          size="icon"
          onClick={handleNext}
          className={`absolute top-1/2 -translate-y-1/2 z-30 bg-background/95 backdrop-blur-sm border border-border hover:border-primary hover:text-primary shadow-xl hover:shadow-2xl transition-all duration-300 ${
            screenSize === 'desktop' 
              ? 'right-4 h-12 w-12' 
              : 'right-2 h-10 w-10'
          }`}
        >
          <ChevronRight className={`${screenSize === 'desktop' ? 'h-5 w-5' : 'h-4 w-4'}`} />
        </Button>

        {/* Enhanced Dots Indicator */}
        <div className="flex justify-center mt-8 space-x-3">
          {Array.from({ length: totalSlides }, (_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`transition-all duration-300 ${
                index === currentIndex
                  ? 'bg-primary scale-125 shadow-lg'
                  : 'bg-border hover:bg-text-muted hover:scale-110'
              } ${
                screenSize === 'desktop' ? 'w-3 h-3' : 'w-2 h-2'
              } rounded-full`}
            />
          ))}
        </div>

        {/* Product Counter */}
        <div className="text-center mt-4">
          <p className="text-sm text-text-muted">
            {currentIndex + 1} of {totalSlides} • {products.length} products
          </p>
        </div>
      </div>
    </div>
  )
}
