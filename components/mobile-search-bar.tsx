"use client"

import { SearchBar } from "./search-bar"

interface MobileSearchBarProps {
  className?: string
}

export function MobileSearchBar({ className = "" }: MobileSearchBarProps) {
  return (
    <div className={`md:hidden w-full px-4 py-3 bg-background border-b border-border ${className}`}>
      <div className="max-w-4xl mx-auto">
        <SearchBar className="w-full" />
      </div>
    </div>
  )
}
