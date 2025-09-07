"use client"

import { motion, useInView } from "framer-motion"
import { useRef, ReactNode } from "react"
import { cn } from "@/lib/utils"

interface EnhancedAnimatedSectionProps {
  children: ReactNode
  className?: string
  animation?: 
    | "fade-up" 
    | "fade-down" 
    | "fade-left" 
    | "fade-right" 
    | "scale-in" 
    | "slide-up" 
    | "zoom-in"
    | "stagger"
    | "bounce"
    | "flip"
    | "rotate"
  delay?: number
  duration?: number
  stagger?: number
  once?: boolean
  aos?: boolean
}

const animationVariants = {
  "fade-up": {
    hidden: { opacity: 0, y: 60 },
    visible: { opacity: 1, y: 0 }
  },
  "fade-down": {
    hidden: { opacity: 0, y: -60 },
    visible: { opacity: 1, y: 0 }
  },
  "fade-left": {
    hidden: { opacity: 0, x: -60 },
    visible: { opacity: 1, x: 0 }
  },
  "fade-right": {
    hidden: { opacity: 0, x: 60 },
    visible: { opacity: 1, x: 0 }
  },
  "scale-in": {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { opacity: 1, scale: 1 }
  },
  "slide-up": {
    hidden: { opacity: 0, y: 100 },
    visible: { opacity: 1, y: 0 }
  },
  "zoom-in": {
    hidden: { opacity: 0, scale: 0.5 },
    visible: { opacity: 1, scale: 1 }
  },
  "stagger": {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  },
  "bounce": {
    hidden: { opacity: 0, y: 60 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 10
      }
    }
  },
  "flip": {
    hidden: { opacity: 0, rotateY: -90 },
    visible: { opacity: 1, rotateY: 0 }
  },
  "rotate": {
    hidden: { opacity: 0, rotate: -180, scale: 0.8 },
    visible: { opacity: 1, rotate: 0, scale: 1 }
  }
}

export function EnhancedAnimatedSection({ 
  children, 
  className, 
  animation = "fade-up", 
  delay = 0, 
  duration = 0.6,
  stagger = 0.1,
  once = true,
  aos = false
}: EnhancedAnimatedSectionProps) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once, margin: "-100px" })

  const variants = animationVariants[animation]

  return (
    <motion.div
      ref={ref}
      className={cn(className)}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      variants={variants}
      transition={{
        duration,
        delay,
        ease: "easeOut"
      }}
      data-aos={aos ? animation.replace("-", "") : undefined}
      data-aos-delay={aos ? delay * 1000 : undefined}
      data-aos-duration={aos ? duration * 1000 : undefined}
    >
      {children}
    </motion.div>
  )
}
