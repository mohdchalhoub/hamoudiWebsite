import Link from "next/link"
import { Mail, Phone, MapPin, Facebook, Instagram, Twitter } from "lucide-react"

export function Footer() {
  return (
    <footer className="bg-muted/50 border-t">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <div className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-pink-600 bg-clip-text text-transparent">
              KidsWear
            </div>
            <p className="text-muted-foreground text-sm">
              Modern, playful clothing for boys and girls. Quality fashion that kids love and parents trust.
            </p>
            <div className="flex space-x-4">
              <Link href="#" className="text-muted-foreground hover:text-primary">
                <Facebook className="h-5 w-5" />
              </Link>
              <Link href="#" className="text-muted-foreground hover:text-primary">
                <Instagram className="h-5 w-5" />
              </Link>
              <Link href="#" className="text-muted-foreground hover:text-primary">
                <Twitter className="h-5 w-5" />
              </Link>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="font-semibold">Quick Links</h3>
            <div className="space-y-2">
              <Link href="/boys" className="block text-sm text-muted-foreground hover:text-primary">
                Boys Collection
              </Link>
              <Link href="/girls" className="block text-sm text-muted-foreground hover:text-primary">
                Girls Collection
              </Link>
              <Link href="/about" className="block text-sm text-muted-foreground hover:text-primary">
                About Us
              </Link>
              <Link href="/contact" className="block text-sm text-muted-foreground hover:text-primary">
                Contact
              </Link>
            </div>
          </div>

          {/* Customer Service */}
          <div className="space-y-4">
            <h3 className="font-semibold">Customer Service</h3>
            <div className="space-y-2">
              <Link href="#" className="block text-sm text-muted-foreground hover:text-primary">
                Size Guide
              </Link>
              <Link href="#" className="block text-sm text-muted-foreground hover:text-primary">
                Shipping Info
              </Link>
              <Link href="#" className="block text-sm text-muted-foreground hover:text-primary">
                Returns
              </Link>
              <Link href="#" className="block text-sm text-muted-foreground hover:text-primary">
                FAQ
              </Link>
            </div>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <h3 className="font-semibold">Contact Info</h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                <Mail className="h-4 w-4" />
                <span>hello@kidswear.com</span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                <Phone className="h-4 w-4" />
                <span>+1 (555) 123-4567</span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                <MapPin className="h-4 w-4" />
                <span>123 Kids Street, Fashion City</span>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t mt-8 pt-8 text-center text-sm text-muted-foreground">
          <p>&copy; 2024 KidsWear. All rights reserved. Made with love for kids everywhere.</p>
        </div>
      </div>
    </footer>
  )
}
