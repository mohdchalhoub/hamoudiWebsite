"use client"

import { useState, useRef, useEffect } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ChevronLeft, ChevronRight, ZoomIn } from "lucide-react"
import { Swiper, SwiperSlide } from 'swiper/react'
import { Navigation, Pagination } from 'swiper/modules'
import { Lightbox } from 'yet-another-react-lightbox'
import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'

interface ProductImageCarouselProps {
  images: string[]
  productName: string
  isFeatured?: boolean
  discountPercentage?: number
  className?: string
}

export function ProductImageCarousel({ 
  images, 
  productName, 
  isFeatured = false, 
  discountPercentage = 0,
  className = ""
}: ProductImageCarouselProps) {
  const [activeIndex, setActiveIndex] = useState(0)
  const [isHovered, setIsHovered] = useState(false)
  const [isLightboxOpen, setIsLightboxOpen] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const swiperRef = useRef<any>(null)

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }
    
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  const openLightbox = (index: number) => {
    setActiveIndex(index)
    setIsLightboxOpen(true)
  }

  const goToPrevious = () => {
    if (swiperRef.current) {
      swiperRef.current.slidePrev()
    }
  }

  const goToNext = () => {
    if (swiperRef.current) {
      swiperRef.current.slideNext()
    }
  }

  const handleImageClick = (index: number) => {
    if (!isMobile) {
      // On desktop, clicking the image advances to next image
      goToNext()
    } else {
      // On mobile, clicking opens lightbox
      openLightbox(index)
    }
  }

  // Prepare slides for lightbox
  const slides = images.map((image, index) => ({
    src: image,
    alt: `${productName} - Image ${index + 1}`,
  }))

  return (
    <div className={`space-y-4 ${className}`}>
      {/* External Navigation Controls */}
      {images.length > 1 && (
        <div className="flex items-center justify-between mb-4">
          <Button
            variant="outline"
            size="lg"
            onClick={goToPrevious}
            className="flex items-center gap-2 bg-background/95 backdrop-blur-sm border-2 border-primary/20 hover:border-primary hover:text-primary shadow-lg hover:shadow-xl transition-all duration-300 min-w-[100px] h-10 text-sm font-medium"
          >
            <ChevronLeft className="h-5 w-5" />
            <span className="hidden sm:inline">Previous</span>
          </Button>
          
          <div className="text-center">
            <p className="text-sm text-muted-foreground font-medium">
              {activeIndex + 1} of {images.length}
            </p>
          </div>
          
          <Button
            variant="outline"
            size="lg"
            onClick={goToNext}
            className="flex items-center gap-2 bg-background/95 backdrop-blur-sm border-2 border-primary/20 hover:border-primary hover:text-primary shadow-lg hover:shadow-xl transition-all duration-300 min-w-[100px] h-10 text-sm font-medium"
          >
            <span className="hidden sm:inline">Next</span>
            <ChevronRight className="h-5 w-5" />
          </Button>
        </div>
      )}

      {/* Main Image Carousel */}
      <div 
        className="relative group"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <Swiper
          ref={swiperRef}
          modules={[Navigation, Pagination]}
          navigation={{
            nextEl: '.swiper-button-next-custom',
            prevEl: '.swiper-button-prev-custom',
          }}
          pagination={{
            clickable: true,
            bulletClass: 'swiper-pagination-bullet-custom',
            bulletActiveClass: 'swiper-pagination-bullet-active-custom',
          }}
          loop={images.length > 1}
          spaceBetween={0}
          slidesPerView={1}
          centeredSlides={true}
          onSlideChange={(swiper) => setActiveIndex(swiper.realIndex)}
          onSwiper={(swiper) => {
            swiperRef.current = swiper
          }}
          touchRatio={1.5}
          threshold={10}
          resistanceRatio={0.85}
          allowTouchMove={true}
          touchStartPreventDefault={false}
          className="rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl transition-shadow duration-300"
        >
          {images.map((image, index) => (
            <SwiperSlide key={index}>
              <div 
                className="relative aspect-[3/4] cursor-pointer group" 
                onClick={() => handleImageClick(index)}
              >
                <Image
                  src={image}
                  alt={`${productName} - Image ${index + 1}`}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                  priority={index === 0}
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = '/placeholder.svg';
                  }}
                />
                
                {/* Gradient overlay for better badge visibility */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                
                {/* Product badges */}
                {isFeatured && index === 0 && (
                  <Badge className="absolute top-4 left-4 bg-black text-white text-sm font-bold px-4 py-2 shadow-xl border-2 border-white/20 backdrop-blur-sm">
                    ⭐ FEATURED
                  </Badge>
                )}
                {discountPercentage > 0 && index === 0 && (
                  <Badge className="absolute top-4 right-4 bg-black text-white text-sm px-3 py-1.5 shadow-lg">
                    -{discountPercentage}%
                  </Badge>
                )}

                {/* Zoom icon */}
                <div className="absolute bottom-4 right-4 bg-black/60 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <ZoomIn className="h-4 w-4" />
                </div>

                {/* Image counter */}
                {images.length > 1 && (
                  <div className="absolute bottom-4 left-4 bg-black/60 text-white text-sm px-3 py-1.5 rounded-lg backdrop-blur-sm">
                    {index + 1} / {images.length}
                  </div>
                )}
              </div>
            </SwiperSlide>
          ))}
        </Swiper>

        {/* Custom Navigation Buttons - Only show on mobile or when hovering */}
        {images.length > 1 && (
          <>
            <Button
              variant="ghost"
              size="icon"
              className={`swiper-button-prev-custom absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 h-8 w-8 sm:h-10 sm:w-10 bg-white/90 hover:bg-white shadow-lg z-10 transition-all duration-300 ${
                isMobile 
                  ? 'opacity-100' 
                  : isHovered 
                    ? 'opacity-100' 
                    : 'opacity-0'
              }`}
              onClick={(e) => {
                e.stopPropagation()
                goToPrevious()
              }}
            >
              <ChevronLeft className="h-4 w-4 sm:h-5 sm:w-5" />
            </Button>
            
            <Button
              variant="ghost"
              size="icon"
              className={`swiper-button-next-custom absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 h-8 w-8 sm:h-10 sm:w-10 bg-white/90 hover:bg-white shadow-lg z-10 transition-all duration-300 ${
                isMobile 
                  ? 'opacity-100' 
                  : isHovered 
                    ? 'opacity-100' 
                    : 'opacity-0'
              }`}
              onClick={(e) => {
                e.stopPropagation()
                goToNext()
              }}
            >
              <ChevronRight className="h-4 w-4 sm:h-5 sm:w-5" />
            </Button>
          </>
        )}
      </div>

      {/* Thumbnail Navigation */}
      {images.length > 1 && (
        <div className="flex space-x-2 overflow-x-auto pb-2">
          {images.map((image, index) => (
            <button
              key={index}
              onClick={() => {
                if (swiperRef.current) {
                  swiperRef.current.slideTo(index)
                }
              }}
              className={`relative flex-shrink-0 w-16 h-16 sm:w-20 sm:h-20 rounded-lg overflow-hidden border-2 transition-all duration-300 ${
                index === activeIndex
                  ? 'border-primary shadow-lg scale-105'
                  : 'border-border hover:border-primary/50'
              }`}
            >
              <Image
                src={image}
                alt={`${productName} thumbnail ${index + 1}`}
                fill
                className="object-cover"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = '/placeholder.svg';
                }}
              />
            </button>
          ))}
        </div>
      )}

      {/* Lightbox */}
      {isLightboxOpen && (
        <Lightbox
          open={isLightboxOpen}
          close={() => setIsLightboxOpen(false)}
          index={activeIndex}
          slides={slides}
          on={{
            view: ({ index }) => setActiveIndex(index),
          }}
        />
      )}

      {/* Custom Swiper Styles */}
      <style jsx global>{`
        .swiper-pagination-custom {
          position: relative;
          margin-top: 1rem;
        }
        
        .swiper-pagination-bullet-custom {
          width: 8px;
          height: 8px;
          background: #d1d5db;
          opacity: 1;
          margin: 0 4px;
          transition: all 0.3s ease;
        }
        
        .swiper-pagination-bullet-active-custom {
          background: #3b82f6;
          transform: scale(1.2);
        }
        
        .swiper-button-prev-custom,
        .swiper-button-next-custom {
          position: absolute;
          top: 50%;
          transform: translateY(-50%);
          z-index: 10;
          width: 40px;
          height: 40px;
          margin-top: 0;
          background: rgba(255, 255, 255, 0.9);
          border-radius: 50%;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
          transition: all 0.3s ease;
        }
        
        .swiper-button-prev-custom:hover,
        .swiper-button-next-custom:hover {
          background: white;
          box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
        }
        
        .swiper-button-prev-custom:after,
        .swiper-button-next-custom:after {
          display: none;
        }
      `}</style>
    </div>
  )
}