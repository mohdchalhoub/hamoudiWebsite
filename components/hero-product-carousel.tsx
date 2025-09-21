"use client"

import { useState, useEffect, useRef } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import Image from "next/image"
import Link from "next/link"

interface HeroProduct {
  id: string
  name: string
  images: string[]
  price: number
  originalPrice?: number
  code?: string
}

interface HeroProductCarouselProps {
  products: HeroProduct[]
}

export function HeroProductCarousel({ products }: HeroProductCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isDragging, setIsDragging] = useState(false)
  const [startX, setStartX] = useState(0)
  const [translateX, setTranslateX] = useState(0)
  const [isAutoPlaying, setIsAutoPlaying] = useState(true)

  // Filter products that have images
  const validProducts = products.filter(product => 
    product && product.images && product.images.length > 0
  ).slice(0, 6) // Limit to 6 products

  // Auto-rotation every 3 seconds
  useEffect(() => {
    if (!isAutoPlaying || validProducts.length <= 1 || isDragging) return

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % validProducts.length)
    }, 3000)

    return () => clearInterval(interval)
  }, [validProducts.length, isDragging, isAutoPlaying])

  // Don't render if no valid products
  if (!validProducts || validProducts.length === 0) {
    return null
  }

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev === 0 ? validProducts.length - 1 : prev - 1))
    setIsAutoPlaying(false)
    setTimeout(() => setIsAutoPlaying(true), 5000) // Resume auto-play after 5 seconds
  }

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % validProducts.length)
    setIsAutoPlaying(false)
    setTimeout(() => setIsAutoPlaying(true), 5000) // Resume auto-play after 5 seconds
  }

  // Simple touch handling
  const handleTouchStart = (e: React.TouchEvent) => {
    e.preventDefault()
    setIsDragging(true)
    setStartX(e.touches[0].clientX)
    setTranslateX(0)
    setIsAutoPlaying(false)
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging) return
    e.preventDefault()
    
    const currentX = e.touches[0].clientX
    const diffX = startX - currentX
    setTranslateX(diffX)
  }

  const handleTouchEnd = () => {
    if (!isDragging) return
    
    setIsDragging(false)
    const threshold = 50
    
    if (Math.abs(translateX) > threshold) {
      if (translateX > 0) {
        handleNext()
      } else {
        handlePrev()
      }
    } else {
      setIsAutoPlaying(true)
    }
    
    setTranslateX(0)
  }

  // Mouse drag for desktop
  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault()
    setIsDragging(true)
    setStartX(e.clientX)
    setTranslateX(0)
    setIsAutoPlaying(false)
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
    } else {
      setIsAutoPlaying(true)
    }
    
    setTranslateX(0)
  }

  const handleMouseLeave = () => {
    if (isDragging) {
      setIsDragging(false)
      setTranslateX(0)
      setIsAutoPlaying(true)
    }
  }

  return (
    <div className="w-full max-w-md mx-auto relative">
      {/* External Navigation Arrows - Outside carousel */}
      {validProducts.length > 1 && (
        <>
          <Button
            variant="ghost"
            size="icon"
            className="absolute left-[-60px] lg:left-[-80px] top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white text-gray-800 shadow-lg backdrop-blur-sm h-10 w-10 lg:h-12 lg:w-12 z-10 rounded-full"
            onClick={handlePrev}
          >
            <ChevronLeft className="h-5 w-5 lg:h-6 lg:w-6" />
          </Button>
          
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-[-60px] lg:right-[-80px] top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white text-gray-800 shadow-lg backdrop-blur-sm h-10 w-10 lg:h-12 lg:w-12 z-10 rounded-full"
            onClick={handleNext}
          >
            <ChevronRight className="h-5 w-5 lg:h-6 lg:w-6" />
          </Button>
        </>
      )}

      {/* Main Carousel Container */}
      <div className="relative">
        <div
          className="relative overflow-hidden rounded-lg bg-gray-100"
          style={{
            aspectRatio: '16/9',
            touchAction: 'pan-y',
            userSelect: 'none',
            WebkitUserSelect: 'none'
          }}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseLeave}
        >
          {/* Product Images */}
          <div
            className="flex h-full"
            style={{
              transform: `translateX(calc(-${currentIndex * 100}% + ${translateX}px))`,
              transition: isDragging ? 'none' : 'transform 0.5s ease-out',
            }}
          >
            {validProducts.map((product, index) => (
              <div key={product.id} className="w-full flex-shrink-0 h-full">
                <Link href={`/products/${product.id}`} className="block h-full">
                  <div className="relative h-full group cursor-pointer">
                    <Image
                      src={product.images[0]}
                      alt={product.name}
                      fill
                      className="object-cover transition-transform duration-300 group-hover:scale-105"
                      sizes="(max-width: 768px) 100vw, 50vw"
                      priority={index === 0}
                    />
                    
                    {/* Product Info Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                        <h3 className="text-sm font-semibold mb-1 truncate">{product.name}</h3>
                        <div className="flex items-center gap-2">
                          <span className="text-lg font-bold">${product.price}</span>
                          {product.originalPrice && product.originalPrice > product.price && (
                            <span className="text-xs line-through text-gray-300">
                              ${product.originalPrice}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              </div>
            ))}
          </div>

        </div>

        {/* Dots Indicator */}
        {validProducts.length > 1 && (
          <div className="flex justify-center mt-3 space-x-1">
            {validProducts.map((_, index) => (
              <button
                key={index}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  index === currentIndex
                    ? 'bg-primary scale-125'
                    : 'bg-gray-300 hover:bg-gray-400'
                }`}
                onClick={() => {
                  setCurrentIndex(index)
                  setIsAutoPlaying(false)
                  setTimeout(() => setIsAutoPlaying(true), 5000)
                }}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
