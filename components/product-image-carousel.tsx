"use client"

import { useState, useRef } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ZoomIn, X, ChevronLeft, ChevronRight } from "lucide-react"
import { Swiper, SwiperSlide } from 'swiper/react'
import { Navigation, Thumbs, FreeMode } from 'swiper/modules'
import type { Swiper as SwiperType } from 'swiper'
import Lightbox from "yet-another-react-lightbox"
import Thumbnails from "yet-another-react-lightbox/plugins/thumbnails"
import Zoom from "yet-another-react-lightbox/plugins/zoom"

// Import Swiper styles
import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/thumbs'
import 'swiper/css/free-mode'

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
  const [thumbsSwiper, setThumbsSwiper] = useState<SwiperType | null>(null)
  const [isLightboxOpen, setIsLightboxOpen] = useState(false)
  const [activeIndex, setActiveIndex] = useState(0)

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
          modules={[Navigation, Thumbs]}
          thumbs={{ swiper: thumbsSwiper && !thumbsSwiper.destroyed ? thumbsSwiper : null }}
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
                />
                
                {/* Gradient overlay for better badge visibility */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                
                {/* Product badges */}
                {isFeatured && index === 0 && (
                  <Badge className="absolute top-4 left-4 bg-gradient-to-r from-amber-500 to-orange-500 text-white text-sm px-3 py-1.5 shadow-lg">
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

      {/* Thumbnail Carousel */}
      {images.length > 1 && (
        <div className="px-2">
          <Swiper
            modules={[FreeMode, Thumbs]}
            onSwiper={setThumbsSwiper}
            spaceBetween={8}
            slidesPerView="auto"
            freeMode={true}
            watchSlidesProgress={true}
            className="thumbnail-swiper"
          >
            {images.map((image, index) => (
              <SwiperSlide key={index} className="!w-20 !h-20">
                <div 
                  className={`relative w-full h-full rounded-lg overflow-hidden cursor-pointer border-2 transition-all duration-300 hover:scale-105 ${
                    index === activeIndex 
                      ? 'border-blue-500 shadow-lg scale-105' 
                      : 'border-gray-200 hover:border-gray-300 hover:shadow-md'
                  }`}
                >
                  <Image
                    src={image}
                    alt={`${productName} thumbnail ${index + 1}`}
                    fill
                    className="object-cover"
                  />
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
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
