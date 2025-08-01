/* eslint-disable react/no-unescaped-entities */
/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { useState } from "react";
import { useLoginForm } from "@/hooks/useLoginForm";
import { Button } from "@/components/SiteCraft/ui/button";
import { Input } from "@/components/SiteCraft/ui/input";
import { Label } from "@/components/SiteCraft/ui/label";
import { Icons } from "../../icons";
import { Alert, AlertDescription } from "../../ui/alert";
import { AlertCircle } from "lucide-react";
import Link from "next/link";

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
  } = useLoginForm();

  return (
    <form onSubmit={onSubmit} className="w-full space-y-6">
      <div className="space-y-2 text-center">
        <h1 className="text-2xl font-semibold tracking-tight">Welcome back</h1>
        <p className="text-sm text-muted-foreground">
          Enter your email to sign in to your account
        </p>
      </div>

      {loginError && (
        <Alert variant="destructive" className="text-sm">
          <div className="flex items-center gap-2">
            <AlertCircle className="h-4 w-4 flex-shrink-0" />
            <AlertDescription>{loginError}</AlertDescription>
          </div>
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
            value={email}
            onChange={(e) => {
              setEmail(e.target.value)
              if (loginError) clearError()
            }}
            className="h-10 px-4 bg-background border border-logo-border hover:border-logo-border/80 focus:border-primary focus:ring-1 focus:ring-primary/20 transition-all duration-200"
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
              asChild
            >
              <Link href="/forgot-password">Forgot password?</Link>
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
            value={password}
            onChange={(e) => {
              setPassword(e.target.value)
              if (loginError) clearError()
            }}
            className="h-10 px-4 bg-background border border-logo-border hover:border-logo-border/80 focus:border-primary focus:ring-1 focus:ring-primary/20 transition-all duration-200"
          />
        </div>
      </div>

      <Button
        type="submit"
        disabled={isLoading}
        className="w-full h-10 text-sm font-medium transition-all duration-200 
                 bg-logo-dark-button hover:bg-logo-dark-button-hover active:dark-button-active
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

      <div className="text-center text-sm">
        <p className="text-muted-foreground">
          Don't have an account?{" "}
          <Link
            href="/signup"
            className="text-primary hover:text-primary/90 font-medium hover:underline"
          >
            Sign up
          </Link>
        </p>
      </div>

      <div className="text-center text-xs text-muted-foreground">
        <p>
          By continuing, you agree to our{" "}
          <Button
            variant="link"
            className="text-primary hover:text-primary/90 px-1 h-auto text-xs"
          >
            Terms of Service
          </Button>{" "}
          and{" "}
          <Button
            variant="link"
            className="text-primary hover:text-primary/90 px-1 h-auto text-xs"
          >
            Privacy Policy
          </Button>
        </p>
      </div>
    </form>
  );
}
