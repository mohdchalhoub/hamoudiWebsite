"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { ProductCard } from "@/components/product-card"

interface Product {
  id: string
  name: string
  description: string
  price: number
  originalPrice?: number
  images: string[]
  category: "boys" | "girls"
  season: "summer" | "winter"
  sizes: string[]
  colors: string[]
  inStock: boolean
  featured: boolean
}

interface Enhanced3DCarouselProps {
  products: Product[]
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

  // Simple touch event setup
  useEffect(() => {
    const carousel = carouselRef.current
    if (!carousel) return

    console.log('🔥 Carousel ref attached, touch events should work now')
    
    return () => {
      console.log('🔥 Carousel ref detached')
    }
  }, [])

  const currentProductsPerSlide = productsPerSlide[screenSize]
  const totalSlides = Math.ceil(products.length / currentProductsPerSlide)

  console.log('🔥 Carousel Debug:', {
    productsLength: products.length,
    currentProductsPerSlide,
    totalSlides,
    screenSize,
    currentIndex
  })

  if (products.length === 0) {
    return (
      <div className="text-center py-12">
        <h3 className="text-lg font-semibold mb-2">No products found</h3>
        <p className="text-text-muted">Try adjusting your filters or search terms.</p>
      </div>
    )
  }

  // Always show carousel with touch support, even for few products
  // This ensures touch events are always available

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev > 0 ? prev - 1 : totalSlides - 1))
  }

  const handleNext = () => {
    setCurrentIndex((prev) => (prev < totalSlides - 1 ? prev + 1 : 0))
  }

  // Simple and reliable touch handling
  const handleTouchStart = (e: React.TouchEvent) => {
    console.log('🔥 TOUCH START - X:', e.touches[0].clientX)
    e.preventDefault()
    setIsDragging(true)
    setStartX(e.touches[0].clientX)
    setTranslateX(0)
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging) return
    
    console.log('🔥 TOUCH MOVE - X:', e.touches[0].clientX)
    e.preventDefault()
    e.stopPropagation()
    
    const currentX = e.touches[0].clientX
    const diffX = startX - currentX
    setTranslateX(diffX)
  }

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (!isDragging) return
    
    console.log('🔥 TOUCH END - translateX:', translateX)
    setIsDragging(false)
    
    const threshold = 30
    if (Math.abs(translateX) > threshold) {
      if (translateX > 0) {
        console.log('🔥 SWIPING NEXT')
        handleNext()
      } else {
        console.log('🔥 SWIPING PREV')
        handlePrev()
      }
    }
    
    setTranslateX(0)
  }

  // Mouse drag support for desktop
  const handleMouseDown = (e: React.MouseEvent) => {
    const target = e.target as HTMLElement
    if (target.closest('[data-product-card]') || 
        target.closest('button') || 
        target.closest('a') ||
        target.closest('[role="button"]')) {
      return
    }
    setIsDragging(true)
    setStartX(e.clientX)
    setTranslateX(0)
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
    
    const threshold = 50
    if (Math.abs(translateX) > threshold) {
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
        {/* External Navigation Arrows - Only show if multiple slides */}
        {totalSlides > 1 && (
          <div className="flex items-center justify-between mb-6">
            <Button
              variant="outline"
              size="lg"
              onClick={handlePrev}
              className="flex items-center gap-2 bg-background/95 backdrop-blur-sm border-2 border-primary/20 hover:border-primary hover:text-primary shadow-lg hover:shadow-xl transition-all duration-300 min-w-[120px] h-12 text-base font-medium"
            >
              <ChevronLeft className="h-6 w-6" />
              <span className="hidden sm:inline">Previous</span>
            </Button>
            
            <div className="text-center">
              <p className="text-sm text-muted-foreground font-medium">
                {currentIndex + 1} of {totalSlides} • {products.length} products
              </p>
            </div>
            
            <Button
              variant="outline"
              size="lg"
              onClick={handleNext}
              className="flex items-center gap-2 bg-background/95 backdrop-blur-sm border-2 border-primary/20 hover:border-primary hover:text-primary shadow-lg hover:shadow-xl transition-all duration-300 min-w-[120px] h-12 text-base font-medium"
            >
              <span className="hidden sm:inline">Next</span>
              <ChevronRight className="h-6 w-6" />
            </Button>
          </div>
        )}

        {/* Carousel Container */}
        <div
          ref={carouselRef}
          className="relative overflow-hidden rounded-lg"
          style={{ 
            touchAction: 'none',
            userSelect: 'none',
            WebkitUserSelect: 'none',
            WebkitTouchCallout: 'none'
          }}
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
            className="flex"
            style={{
              transform: `translateX(calc(-${currentIndex * 100}% + ${translateX}px))`,
              transition: isDragging ? 'none' : 'transform 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
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
                            pointerEvents: 'auto',
                          }}
                        >
                          <div 
                            className="relative group h-full"
                            style={{
                              transform: isActive ? 'translateY(-8px)' : 'translateY(0px)',
                              filter: isActive ? 'brightness(1.05)' : 'brightness(1)',
                              transition: 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
                              pointerEvents: 'auto',
                            }}
                          >
                            <ProductCard product={product} />
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
      </div>
    </div>
  )
}