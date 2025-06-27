"use client"

import { useState, type FormEvent } from "react"
import { Eye, EyeOff } from "lucide-react"
import { Button } from "@/components/e-commerce/ui/button"
import { Input } from "@/components/e-commerce/ui/input"
import { Label } from "@/components/e-commerce/ui/label"
import Link from "next/link"
import { useRouter } from "next/navigation"

// Theme configuration matching product page
const defaultTheme = {
  backgroundColor: "white",
  textColor: "black",
  accentColor: "white",
  secondaryColor: "black",
  borderRadius: "rounded-lg",
  fontFamily: "font-sans",
}

export default function LoginPage() {
  const [email, setEmail] = useState<string>("")
  const [password, setPassword] = useState<string>("")
  const [showPassword, setShowPassword] = useState<boolean>(false)
  const [error, setError] = useState<string>("")
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const router = useRouter()

  const handleLogin = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)

    if (!email || !password) {
      setError("Please fill in all fields")
      setIsLoading(false)
      return
    }

    // Simulate loading delay
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // Mock authentication - accept any email/password
    if (email && password) {
      // Store mock token
      localStorage.setItem("token", "mock-token-" + Date.now())
      router.push("/e-commerce/TODO/profile")
    } else {
      setError("Invalid credentials")
    }

    setIsLoading(false)
  }

  return (
    <div
      className={`min-h-screen flex pt-20 items-center justify-center px-4 ${defaultTheme.fontFamily}`}
      style={{ backgroundColor: defaultTheme.backgroundColor }}
    >
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h2
            className="text-3xl font-bold"
            style={{ color: defaultTheme.textColor }}
          >
            Welcome Back
          </h2>
          <p
            className="mt-2 opacity-60"
            style={{ color: defaultTheme.textColor }}
          >
            Sign in to your account
          </p>
        </div>

        <form onSubmit={handleLogin} className="mt-8 space-y-6">
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-md p-3">
              <p className="text-red-600 text-sm">{error}</p>
            </div>
          )}

          <div className="space-y-4">
            <div>
              <Label htmlFor="email" style={{ color: defaultTheme.textColor }}>
                Email address
              </Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className={`mt-1 border-2 ${defaultTheme.borderRadius}`}
                style={{ borderColor: defaultTheme.secondaryColor }}
                required
              />
            </div>

            <div>
              <Label
                htmlFor="password"
                style={{ color: defaultTheme.textColor }}
              >
                Password
              </Label>
              <div className="relative mt-1">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className={`pr-10 border-2 ${defaultTheme.borderRadius}`}
                  style={{ borderColor: defaultTheme.secondaryColor }}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                >
                  {showPassword ? (
                    <EyeOff
                      className="h-4 w-4"
                      style={{ color: defaultTheme.textColor }}
                    />
                  ) : (
                    <Eye
                      className="h-4 w-4"
                      style={{ color: defaultTheme.textColor }}
                    />
                  )}
                </button>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <Link
              href="/forgot-password"
              className="text-sm hover:underline"
              style={{ color: defaultTheme.textColor }}
            >
              Forgot your password?
            </Link>
          </div>

          <Button
            type="submit"
            className={`w-full text-white hover:opacity-90 ${defaultTheme.borderRadius}`}
            style={{ backgroundColor: defaultTheme.secondaryColor }}
            disabled={isLoading}
          >
            {isLoading ? "Signing in..." : "Sign in"}
          </Button>

          <div className="text-center">
            <p
              className="text-sm opacity-60"
              style={{ color: defaultTheme.textColor }}
            >
              {"Don't have an account? "}
              <Link
                href="/e-commerce/TODO/register"
                className="font-medium hover:underline"
                style={{ color: defaultTheme.textColor }}
              >
                Sign up
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}
