import Link from "next/link"
import { Mail, Phone, MapPin, Facebook, Instagram, Twitter } from "lucide-react"

export function Footer() {
  return (
    <footer className="bg-[#F3F4F6] border-t border-border">
      <div className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {/* Brand */}
          <div className="space-y-3">
            <div className="text-lg font-light text-text-secondary">
              KidsCorner
            </div>
            <p className="text-text-muted text-sm leading-relaxed">
              Quality fashion for amazing kids. Modern, comfortable clothing that parents trust.
            </p>
            <div className="flex space-x-3">
              {[
                { icon: Facebook, href: "#" },
                { icon: Instagram, href: "#" },
                { icon: Twitter, href: "#" }
              ].map((social, index) => (
                <Link 
                  key={index}
                  href={social.href} 
                  className="text-text-muted hover:text-text-secondary transition-colors duration-200"
                >
                  <social.icon className="h-4 w-4" />
                </Link>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h3 className="font-medium text-text-secondary text-sm">Shop</h3>
            <div className="space-y-2">
              {[
                { name: "Boys Collection", href: "/boys" },
                { name: "Girls Collection", href: "/girls" },
                { name: "On Sale", href: "/on-sale" }
              ].map((link) => (
                <Link 
                  key={link.name}
                  href={link.href} 
                  className="block text-sm text-text-muted hover:text-text-secondary transition-colors duration-200"
                >
                  {link.name}
                </Link>
              ))}
            </div>
          </div>

          {/* Company */}
          <div className="space-y-3">
            <h3 className="font-medium text-text-secondary text-sm">Company</h3>
            <div className="space-y-2">
              {[
                { name: "About Us", href: "/about" },
                { name: "Contact", href: "/contact" },
                { name: "Careers", href: "#" }
              ].map((link) => (
                <Link 
                  key={link.name}
                  href={link.href} 
                  className="block text-sm text-text-muted hover:text-text-secondary transition-colors duration-200"
                >
                  {link.name}
                </Link>
              ))}
            </div>
          </div>

          {/* Contact */}
          <div className="space-y-3">
            <h3 className="font-medium text-text-secondary text-sm">Contact</h3>
            <div className="space-y-2">
              <div className="flex items-center space-x-2 text-sm text-text-muted">
                <Mail className="h-3 w-3" />
                <span>hello@kidscorner.com</span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-text-muted">
                <Phone className="h-3 w-3" />
                <span>+1 (555) 123-4567</span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-text-muted">
                <MapPin className="h-3 w-3" />
                <span>123 Fashion St, Style City</span>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 pt-4 border-t border-border">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-3 md:space-y-0">
            <p className="text-sm text-text-muted">
              © 2024 KidsCorner. All rights reserved.
            </p>
            <div className="flex space-x-6 text-sm">
              {[
                { name: "Privacy Policy", href: "#" },
                { name: "Terms of Service", href: "#" },
                { name: "Cookie Policy", href: "#" }
              ].map((link) => (
                <Link 
                  key={link.name}
                  href={link.href} 
                  className="text-text-muted hover:text-text-secondary transition-colors duration-200"
                >
                  {link.name}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
