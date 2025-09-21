"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { TrendingUp, TrendingDown, DollarSign, ShoppingCart, Users, Package } from "lucide-react"
import { getAllOrders, getProducts, getProductsCount, getOrdersCount, getCustomersCount, getTotalRevenue } from "@/lib/database"
import type { OrderWithItems, ProductWithDetails } from "@/lib/database.types"

interface AnalyticsData {
  totalRevenue: number
  totalOrders: number
  totalCustomers: number
  averageOrderValue: number
  revenueGrowth: number
  ordersGrowth: number
  topProducts: Array<{ product: ProductWithDetails; sales: number; revenue: number }>
  recentOrders: OrderWithItems[]
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
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const [orders, products, totalRevenue, totalOrders, totalCustomers] = await Promise.all([
          getAllOrders(),
          getProducts({ active: true }),
          getTotalRevenue(),
          getOrdersCount(),
          getCustomersCount()
        ])

        // Calculate analytics using accurate counts
        const uniqueCustomers = new Set(orders.map((order) => order.email)).size
        const averageOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0

        // Calculate product sales from order items
        const productSales = new Map<string, { sales: number; revenue: number }>()
        orders.forEach((order) => {
          order.order_items?.forEach((item) => {
            const existing = productSales.get(item.product_id || '') || { sales: 0, revenue: 0 }
            existing.sales += item.quantity
            existing.revenue += item.total_price
            productSales.set(item.product_id || '', existing)
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

        // Calculate growth (simplified - in a real app, you'd compare with previous period)
        const revenueGrowth = 0 // No growth data available yet
        const ordersGrowth = 0 // No growth data available yet

        setAnalytics({
          totalRevenue,
          totalOrders,
          totalCustomers: totalCustomers, // Use accurate count from database
          averageOrderValue,
          revenueGrowth,
          ordersGrowth,
          topProducts,
          recentOrders: orders.slice(-5).reverse(),
        })
      } catch (error) {
        console.error('Failed to fetch analytics:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchAnalytics()
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
        {growth !== undefined && growth !== 0 && (
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
        {growth === 0 && (
          <div className="text-xs text-muted-foreground">
            No growth data available
          </div>
        )}
      </CardContent>
    </Card>
  )

  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Analytics</h1>
          <p className="text-muted-foreground">Track your store's performance and sales metrics</p>
        </div>
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading analytics...</p>
          </div>
        </div>
      </div>
    )
  }

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
                    <p className="font-medium">{order.email}</p>
                    <p className="text-sm text-muted-foreground">{new Date(order.created_at || '').toLocaleDateString()}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">${order.total_amount.toFixed(2)}</p>
                    <Badge variant={order.status === "delivered" ? "default" : "secondary"}>{order.status}</Badge>
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
