export interface Database {
  public: {
    Tables: {
      categories: {
        Row: {
          id: string
          name: string
          slug: string
          description: string | null
          image_url: string | null
          sort_order: number
          is_active: boolean
          created_at: string | null
          updated_at: string | null
        }
        Insert: {
          id?: string
          name: string
          slug: string
          description?: string | null
          image_url?: string | null
          sort_order?: number
          is_active?: boolean
          created_at?: string | null
          updated_at?: string | null
        }
        Update: {
          id?: string
          name?: string
          slug?: string
          description?: string | null
          image_url?: string | null
          sort_order?: number
          is_active?: boolean
          created_at?: string | null
          updated_at?: string | null
        }
      }
      products: {
        Row: {
          id: string
          name: string
          slug: string
          description: string | null
          short_description: string | null
          price: number
          compare_at_price: number | null
          category_id: string | null
          gender: 'boys' | 'girls' | 'unisex'
          age_range: string
          brand: string | null
          material: string | null
          care_instructions: string | null
          images: string[]
          videos: string[]
          product_code: string | null
          is_featured: boolean
          is_active: boolean
          is_digital: boolean
          on_sale: boolean
          weight_grams: number | null
          dimensions_cm: any | null
          seo_title: string | null
          seo_description: string | null
          created_at: string | null
          updated_at: string | null
        }
        Insert: {
          id?: string
          name: string
          slug: string
          description?: string | null
          short_description?: string | null
          price: number
          compare_at_price?: number | null
          category_id?: string | null
          gender: 'boys' | 'girls' | 'unisex'
          age_range?: string
          brand?: string | null
          material?: string | null
          care_instructions?: string | null
          images?: string[]
          videos?: string[]
          product_code?: string | null
          is_featured?: boolean
          is_active?: boolean
          is_digital?: boolean
          on_sale?: boolean
          weight_grams?: number | null
          dimensions_cm?: any | null
          seo_title?: string | null
          seo_description?: string | null
          created_at?: string | null
          updated_at?: string | null
        }
        Update: {
          id?: string
          name?: string
          slug?: string
          description?: string | null
          short_description?: string | null
          price?: number
          compare_at_price?: number | null
          category_id?: string | null
          gender?: 'boys' | 'girls' | 'unisex'
          age_range?: string
          brand?: string | null
          material?: string | null
          care_instructions?: string | null
          images?: string[]
          videos?: string[]
          product_code?: string | null
          is_featured?: boolean
          is_active?: boolean
          is_digital?: boolean
          on_sale?: boolean
          weight_grams?: number | null
          dimensions_cm?: any | null
          seo_title?: string | null
          seo_description?: string | null
          created_at?: string | null
          updated_at?: string | null
        }
      }
      product_variants: {
        Row: {
          id: string
          product_id: string
          sku: string | null
          size: string | null
          age_range: string | null
          color: string
          color_hex: string | null
          variant_code: string | null
          stock_quantity: number
          price_adjustment: number
          weight_adjustment: number
          is_active: boolean
          created_at: string | null
        }
        Insert: {
          id?: string
          product_id: string
          sku?: string | null
          size?: string | null
          age_range?: string | null
          color: string
          color_hex?: string | null
          variant_code?: string | null
          stock_quantity?: number
          price_adjustment?: number
          weight_adjustment?: number
          is_active?: boolean
          created_at?: string | null
        }
        Update: {
          id?: string
          product_id?: string
          sku?: string | null
          size?: string | null
          age_range?: string | null
          color?: string
          color_hex?: string | null
          variant_code?: string | null
          stock_quantity?: number
          price_adjustment?: number
          weight_adjustment?: number
          is_active?: boolean
          created_at?: string | null
        }
      }
      customers: {
        Row: {
          id: string
          user_id: string | null
          email: string
          first_name: string
          last_name: string
          phone: string | null
          date_of_birth: string | null
          gender: 'male' | 'female' | 'other' | null
          newsletter_subscribed: boolean
          marketing_consent: boolean
          created_at: string | null
          updated_at: string | null
        }
        Insert: {
          id?: string
          user_id?: string | null
          email: string
          first_name: string
          last_name: string
          phone?: string | null
          date_of_birth?: string | null
          gender?: 'male' | 'female' | 'other' | null
          newsletter_subscribed?: boolean
          marketing_consent?: boolean
          created_at?: string | null
          updated_at?: string | null
        }
        Update: {
          id?: string
          user_id?: string | null
          email?: string
          first_name?: string
          last_name?: string
          phone?: string | null
          date_of_birth?: string | null
          gender?: 'male' | 'female' | 'other' | null
          newsletter_subscribed?: boolean
          marketing_consent?: boolean
          created_at?: string | null
          updated_at?: string | null
        }
      }
      addresses: {
        Row: {
          id: string
          customer_id: string
          type: 'shipping' | 'billing'
          first_name: string
          last_name: string
          company: string | null
          address_line_1: string
          address_line_2: string | null
          city: string
          state: string
          postal_code: string
          country: string
          phone: string | null
          is_default: boolean
          created_at: string | null
          updated_at: string | null
        }
        Insert: {
          id?: string
          customer_id: string
          type: 'shipping' | 'billing'
          first_name: string
          last_name: string
          company?: string | null
          address_line_1: string
          address_line_2?: string | null
          city: string
          state: string
          postal_code: string
          country?: string
          phone?: string | null
          is_default?: boolean
          created_at?: string | null
          updated_at?: string | null
        }
        Update: {
          id?: string
          customer_id?: string
          type?: 'shipping' | 'billing'
          first_name?: string
          last_name?: string
          company?: string | null
          address_line_1?: string
          address_line_2?: string | null
          city?: string
          state?: string
          postal_code?: string
          country?: string
          phone?: string | null
          is_default?: boolean
          created_at?: string | null
          updated_at?: string | null
        }
      }
      cart_items: {
        Row: {
          id: string
          customer_id: string | null
          session_id: string | null
          product_id: string
          variant_id: string | null
          quantity: number
          created_at: string | null
          updated_at: string | null
        }
        Insert: {
          id?: string
          customer_id?: string | null
          session_id?: string | null
          product_id: string
          variant_id?: string | null
          quantity?: number
          created_at?: string | null
          updated_at?: string | null
        }
        Update: {
          id?: string
          customer_id?: string | null
          session_id?: string | null
          product_id?: string
          variant_id?: string | null
          quantity?: number
          created_at?: string | null
          updated_at?: string | null
        }
      }
      orders: {
        Row: {
          id: string
          order_number: string
          customer_id: string | null
          email: string
          status: 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled' | 'refunded'
          payment_status: 'pending' | 'paid' | 'failed' | 'refunded' | 'partially_refunded' | null
          payment_method: string | null
          payment_reference: string | null
          subtotal: number
          tax_amount: number
          shipping_amount: number
          discount_amount: number
          total_amount: number
          currency: string
          shipping_address: any
          billing_address: any | null
          notes: string | null
          tracking_number: string | null
          shipped_at: string | null
          delivered_at: string | null
          created_at: string | null
          updated_at: string | null
        }
        Insert: {
          id?: string
          order_number?: string
          customer_id?: string | null
          email: string
          status?: 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled' | 'refunded'
          payment_status?: 'pending' | 'paid' | 'failed' | 'refunded' | 'partially_refunded' | null
          payment_method?: string | null
          payment_reference?: string | null
          subtotal: number
          tax_amount?: number
          shipping_amount?: number
          discount_amount?: number
          total_amount: number
          currency?: string
          shipping_address: any
          billing_address?: any | null
          notes?: string | null
          tracking_number?: string | null
          shipped_at?: string | null
          delivered_at?: string | null
          created_at?: string | null
          updated_at?: string | null
        }
        Update: {
          id?: string
          order_number?: string
          customer_id?: string | null
          email?: string
          status?: 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled' | 'refunded'
          payment_status?: 'pending' | 'paid' | 'failed' | 'refunded' | 'partially_refunded' | null
          payment_method?: string | null
          payment_reference?: string | null
          subtotal?: number
          tax_amount?: number
          shipping_amount?: number
          discount_amount?: number
          total_amount?: number
          currency?: string
          shipping_address?: any
          billing_address?: any | null
          notes?: string | null
          tracking_number?: string | null
          shipped_at?: string | null
          delivered_at?: string | null
          created_at?: string | null
          updated_at?: string | null
        }
      }
      order_items: {
        Row: {
          id: string
          order_id: string
          product_id: string | null
          variant_id: string | null
          product_name: string
          product_sku: string | null
          variant_description: string | null
          quantity: number
          unit_price: number
          total_price: number
          created_at: string | null
        }
        Insert: {
          id?: string
          order_id: string
          product_id?: string | null
          variant_id?: string | null
          product_name: string
          product_sku?: string | null
          variant_description?: string | null
          quantity: number
          unit_price: number
          total_price: number
          created_at?: string | null
        }
        Update: {
          id?: string
          order_id?: string
          product_id?: string | null
          variant_id?: string | null
          product_name?: string
          product_sku?: string | null
          variant_description?: string | null
          quantity?: number
          unit_price?: number
          total_price?: number
          created_at?: string | null
        }
      }
      reviews: {
        Row: {
          id: string
          product_id: string
          customer_id: string | null
          order_id: string | null
          rating: number
          title: string | null
          comment: string | null
          is_verified_purchase: boolean
          is_approved: boolean
          helpful_count: number
          created_at: string | null
          updated_at: string | null
        }
        Insert: {
          id?: string
          product_id: string
          customer_id?: string | null
          order_id?: string | null
          rating: number
          title?: string | null
          comment?: string | null
          is_verified_purchase?: boolean
          is_approved?: boolean
          helpful_count?: number
          created_at?: string | null
          updated_at?: string | null
        }
        Update: {
          id?: string
          product_id?: string
          customer_id?: string | null
          order_id?: string | null
          rating?: number
          title?: string | null
          comment?: string | null
          is_verified_purchase?: boolean
          is_approved?: boolean
          helpful_count?: number
          created_at?: string | null
          updated_at?: string | null
        }
      }
      wishlist_items: {
        Row: {
          id: string
          customer_id: string
          product_id: string
          created_at: string | null
        }
        Insert: {
          id?: string
          customer_id: string
          product_id: string
          created_at?: string | null
        }
        Update: {
          id?: string
          customer_id?: string
          product_id?: string
          created_at?: string | null
        }
      }
      coupons: {
        Row: {
          id: string
          code: string
          name: string
          description: string | null
          type: 'percentage' | 'fixed_amount' | 'free_shipping'
          value: number
          minimum_amount: number
          maximum_discount: number | null
          usage_limit: number | null
          used_count: number
          is_active: boolean
          starts_at: string | null
          expires_at: string | null
          created_at: string | null
          updated_at: string | null
        }
        Insert: {
          id?: string
          code: string
          name: string
          description?: string | null
          type: 'percentage' | 'fixed_amount' | 'free_shipping'
          value: number
          minimum_amount?: number
          maximum_discount?: number | null
          usage_limit?: number | null
          used_count?: number
          is_active?: boolean
          starts_at?: string | null
          expires_at?: string | null
          created_at?: string | null
          updated_at?: string | null
        }
        Update: {
          id?: string
          code?: string
          name?: string
          description?: string | null
          type?: 'percentage' | 'fixed_amount' | 'free_shipping'
          value?: number
          minimum_amount?: number
          maximum_discount?: number | null
          usage_limit?: number | null
          used_count?: number
          is_active?: boolean
          starts_at?: string | null
          expires_at?: string | null
          created_at?: string | null
          updated_at?: string | null
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}

// Convenience types
export type Category = Database['public']['Tables']['categories']['Row']
export type CategoryInsert = Database['public']['Tables']['categories']['Insert']
export type CategoryUpdate = Database['public']['Tables']['categories']['Update']

export type Product = Database['public']['Tables']['products']['Row']
export type ProductInsert = Database['public']['Tables']['products']['Insert']
export type ProductUpdate = Database['public']['Tables']['products']['Update']

export type ProductVariant = Database['public']['Tables']['product_variants']['Row']
export type ProductVariantInsert = Database['public']['Tables']['product_variants']['Insert']
export type ProductVariantUpdate = Database['public']['Tables']['product_variants']['Update']

export type Customer = Database['public']['Tables']['customers']['Row']
export type CustomerInsert = Database['public']['Tables']['customers']['Insert']
export type CustomerUpdate = Database['public']['Tables']['customers']['Update']

export type Address = Database['public']['Tables']['addresses']['Row']
export type AddressInsert = Database['public']['Tables']['addresses']['Insert']
export type AddressUpdate = Database['public']['Tables']['addresses']['Update']

export type CartItem = Database['public']['Tables']['cart_items']['Row']
export type CartItemInsert = Database['public']['Tables']['cart_items']['Insert']
export type CartItemUpdate = Database['public']['Tables']['cart_items']['Update']

export type Order = Database['public']['Tables']['orders']['Row']
export type OrderInsert = Database['public']['Tables']['orders']['Insert']
export type OrderUpdate = Database['public']['Tables']['orders']['Update']

export type OrderItem = Database['public']['Tables']['order_items']['Row']
export type OrderItemInsert = Database['public']['Tables']['order_items']['Insert']
export type OrderItemUpdate = Database['public']['Tables']['order_items']['Update']

export type Review = Database['public']['Tables']['reviews']['Row']
export type ReviewInsert = Database['public']['Tables']['reviews']['Insert']
export type ReviewUpdate = Database['public']['Tables']['reviews']['Update']

export type WishlistItem = Database['public']['Tables']['wishlist_items']['Row']
export type WishlistItemInsert = Database['public']['Tables']['wishlist_items']['Insert']
export type WishlistItemUpdate = Database['public']['Tables']['wishlist_items']['Update']

export type Coupon = Database['public']['Tables']['coupons']['Row']
export type CouponInsert = Database['public']['Tables']['coupons']['Insert']
export type CouponUpdate = Database['public']['Tables']['coupons']['Update']

// Extended types with relationships
export interface ProductWithDetails extends Product {
  category?: Category
  variants?: ProductVariant[]
  reviews?: Review[]
  average_rating?: number
  review_count?: number
}

export interface CartItemWithProduct extends CartItem {
  product?: Product
  variant?: ProductVariant
}

export interface OrderWithItems extends Order {
  order_items?: OrderItem[]
  customer?: Customer
}

export interface CategoryWithProductCount extends Category {
  product_count?: number
}
