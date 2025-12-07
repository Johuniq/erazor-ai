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
      
      // Clear all storage immediately BEFORE calling signOut
      if (typeof window !== 'undefined') {
        console.log('Clearing storage before API call...')
        
        // Clear localStorage
        const keysToRemove: string[] = []
        for (let i = 0; i < localStorage.length; i++) {
          const key = localStorage.key(i)
          if (key) {
            keysToRemove.push(key)
          }
        }
        keysToRemove.forEach(key => {
          if (key.startsWith('sb-') || key.includes('supabase')) {
            console.log('Removing:', key)
            localStorage.removeItem(key)
          }
        })
        
        // Clear sessionStorage
        sessionStorage.clear()
        
        // Clear all Supabase cookies
        const cookies = document.cookie.split(";")
        for (const cookie of cookies) {
          const name = cookie.split("=")[0].trim()
          if (name.startsWith('sb-') || name.includes('auth-token')) {
            console.log('Clearing cookie:', name)
            // Clear for current domain
            document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`
            // Clear for parent domain
            const domain = window.location.hostname
            document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=${domain};`
            document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=.${domain};`
          }
        }
      }
      
      console.log('Storage cleared, calling API...')
      
      // Now try to call the API (but storage is already cleared so user will be logged out anyway)
      try {
        await Promise.race([
          supabase.auth.signOut({ scope: 'local' }),
          new Promise((resolve) => setTimeout(resolve, 1000))
        ])
        console.log('API call completed')
      } catch (apiError) {
        console.log('API call failed, but storage already cleared:', apiError)
      }
      
      console.log('Resetting store state...')
      
      // Reset store state
      set({ 
        user: null, 
        isAuthenticated: false,
        error: null 
      })
      
      // Redirect with cache busting
      console.log('Redirecting to home...')
      if (typeof window !== 'undefined') {
        setTimeout(() => {
          window.location.href = '/'
        }, 100)
      }
    } catch (error) {
      console.error('Error signing out:', error)
      // Even if there's an error, try to redirect anyway
      if (typeof window !== 'undefined') {
        window.location.href = '/'
      }
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
