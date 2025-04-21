"use client"

import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/hooks/useAuth"
import { Building2 } from "lucide-react"

export function Navbar() {
  const { isAuthenticated, logout } = useAuth()

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-8">
        <Link 
            href="/" 
            className="flex items-center space-x-2 transition-colors hover:opacity-90"
          >
            <div className="flex items-center">
              <Image 
                src="/logo.png" 
                alt="SiteCraft Logo" 
                width={32} 
                height={32} 
                className="h-6 w-auto object-contain"
              />
              <Image 
                src="/font.png" 
                alt="SiteCraft" 
                width={120} 
                height={24} 
                className="h-18 w-auto lg-2 object-contain"
              />
            </div>
          </Link>
          <nav className="hidden md:flex items-center space-x-6">
            <Link
              href="/about"
              className="text-sm font-medium text-[#cc7860]/95 transition-colors hover:opacity-90 relative group"
            >
              About
              <span className="absolute inset-x-0 -bottom-1 h-0.5 bg-[#cc7860] opacity-100 transform scale-x-0 group-hover:scale-x-100 group-hover:opacity-90 transition-all"></span>
            </Link>
            <Link
              href="/features"
              className="text-sm font-medium text-[#cc7860]/95 text-muted-foreground transition-colors hover:opacity-90 relative group"
            >
              Features
              <span className="absolute inset-x-0 -bottom-1 h-0.5 bg-[#cc7860] opacity-100 transform scale-x-0 group-hover:scale-x-100 group-hover:opacity-90 transition-all"></span>
            </Link>
            <Link
              href="/pricing"
              className="text-sm font-medium text-[#cc7860]/95 text-muted-foreground transition-colors hover:opacity-90 relative group"
            >
              Pricing
              <span className="absolute inset-x-0 -bottom-1 h-0.5 bg-[#cc7860] opacity-100 transform scale-x-0 group-hover:scale-x-100 group-hover:opacity-90 transition-all"></span>
            </Link>
          </nav>
        </div>
        <div className="flex items-center space-x-4">
          {isAuthenticated ? (
            <Button 
              variant="ghost" 
              onClick={logout}
              className="font-medium hover:bg-primary/10 transition-colors"
            >
              Logout
            </Button>
          ) : (
            <div className="flex items-center space-x-3">
              <Link href="/login">
                <Button 
                  variant="ghost"
                  className="font-medium text-[#cc7860]/95 hover:text-[#cc7860]/90 hover:bg-[#cc7860]/10 transition-colors"
                >
                  Login
                </Button>
              </Link>
              <Link href="/signup">
                <Button
                  className="font-medium bg-[#cc7860]/95 text-primary-foreground hover:bg-[#cc7860]/90 
                           shadow-lg hover:shadow-xl transition-all duration-200
                           transform hover:-translate-y-0.5 active:translate-y-0"
                >
                  Sign Up
                </Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  )
} 