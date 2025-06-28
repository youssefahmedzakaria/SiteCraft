import { create } from 'zustand'
import { login as loginAPI, logout as logoutAPI, getSession, register as registerAPI, setSession } from '../lib/auth'

interface SessionData {
  storeId: number | null
  userId: number | null
  role: string | null
}

interface AuthState {
  isAuthenticated: boolean
  user: SessionData | null
  loginError: string | null
  signupError: string | null
  isLoading: boolean
  login: (email: string, password: string) => Promise<boolean>
  logout: () => Promise<void>
  signup: (userData: { email: string, password: string, name?: string, phone?: string, gender?: string }) => Promise<number | null>
  updateSessionAfterStoreCreation: (storeId: number, role: string) => Promise<void>
  checkSession: () => Promise<void>
  clearError: () => void
}

export const useAuth = create<AuthState>((set, get) => ({
  isAuthenticated: false,
  user: null,
  loginError: null,
  signupError: null,
  isLoading: false,
  
  login: async (email: string, password: string) => {
    set({ isLoading: true, loginError: null })
    try {
      await loginAPI(email, password)
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
      set({ loginError: error.message || 'Login failed' })
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
      
      // Redirect to homepage after logout
      if (typeof window !== 'undefined') {
        window.location.href = '/';
      }
    }
  },
  
  signup: async (userData) => {
    console.log('🎯 useAuth signup called with:', userData);
    set({ isLoading: true, signupError: null })
    try {
      console.log('📞 Calling registerAPI...');
      const response = await registerAPI(userData)
      console.log('📥 registerAPI response received:', response);
      
      // Set session with the returned data (only userId, no storeId yet)
      if (response.userId) {
        console.log('🔐 Setting session with userId only (no storeId yet)...');
        await setSession(response.userId, null) // No storeId during registration
        
        console.log('🔄 Updating auth state...');
        // Update the auth state (user is authenticated but no store yet)
        set({ 
          isAuthenticated: true, 
          user: {
            userId: response.userId,
            storeId: null, // No store created yet
            role: null // No role assigned yet
          },
          signupError: null 
        })
        console.log('✅ Auth state updated successfully!');
      } else {
        console.log('⚠️ Missing userId in response:', response);
      }
      
      return response.userId
    } catch (error: any) {
      console.error('💥 Signup error:', error);
      set({ signupError: error.message || 'Registration failed' })
      return null
    } finally {
      set({ isLoading: false })
      console.log('🏁 Signup process completed');
    }
  },

  updateSessionAfterStoreCreation: async (storeId: number, role: string) => {
    console.log('🔄 Updating session after store creation...', { storeId, role });
    const currentUser = get().user;
    if (!currentUser?.userId) {
      console.error('❌ No user found to update session');
      return;
    }

    try {
      // Update session with storeId
      await setSession(currentUser.userId, storeId);
      
      // Update auth state
      set({
        user: {
          ...currentUser,
          storeId: storeId,
          role: role
        }
      });
      
      console.log('✅ Session updated successfully after store creation');
    } catch (error) {
      console.error('💥 Error updating session after store creation:', error);
      throw error;
    }
  },

  checkSession: async () => {
    set({ isLoading: true })
    try {
      const session = await getSession()
      if (session && session.userId) {
        set({ 
          isAuthenticated: true, 
          user: session 
        })
      } else {
        set({ 
          isAuthenticated: false, 
          user: null 
        })
      }
    } catch (error) {
      console.error('Session check error:', error)
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