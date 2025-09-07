"use client"

import { useState, useRef, useEffect } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ZoomIn, X, ChevronLeft, ChevronRight } from "lucide-react"
import { Swiper, SwiperSlide } from 'swiper/react'
import { Navigation } from 'swiper/modules'
import Lightbox from "yet-another-react-lightbox"
import Thumbnails from "yet-another-react-lightbox/plugins/thumbnails"
import Zoom from "yet-another-react-lightbox/plugins/zoom"

// Import Swiper styles
import 'swiper/css'
import 'swiper/css/navigation'

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
  const [isLightboxOpen, setIsLightboxOpen] = useState(false)
  const [activeIndex, setActiveIndex] = useState(0)
  const swiperRef = useRef<any>(null)

  if (!images || images.length === 0) {
    return (
      <div className={`relative aspect-[3/4] overflow-hidden rounded-2xl bg-gray-100 flex items-center justify-center ${className}`}>
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

  const openLightbox = (index: number) => {
    setActiveIndex(index)
    setIsLightboxOpen(true)
  }

  const closeLightbox = () => {
    setIsLightboxOpen(false)
  }

  const goToImage = (index: number) => {
    setActiveIndex(index)
    if (swiperRef.current) {
      swiperRef.current.slideTo(index)
    }
  }

  // Prepare slides for lightbox
  const slides = images.map((image, index) => ({
    src: image,
    alt: `${productName} - Image ${index + 1}`,
  }))

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Main Image Carousel */}
      <div className="relative">
        <Swiper
          ref={swiperRef}
          modules={[Navigation]}
          navigation={{
            nextEl: '.swiper-button-next-custom',
            prevEl: '.swiper-button-prev-custom',
          }}
          onSlideChange={(swiper) => setActiveIndex(swiper.activeIndex)}
          className="rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl transition-shadow duration-300"
        >
          {images.map((image, index) => (
            <SwiperSlide key={index}>
              <div className="relative aspect-[3/4] cursor-pointer group" onClick={() => openLightbox(index)}>
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
                  <Badge className="absolute top-4 left-4 bg-gradient-to-r from-secondary-500 to-secondary-600 text-white text-sm px-3 py-1.5 shadow-lg">
                    ⭐ Featured
                  </Badge>
                )}
                {discountPercentage > 0 && index === 0 && (
                  <Badge className="absolute top-4 right-4 bg-gradient-to-r from-red-500 to-red-600 text-white text-sm px-3 py-1.5 shadow-lg">
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

        {/* Custom Navigation Buttons */}
        {images.length > 1 && (
          <>
            <Button
              variant="ghost"
              size="icon"
              className="swiper-button-prev-custom absolute left-4 top-1/2 -translate-y-1/2 h-10 w-10 bg-white/90 hover:bg-white shadow-lg opacity-0 group-hover:opacity-100 transition-opacity z-10"
            >
              <ChevronLeft className="h-5 w-5" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="swiper-button-next-custom absolute right-4 top-1/2 -translate-y-1/2 h-10 w-10 bg-white/90 hover:bg-white shadow-lg opacity-0 group-hover:opacity-100 transition-opacity z-10"
            >
              <ChevronRight className="h-5 w-5" />
            </Button>
          </>
        )}
      </div>

      {/* Thumbnail Gallery */}
      {images.length > 1 && (
        <div className="flex justify-center">
          <div className="flex gap-3 overflow-x-auto pb-2 max-w-full">
            {images.map((image, index) => (
              <div
                key={index}
                className={`relative flex-shrink-0 w-16 h-16 sm:w-20 sm:h-20 rounded-lg overflow-hidden cursor-pointer border-2 transition-all duration-300 hover:scale-105 ${
                  index === activeIndex 
                    ? 'border-primary-500 shadow-lg scale-105' 
                    : 'border-gray-200 hover:border-gray-300 hover:shadow-md'
                }`}
                onClick={() => goToImage(index)}
              >
                <Image
                  src={image}
                  alt={`${productName} thumbnail ${index + 1}`}
                  width={80}
                  height={80}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = '/placeholder.svg';
                  }}
                />
                {/* Active indicator */}
                {index === activeIndex && (
                  <div className="absolute inset-0 bg-primary-500/20 border-2 border-primary-500 rounded-lg" />
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Lightbox Gallery */}
      <Lightbox
        open={isLightboxOpen}
        close={closeLightbox}
        slides={slides}
        index={activeIndex}
        plugins={[Thumbnails, Zoom]}
        thumbnails={{
          position: "bottom",
          width: 120,
          height: 80,
        }}
        zoom={{
          maxZoomPixelRatio: 3,
          scrollToZoom: true,
        }}
        styles={{
          container: { backgroundColor: "rgba(0, 0, 0, 0.95)" },
        }}
      />
    </div>
  )
}
