import { useState } from 'react'
import { useAuth } from './useAuth'
import { useRouter } from 'next/navigation'
import { getSession } from '../lib/auth'

export const useLoginForm = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const { login, loginError, isLoading, clearError } = useAuth()
  const router = useRouter()

  const onSubmit = async (event: React.SyntheticEvent) => {
    event.preventDefault()
    clearError()

    if (!email || !password) {
      return
    }

    const success = await login(email, password)
    if (success) {
      const session = await getSession();
      if (session?.role === 'admin') {
        router.push('/admin')
      } else {
        router.push('/dashboard')
      }
    }
  }

  return { 
    email, 
    setEmail, 
    password, 
    setPassword, 
    isLoading, 
    loginError, 
    onSubmit,
    clearError 
  }
} 