import { useState } from 'react'
import { useAuth } from './useAuth'
import { useRouter } from 'next/navigation'

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
      router.push('/dashboard')
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