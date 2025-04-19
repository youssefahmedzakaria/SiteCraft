import { useState } from 'react'

export const useLoginForm = () => {
  const [isLoading, setIsLoading] = useState(false)

  const onSubmit = async (event: React.SyntheticEvent) => {
    event.preventDefault()
    setIsLoading(true)

    try {
      // Add your login logic here
      await new Promise(resolve => setTimeout(resolve, 3000))
    } catch (error) {
      console.error('Login error:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return { isLoading, onSubmit }
} 