"use client"

import { Card, CardContent } from "@/components/ui/card"

interface SkeletonLoaderProps {
  type?: "product-card" | "text" | "button" | "image"
  className?: string
}

export function SkeletonLoader({ type = "product-card", className = "" }: SkeletonLoaderProps) {
  if (type === "product-card") {
    return (
      <Card className={`premium-card border-0 overflow-hidden ${className}`}>
        <div className="skeleton-image" />
        <CardContent className="p-6">
          <div className="space-y-3">
            <div className="skeleton-text-lg w-3/4" />
            <div className="skeleton-text w-1/2" />
            <div className="flex items-center justify-between">
              <div className="skeleton-text w-16" />
              <div className="skeleton-button w-20" />
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (type === "text") {
    return (
      <div className={`space-y-2 ${className}`}>
        <div className="skeleton-text w-full" />
        <div className="skeleton-text w-4/5" />
        <div className="skeleton-text w-3/5" />
      </div>
    )
  }

  if (type === "button") {
    return <div className={`skeleton-button w-full ${className}`} />
  }

  if (type === "image") {
    return <div className={`skeleton-image w-full ${className}`} />
  }

  return null
}

export function ProductGridSkeleton({ count = 4 }: { count?: number }) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-8 max-w-7xl mx-auto">
      {Array.from({ length: count }).map((_, index) => (
        <SkeletonLoader 
          key={index} 
          type="product-card" 
          className="animate-fade-in-up"
          style={{ animationDelay: `${index * 0.1}s` }}
        />
      ))}
    </div>
  )
}

export function LoadingSpinner({ size = "md" }: { size?: "sm" | "md" | "lg" }) {
  const sizeClasses = {
    sm: "w-6 h-6",
    md: "w-10 h-10", 
    lg: "w-16 h-16"
  }

  return (
    <div className="flex items-center justify-center p-8">
      <div className={`premium-spinner ${sizeClasses[size]}`} />
    </div>
  )
}
