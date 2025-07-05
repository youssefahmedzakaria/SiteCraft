"use client";

import { useForgotPasswordForm } from "@/hooks/useForgotPasswordForm";
import { Button } from "@/components/e-commerce/ui/button";
import { Input } from "@/components/e-commerce/ui/input";
import { Label } from "@/components/e-commerce/ui/label";
import { Icons } from "@/components/SiteCraft/icons";
import { AlertCircle, CheckCircle } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

export default function ForgotPasswordPage() {
  const path = usePathname();
  const pathSegments = path.split("/");
  const subdomain = pathSegments[2];
  const [initialColors] = useState({
    primary: "#000000",
    secondary: "#000000",
    accent: "#000000",
  });
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
    handleBackToLogin,
  } = useForgotPasswordForm();

  return (
    <div className="min-h-screen flex pt-20 items-center justify-center px-4 bg-[#ffffff] font-sans">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold" style={{ color: initialColors.primary }}>
            Forgot Password
          </h2>
          <p className="mt-2 opacity-60" style={{ color: initialColors.primary }}>
            {step === "email" && "Enter your email to receive a verification code."}
            {step === "otp" && `We've sent a verification code to ${email}.`}
            {step === "newPassword" && "Enter your new password below."}
            {step === "success" && "Your password has been reset successfully."}
          </p>
        </div>

        {step === "email" && (
          <form onSubmit={handleSendOTP} className="space-y-6">
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-md p-3">
                <div className="flex items-center">
                  <AlertCircle className="h-4 w-4 text-red-500 mr-2" />
                  <p className="text-red-600 text-sm">{error}</p>
                </div>
              </div>
            )}
            <div className="space-y-4">
              <div>
                <Label htmlFor="email" style={{ color: initialColors.primary }}>
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
                  className="mt-1 border-2 rounded-lg"
                  style={{ borderColor: initialColors.secondary }}
                />
              </div>
            </div>
            <Button
              type="submit"
              className="w-full text-white hover:opacity-90 rounded-lg"
              style={{ backgroundColor: initialColors.secondary }}
              disabled={isLoading}
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
              <p className="opacity-60" style={{ color: initialColors.primary }}>
                Remember your password?{' '}
                <Link
                  href={`/e-commerce/${subdomain}/login`}
                  className="font-medium hover:underline"
                  style={{ color: initialColors.primary }}
                >
                  Sign in
                </Link>
              </p>
            </div>
          </form>
        )}

        {step === "otp" && (
          <form onSubmit={handleVerifyOTP} className="space-y-6">
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-md p-3">
                <div className="flex items-center">
                  <AlertCircle className="h-4 w-4 text-red-500 mr-2" />
                  <p className="text-red-600 text-sm">{error}</p>
                </div>
              </div>
            )}
            <div className="space-y-4">
              <div>
                <Label htmlFor="otp" style={{ color: initialColors.primary }}>
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
                  className="mt-1 border-2 rounded-lg"
                  style={{ borderColor: initialColors.secondary }}
                />
              </div>
            </div>
            <Button
              type="submit"
              className="w-full text-white hover:opacity-90 rounded-lg"
              style={{ backgroundColor: initialColors.secondary }}
              disabled={isLoading}
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
                className="hover:underline"
                style={{ color: initialColors.primary }}
                onClick={() => window.location.reload()}
              >
                Try another email
              </Button>
            </div>
          </form>
        )}

        {step === "newPassword" && (
          <form onSubmit={handleResetPassword} className="space-y-6">
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-md p-3">
                <div className="flex items-center">
                  <AlertCircle className="h-4 w-4 text-red-500 mr-2" />
                  <p className="text-red-600 text-sm">{error}</p>
                </div>
              </div>
            )}
            <div className="space-y-4">
              <div>
                <Label htmlFor="newPassword" style={{ color: initialColors.primary }}>
                  New password
                </Label>
                <Input
                  id="newPassword"
                  name="newPassword"
                  type="password"
                  placeholder="Enter new password"
                  required
                  disabled={isLoading}
                  value={newPassword}
                  onChange={(e) => {
                    setNewPassword(e.target.value);
                    if (error) clearError();
                  }}
                  className="mt-1 border-2 rounded-lg"
                  style={{ borderColor: initialColors.secondary }}
                />
              </div>
              <div>
                <Label htmlFor="confirmPassword" style={{ color: initialColors.primary }}>
                  Confirm password
                </Label>
                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  placeholder="Confirm new password"
                  required
                  disabled={isLoading}
                  value={confirmPassword}
                  onChange={(e) => {
                    setConfirmPassword(e.target.value);
                    if (error) clearError();
                  }}
                  className="mt-1 border-2 rounded-lg"
                  style={{ borderColor: initialColors.secondary }}
                />
              </div>
            </div>
            <Button
              type="submit"
              className="w-full text-white hover:opacity-90 rounded-lg"
              style={{ backgroundColor: initialColors.secondary }}
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                  Resetting...
                </>
              ) : (
                "Reset password"
              )}
            </Button>
          </form>
        )}

        {step === "success" && (
          <div className="text-center space-y-6">
            <div className="flex justify-center">
              <CheckCircle className="h-12 w-12 text-green-500" />
            </div>
            <h3 className="text-xl font-semibold" style={{ color: initialColors.primary }}>
              Password reset successfully!
            </h3>
            <p className="opacity-60" style={{ color: initialColors.primary }}>
              You can now sign in with your new password.
            </p>
            <Link
              href={`/e-commerce/${subdomain}/login`}
              className="w-full inline-block text-center text-white rounded-lg px-4 py-2 font-medium hover:opacity-90"
              style={{ backgroundColor: initialColors.secondary }}
            >
              Back to Login
            </Link>
          </div>
        )}
      </div>
    </div>
  );
} 