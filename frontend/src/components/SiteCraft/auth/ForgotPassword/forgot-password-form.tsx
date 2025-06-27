"use client";

import { useForgotPasswordForm } from "@/hooks/useForgotPasswordForm";
import { Button } from "@/components/SiteCraft/ui/button";
import { Input } from "@/components/SiteCraft/ui/input";
import { Label } from "@/components/SiteCraft/ui/label";
import { Icons } from "../../icons";
import { Alert, AlertDescription } from "../../ui/alert";
import { AlertCircle, ArrowLeft, CheckCircle } from "lucide-react";
import Link from "next/link";

export function ForgotPasswordForm() {
  const {
    step,
    email,
    setEmail,
    otp,
    setOtp,
    newPassword,
    setNewPassword,
    confirmPassword,
    setConfirmPassword,
    isLoading,
    error,
    clearError,
    handleSendOTP,
    handleVerifyOTP,
    handleResetPassword,
    handleBackToLogin
  } = useForgotPasswordForm();

  // Step 1: Email Input
  if (step === 'email') {
    return (
      <form onSubmit={handleSendOTP} className="w-full space-y-6">
        <div className="space-y-2 text-center">
          <h1 className="text-2xl font-semibold tracking-tight">
            Forgot password
          </h1>
          <p className="text-sm text-muted-foreground">
            Enter your email address and we'll send you a verification code
          </p>
        </div>

        {error && (
          <Alert variant="destructive" className="text-sm">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
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
                setEmail(e.target.value);
                if (error) clearError();
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
              Sending code...
            </>
          ) : (
            "Send verification code"
          )}
        </Button>

        <div className="text-center text-sm">
          <p className="text-muted-foreground">
            Remember your password?{" "}
            <Link
              href="/login"
              className="text-primary hover:text-primary/90 font-medium hover:underline"
            >
              Sign in
            </Link>
          </p>
        </div>
      </form>
    );
  }

  // Step 2: OTP Verification
  if (step === 'otp') {
    return (
      <form onSubmit={handleVerifyOTP} className="w-full space-y-6">
        <div className="space-y-2 text-center">
          <h1 className="text-2xl font-semibold tracking-tight">
            Enter verification code
          </h1>
          <p className="text-sm text-muted-foreground">
            We've sent a verification code to {email}
          </p>
        </div>

        {error && (
          <Alert variant="destructive" className="text-sm">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <div className="space-y-4">
          <div className="space-y-2">
            <Label
              htmlFor="otp"
              className="text-sm font-medium text-foreground/90"
            >
              Verification code
            </Label>
            <Input
              id="otp"
              name="otp"
              type="text"
              placeholder="Enter 6-digit code"
              autoComplete="one-time-code"
              required
              disabled={isLoading}
              value={otp}
              onChange={(e) => {
                setOtp(e.target.value);
                if (error) clearError();
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
              Verifying...
            </>
          ) : (
            "Verify code"
          )}
        </Button>

        <div className="text-center text-sm">
          <Button
            type="button"
            variant="link"
            className="text-primary hover:text-primary/90"
            onClick={() => window.location.reload()}
          >
            Try another email
          </Button>
        </div>
      </form>
    );
  }

  // Step 3: New Password
  if (step === 'newPassword') {
    return (
      <form onSubmit={handleResetPassword} className="w-full space-y-6">
        <div className="space-y-2 text-center">
          <h1 className="text-2xl font-semibold tracking-tight">
            Reset your password
          </h1>
          <p className="text-sm text-muted-foreground">
            Enter your new password
          </p>
        </div>

        {error && (
          <Alert variant="destructive" className="text-sm">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <div className="space-y-4">
          <div className="space-y-2">
            <Label
              htmlFor="newPassword"
              className="text-sm font-medium text-foreground/90"
            >
              New password
            </Label>
            <Input
              id="newPassword"
              name="newPassword"
              type="password"
              placeholder="••••••••"
              autoComplete="new-password"
              required
              disabled={isLoading}
              value={newPassword}
              onChange={(e) => {
                setNewPassword(e.target.value);
                if (error) clearError();
              }}
              className="h-10 px-4 bg-background border border-logo-border hover:border-logo-border/80 focus:border-primary focus:ring-1 focus:ring-primary/20 transition-all duration-200"
            />
          </div>

          <div className="space-y-2">
            <Label
              htmlFor="confirmPassword"
              className="text-sm font-medium text-foreground/90"
            >
              Confirm new password
            </Label>
            <Input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              placeholder="••••••••"
              autoComplete="new-password"
              required
              disabled={isLoading}
              value={confirmPassword}
              onChange={(e) => {
                setConfirmPassword(e.target.value);
                if (error) clearError();
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
              Resetting password...
            </>
          ) : (
            "Reset password"
          )}
        </Button>
      </form>
    );
  }

  // Step 4: Success
  if (step === 'success') {
    return (
      <div className="w-full space-y-6 text-center">
        <div className="space-y-2">
          <div className="flex justify-center">
            <CheckCircle className="h-12 w-12 text-green-600" />
          </div>
          <h1 className="text-2xl font-semibold tracking-tight">
            Password reset successfully!
          </h1>
          <p className="text-sm text-muted-foreground">
            Your password has been updated. You can now sign in with your new password.
          </p>
        </div>

        <Button
          onClick={handleBackToLogin}
          className="w-full h-10 text-sm font-medium transition-all duration-200 
                   bg-logo-dark-button hover:bg-logo-dark-button-hover active:dark-button-active
                   text-primary-foreground
                   transform hover:-translate-y-0.5 active:translate-y-0
                   rounded-md"
        >
          Sign in
        </Button>
      </div>
    );
  }

  return null;
}
