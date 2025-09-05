"use client"

import { Button } from "@/components/ui/button"
import { useAdmin } from "@/contexts/admin-context"
import { LogOut, Settings, User } from "lucide-react"
import Link from "next/link"

export function AdminHeader() {
  const { logout } = useAdmin()

  const handleLogout = () => {
    logout()
    window.location.href = "/admin/login"
  }

  return (
    <header className="border-b bg-background">
      <div className="flex h-16 items-center justify-between px-6">
        <div className="flex items-center space-x-4">
          <Link href="/admin" className="text-2xl font-bold text-primary">
            KidsWear Admin
          </Link>
        </div>
        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="icon">
            <Settings className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon">
            <User className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" onClick={handleLogout}>
            <LogOut className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </header>
  )
}
