import { useState } from 'react'
import { setSession } from '@/lib/auth'
import { useAuth } from './useAuth'
import { useRouter } from 'next/navigation'

export const useStoreAssignment = () => {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const { checkSession } = useAuth()
  const router = useRouter()

  const assignUserToStore = async (userId: number, storeId: number) => {
    setIsLoading(true)
    setError('')

    try {
      // Set the session with userId and storeId
      await setSession(userId, storeId)
      
      // Refresh the session to get updated data
      await checkSession()
      
      // Redirect to dashboard
      router.push('/dashboard')
      
      return true
    } catch (err: any) {
      setError(err.message || 'Failed to assign user to store')
      return false
    } finally {
      setIsLoading(false)
    }
  }

  const clearError = () => setError('')

  return {
    assignUserToStore,
    isLoading,
    error,
    clearError
  }
} 