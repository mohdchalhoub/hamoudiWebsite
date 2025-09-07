"use client"

import type React from "react"

import { useEffect } from "react"
import { useRouter, usePathname } from "next/navigation"
import { AdminProvider, useAdmin } from "@/contexts/admin-context"
import { AdminHeader } from "@/components/admin-header"
import { AdminSidebar } from "@/components/admin-sidebar"

function AdminLayoutContent({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isInitialized } = useAdmin()
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    // Only redirect if we've checked localStorage and user is not authenticated
    if (isInitialized && !isAuthenticated && pathname !== "/admin/login") {
      router.push("/admin/login")
    }
  }, [isAuthenticated, isInitialized, pathname, router])

  // Show loading state while checking authentication
  if (!isInitialized) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    )
  }

  if (!isAuthenticated && pathname !== "/admin/login") {
    return null
  }

  if (pathname === "/admin/login") {
    return <>{children}</>
  }

  return (
    <div className="min-h-screen bg-background">
      <AdminHeader />
      <div className="flex">
        <AdminSidebar />
        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
  )
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <AdminProvider>
      <AdminLayoutContent>{children}</AdminLayoutContent>
    </AdminProvider>
  )
}
