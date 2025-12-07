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
    console.log('Starting signOut...')
    
    try {
      const supabase = createClient()
      console.log('Supabase client created')
      
      // Clear session from storage first (synchronous, always works)
      if (typeof window !== 'undefined') {
        // Clear Supabase auth tokens from localStorage
        const keysToRemove: string[] = []
        for (let i = 0; i < localStorage.length; i++) {
          const key = localStorage.key(i)
          if (key && (key.startsWith('sb-') || key.includes('supabase.auth'))) {
            keysToRemove.push(key)
          }
        }
        keysToRemove.forEach(key => {
          console.log('Removing localStorage key:', key)
          localStorage.removeItem(key)
        })
      }
      
      // Try to call Supabase signOut but don't wait for it
      supabase.auth.signOut().catch(err => {
        console.log('SignOut API call failed (non-blocking):', err)
      })
      
      console.log('Session cleared, resetting store and redirecting...')
      
      // Reset store state immediately
      set({ 
        user: null, 
        isAuthenticated: false,
        error: null 
      })
      
      // Redirect immediately
      console.log('Redirecting to home...')
      if (typeof window !== 'undefined') {
        window.location.href = '/'
      }
    } catch (error) {
      console.error('Error signing out:', error)
      set({ 
        error: error instanceof Error ? error.message : 'Failed to sign out'
      })
      throw error
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
