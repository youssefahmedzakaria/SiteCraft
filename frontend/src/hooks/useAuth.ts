import { create } from 'zustand'

interface AuthState {
  isAuthenticated: boolean
  user: any | null
  loginError: string | null
  signupError: string | null
  login: (email: string, password: string) => Promise<boolean>
  logout: () => void
  signup: (email: string, password: string) => Promise<boolean>
  clearError: () => void
}

export const useAuth = create<AuthState>((set) => ({
  isAuthenticated: false,
  user: null,
  loginError: null,
  signupError: null,
  
  login: async (email: string, password: string) => {
    try {
      // TODO: Replace with actual API call
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })

      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        set({ loginError: data.message || 'Invalid email or password' });
        return false;
      }

      const data = await response.json()
      set({ isAuthenticated: true, user: data.user})
      return true;
    } catch (error) {
      console.error('Login error:', error)
      set({ loginError: 'Connection error. Please try again.' })
      return false;
    }
  },
  
  logout: () => {
    set({ isAuthenticated: false, user: null })
  },
  
  signup: async (email: string, password: string) => {
    try {
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })

      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        set({ signupError: data.message || 'Registration failed' });
        return false;
      }

      const data = await response.json()
      set({ isAuthenticated: true, user: data.user})
      return true;
    } catch (error) {
      console.error('Signup error:', error)
      set({ signupError: 'Connection error. Please try again.' })
      return false;
    }
  },
  
  clearError: () => set({ loginError: null, signupError: null}),
}))