"use client"

import type React from "react"

import { useScrollAnimation } from "@/hooks/use-scroll-animation"
import { cn } from "@/lib/utils"

interface AnimatedSectionProps {
  children: React.ReactNode
  className?: string
  animation?: "fade-up" | "fade-left" | "fade-right" | "scale-in"
  delay?: number
}

export function AnimatedSection({ children, className, animation = "fade-up", delay = 0 }: AnimatedSectionProps) {
  const { ref, isVisible } = useScrollAnimation()

  const animationClass = {
    "fade-up": "animate-fade-in-up",
    "fade-left": "animate-fade-in-left",
    "fade-right": "animate-fade-in-right",
    "scale-in": "animate-scale-in",
  }[animation]

  const delayClass = delay > 0 ? `animate-delay-${delay}` : ""

  return (
    <div
      ref={ref}
      className={cn(
        className,
        !isVisible && animationClass,
        delayClass,
        isVisible && "opacity-100 translate-y-0 translate-x-0 scale-100",
      )}
    >
      {children}
    </div>
  )
}
