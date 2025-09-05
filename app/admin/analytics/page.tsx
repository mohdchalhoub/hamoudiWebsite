"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { TrendingUp, TrendingDown, DollarSign, ShoppingCart, Users, Package } from "lucide-react"
import type { Order, Product } from "@/lib/types"

interface AnalyticsData {
  totalRevenue: number
  totalOrders: number
  totalCustomers: number
  averageOrderValue: number
  revenueGrowth: number
  ordersGrowth: number
  topProducts: Array<{ product: Product; sales: number; revenue: number }>
  recentOrders: Order[]
}

export default function AnalyticsPage() {
  const [analytics, setAnalytics] = useState<AnalyticsData>({
    totalRevenue: 0,
    totalOrders: 0,
    totalCustomers: 0,
    averageOrderValue: 0,
    revenueGrowth: 0,
    ordersGrowth: 0,
    topProducts: [],
    recentOrders: [],
  })

  useEffect(() => {
    // Get data from localStorage
    const savedOrders = localStorage.getItem("orders")
    const savedProducts = localStorage.getItem("admin-products")

    if (savedOrders && savedProducts) {
      const orders: Order[] = JSON.parse(savedOrders)
      const products: Product[] = JSON.parse(savedProducts)

      // Calculate analytics
      const totalRevenue = orders.reduce((sum, order) => sum + order.total, 0)
      const totalOrders = orders.length
      const uniqueCustomers = new Set(orders.map((order) => order.customerInfo.email)).size
      const averageOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0

      // Calculate product sales
      const productSales = new Map<string, { sales: number; revenue: number }>()
      orders.forEach((order) => {
        order.items.forEach((item) => {
          const existing = productSales.get(item.id) || { sales: 0, revenue: 0 }
          existing.sales += item.quantity
          existing.revenue += item.price * item.quantity
          productSales.set(item.id, existing)
        })
      })

      // Get top products
      const topProducts = Array.from(productSales.entries())
        .map(([productId, data]) => ({
          product: products.find((p) => p.id === productId)!,
          sales: data.sales,
          revenue: data.revenue,
        }))
        .filter((item) => item.product)
        .sort((a, b) => b.revenue - a.revenue)
        .slice(0, 5)

      // Mock growth calculations (in a real app, you'd compare with previous period)
      const revenueGrowth = Math.random() * 20 - 5 // Random between -5% and 15%
      const ordersGrowth = Math.random() * 25 - 10 // Random between -10% and 15%

      setAnalytics({
        totalRevenue,
        totalOrders,
        totalCustomers: uniqueCustomers,
        averageOrderValue,
        revenueGrowth,
        ordersGrowth,
        topProducts,
        recentOrders: orders.slice(-5).reverse(),
      })
    }
  }, [])

  const StatCard = ({
    title,
    value,
    icon: Icon,
    growth,
    prefix = "",
    suffix = "",
  }: {
    title: string
    value: number
    icon: any
    growth?: number
    prefix?: string
    suffix?: string
  }) => (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">
          {prefix}
          {typeof value === "number" ? value.toLocaleString() : value}
          {suffix}
        </div>
        {growth !== undefined && (
          <div className="flex items-center text-xs text-muted-foreground">
            {growth >= 0 ? (
              <TrendingUp className="h-3 w-3 mr-1 text-green-500" />
            ) : (
              <TrendingDown className="h-3 w-3 mr-1 text-red-500" />
            )}
            <span className={growth >= 0 ? "text-green-500" : "text-red-500"}>{Math.abs(growth).toFixed(1)}%</span>
            <span className="ml-1">from last month</span>
          </div>
        )}
      </CardContent>
    </Card>
  )

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Analytics</h1>
        <p className="text-muted-foreground">Track your store's performance and sales metrics</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Revenue"
          value={analytics.totalRevenue}
          icon={DollarSign}
          growth={analytics.revenueGrowth}
          prefix="$"
        />
        <StatCard
          title="Total Orders"
          value={analytics.totalOrders}
          icon={ShoppingCart}
          growth={analytics.ordersGrowth}
        />
        <StatCard title="Customers" value={analytics.totalCustomers} icon={Users} />
        <StatCard title="Avg. Order Value" value={analytics.averageOrderValue} icon={Package} prefix="$" />
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Top Products</CardTitle>
            <CardDescription>Best performing products by revenue</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {analytics.topProducts.map((item, index) => (
                <div key={item.product.id} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Badge
                      variant="secondary"
                      className="w-6 h-6 rounded-full p-0 flex items-center justify-center text-xs"
                    >
                      {index + 1}
                    </Badge>
                    <div>
                      <p className="font-medium">{item.product.name}</p>
                      <p className="text-sm text-muted-foreground">{item.sales} sold</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">${item.revenue.toFixed(2)}</p>
                  </div>
                </div>
              ))}
              {analytics.topProducts.length === 0 && (
                <p className="text-muted-foreground text-center py-4">No sales data available</p>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Orders</CardTitle>
            <CardDescription>Latest customer orders</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {analytics.recentOrders.map((order) => (
                <div key={order.id} className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">{order.customerInfo.name}</p>
                    <p className="text-sm text-muted-foreground">{new Date(order.createdAt).toLocaleDateString()}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">${order.total.toFixed(2)}</p>
                    <Badge variant={order.status === "completed" ? "default" : "secondary"}>{order.status}</Badge>
                  </div>
                </div>
              ))}
              {analytics.recentOrders.length === 0 && (
                <p className="text-muted-foreground text-center py-4">No orders yet</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
