import type React from "react"
import type { Metadata } from "next"
import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"
import { Analytics } from "@vercel/analytics/next"
import "./globals.css"
import { CartProvider } from "@/contexts/cart-context"
import { Toaster } from "@/components/ui/toaster"
import { Suspense } from "react"
import { ThemeProvider } from "@/components/theme-provider"
import { AOSProvider } from "@/components/aos-provider"

export const metadata: Metadata = {
  title: "KidsCorner - Luxe Fashion for Kids",
  description: "Modern, playful clothing for boys and girls",
  generator: "v0.app",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`font-body ${GeistSans.variable} ${GeistMono.variable} antialiased`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          <AOSProvider>
            <Suspense fallback={null}>
              <CartProvider>
                {children}
                <Toaster />
              </CartProvider>
            </Suspense>
          </AOSProvider>
        </ThemeProvider>
        <Analytics />
      </body>
    </html>
  )
}
