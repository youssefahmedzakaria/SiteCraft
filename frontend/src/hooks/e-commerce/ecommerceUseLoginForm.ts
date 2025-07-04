'use client'
import { useState } from 'react'
import { useAuth } from './ecommerceUseAuth'
import { usePathname, useRouter } from 'next/navigation'

export const useLoginForm = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const { login, loginError, isLoading, clearError } = useAuth()
  const router = useRouter()
          const path = usePathname();
        const pathSegments = path.split("/");
        const subdomain = pathSegments[2];

  const onSubmit = async (event: React.SyntheticEvent) => {
    event.preventDefault()
    clearError()

    if (!email || !password) {
      return
    }

    const success = await login(email, password, subdomain)
    if (success) {
      router.push(`/e-commerce/${subdomain}`);
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