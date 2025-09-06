"use client"

import type React from "react"
import { createContext, useContext, useEffect, useState } from "react"
import type { ProductWithDetails } from "@/lib/database.types"
import { getProducts, createProduct, updateProduct, deleteProduct } from "@/lib/database"

interface AdminContextType {
  isAuthenticated: boolean
  login: (username: string, password: string) => boolean
  logout: () => void
  products: ProductWithDetails[]
  loading: boolean
  addProduct: (product: any) => Promise<void>
  updateProduct: (id: string, product: any) => Promise<void>
  deleteProduct: (id: string) => Promise<void>
  refreshProducts: () => Promise<void>
}

const AdminContext = createContext<AdminContextType | undefined>(undefined)

// Simple admin credentials (in a real app, this would be handled by a proper auth system)
const ADMIN_CREDENTIALS = {
  username: "admin",
  password: "admin123",
}

export function AdminProvider({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [products, setProducts] = useState<ProductWithDetails[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    // Check if admin is already logged in
    const adminAuth = localStorage.getItem("admin-auth")
    if (adminAuth === "true") {
      setIsAuthenticated(true)
    }
  }, [])

  const refreshProducts = async () => {
    if (!isAuthenticated) return
    
    setLoading(true)
    try {
      const fetchedProducts = await getProducts({ active: true })
      setProducts(fetchedProducts)
    } catch (error) {
      console.error('Failed to fetch products:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (isAuthenticated) {
      refreshProducts()
    }
  }, [isAuthenticated])

  const login = (username: string, password: string): boolean => {
    if (username === ADMIN_CREDENTIALS.username && password === ADMIN_CREDENTIALS.password) {
      setIsAuthenticated(true)
      localStorage.setItem("admin-auth", "true")
      return true
    }
    return false
  }

  const logout = () => {
    setIsAuthenticated(false)
    localStorage.removeItem("admin-auth")
    setProducts([])
  }

  const addProduct = async (productData: any) => {
    try {
      await createProduct(productData)
      await refreshProducts()
    } catch (error) {
      console.error('Failed to add product:', error)
      throw error
    }
  }

  const updateProductHandler = async (id: string, productData: any) => {
    try {
      await updateProduct(id, productData)
      await refreshProducts()
    } catch (error) {
      console.error('Failed to update product:', error)
      throw error
    }
  }

  const deleteProductHandler = async (id: string) => {
    try {
      await deleteProduct(id)
      await refreshProducts()
    } catch (error) {
      console.error('Failed to delete product:', error)
      throw error
    }
  }

  return (
    <AdminContext.Provider
      value={{
        isAuthenticated,
        login,
        logout,
        products,
        loading,
        addProduct,
        updateProduct: updateProductHandler,
        deleteProduct: deleteProductHandler,
        refreshProducts,
      }}
    >
      {children}
    </AdminContext.Provider>
  )
}

export function useAdmin() {
  const context = useContext(AdminContext)
  if (context === undefined) {
    throw new Error("useAdmin must be used within an AdminProvider")
  }
  return context
}
