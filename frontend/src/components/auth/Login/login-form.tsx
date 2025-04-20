"use client"

import { useState } from "react"
import { useAuth } from "@/hooks/useAuth"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Icons } from "../../icons"
import { Alert, AlertDescription } from "../../ui/alert"
import { AlertCircle } from "lucide-react"


export function LoginForm() {
  const { login, loginError } = useAuth()
  const [isLoading, setIsLoading] = useState(false)

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setIsLoading(true)
    

    const formData = new FormData(event.currentTarget)
    const email = formData.get("email") as string
    const password = formData.get("password") as string

    await login(email, password)
    setIsLoading(false)
  }

  return (
    <form 
      onSubmit={onSubmit} 
      className="w-full max-w-sm mx-auto space-y-8 bg-background/95 backdrop-blur-sm p-8 rounded-lg border border-border/20"
    >
      <div className="space-y-2 text-center">
        <h1 className="text-2xl font-semibold tracking-tight">Welcome back</h1>
        <p className="text-sm text-muted-foreground">
          Enter your email to sign in to your account
        </p>
      </div>

      {loginError && (
        <Alert variant="destructive" className="text-sm">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{loginError}</AlertDescription>
        </Alert>
      )}
      
      <div className="space-y-4">
        <div className="space-y-2">
          <Label 
            htmlFor="email" 
            className="text-sm font-medium text-foreground/90"
          >
            Email address
          </Label>
          <Input
            id="email"
            name="email"
            type="email"
            placeholder="name@example.com"
            autoComplete="email"
            required
            disabled={isLoading}
            className="h-10 px-4 bg-background border border-input hover:border-input/80 focus:border-primary focus:ring-1 focus:ring-primary/20 transition-all duration-200"
          />
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label 
              htmlFor="password" 
              className="text-sm font-medium text-foreground/90"
            >
              Password
            </Label>
            <Button 
              variant="link" 
              className="text-xs text-primary hover:text-primary/90 px-0 h-auto font-medium"
              type="button"
            >
              Forgot password?
            </Button>
          </div>
          <Input
            id="password"
            name="password"
            type="password"
            placeholder="••••••••"
            autoComplete="current-password"
            required
            disabled={isLoading}
            className="h-10 px-4 bg-background border border-input hover:border-input/80 focus:border-primary focus:ring-1 focus:ring-primary/20 transition-all duration-200"
          />
        </div>
      </div>

      <Button
        type="submit"
        disabled={isLoading}
        className="w-full h-10 text-sm font-medium transition-all duration-200 
                 bg-primary hover:bg-primary/90 active:bg-primary/80
                 text-primary-foreground
                 transform hover:-translate-y-0.5 active:translate-y-0
                 disabled:opacity-50 disabled:pointer-events-none
                 rounded-md"
      >
        {isLoading ? (
          <>
            <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
            Signing in...
          </>
        ) : (
          "Sign in"
        )}
      </Button>
    </form>
  )
} 