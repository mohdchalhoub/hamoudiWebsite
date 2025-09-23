"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import { useAdmin } from "@/contexts/admin-context"
import { Save, User, Store, Bell, Shield } from "lucide-react"

interface SiteSettings {
  siteName: string
  siteDescription: string
  contactEmail: string
  contactPhone: string
  address: string
  currency: string
  taxRate: number
  emailNotifications: boolean
  orderNotifications: boolean
  lowStockAlerts: boolean
  maintenanceMode: boolean
}

export default function SettingsPage() {
  const { logout } = useAdmin()
  const [settings, setSettings] = useState<SiteSettings>({
    siteName: "Kids Fashion Store",
    siteDescription: "Fun fashion for amazing kids",
    contactEmail: "info@kidsfashion.com",
    contactPhone: "+1 (555) 123-4567",
    address: "123 Fashion Street, Style City, SC 12345",
    currency: "USD",
    taxRate: 8.5,
    emailNotifications: true,
    orderNotifications: true,
    lowStockAlerts: true,
    maintenanceMode: false,
  })

  const [adminProfile, setAdminProfile] = useState({
    name: "Admin User",
    email: "admin@kidsfashion.com",
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  })

  const [isSaving, setIsSaving] = useState(false)

  useEffect(() => {
    // Load settings from localStorage
    const savedSettings = localStorage.getItem("site-settings")
    if (savedSettings) {
      setSettings(JSON.parse(savedSettings))
    }

    const savedProfile = localStorage.getItem("admin-profile")
    if (savedProfile) {
      const profile = JSON.parse(savedProfile)
      setAdminProfile((prev) => ({ ...prev, ...profile, currentPassword: "", newPassword: "", confirmPassword: "" }))
    }
  }, [])

  const handleSettingsChange = (key: keyof SiteSettings, value: any) => {
    setSettings((prev) => ({ ...prev, [key]: value }))
  }

  const handleProfileChange = (key: string, value: string) => {
    setAdminProfile((prev) => ({ ...prev, [key]: value }))
  }

  const saveSettings = async () => {
    setIsSaving(true)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))

    localStorage.setItem("site-settings", JSON.stringify(settings))
    localStorage.setItem(
      "admin-profile",
      JSON.stringify({
        name: adminProfile.name,
        email: adminProfile.email,
      }),
    )

    setIsSaving(false)

    // Reset password fields
    setAdminProfile((prev) => ({
      ...prev,
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    }))
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Settings</h1>
        <p className="text-muted-foreground">Manage your store settings and admin profile</p>
      </div>

      <div className="grid gap-6">
        {/* Admin Profile */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <User className="h-5 w-5" />
              <span>Admin Profile</span>
            </CardTitle>
            <CardDescription>Update your admin account information</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="admin-name">Name</Label>
                <Input
                  id="admin-name"
                  value={adminProfile.name}
                  onChange={(e) => handleProfileChange("name", e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="admin-email">Email</Label>
                <Input
                  id="admin-email"
                  type="email"
                  value={adminProfile.email}
                  onChange={(e) => handleProfileChange("email", e.target.value)}
                />
              </div>
            </div>

            <Separator />

            <div className="space-y-4">
              <h4 className="font-medium">Change Password</h4>
              <div className="grid gap-4 md:grid-cols-3">
                <div className="space-y-2">
                  <Label htmlFor="current-password">Current Password</Label>
                  <Input
                    id="current-password"
                    type="password"
                    value={adminProfile.currentPassword}
                    onChange={(e) => handleProfileChange("currentPassword", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="new-password">New Password</Label>
                  <Input
                    id="new-password"
                    type="password"
                    value={adminProfile.newPassword}
                    onChange={(e) => handleProfileChange("newPassword", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirm-password">Confirm Password</Label>
                  <Input
                    id="confirm-password"
                    type="password"
                    value={adminProfile.confirmPassword}
                    onChange={(e) => handleProfileChange("confirmPassword", e.target.value)}
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Store Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Store className="h-5 w-5" />
              <span>Store Information</span>
            </CardTitle>
            <CardDescription>Basic information about your store</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="site-name">Store Name</Label>
                <Input
                  id="site-name"
                  value={settings.siteName}
                  onChange={(e) => handleSettingsChange("siteName", e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="contact-email">Contact Email</Label>
                <Input
                  id="contact-email"
                  type="email"
                  value={settings.contactEmail}
                  onChange={(e) => handleSettingsChange("contactEmail", e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="site-description">Store Description</Label>
              <Textarea
                id="site-description"
                value={settings.siteDescription}
                onChange={(e) => handleSettingsChange("siteDescription", e.target.value)}
                rows={3}
              />
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="contact-phone">Contact Phone</Label>
                <Input
                  id="contact-phone"
                  value={settings.contactPhone}
                  onChange={(e) => handleSettingsChange("contactPhone", e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="currency">Currency</Label>
                <Input
                  id="currency"
                  value={settings.currency}
                  onChange={(e) => handleSettingsChange("currency", e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="address">Store Address</Label>
              <Textarea
                id="address"
                value={settings.address}
                onChange={(e) => handleSettingsChange("address", e.target.value)}
                rows={2}
              />
            </div>
          </CardContent>
        </Card>

        {/* Pricing */}
        <Card>
          <CardHeader>
            <CardTitle>Pricing</CardTitle>
            <CardDescription>Configure pricing options</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-1">
              <div className="space-y-2">
                <Label htmlFor="tax-rate">Tax Rate (%)</Label>
                <Input
                  id="tax-rate"
                  type="number"
                  step="0.1"
                  value={settings.taxRate}
                  onChange={(e) => handleSettingsChange("taxRate", Number.parseFloat(e.target.value) || 0)}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Notifications */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Bell className="h-5 w-5" />
              <span>Notifications</span>
            </CardTitle>
            <CardDescription>Configure notification preferences</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Email Notifications</Label>
                <p className="text-sm text-muted-foreground">Receive email notifications for important events</p>
              </div>
              <Switch
                checked={settings.emailNotifications}
                onCheckedChange={(checked) => handleSettingsChange("emailNotifications", checked)}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Order Notifications</Label>
                <p className="text-sm text-muted-foreground">Get notified when new orders are placed</p>
              </div>
              <Switch
                checked={settings.orderNotifications}
                onCheckedChange={(checked) => handleSettingsChange("orderNotifications", checked)}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Low Stock Alerts</Label>
                <p className="text-sm text-muted-foreground">Alert when products are running low</p>
              </div>
              <Switch
                checked={settings.lowStockAlerts}
                onCheckedChange={(checked) => handleSettingsChange("lowStockAlerts", checked)}
              />
            </div>
          </CardContent>
        </Card>

        {/* System */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Shield className="h-5 w-5" />
              <span>System</span>
            </CardTitle>
            <CardDescription>System-wide settings and security</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Maintenance Mode</Label>
                <p className="text-sm text-muted-foreground">Temporarily disable the store for maintenance</p>
              </div>
              <Switch
                checked={settings.maintenanceMode}
                onCheckedChange={(checked) => handleSettingsChange("maintenanceMode", checked)}
              />
            </div>

            <Separator />

            <div className="flex justify-between items-center">
              <div>
                <h4 className="font-medium">Admin Session</h4>
                <p className="text-sm text-muted-foreground">Sign out of the admin dashboard</p>
              </div>
              <Button variant="outline" onClick={logout}>
                Sign Out
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Save Button */}
        <div className="flex justify-end">
          <Button onClick={saveSettings} disabled={isSaving} className="min-w-32">
            {isSaving ? (
              <>Saving...</>
            ) : (
              <>
                <Save className="h-4 w-4 mr-2" />
                Save Changes
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  )
}
