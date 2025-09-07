"use client"

import Link from "next/link"
import { useState, useEffect } from "react"
// Removed framer-motion imports to use CSS animations instead
import { Button } from "@/components/ui/button"
import { CartDrawer } from "./cart-drawer"
import { SearchBar } from "./search-bar"
import { Menu, Heart, X } from "lucide-react"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"

interface HeaderProps {
  hasSaleProducts?: boolean
}

export function Header({ hasSaleProducts = false }: HeaderProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const navigation = [
    { name: "Home", href: "/" },
    { name: "Boys", href: "/boys" },
    { name: "Girls", href: "/girls" },
    { name: "About", href: "/about" },
    { name: "Contact", href: "/contact" },
  ]

  return (
    <header 
      className={`sticky top-0 z-50 w-full border-b border-border bg-background transition-all duration-300 ${
        scrolled 
          ? "shadow-sm" 
          : "shadow-none"
      }`}
    >
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <div className="hover:scale-105 transition-transform duration-300">
            <Link href="/" className="flex items-center space-x-2 group">
              <div className="text-xl font-light text-text-primary">
                KidsCorner
              </div>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {navigation.map((item, index) => (
              <div
                key={item.name}
                className="animate-fade-in-down"
                style={{ animationDelay: `${index * 0.1 + 0.3}s` }}
              >
                <Link
                  href={item.href}
                  className="text-sm font-medium text-text-muted hover:text-primary transition-colors duration-200 px-3 py-2"
                >
                  {item.name}
                </Link>
              </div>
            ))}
          </nav>

          {/* Search Bar */}
          <div className="hidden md:block flex-1 max-w-md mx-8">
            <SearchBar />
          </div>

          {/* Actions */}
          <div className="flex items-center space-x-2 animate-fade-in-right" style={{ animationDelay: '0.5s' }}>
            <div className="hover:scale-110 hover:rotate-5 transition-all duration-500">
              <Button
                variant="ghost"
                size="icon"
                className="hidden sm:flex hover:text-primary text-text-muted"
              >
                <Heart className="h-4 w-4" />
              </Button>
            </div>
            
            {/* On Sale Button */}
            {hasSaleProducts && (
              <div className="hover:scale-105 transition-transform duration-500">
                <Link href="/on-sale">
                  <Button
                    variant="outline"
                    size="sm"
                    className="hidden sm:flex bg-background border border-border text-text-primary hover:border-primary hover:text-primary text-xs px-3 py-1.5 rounded-none"
                  >
                    Sale
                  </Button>
                </Link>
              </div>
            )}
            
            <div className="hover:scale-105 transition-transform duration-500">
              <CartDrawer />
            </div>

            {/* Mobile Menu */}
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild>
                <div className="hover:scale-110 transition-transform duration-500">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="md:hidden text-text-muted"
                  >
                    {isOpen ? (
                      <X className="h-4 w-4 transition-transform duration-300" />
                    ) : (
                      <Menu className="h-4 w-4 transition-transform duration-300" />
                    )}
                  </Button>
                </div>
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px] sm:w-[400px]">
                <div className="flex flex-col space-y-4 mt-8 animate-fade-in-right">
                  {/* Mobile Search Bar */}
                  <div className="px-4 pb-4">
                    <SearchBar />
                  </div>
                  
                  {navigation.map((item, index) => (
                    <div
                      key={item.name}
                      className="animate-fade-in-right"
                      style={{ animationDelay: `${index * 0.1 + 0.2}s` }}
                    >
                      <Link
                        href={item.href}
                        className="text-base font-medium text-text-muted hover:text-primary block py-3 px-4"
                        onClick={() => setIsOpen(false)}
                      >
                        {item.name}
                      </Link>
                    </div>
                  ))}
                  
                  {/* On Sale Link for Mobile */}
                  {hasSaleProducts && (
                    <div
                      className="animate-fade-in-right"
                      style={{ animationDelay: `${navigation.length * 0.1 + 0.2}s` }}
                    >
                      <Link
                        href="/on-sale"
                        className="text-base font-medium text-text-muted hover:text-primary block py-3 px-4"
                        onClick={() => setIsOpen(false)}
                      >
                        On Sale
                      </Link>
                    </div>
                  )}
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  )
}
