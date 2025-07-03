/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { create } from 'zustand'
import { login as loginAPI, logout as logoutAPI, getSession, register as registerAPI } from '../../lib/e-commerce/ecommerceAuth'

interface SessionData {
  customerId: number | null
  storeId: number | null
  customerEmail: string | null
  customerName: string | null
}

interface AuthState {
  isAuthenticated: boolean
  user: SessionData | null
  loginError: string | null
  signupError: string | null
  isLoading: boolean
  login: (email: string, password: string , subdomain: string) => Promise<boolean>
  logout: () => Promise<void>
  signup: (userData: { email: string, password: string, name?: string, phone?: string }, subdomain: string) => Promise<number | null>
  checkSession: () => Promise<void>
  clearError: () => void
}

export const useAuth = create<AuthState>((set, get) => ({
  isAuthenticated: false,
  user: null,
  loginError: null,
  signupError: null,
  isLoading: false,


  login: async (email: string, password: string, subdomain: string) => {
    set({ isLoading: true, loginError: null })
    try {
      await loginAPI(email, password, subdomain)
      const session = await getSession()
      if (session) {
        set({
          isAuthenticated: true,
          user: session,
          loginError: null
        })
        return true
      } else {
        set({ loginError: 'Login failed - no session data' })
        return false
      }
    } catch (error: any) {
      console.error('Login error:', error)
      set({ loginError: 'Login failed, Please check email and password' })
      return false
    } finally {
      set({ isLoading: false })
    }
  },

  logout: async () => {
    console.log('🔐 useAuth logout called');
    set({ isLoading: true })
    try {
      console.log('📞 Calling logoutAPI...');
      await logoutAPI()
      console.log('✅ logoutAPI completed successfully');
    } catch (error) {
      console.error('💥 Logout error:', error)
    } finally {
      console.log('🔄 Clearing auth state...');
      set({
        isAuthenticated: false,
        user: null,
        isLoading: false
      })
      console.log('✅ Auth state cleared, logout complete');
    }
  },

  signup: async (userData, subdomain) => {
    console.log('🎯 useAuth signup called with:', userData, subdomain);
    set({ isLoading: true, signupError: null })
    try {
      console.log('📞 Calling registerAPI...');
      const response = await registerAPI(userData, subdomain)
      console.log('📥 registerAPI response received:', response);

      // Set session with the returned data
      if (response.success) {
        console.log('🔐 Setting session with returned data...');
        console.log('🔄 Updating auth state...');
        console.log('✅ Auth state updated successfully!');
      } else {
        console.log('⚠️ Missing customerId in response:', response);
      }

      return response.message;
    } catch (error: any) {
      console.error('💥 Signup error:', error);
      set({ signupError: error.message || 'Registration failed' })
      return error.message;
    } finally {
      set({ isLoading: false })
      console.log('🏁 Signup process completed');
    }
  },

  checkSession: async () => {
    set({ isLoading: true })
    try {
      console.log('🔄 Checking session...');
      const session = await getSession()
      console.log('📥 Session data received:', session);

      if (session && session.customerId) {
        console.log('✅ Valid session found, updating auth state...');
        set({
          isAuthenticated: true,
          user: session
        })
        console.log('✅ Auth state updated with session data');
      } else {
        console.log('❌ No valid session found');
        set({
          isAuthenticated: false,
          user: null
        })
      }
    } catch (error) {
      console.error('💥 Session check error:', error)
      set({
        isAuthenticated: false,
        user: null
      })
    } finally {
      set({ isLoading: false })
    }
  },

  clearError: () => set({ loginError: null, signupError: null }),
}))