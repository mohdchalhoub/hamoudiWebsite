"use client"

import type React from "react"
import { createContext, useContext, useEffect, useState } from "react"
import type { Product } from "@/lib/types"
import { mockProducts } from "@/lib/mock-data"

interface AdminContextType {
  isAuthenticated: boolean
  login: (username: string, password: string) => boolean
  logout: () => void
  products: Product[]
  addProduct: (product: Omit<Product, "id">) => void
  updateProduct: (id: string, product: Partial<Product>) => void
  deleteProduct: (id: string) => void
}

const AdminContext = createContext<AdminContextType | undefined>(undefined)

// Simple admin credentials (in a real app, this would be handled by a proper auth system)
const ADMIN_CREDENTIALS = {
  username: "admin",
  password: "admin123",
}

export function AdminProvider({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [products, setProducts] = useState<Product[]>([])

  useEffect(() => {
    // Check if admin is already logged in
    const adminAuth = localStorage.getItem("admin-auth")
    if (adminAuth === "true") {
      setIsAuthenticated(true)
    }

    const savedProducts = localStorage.getItem("admin-products")
    if (savedProducts) {
      setProducts(JSON.parse(savedProducts))
    } else {
      setProducts(mockProducts)
      localStorage.setItem("admin-products", JSON.stringify(mockProducts))
    }
  }, [])

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
  }

  const addProduct = (productData: Omit<Product, "id">) => {
    const newProduct: Product = {
      ...productData,
      id: Date.now().toString(), // Simple ID generation
    }
    const updatedProducts = [...products, newProduct]
    setProducts(updatedProducts)
    localStorage.setItem("admin-products", JSON.stringify(updatedProducts))
  }

  const updateProduct = (id: string, productData: Partial<Product>) => {
    const updatedProducts = products.map((product) => (product.id === id ? { ...product, ...productData } : product))
    setProducts(updatedProducts)
    localStorage.setItem("admin-products", JSON.stringify(updatedProducts))
  }

  const deleteProduct = (id: string) => {
    const updatedProducts = products.filter((product) => product.id !== id)
    setProducts(updatedProducts)
    localStorage.setItem("admin-products", JSON.stringify(updatedProducts))
  }

  return (
    <AdminContext.Provider
      value={{
        isAuthenticated,
        login,
        logout,
        products,
        addProduct,
        updateProduct,
        deleteProduct,
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
