"use client"

import type React from "react"

import { useScrollAnimation } from "@/hooks/use-scroll-animation"
import { cn } from "@/lib/utils"

interface AnimatedSectionProps {
  children: React.ReactNode
  className?: string
  animation?: "fade-up" | "fade-down" | "fade-left" | "fade-right" | "scale-in" | "slide-up" | "zoom-in" | "wiggle" | "shake" | "glow" | "slide-in-left" | "slide-in-right" | "rotate-in" | "flip-in" | "zoom-out" | "elastic" | "heartbeat" | "rubber-band" | "tada" | "wobble" | "swing" | "fade-in-scale" | "slide-up-fade"
  delay?: number
  duration?: number
  once?: boolean
}

export function AnimatedSection({ 
  children, 
  className, 
  animation = "fade-up", 
  delay = 0, 
  duration = 800,
  once = true 
}: AnimatedSectionProps) {
  const { ref, isVisible } = useScrollAnimation({ triggerOnce: once })

  const animationClass = {
    "fade-up": "animate-fade-in-up",
    "fade-down": "animate-fade-in-down",
    "fade-left": "animate-fade-in-left",
    "fade-right": "animate-fade-in-right",
    "scale-in": "animate-scale-in",
    "slide-up": "animate-slide-up",
    "zoom-in": "animate-zoom-in",
    "wiggle": "animate-wiggle",
    "shake": "animate-shake",
    "glow": "animate-glow",
    "slide-in-left": "animate-slide-in-left",
    "slide-in-right": "animate-slide-in-right",
    "rotate-in": "animate-rotate-in",
    "flip-in": "animate-flip-in",
    "zoom-out": "animate-zoom-out",
    "elastic": "animate-elastic",
    "heartbeat": "animate-heartbeat",
    "rubber-band": "animate-rubber-band",
    "tada": "animate-tada",
    "wobble": "animate-wobble",
    "swing": "animate-swing",
    "fade-in-scale": "animate-fade-in-scale",
    "slide-up-fade": "animate-slide-up-fade",
  }[animation]

  const delayClass = delay > 0 ? `animate-delay-${delay}` : ""

  return (
    <div
      ref={ref}
      className={cn(
        className,
        "transition-all duration-300 ease-out",
        !isVisible && animationClass,
        delayClass,
        isVisible && "opacity-100 translate-y-0 translate-x-0 scale-100",
      )}
      style={{
        animationDuration: `${duration}ms`,
      }}
    >
      {children}
    </div>
  )
}