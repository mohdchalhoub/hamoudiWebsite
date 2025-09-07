"use client"

import type React from "react"
import { createContext, useContext, useEffect, useState } from "react"
import type { ProductWithDetails } from "@/lib/database.types"
import { supabase } from "@/lib/supabase"
import type { User, Session } from "@supabase/supabase-js"

interface SecureAdminContextType {
  isAuthenticated: boolean
  isInitialized: boolean
  user: User | null
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>
  logout: () => Promise<void>
  products: ProductWithDetails[]
  loading: boolean
  addProduct: (product: any) => Promise<void>
  updateProduct: (id: string, product: any) => Promise<void>
  deleteProduct: (id: string) => Promise<void>
  refreshProducts: () => Promise<void>
}

const SecureAdminContext = createContext<SecureAdminContextType | undefined>(undefined)

export function SecureAdminProvider({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [user, setUser] = useState<User | null>(null)
  const [products, setProducts] = useState<ProductWithDetails[]>([])
  const [loading, setLoading] = useState(false)
  const [isInitialized, setIsInitialized] = useState(false)

  useEffect(() => {
    // Check if admin is already logged in via Supabase
    const checkAuth = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession()
        if (session?.user) {
          setUser(session.user)
          setIsAuthenticated(true)
        }
      } catch (error) {
        console.error('Error checking auth:', error)
      } finally {
        setIsInitialized(true)
      }
    }

    checkAuth()

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (session?.user) {
          setUser(session.user)
          setIsAuthenticated(true)
        } else {
          setUser(null)
          setIsAuthenticated(false)
        }
        setIsInitialized(true)
      }
    )

    return () => subscription.unsubscribe()
  }, [])

  const getAuthHeaders = async () => {
    const { data: { session } } = await supabase.auth.getSession()
    if (!session?.access_token) {
      throw new Error('No valid session')
    }
    return {
      'Authorization': `Bearer ${session.access_token}`,
      'Content-Type': 'application/json'
    }
  }

  const refreshProducts = async () => {
    if (!isAuthenticated) return
    
    setLoading(true)
    try {
      const headers = await getAuthHeaders()
      const response = await fetch('/api/admin/products', {
        method: 'GET',
        headers
      })

      if (!response.ok) {
        if (response.status === 401) {
          // Unauthorized - redirect to login
          await logout()
          return
        }
        throw new Error('Failed to fetch products')
      }

      const { products } = await response.json()
      setProducts(products)
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

  const login = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) {
        return { success: false, error: error.message }
      }

      if (data.user) {
        setUser(data.user)
        setIsAuthenticated(true)
        return { success: true }
      }

      return { success: false, error: 'Login failed' }
    } catch (error) {
      console.error('Login error:', error)
      return { success: false, error: 'An unexpected error occurred' }
    }
  }

  const logout = async () => {
    try {
      await supabase.auth.signOut()
      setUser(null)
      setIsAuthenticated(false)
      setProducts([])
    } catch (error) {
      console.error('Logout error:', error)
    }
  }

  const addProduct = async (productData: any) => {
    try {
      const headers = await getAuthHeaders()
      const response = await fetch('/api/admin/products', {
        method: 'POST',
        headers,
        body: JSON.stringify(productData)
      })

      if (!response.ok) {
        if (response.status === 401) {
          await logout()
          throw new Error('Unauthorized')
        }
        const { error } = await response.json()
        throw new Error(error || 'Failed to add product')
      }

      await refreshProducts()
    } catch (error) {
      console.error('Failed to add product:', error)
      throw error
    }
  }

  const updateProduct = async (id: string, productData: any) => {
    try {
      const headers = await getAuthHeaders()
      const response = await fetch(`/api/admin/products/${id}`, {
        method: 'PUT',
        headers,
        body: JSON.stringify(productData)
      })

      if (!response.ok) {
        if (response.status === 401) {
          await logout()
          throw new Error('Unauthorized')
        }
        const { error } = await response.json()
        throw new Error(error || 'Failed to update product')
      }

      await refreshProducts()
    } catch (error) {
      console.error('Failed to update product:', error)
      throw error
    }
  }

  const deleteProduct = async (id: string) => {
    try {
      const headers = await getAuthHeaders()
      const response = await fetch(`/api/admin/products/${id}`, {
        method: 'DELETE',
        headers
      })

      if (!response.ok) {
        if (response.status === 401) {
          await logout()
          throw new Error('Unauthorized')
        }
        const { error } = await response.json()
        throw new Error(error || 'Failed to delete product')
      }

      await refreshProducts()
    } catch (error) {
      console.error('Failed to delete product:', error)
      throw error
    }
  }

  return (
    <SecureAdminContext.Provider
      value={{
        isAuthenticated,
        isInitialized,
        user,
        login,
        logout,
        products,
        loading,
        addProduct,
        updateProduct,
        deleteProduct,
        refreshProducts,
      }}
    >
      {children}
    </SecureAdminContext.Provider>
  )
}

export function useSecureAdmin() {
  const context = useContext(SecureAdminContext)
  if (context === undefined) {
    throw new Error("useSecureAdmin must be used within a SecureAdminProvider")
  }
  return context
}
