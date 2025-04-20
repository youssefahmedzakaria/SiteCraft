"use client"

import { LoginForm } from "@/components/auth/Login/login-form"
import { Building2 } from "lucide-react"
import Link from "next/link"

export default function LoginPage() {
  return (
    <div className="min-h-screen grid md:grid-cols-2 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
        <div className="absolute left-0 right-0 top-0 -z-10 m-auto h-[310px] w-[310px] rounded-full bg-primary/20 opacity-20 blur-[100px]"></div>
      </div>

      {/* Left Side - Form */}
      <div className="flex flex-col items-center justify-center px-6 py-12 lg:px-8 relative">
        <div className="absolute inset-0 -z-10 bg-white/30 backdrop-blur-xl"></div>
        <div className="sm:mx-auto sm:w-full sm:max-w-sm mb-8 relative">
          <Link href="/" className="flex items-center justify-center space-x-2 mb-8 group">
            <Building2 className="h-8 w-8 text-primary group-hover:text-primary/80 transition-colors" />
            <span className="text-2xl font-bold group-hover:text-primary/80 transition-colors">SiteCraft</span>
          </Link>
          <h2 className="text-center text-2xl font-bold leading-9 tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/80">
            Welcome back
          </h2>
          <p className="mt-2 text-center text-sm text-muted-foreground">
            Don't have an account?{" "}
            <Link 
              href="/signup" 
              className="font-semibold text-primary hover:text-primary/90 underline-offset-4 hover:underline"
            >
              Sign up
            </Link>
          </p>
        </div>
        <div className="relative w-full max-w-sm">
          <div className="absolute -inset-0.5 bg-gradient-to-r from-primary to-primary/50 rounded-lg blur opacity-30 group-hover:opacity-100 transition duration-1000"></div>
          <LoginForm />
        </div>
      </div>

      {/* Right Side - Content */}
      <div className="hidden md:flex flex-col bg-primary text-primary-foreground relative overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff0a_1px,transparent_1px),linear-gradient(to_bottom,#ffffff0a_1px,transparent_1px)] bg-[size:24px_24px]"></div>
        <div className="flex-1 flex items-center justify-center p-8 relative">
          <div className="max-w-md relative z-10">
            <h1 className="text-3xl font-bold mb-6">
              Transform Your Business with SiteCraft
            </h1>
            <ul className="space-y-4 text-lg">
              <li className="flex items-center space-x-2">
                <span className="text-xl">✨</span>
                <span>Easy-to-use store builder</span>
              </li>
              <li className="flex items-center space-x-2">
                <span className="text-xl">🛍️</span>
                <span>Powerful e-commerce tools</span>
              </li>
              <li className="flex items-center space-x-2">
                <span className="text-xl">🌐</span>
                <span>Local payment integration</span>
              </li>
              <li className="flex items-center space-x-2">
                <span className="text-xl">📱</span>
                <span>Mobile-optimized design</span>
              </li>
              <li className="flex items-center space-x-2">
                <span className="text-xl">🔒</span>
                <span>Enterprise-grade security</span>
              </li>
              <li className="flex items-center space-x-2">
                <span className="text-xl">🌟</span>
                <span>24/7 dedicated support</span>
              </li>
            </ul>
          </div>
        </div>
        <div className="relative z-10 p-8">
          <blockquote className="relative">
            <div className="absolute -top-6 -left-4 text-white/20 text-6xl">"</div>
            <p className="relative z-10 text-lg italic">
              SiteCraft has revolutionized how we do business online. The local payment integration and Arabic support made it perfect for our market.
            </p>
            <footer className="mt-2 font-semibold">- Ahmed Hassan, Shop Owner</footer>
          </blockquote>
        </div>
      </div>
    </div>
  )
}