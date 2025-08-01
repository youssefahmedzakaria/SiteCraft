/* eslint-disable @typescript-eslint/no-explicit-any */
import { create } from 'zustand'
import { login as loginAPI, logout as logoutAPI, getSession, register as registerAPI, setSession } from '../lib/auth'

interface SessionData {
  storeId: number | null
  userId: number | null
  role: string | null
  storeStatus?: string | null
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
          user: {
            storeId: session.storeId,
            userId: session.userId,
            role: session.role,
            storeStatus: session.storeStatus || null
          },
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
        await setSession(response.userId, null, null) // No storeId or role during registration
        
        console.log('🔄 Updating auth state...');
        // Update the auth state (user is authenticated but no store yet)
        set({ 
          isAuthenticated: true, 
          user: {
            userId: response.userId,
            storeId: null, // No store created yet
            role: null, // No role assigned yet
            storeStatus: null // No store status assigned yet
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
      // Update session with storeId and role
      console.log('📞 Calling setSession with:', { userId: currentUser.userId, storeId, role });
      await setSession(currentUser.userId, storeId, role);
      console.log('✅ setSession completed successfully');
      
      // Refresh the session to get updated data from backend
      console.log('🔄 Refreshing session data...');
      const { checkSession } = get();
      await checkSession();
      console.log('✅ Session refreshed successfully');
      
      // Also update auth state locally for immediate effect
      set({
        user: {
          ...currentUser,
          storeId: storeId,
          role: role,
          storeStatus: null // No store status assigned yet
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
      console.log('🔄 Checking session...');
      const session = await getSession()
      console.log('📥 Session data received:', session);
      
      if (session && session.userId) {
        console.log('✅ Valid session found, updating auth state...');
        const userData = {
          storeId: session.storeId,
          userId: session.userId,
          role: session.role,
          storeStatus: session.storeStatus || null
        };
        console.log('👤 User data to set:', userData);
        set({ 
          isAuthenticated: true, 
          user: userData
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