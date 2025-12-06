import { create } from 'zustand'

interface ProductPrice {
  id: string
  type: string
  amountType: string
  priceAmount: number | null
  priceCurrency: string | null
  recurringInterval: string | null
}

export interface Product {
  id: string
  name: string
  description: string | null
  isRecurring: boolean
  prices: ProductPrice[]
}

interface ProductsState {
  products: Product[]
  isLoading: boolean
  error: string | null
  lastFetched: number | null
  
  // Actions
  fetchProducts: () => Promise<void>
  setProducts: (products: Product[]) => void
  reset: () => void
}

const CACHE_DURATION = 5 * 60 * 1000 // 5 minutes

export const useProductsStore = create<ProductsState>((set, get) => ({
  products: [],
  isLoading: false,
  error: null,
  lastFetched: null,

  fetchProducts: async () => {
    const state = get()
    
    // Check if we have cached data that's still valid
    if (
      state.products.length > 0 && 
      state.lastFetched && 
      Date.now() - state.lastFetched < CACHE_DURATION
    ) {
      return // Use cached data
    }

    set({ isLoading: true, error: null })

    try {
      const response = await fetch('/api/products')
      
      if (!response.ok) {
        throw new Error('Failed to fetch products')
      }

      const data = await response.json()
      
      set({ 
        products: data.products || [],
        isLoading: false,
        lastFetched: Date.now()
      })
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to fetch products',
        isLoading: false
      })
    }
  },

  setProducts: (products) => {
    set({ products, lastFetched: Date.now() })
  },

  reset: () => {
    set({
      products: [],
      isLoading: false,
      error: null,
      lastFetched: null
    })
  }
}))
