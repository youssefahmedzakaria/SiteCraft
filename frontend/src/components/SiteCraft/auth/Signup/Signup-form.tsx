"use client";

import { useSignupForm } from "@/hooks/useSignupForm";
import { Button } from "@/components/SiteCraft/ui/button";
import { Input } from "@/components/SiteCraft/ui/input";
import { Label } from "@/components/SiteCraft/ui/label";
import { Icons } from "../../icons";
import { Alert, AlertDescription } from "../../ui/alert";
import { AlertCircle } from "lucide-react";
import Link from "next/link";

export function SignupForm() {
  const {
    formData,
    handleInputChange,
    errors,
    emailAvailabilityError,
    signupError,
    isLoading,
    onSubmit,
    clearError,
  } = useSignupForm();

  return (
    <form onSubmit={onSubmit} className="w-full space-y-6">
      <div className="space-y-2 text-center">
        <h1 className="text-2xl font-semibold tracking-tight">
          Create an account
        </h1>
        <p className="text-sm text-muted-foreground">
          Enter your details below to create your account and store
        </p>
      </div>

      {signupError && (
        <Alert variant="destructive" className="text-sm">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{signupError}</AlertDescription>
        </Alert>
      )}

      {emailAvailabilityError && (
        <Alert variant="destructive" className="flex text-sm items-center">
          <AlertCircle className="h-3 w-3 flex items-center" />
          <AlertDescription className="flex items-center">
            {emailAvailabilityError}
          </AlertDescription>
        </Alert>
      )}

      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label
              htmlFor="name"
              className="text-sm font-medium text-foreground/90"
            >
              Name
            </Label>
            <Input
              id="name"
              name="name"
              type="text"
              placeholder="Full Name"
              autoComplete="name"
              required
              disabled={isLoading}
              value={formData.name}
              onChange={(e) => {
                handleInputChange("name", e.target.value);
                if (errors.name) clearError();
              }}
              className="h-10 px-4 bg-background border border-logo-border hover:border-logo-border/80 focus:border-primary focus:ring-1 focus:ring-primary/20 transition-all duration-200"
            />
            {errors.name && (
              <p className="text-sm text-red-600">{errors.name}</p>
            )}
          </div>

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
              value={formData.email}
              onChange={(e) => {
                handleInputChange("email", e.target.value);
                if (errors.email) clearError();
              }}
              className="h-10 px-4 bg-background border border-logo-border hover:border-logo-border/80 focus:border-primary focus:ring-1 focus:ring-primary/20 transition-all duration-200"
            />
            {errors.email && (
              <p className="text-sm text-red-600">{errors.email}</p>
            )}
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
              value={formData.password}
              onChange={(e) => {
                handleInputChange("password", e.target.value);
                if (errors.password) clearError();
              }}
              className="h-10 px-4 bg-background border border-logo-border hover:border-logo-border/80 focus:border-primary focus:ring-1 focus:ring-primary/20 transition-all duration-200"
            />
            {errors.password && (
              <p className="text-sm text-red-600">{errors.password}</p>
            )}
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
              value={formData.confirmPassword}
              onChange={(e) => {
                handleInputChange("confirmPassword", e.target.value);
                if (errors.confirmPassword) clearError();
              }}
              className="h-10 px-4 bg-background border border-logo-border hover:border-logo-border/80 focus:border-primary focus:ring-1 focus:ring-primary/20 transition-all duration-200"
            />
            {errors.confirmPassword && (
              <p className="text-sm text-red-600">{errors.confirmPassword}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label
              htmlFor="phone"
              className="text-sm font-medium text-foreground/90"
            >
              Phone Number
            </Label>
            <Input
              id="phone"
              name="phone"
              type="tel"
              placeholder="+20 1XXXXXXXXX"
              autoComplete="tel"
              required
              disabled={isLoading}
              value={formData.phone}
              onChange={(e) => {
                handleInputChange("phone", e.target.value);
                if (errors.phone) clearError();
              }}
              className="h-10 px-4 bg-background border border-logo-border hover:border-logo-border/80 focus:border-primary focus:ring-1 focus:ring-primary/20 transition-all duration-200"
            />
            {errors.phone && (
              <p className="text-sm text-red-600">{errors.phone}</p>
            )}
          </div>

          {/* Gender Radio Buttons */}
          <div className="space-y-2">
            <Label
              htmlFor="gender"
              className="text-sm font-medium text-foreground/90"
            >
              Gender
            </Label>
            <div className="flex items-center space-x-4">
              <label>
                <input
                  type="radio"
                  name="gender"
                  value="male"
                  disabled={isLoading}
                  checked={formData.gender === "male"}
                  onChange={(e) => {
                    handleInputChange("gender", e.target.value);
                    if (errors.gender) clearError();
                  }}
                  className="h-4 w-4 accent-logo-dark-button focus:ring-logo-dark-button"
                />
                <span className="ml-2 text-sm text-foreground/90">Male</span>
              </label>
              <label>
                <input
                  type="radio"
                  name="gender"
                  value="female"
                  disabled={isLoading}
                  checked={formData.gender === "female"}
                  onChange={(e) => {
                    handleInputChange("gender", e.target.value);
                    if (errors.gender) clearError();
                  }}
                  className="h-4 w-4 accent-logo-dark-button focus:ring-logo-dark-button"
                />
                <span className="ml-2 text-sm text-foreground/90">Female</span>
              </label>
            </div>
            {errors.gender && (
              <p className="text-sm text-red-600">{errors.gender}</p>
            )}
          </div>
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
            Creating account...
          </>
        ) : (
          "Create account"
        )}
      </Button>

      <div className="text-center text-sm">
        <p className="text-muted-foreground">
          Already have an account?{" "}
          <Link
            href="/login"
            className="text-primary hover:text-primary/90 font-medium hover:underline"
          >
            Sign in
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
