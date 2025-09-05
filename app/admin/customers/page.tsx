"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Search, Mail, Phone, MapPin, Package } from "lucide-react"
import type { Order } from "@/lib/types"

interface Customer {
  id: string
  name: string
  email: string
  phone: string
  address: string
  totalOrders: number
  totalSpent: number
  lastOrderDate: string
}

export default function CustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [filteredCustomers, setFilteredCustomers] = useState<Customer[]>([])

  useEffect(() => {
    // Get orders from localStorage and extract customer data
    const savedOrders = localStorage.getItem("orders")
    if (savedOrders) {
      const orders: Order[] = JSON.parse(savedOrders)

      // Group orders by customer email to create customer profiles
      const customerMap = new Map<string, Customer>()

      orders.forEach((order) => {
        const existing = customerMap.get(order.customerInfo.email)
        if (existing) {
          existing.totalOrders += 1
          existing.totalSpent += order.total
          if (new Date(order.createdAt) > new Date(existing.lastOrderDate)) {
            existing.lastOrderDate = order.createdAt
          }
        } else {
          customerMap.set(order.customerInfo.email, {
            id: order.customerInfo.email,
            name: order.customerInfo.name,
            email: order.customerInfo.email,
            phone: order.customerInfo.phone,
            address: order.customerInfo.address,
            totalOrders: 1,
            totalSpent: order.total,
            lastOrderDate: order.createdAt,
          })
        }
      })

      const customerList = Array.from(customerMap.values())
      setCustomers(customerList)
      setFilteredCustomers(customerList)
    }
  }, [])

  useEffect(() => {
    const filtered = customers.filter(
      (customer) =>
        customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        customer.phone.includes(searchTerm),
    )
    setFilteredCustomers(filtered)
  }, [searchTerm, customers])

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Customers</h1>
        <p className="text-muted-foreground">Manage your customer base and view their order history</p>
      </div>

      <div className="flex items-center space-x-2">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search customers..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-8"
          />
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filteredCustomers.map((customer) => (
          <Card key={customer.id} className="hover:shadow-md transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span className="truncate">{customer.name}</span>
                <Badge variant="secondary">{customer.totalOrders} orders</Badge>
              </CardTitle>
              <CardDescription>Customer since {new Date(customer.lastOrderDate).toLocaleDateString()}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center space-x-2 text-sm">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <span className="truncate">{customer.email}</span>
              </div>
              <div className="flex items-center space-x-2 text-sm">
                <Phone className="h-4 w-4 text-muted-foreground" />
                <span>{customer.phone}</span>
              </div>
              <div className="flex items-center space-x-2 text-sm">
                <MapPin className="h-4 w-4 text-muted-foreground" />
                <span className="truncate">{customer.address}</span>
              </div>
              <div className="flex items-center justify-between pt-2 border-t">
                <div className="text-sm">
                  <span className="text-muted-foreground">Total Spent:</span>
                  <div className="font-semibold">${customer.totalSpent.toFixed(2)}</div>
                </div>
                <Button variant="outline" size="sm">
                  <Package className="h-4 w-4 mr-1" />
                  View Orders
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredCustomers.length === 0 && (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Package className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No customers found</h3>
            <p className="text-muted-foreground text-center">
              {customers.length === 0
                ? "No customers have placed orders yet."
                : "No customers match your search criteria."}
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
