import Link from "next/link"
import { Mail, Phone, MapPin, Facebook, Instagram, Twitter } from "lucide-react"

export function Footer() {
  return (
    <footer className="bg-gradient-to-br from-slate-900 via-gray-800 to-slate-900 border-t border-gray-700/50 shadow-2xl">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <div className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-pink-600 bg-clip-text text-transparent animate-gradient">
              KidsWear
            </div>
            <p className="text-gray-300 text-sm leading-relaxed">
              Modern, playful clothing for boys and girls. Quality fashion that kids love and parents trust.
            </p>
            <div className="flex space-x-4">
              <Link href="#" className="text-gray-400 hover:text-blue-400 hover:scale-110 transition-all duration-300 hover-bounce">
                <Facebook className="h-5 w-5" />
              </Link>
              <Link href="#" className="text-gray-400 hover:text-pink-400 hover:scale-110 transition-all duration-300 hover-bounce">
                <Instagram className="h-5 w-5" />
              </Link>
              <Link href="#" className="text-gray-400 hover:text-blue-300 hover:scale-110 transition-all duration-300 hover-bounce">
                <Twitter className="h-5 w-5" />
              </Link>
            </div>
          </div>
          <div className="space-y-4">
            <h3 className="font-semibold text-white">Quick Links</h3>
            <div className="space-y-2">
              <Link href="/boys" className="block text-sm text-gray-300 hover:text-blue-400 hover:translate-x-1 transition-all duration-300">
                Boys Collection
              </Link>
              <Link href="/girls" className="block text-sm text-gray-300 hover:text-pink-400 hover:translate-x-1 transition-all duration-300">
                Girls Collection
              </Link>
              <Link href="/about" className="block text-sm text-gray-300 hover:text-blue-400 hover:translate-x-1 transition-all duration-300">
                About Us
              </Link>
              <Link href="/contact" className="block text-sm text-gray-300 hover:text-blue-400 hover:translate-x-1 transition-all duration-300">
                Contact
              </Link>
            </div>
          </div>
          <div className="space-y-4">
            <h3 className="font-semibold text-white">Customer Service</h3>
            <div className="space-y-2">
              <Link href="#" className="block text-sm text-gray-300 hover:text-blue-400 hover:translate-x-1 transition-all duration-300">
                Size Guide
              </Link>
              <Link href="#" className="block text-sm text-gray-300 hover:text-blue-400 hover:translate-x-1 transition-all duration-300">
                Shipping Info
              </Link>
              <Link href="#" className="block text-sm text-gray-300 hover:text-blue-400 hover:translate-x-1 transition-all duration-300">
                Returns
              </Link>
              <Link href="#" className="block text-sm text-gray-300 hover:text-blue-400 hover:translate-x-1 transition-all duration-300">
                FAQ
              </Link>
            </div>
          </div>
          <div className="space-y-4">
            <h3 className="font-semibold text-white">Contact Info</h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-3 text-sm text-gray-300">
                <Mail className="h-4 w-4 text-blue-400" />
                <span>hello@kidswear.com</span>
              </div>
              <div className="flex items-center space-x-3 text-sm text-gray-300">
                <Phone className="h-4 w-4 text-blue-400" />
                <span>+1 (555) 123-4567</span>
              </div>
              <div className="flex items-center space-x-3 text-sm text-gray-300">
                <MapPin className="h-4 w-4 text-blue-400" />
                <span>123 Fashion St, Style City</span>
              </div>
            </div>
          </div>
        </div>
        <div className="mt-8 pt-8 border-t border-gray-700/50">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-sm text-gray-400">
              © 2024 KidsWear. All rights reserved.
            </p>
            <div className="flex space-x-6 text-sm">
              <Link href="#" className="text-gray-400 hover:text-blue-400 transition-colors duration-300">
                Privacy Policy
              </Link>
              <Link href="#" className="text-gray-400 hover:text-blue-400 transition-colors duration-300">
                Terms of Service
              </Link>
              <Link href="#" className="text-gray-400 hover:text-blue-400 transition-colors duration-300">
                Cookie Policy
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
