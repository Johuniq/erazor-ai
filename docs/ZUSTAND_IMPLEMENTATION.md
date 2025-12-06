# Zustand Implementation Summary

## Overview
This document summarizes all Zustand store implementations in the Erazor AI application for centralized, reactive state management.

---

## 1. User Store (`/lib/store/user-store.ts`)

### Purpose
Manages user profile data and credits across the entire application.

### State
- `currentProfile`: User's profile data (email, name, credits, plan, etc.)
- `isLoading`: Loading state for async operations
- `error`: Error messages

### Actions
- `fetchProfile()`: Loads user profile from Supabase
- `updateCredits(credits)`: Updates credit count
- `deductCredits(amount)`: Decrements credits (optimistic update)
- `setProfile(profile)`: Manually sets profile data
- `reset()`: Clears all state

### Usage
```tsx
import { useUserStore } from '@/lib/store/user-store'

function Component() {
  const { currentProfile, fetchProfile, deductCredits } = useUserStore()
  
  useEffect(() => {
    fetchProfile()
  }, [fetchProfile])
  
  // After processing
  deductCredits(1)
}
```

### Integrated In
- `/app/dashboard/page.tsx`
- `/app/dashboard/settings/page.tsx`
- `/app/dashboard/remove-background/page.tsx`
- `/app/dashboard/upscale/page.tsx`
- `/components/dashboard/header.tsx`

---

## 2. Auth Store (`/lib/store/auth-store.ts`)

### Purpose
Manages authentication state globally with automatic Supabase sync.

### State
- `user`: Current authenticated user
- `isAuthenticated`: Boolean flag
- `isLoading`: Loading state
- `error`: Error messages

### Actions
- `fetchUser()`: Gets current user from Supabase
- `setUser(user)`: Updates user state
- `signOut()`: Signs out user
- `reset()`: Clears all state

### Auth Flow
1. User logs in → `setUser()` called in login/signup pages
2. `AuthProvider` listens to Supabase auth changes
3. On `SIGNED_IN` → fetches user profile via user store
4. On `SIGNED_OUT` → resets both stores
5. On `TOKEN_REFRESHED` → updates user in auth store

### Usage
```tsx
import { useAuthStore } from '@/lib/store/auth-store'

function Component() {
  const { user, isAuthenticated, signOut } = useAuthStore()
  
  const handleLogout = async () => {
    await signOut()
    // AuthProvider handles cleanup
  }
}
```

### Helper Hooks
- `useRequireAuth()`: Redirects to login if not authenticated
- `useRedirectIfAuthenticated()`: Redirects to dashboard if logged in

### Integrated In
- `/components/auth-provider.tsx` (wraps entire app)
- `/app/login/page.tsx`
- `/app/signup/page.tsx`
- `/components/dashboard/header.tsx`
- `/hooks/use-auth.ts`

---

## 3. Products Store (`/lib/store/products-store.ts`)

### Purpose
Caches and shares product/pricing data across components to reduce API calls.

### State
- `products`: Array of Polar products
- `isLoading`: Fetch loading state
- `error`: Error messages
- `lastFetched`: Timestamp for cache validation

### Features
- **Automatic Caching**: Data cached for 5 minutes
- **Smart Fetching**: Checks cache before making API calls
- **Shared State**: Multiple components use same cached data

### Actions
- `fetchProducts()`: Fetches products with cache check
- `setProducts(products)`: Manually sets products
- `reset()`: Clears cache

### Usage
```tsx
import { useProductsStore } from '@/lib/store/products-store'

function Component() {
  const { products, isLoading, fetchProducts } = useProductsStore()
  
  useEffect(() => {
    fetchProducts() // Only fetches if cache expired
  }, [fetchProducts])
  
  return products.map(product => ...)
}
```

### Integrated In
- `/components/landing/pricing-section.tsx`

### Benefits
- ✅ Reduces duplicate API calls to `/api/products`
- ✅ Instant load for repeat visits
- ✅ Consistent data across components

---

## Benefits of Zustand Implementation

### 1. **Reactive Updates**
Credits and auth status update instantly across all components without page reloads.

### 2. **Reduced Prop Drilling**
No need to pass user/auth data through multiple component layers.

### 3. **Better Performance**
- Cached data reduces API calls
- Only components using specific store values re-render
- Optimistic updates improve perceived speed

### 4. **Centralized Logic**
All state management logic in one place, easier to maintain and debug.

### 5. **Type Safety**
Full TypeScript support with proper typing for all stores.

### 6. **Developer Experience**
- Simple API (no boilerplate)
- DevTools support
- Easy to test

---

## Best Practices

### 1. **Always Call fetch on Mount**
```tsx
useEffect(() => {
  fetchProfile()
}, [fetchProfile])
```

### 2. **Use Optimistic Updates**
```tsx
// Update UI immediately
deductCredits(1)

// Then make API call in background
await processImage()
```

### 3. **Reset Stores on Logout**
```tsx
const { signOut } = useAuthStore()
const { reset: resetUser } = useUserStore()

await signOut()
resetUser()
```

### 4. **Check Loading States**
```tsx
if (isLoading) return <Spinner />
if (error) return <Error message={error} />
```

---

## Future Enhancements

### Potential New Stores

1. **Theme Store**
   - Replace ThemeProvider context with Zustand
   - Persist theme preference to localStorage

2. **Processing Jobs Store**
   - Real-time job status updates
   - Sync processing history across tabs
   - WebSocket integration for live updates

3. **Toast/Notification Store**
   - Queue notifications
   - Global notification state
   - Better control over toast lifecycle

4. **Upload Store**
   - Track multiple file uploads
   - Progress tracking
   - Cancel/retry functionality

5. **Settings Store**
   - User preferences
   - App configuration
   - Feature flags

---

## Migration Checklist

When converting a component to use Zustand:

- [ ] Import the store: `import { useUserStore } from '@/lib/store/user-store'`
- [ ] Remove local useState for data managed by store
- [ ] Call `fetch` actions in useEffect
- [ ] Use store values directly (no prop drilling)
- [ ] Update store after mutations
- [ ] Reset store on unmount if needed
- [ ] Test loading and error states

---

## Store Architecture Pattern

```typescript
// 1. Define types
interface State {
  data: DataType | null
  isLoading: boolean
  error: string | null
}

// 2. Define actions
interface Actions {
  fetchData: () => Promise<void>
  updateData: (data: DataType) => void
  reset: () => void
}

// 3. Create store with zustand
export const useStore = create<State & Actions>((set) => ({
  // Initial state
  data: null,
  isLoading: false,
  error: null,
  
  // Actions
  fetchData: async () => {
    set({ isLoading: true, error: null })
    try {
      const data = await api.fetch()
      set({ data, isLoading: false })
    } catch (error) {
      set({ error: error.message, isLoading: false })
    }
  },
  
  updateData: (data) => set({ data }),
  
  reset: () => set({ data: null, isLoading: false, error: null })
}))
```

---

## Conclusion

Zustand provides a lightweight, performant state management solution that eliminates the need for prop drilling and ensures reactive updates across the application. The three stores (user, auth, products) cover the core data flows and can serve as templates for future store implementations.
