'use client'

import { useLoginForm } from '@/hooks/useLoginForm'
import { Button } from '@/components/SiteCraft/ui/button'
import { Input } from '@/components/SiteCraft/ui/input'
import { Label } from '@/components/SiteCraft/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/SiteCraft/ui/card'
import { Alert, AlertDescription } from '@/components/SiteCraft/ui/alert'
import { Eye, EyeOff } from 'lucide-react'
import { useState } from 'react'

export function LoginForm() {
  const {
    email,
    setEmail,
    password,
    setPassword,
    isLoading,
    loginError,
    onSubmit,
    clearError
  } = useLoginForm()

  const [showPassword, setShowPassword] = useState(false)

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl text-center">Welcome back</CardTitle>
        <CardDescription className="text-center">
          Enter your credentials to access your dashboard
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={onSubmit} className="space-y-4">
          {loginError && (
            <Alert variant="destructive">
              <AlertDescription>{loginError}</AlertDescription>
            </Alert>
          )}
          
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                setEmail(e.target.value)
                if (loginError) clearError()
              }}
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? 'text' : 'password'}
                placeholder="Enter your password"
                value={password}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                  setPassword(e.target.value)
                  if (loginError) clearError()
                }}
                required
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>
          
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? 'Signing in...' : 'Sign in'}
          </Button>
        </form>
        
        <div className="mt-4 text-center text-sm">
          <a href="/forgot-password" className="text-green-600 hover:underline">
            Forgot your password?
          </a>
        </div>
        
        <div className="mt-4 text-center text-sm">
          Don't have an account?{' '}
          <a href="/signup" className="text-green-600 hover:underline">
            Sign up
          </a>
        </div>
      </CardContent>
    </Card>
  )
} 