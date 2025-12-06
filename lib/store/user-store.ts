import { createClient } from '@/lib/supabase/client'
import { create } from 'zustand'

interface UserProfile {
  id: string
  email: string | null
  full_name: string | null
  avatar_url: string | null
  credits: number
  plan: string
  polar_customer_id: string | null
  polar_subscription_id: string | null
  created_at: string
  updated_at: string
}

interface UserStore {
  profile: UserProfile | null
  isLoading: boolean
  error: string | null
  
  // Actions
  fetchProfile: () => Promise<void>
  updateCredits: (credits: number) => void
  deductCredits: (amount: number) => void
  setProfile: (profile: UserProfile | null) => void
  reset: () => void
}

export const useUserStore = create<UserStore>((set, get) => ({
  profile: null,
  isLoading: false,
  error: null,

  fetchProfile: async () => {
    set({ isLoading: true, error: null })
    
    try {
      const supabase = createClient()
      const { data: { user }, error: authError } = await supabase.auth.getUser()

      if (authError) throw authError
      if (!user) {
        set({ profile: null, isLoading: false })
        return
      }

      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single()

      if (profileError) throw profileError

      set({ profile, isLoading: false })
    } catch (error) {
      console.error('Error fetching profile:', error)
      set({ 
        error: error instanceof Error ? error.message : 'Failed to fetch profile',
        isLoading: false 
      })
    }
  },

  updateCredits: (credits: number) => {
    const { profile } = get()
    if (profile) {
      set({ profile: { ...profile, credits } })
    }
  },

  deductCredits: (amount: number) => {
    const { profile } = get()
    if (profile) {
      const newCredits = Math.max(0, profile.credits - amount)
      set({ profile: { ...profile, credits: newCredits } })
    }
  },

  setProfile: (profile: UserProfile | null) => {
    set({ profile })
  },

  reset: () => {
    set({ profile: null, isLoading: false, error: null })
  },
}))
