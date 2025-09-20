"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog"
import { useToast } from "@/hooks/use-toast"
import { Search, Plus, Eye, Edit, Trash2, Package, Phone, MapPin, Calendar, DollarSign, Loader2 } from "lucide-react"

interface Customer {
  id: string
  name: string
  phone: string
  address: string
  totalOrders: number
  totalSpent: number
  lastOrderDate: string
  firstOrderDate: string
  orders?: Array<{
    id: string
    orderNumber: string
    total: number
    status: string
    date: string
    itemsCount: number
  }>
}

interface CustomerFormData {
  firstName: string
  lastName: string
  email: string
  phone: string
}

export default function CustomersPage() {
  const router = useRouter()
  const { toast } = useToast()
  
  const [customers, setCustomers] = useState<Customer[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [filteredCustomers, setFilteredCustomers] = useState<Customer[]>([])
  const [loading, setLoading] = useState(true)
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [isViewModalOpen, setIsViewModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null)
  const [viewingCustomer, setViewingCustomer] = useState<Customer | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isLoadingCustomerDetails, setIsLoadingCustomerDetails] = useState(false)
  
  const [formData, setFormData] = useState<CustomerFormData>({
    firstName: "",
    lastName: "",
    email: "",
    phone: ""
  })

  // Fetch customers
  const fetchCustomers = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/customers')
      
      if (!response.ok) {
        throw new Error('Failed to fetch customers')
      }
      
      const data = await response.json()
      setCustomers(data.customers || [])
      setFilteredCustomers(data.customers || [])
      
    } catch (error) {
      console.error('Error fetching customers:', error)
      toast({
        title: "Error",
        description: "Failed to load customers",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  // Fetch customer details for view modal
  const fetchCustomerDetails = async (customerId: string) => {
    try {
      setIsLoadingCustomerDetails(true)
      const response = await fetch(`/api/customers/${encodeURIComponent(customerId)}`)
      
      if (!response.ok) {
        throw new Error('Failed to fetch customer details')
      }
      
      const data = await response.json()
      setViewingCustomer(data.customer)
      
    } catch (error) {
      console.error('Error fetching customer details:', error)
      toast({
        title: "Error",
        description: "Failed to load customer details",
        variant: "destructive"
      })
    } finally {
      setIsLoadingCustomerDetails(false)
    }
  }

  // Add new customer
  const handleAddCustomer = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.firstName.trim() || !formData.lastName.trim() || !formData.email.trim()) {
      toast({
        title: "Validation Error",
        description: "First name, last name, and email are required",
        variant: "destructive"
      })
      return
    }
    
    try {
      setIsSubmitting(true)
      const response = await fetch('/api/customers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })
      
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to add customer')
      }
      
      toast({
        title: "Success",
        description: "Customer added successfully"
      })
      
      setFormData({ firstName: "", lastName: "", email: "", phone: "" })
      setIsAddModalOpen(false)
      fetchCustomers()
      
    } catch (error) {
      console.error('Error adding customer:', error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to add customer",
        variant: "destructive"
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  // Edit customer
  const handleEditCustomer = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!selectedCustomer || !formData.firstName.trim() || !formData.lastName.trim() || !formData.email.trim()) {
      toast({
        title: "Validation Error",
        description: "First name, last name, and email are required",
        variant: "destructive"
      })
      return
    }
    
    try {
      setIsSubmitting(true)
      const response = await fetch(`/api/customers/${encodeURIComponent(selectedCustomer.id)}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })
      
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to update customer')
      }
      
      toast({
        title: "Success",
        description: "Customer updated successfully"
      })
      
      setIsEditModalOpen(false)
      setSelectedCustomer(null)
      fetchCustomers()
      
    } catch (error) {
      console.error('Error updating customer:', error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to update customer",
        variant: "destructive"
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  // Delete customer
  const handleDeleteCustomer = async () => {
    if (!selectedCustomer) return
    
    try {
      setIsSubmitting(true)
      const response = await fetch(`/api/customers/${encodeURIComponent(selectedCustomer.id)}`, {
        method: 'DELETE'
      })
      
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to delete customer')
      }
      
      toast({
        title: "Success",
        description: "Customer deleted successfully"
      })
      
      setIsDeleteDialogOpen(false)
      setSelectedCustomer(null)
      fetchCustomers()
      
    } catch (error) {
      console.error('Error deleting customer:', error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to delete customer",
        variant: "destructive"
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  // Handle view customer
  const handleViewCustomer = (customer: Customer) => {
    setSelectedCustomer(customer)
    fetchCustomerDetails(customer.id)
    setIsViewModalOpen(true)
  }

  // Handle edit customer
  const handleEditClick = (customer: Customer) => {
    setSelectedCustomer(customer)
    const [firstName, lastName] = customer.name.split(' ', 2)
    setFormData({
      firstName: firstName || '',
      lastName: lastName || '',
      email: customer.email || '',
      phone: customer.phone
    })
    setIsEditModalOpen(true)
  }

  // Handle delete customer
  const handleDeleteClick = (customer: Customer) => {
    setSelectedCustomer(customer)
    setIsDeleteDialogOpen(true)
  }

  // Navigate to customer's orders
  const handleViewOrders = (customer: Customer) => {
    router.push(`/admin/orders?customer=${encodeURIComponent(customer.name)}&phone=${encodeURIComponent(customer.phone)}`)
  }

  // Filter customers based on search
  useEffect(() => {
    const filtered = customers.filter(customer =>
      customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.phone.includes(searchTerm) ||
      customer.address.toLowerCase().includes(searchTerm.toLowerCase())
    )
    setFilteredCustomers(filtered)
  }, [searchTerm, customers])

  // Load customers on component mount
  useEffect(() => {
    fetchCustomers()
  }, [])

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Customers</h1>
          <p className="text-muted-foreground">
            Manage your customer base and view their order history
          </p>
        </div>
        <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Customer
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Add New Customer</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleAddCustomer} className="space-y-4">
              <div>
                <label className="text-sm font-medium">First Name *</label>
                <Input
                  value={formData.firstName}
                  onChange={(e) => setFormData(prev => ({ ...prev, firstName: e.target.value }))}
                  placeholder="First name"
                  required
                />
              </div>
              <div>
                <label className="text-sm font-medium">Last Name *</label>
                <Input
                  value={formData.lastName}
                  onChange={(e) => setFormData(prev => ({ ...prev, lastName: e.target.value }))}
                  placeholder="Last name"
                  required
                />
              </div>
              <div>
                <label className="text-sm font-medium">Email *</label>
                <Input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                  placeholder="Email address"
                  required
                />
              </div>
              <div>
                <label className="text-sm font-medium">Phone</label>
                <Input
                  value={formData.phone}
                  onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                  placeholder="Phone number"
                />
              </div>
              <div className="flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={() => setIsAddModalOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                  Add Customer
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Search */}
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
        <div className="text-sm text-muted-foreground">
          {filteredCustomers.length} of {customers.length} customers
        </div>
      </div>

      {/* Loading State */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
            <p className="text-muted-foreground">Loading customers...</p>
          </div>
        </div>
      ) : (
        <>
          {/* Customers Table */}
          {filteredCustomers.length > 0 ? (
            <Card>
              <CardHeader>
                <CardTitle>Customer List</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left p-3 font-semibold">Customer</th>
                        <th className="text-left p-3 font-semibold">Email</th>
                        <th className="text-left p-3 font-semibold">Phone</th>
                        <th className="text-left p-3 font-semibold">Orders</th>
                        <th className="text-left p-3 font-semibold">Total Spent</th>
                        <th className="text-left p-3 font-semibold">Last Order</th>
                        <th className="text-left p-3 font-semibold">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredCustomers.map((customer) => (
                        <tr key={customer.id} className="border-b hover:bg-muted/50">
                          <td className="p-3">
                            <div className="font-medium">{customer.name}</div>
                            <div className="text-sm text-muted-foreground">
                              Customer since {new Date(customer.firstOrderDate).toLocaleDateString()}
                            </div>
                          </td>
                          <td className="p-3">
                            <div className="text-sm">{customer.email}</div>
                          </td>
                          <td className="p-3">
                            <div className="flex items-center gap-2">
                              <Phone className="h-4 w-4 text-muted-foreground" />
                              {customer.phone}
                            </div>
                          </td>
                          <td className="p-3">
                            <Badge variant="secondary">
                              {customer.totalOrders} orders
                            </Badge>
                          </td>
                          <td className="p-3">
                            <div className="flex items-center gap-2">
                              <DollarSign className="h-4 w-4 text-muted-foreground" />
                              <span className="font-semibold">${customer.totalSpent.toFixed(2)}</span>
                            </div>
                          </td>
                          <td className="p-3">
                            <div className="flex items-center gap-2">
                              <Calendar className="h-4 w-4 text-muted-foreground" />
                              <span className="text-sm">
                                {new Date(customer.lastOrderDate).toLocaleDateString()}
                              </span>
                            </div>
                          </td>
                          <td className="p-3">
                            <div className="flex items-center gap-1">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleViewCustomer(customer)}
                                className="h-8 px-2"
                              >
                                <Eye className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleEditClick(customer)}
                                className="h-8 px-2"
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleViewOrders(customer)}
                                className="h-8 px-2"
                              >
                                <Package className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleDeleteClick(customer)}
                                className="h-8 px-2 text-destructive hover:text-destructive"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          ) : (
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
        </>
      )}

      {/* View Customer Modal */}
      <Dialog open={isViewModalOpen} onOpenChange={setIsViewModalOpen}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Customer Details</DialogTitle>
          </DialogHeader>
          {isLoadingCustomerDetails ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin" />
            </div>
          ) : viewingCustomer ? (
            <div className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Customer Information</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Name</label>
                      <p className="font-medium">{viewingCustomer.name}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Email</label>
                      <p>{viewingCustomer.email}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Phone</label>
                      <p>{viewingCustomer.phone}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Address</label>
                      <p>{viewingCustomer.address}</p>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Order Statistics</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Total Orders</label>
                      <p className="font-medium">{viewingCustomer.totalOrders}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Total Spent</label>
                      <p className="font-medium">${viewingCustomer.totalSpent.toFixed(2)}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">First Order</label>
                      <p>{new Date(viewingCustomer.firstOrderDate).toLocaleDateString()}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Last Order</label>
                      <p>{new Date(viewingCustomer.lastOrderDate).toLocaleDateString()}</p>
                    </div>
                  </CardContent>
                </Card>
              </div>
              
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center justify-between">
                    Order History
                    <Button
                      variant="outline"
                      onClick={() => handleViewOrders(viewingCustomer)}
                    >
                      <Package className="h-4 w-4 mr-2" />
                      View All Orders
                    </Button>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {viewingCustomer.orders && viewingCustomer.orders.length > 0 ? (
                    <div className="space-y-3">
                      {viewingCustomer.orders.slice(0, 5).map((order) => (
                        <div key={order.id} className="flex justify-between items-center p-3 border rounded-lg">
                          <div>
                            <p className="font-medium">#{order.orderNumber}</p>
                            <p className="text-sm text-muted-foreground">
                              {new Date(order.date).toLocaleDateString()} • {order.itemsCount} items
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="font-medium">${order.total.toFixed(2)}</p>
                            <Badge variant="outline">{order.status}</Badge>
                          </div>
                        </div>
                      ))}
                      {viewingCustomer.orders.length > 5 && (
                        <p className="text-sm text-muted-foreground text-center">
                          And {viewingCustomer.orders.length - 5} more orders...
                        </p>
                      )}
                    </div>
                  ) : (
                    <p className="text-muted-foreground text-center py-4">No orders found</p>
                  )}
                </CardContent>
              </Card>
            </div>
          ) : null}
        </DialogContent>
      </Dialog>

      {/* Edit Customer Modal */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Customer</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleEditCustomer} className="space-y-4">
            <div>
              <label className="text-sm font-medium">First Name *</label>
              <Input
                value={formData.firstName}
                onChange={(e) => setFormData(prev => ({ ...prev, firstName: e.target.value }))}
                placeholder="First name"
                required
              />
            </div>
            <div>
              <label className="text-sm font-medium">Last Name *</label>
              <Input
                value={formData.lastName}
                onChange={(e) => setFormData(prev => ({ ...prev, lastName: e.target.value }))}
                placeholder="Last name"
                required
              />
            </div>
            <div>
              <label className="text-sm font-medium">Email *</label>
              <Input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                placeholder="Email address"
                required
              />
            </div>
            <div>
              <label className="text-sm font-medium">Phone</label>
              <Input
                value={formData.phone}
                onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                placeholder="Phone number"
              />
            </div>
            <div className="flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={() => setIsEditModalOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                Save Changes
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Customer Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Customer</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete customer "{selectedCustomer?.name}"? 
              This will cancel all their orders and cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteCustomer}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              disabled={isSubmitting}
            >
              {isSubmitting && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              Delete Customer
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}