"use client"

import Link from "next/link"
import { useState, useEffect } from "react"
// Removed framer-motion imports to use CSS animations instead
import { Button } from "@/components/ui/button"
import { CartDrawer } from "./cart-drawer"
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
      className={`sticky top-0 z-50 w-full border-b backdrop-blur-2xl supports-[backdrop-filter]:bg-white/95 shadow-premium border-gray-200/30 transition-all duration-500 animate-fade-in-down ${
        scrolled 
          ? "bg-white/98 shadow-2xl border-gray-300/40 backdrop-blur-3xl" 
          : "bg-white/90 shadow-lg border-gray-200/30 backdrop-blur-2xl"
      }`}
    >
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <div className="hover:scale-105 transition-transform duration-300">
            <Link href="/" className="flex items-center space-x-2 group">
              <div className="text-2xl font-display font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent animate-gradient group-hover:scale-105 transition-all duration-500">
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
                  className="text-sm font-semibold text-gray-700 transition-all duration-500 hover:text-blue-600 hover:scale-105 relative px-3 py-2 rounded-xl group"
                >
                  <span className="relative z-10">{item.name}</span>
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 via-purple-600/10 to-pink-600/10 rounded-xl opacity-0 group-hover:opacity-100 transition-all duration-500 scale-95 group-hover:scale-100" />
                  <div className="absolute bottom-0 left-1/2 w-0 h-0.5 bg-gradient-to-r from-blue-600 to-pink-600 transition-all duration-500 group-hover:w-full group-hover:left-0" />
                </Link>
              </div>
            ))}
          </nav>

          {/* Actions */}
          <div className="flex items-center space-x-2 animate-fade-in-right" style={{ animationDelay: '0.5s' }}>
            <div className="hover:scale-110 hover:rotate-5 transition-all duration-500">
              <Button
                variant="ghost"
                size="icon"
                className="hidden sm:flex hover:text-pink-600 transition-all duration-500 hover:bg-pink-50 rounded-xl"
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
                    className="hidden sm:flex bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600 text-white border-0 shadow-lg hover:shadow-xl transition-all duration-500 rounded-xl font-semibold text-xs px-3 py-1.5"
                  >
                    🔥 Sale
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
                    className="md:hidden hover:bg-gray-100 rounded-xl transition-all duration-500"
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
                  {navigation.map((item, index) => (
                    <div
                      key={item.name}
                      className="animate-fade-in-right"
                      style={{ animationDelay: `${index * 0.1 + 0.2}s` }}
                    >
                      <Link
                        href={item.href}
                        className="text-lg font-semibold transition-all duration-500 hover:text-primary hover:translate-x-2 block py-3 px-4 rounded-xl hover:bg-gray-50"
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
                        className="text-lg font-semibold transition-all duration-500 hover:text-red-600 hover:translate-x-2 block py-3 px-4 rounded-xl hover:bg-red-50"
                        onClick={() => setIsOpen(false)}
                      >
                        🔥 On Sale
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
