import { createClient } from '@/lib/supabase/client'
import type { User } from '@supabase/supabase-js'
import { create } from 'zustand'

interface AuthStore {
  user: User | null
  isLoading: boolean
  isAuthenticated: boolean
  error: string | null
  
  // Actions
  setUser: (user: User | null) => void
  fetchUser: () => Promise<void>
  signOut: () => Promise<void>
  reset: () => void
}

export const useAuthStore = create<AuthStore>((set, get) => ({
  user: null,
  isLoading: false,
  isAuthenticated: false,
  error: null,

  setUser: (user: User | null) => {
    set({ 
      user, 
      isAuthenticated: !!user,
      error: null 
    })
  },

  fetchUser: async () => {
    set({ isLoading: true, error: null })
    
    try {
      const supabase = createClient()
      const { data: { user }, error } = await supabase.auth.getUser()

      if (error) throw error

      set({ 
        user, 
        isAuthenticated: !!user,
        isLoading: false 
      })
    } catch (error) {
      console.error('Error fetching user:', error)
      set({ 
        error: error instanceof Error ? error.message : 'Failed to fetch user',
        user: null,
        isAuthenticated: false,
        isLoading: false 
      })
    }
  },

  signOut: async () => {
    try {
      const supabase = createClient()
      await supabase.auth.signOut()
      
      set({ 
        user: null, 
        isAuthenticated: false,
        error: null 
      })
    } catch (error) {
      console.error('Error signing out:', error)
      set({ 
        error: error instanceof Error ? error.message : 'Failed to sign out'
      })
    }
  },

  reset: () => {
    set({ 
      user: null, 
      isAuthenticated: false,
      isLoading: false, 
      error: null 
    })
  },
}))
