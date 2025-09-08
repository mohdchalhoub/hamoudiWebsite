"use client"

import { Loader2 } from "lucide-react"

interface PageLoadingProps {
  message?: string
  fullScreen?: boolean
}

export function PageLoading({ 
  message = "Loading...", 
  fullScreen = true 
}: PageLoadingProps) {
  const containerClasses = fullScreen 
    ? "min-h-screen flex items-center justify-center bg-background"
    : "flex items-center justify-center py-12"

  return (
    <div className={containerClasses}>
      <div className="flex flex-col items-center space-y-4 animate-fade-in">
        {/* Spinner */}
        <div className="relative">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <div className="absolute inset-0 h-8 w-8 animate-ping">
            <div className="h-full w-full rounded-full bg-primary/20"></div>
          </div>
        </div>
        
        {/* Loading Text */}
        <div className="text-center space-y-2">
          <p className="text-lg font-medium text-text-primary">{message}</p>
          <p className="text-sm text-text-muted">Please wait while we load your content</p>
        </div>
        
        {/* Progress Dots */}
        <div className="flex space-x-1">
          <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
          <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
          <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
        </div>
      </div>
    </div>
  )
}

// Compact version for smaller areas
export function CompactLoading({ message = "Loading..." }: { message?: string }) {
  return (
    <div className="flex items-center justify-center py-8">
      <div className="flex items-center space-x-3">
        <Loader2 className="h-5 w-5 animate-spin text-primary" />
        <span className="text-text-primary font-medium">{message}</span>
      </div>
    </div>
  )
}

// Skeleton loading for product cards
export function ProductCardSkeleton() {
  return (
    <div className="animate-pulse">
      <div className="bg-background border border-border rounded-card overflow-hidden">
        {/* Image skeleton */}
        <div className="aspect-[3/4] bg-background-subtle"></div>
        
        {/* Content skeleton */}
        <div className="p-4 space-y-3">
          {/* Title skeleton */}
          <div className="h-4 bg-background-subtle rounded w-3/4"></div>
          
          {/* Price skeleton */}
          <div className="flex items-center space-x-2">
            <div className="h-4 bg-background-subtle rounded w-16"></div>
            <div className="h-3 bg-background-subtle rounded w-12"></div>
          </div>
          
          {/* Button skeleton */}
          <div className="h-9 bg-background-subtle rounded"></div>
        </div>
      </div>
    </div>
  )
}

// Grid skeleton for multiple products
export function ProductGridSkeleton({ count = 4 }: { count?: number }) {
  return (
    <div className={`grid gap-6 max-w-7xl mx-auto ${
      count <= 2 ? 'grid-cols-2' : 'grid-cols-2 md:grid-cols-3 lg:grid-cols-4'
    }`}>
      {Array.from({ length: count }, (_, index) => (
        <ProductCardSkeleton key={index} />
      ))}
    </div>
  )
}
