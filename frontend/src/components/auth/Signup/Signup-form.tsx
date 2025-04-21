"use client"

import { useState } from "react"
import { useAuth } from "@/hooks/useAuth"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Icons } from "../../icons"
import { Alert, AlertDescription } from "../../ui/alert"
import { AlertCircle } from "lucide-react"
import Link from "next/link"

export function SignupForm() {
  const [isLoading, setIsLoading] = useState(false)
  const [signupError, setError] = useState("")
  const { signup } = useAuth()

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setIsLoading(true)
    setError("")

    const formData = new FormData(event.currentTarget)
    const email = formData.get("email") as string
    const password = formData.get("password") as string
    const confirmPassword = formData.get("confirmPassword") as string

    if (password !== confirmPassword) {
      setError("Passwords do not match")
      setIsLoading(false)
      return
    }

    try {
      await signup(email, password)
    } catch (signupError) {
      console.error("Signup failed:", signupError)
      setError("Failed to create account. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form 
      onSubmit={onSubmit} 
      className="w-full space-y-6"
    >
      <div className="space-y-2 text-center">
        <h1 className="text-2xl font-semibold tracking-tight">Create an account</h1>
        <p className="text-sm text-muted-foreground">
          Enter your email below to create your account
        </p>
      </div>

      {signupError && (
        <Alert variant="destructive" className="text-sm">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{signupError}</AlertDescription>
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
          <Label 
            htmlFor="password" 
            className="text-sm font-medium text-foreground/90"
          >
            Password
          </Label>
          <Input
            id="password"
            name="password"
            type="password"
            placeholder="••••••••"
            autoComplete="new-password"
            required
            disabled={isLoading}
            className="h-10 px-4 bg-background border border-input hover:border-input/80 focus:border-primary focus:ring-1 focus:ring-primary/20 transition-all duration-200"
          />
        </div>

        <div className="space-y-2">
          <Label 
            htmlFor="confirmPassword" 
            className="text-sm font-medium text-foreground/90"
          >
            Confirm Password
          </Label>
          <Input
            id="confirmPassword"
            name="confirmPassword"
            type="password"
            placeholder="••••••••"
            autoComplete="new-password"
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
            Creating account...
          </>
        ) : (
          "Create account"
        )}
      </Button>

      <div className="text-center text-sm">
        <p className="text-muted-foreground">
          Already have an account?{" "}
          <Link href="/login" className="text-primary hover:text-primary/90 font-medium hover:underline">
            Sign in
          </Link>
        </p>
      </div>

      <div className="text-center text-xs text-muted-foreground">
        <p>
          By creating an account, you agree to our{" "}
          <Button variant="link" className="text-primary hover:text-primary/90 px-1 h-auto text-xs">
            Terms of Service
          </Button>
          {" "}and{" "}
          <Button variant="link" className="text-primary hover:text-primary/90 px-1 h-auto text-xs">
            Privacy Policy
          </Button>
        </p>
      </div>
    </form>
  )
}