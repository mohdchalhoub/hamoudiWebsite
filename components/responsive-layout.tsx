"use client"

import { MobileSearchBar } from "./mobile-search-bar"

interface ResponsiveLayoutProps {
  children: React.ReactNode
  showMobileSearch?: boolean
}

export function ResponsiveLayout({ 
  children, 
  showMobileSearch = true 
}: ResponsiveLayoutProps) {
  return (
    <div className="min-h-screen">
      {children}
      {showMobileSearch && <MobileSearchBar />}
    </div>
  )
}
