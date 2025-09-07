import Link from "next/link"
import { Mail, Phone, MapPin, Facebook, Instagram, Twitter, Heart } from "lucide-react"

export function Footer() {
  return (
    <footer className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 border-t border-gray-700/30 shadow-premium relative overflow-hidden animate-fade-in-up">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-10 left-10 w-32 h-32 bg-gradient-to-br from-blue-500/10 to-pink-500/10 rounded-full blur-2xl animate-float-gentle" />
        <div className="absolute bottom-10 right-10 w-40 h-40 bg-gradient-to-br from-pink-500/10 to-purple-500/10 rounded-full blur-2xl animate-float-gentle" style={{ animationDelay: '2s' }} />
      </div>

      <div className="container mx-auto px-4 py-16 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="space-y-6 animate-fade-in-left">
            <div className="hover:scale-105 transition-transform duration-500">
              <div className="text-3xl font-display font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                KidsCorner
              </div>
            </div>
            <p className="text-gray-300 text-sm leading-relaxed max-w-sm font-body">
              Modern, playful clothing for boys and girls. Quality fashion that kids love and parents trust.
            </p>
            <div className="flex space-x-4">
              {[
                { icon: Facebook, href: "#", color: "hover:text-blue-400" },
                { icon: Instagram, href: "#", color: "hover:text-pink-400" },
                { icon: Twitter, href: "#", color: "hover:text-blue-300" }
              ].map((social, index) => (
                <div key={index} className="hover:scale-125 hover:rotate-5 transition-all duration-500">
                  <Link href={social.href} className={`text-gray-400 ${social.color} transition-all duration-500 p-2 rounded-xl hover:bg-white/10`}>
                    <social.icon className="h-6 w-6" />
                  </Link>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-6 animate-fade-in-left" style={{ animationDelay: '0.2s' }}>
            <h3 className="font-display font-bold text-white text-lg">Quick Links</h3>
            <div className="space-y-3">
              {[
                { name: "Boys Collection", href: "/boys", color: "hover:text-blue-400" },
                { name: "Girls Collection", href: "/girls", color: "hover:text-pink-400" },
                { name: "About Us", href: "/about", color: "hover:text-blue-400" },
                { name: "Contact", href: "/contact", color: "hover:text-blue-400" }
              ].map((link, index) => (
                <div key={link.name} className="animate-fade-in-left" style={{ animationDelay: `${0.3 + index * 0.1}s` }}>
                  <Link 
                    href={link.href} 
                    className={`block text-sm text-gray-300 ${link.color} hover:translate-x-2 transition-all duration-500 group py-2 px-3 rounded-lg hover:bg-white/5`}
                  >
                    <span className="group-hover:pl-2 transition-all duration-500">{link.name}</span>
                  </Link>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-6 animate-fade-in-left" style={{ animationDelay: '0.4s' }}>
            <h3 className="font-display font-bold text-white text-lg">Contact Info</h3>
            <div className="space-y-4">
              {[
                { icon: Mail, text: "hello@kidscorner.com" },
                { icon: Phone, text: "+1 (555) 123-4567" },
                { icon: MapPin, text: "123 Fashion St, Style City" }
              ].map((contact, index) => (
                <div
                  key={index}
                  className="flex items-center space-x-3 text-sm text-gray-300 group animate-fade-in-left hover:translate-x-1 transition-transform duration-300"
                  style={{ animationDelay: `${0.7 + index * 0.1}s` }}
                >
                  <div className="hover:scale-125 hover:rotate-5 transition-all duration-500">
                    <contact.icon className="h-5 w-5 text-blue-400 group-hover:text-blue-300 transition-colors duration-500" />
                  </div>
                  <span className="group-hover:text-white transition-colors duration-500">{contact.text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-gray-700/50 animate-fade-in-up" style={{ animationDelay: '0.8s' }}>
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="flex items-center space-x-2 hover:scale-105 transition-transform duration-500">
              <p className="text-sm text-gray-400 font-body">
                © 2024 KidsCorner. Made with
              </p>
              <div className="animate-pulse">
                <Heart className="h-4 w-4 text-red-500 fill-current" />
              </div>
              <p className="text-sm text-gray-400 font-body">
                for amazing kids.
              </p>
            </div>
            <div className="flex space-x-6 text-sm">
              {[
                { name: "Privacy Policy", href: "#" },
                { name: "Terms of Service", href: "#" },
                { name: "Cookie Policy", href: "#" }
              ].map((link, index) => (
                <div key={link.name} className="hover:scale-105 transition-transform duration-500">
                  <Link 
                    href={link.href} 
                    className="text-gray-400 hover:text-blue-400 transition-colors duration-500 font-body"
                  >
                    {link.name}
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
