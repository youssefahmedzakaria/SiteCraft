"use client";

import type React from "react";
import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/e-commerce/ui/button";
import { Input } from "@/components/e-commerce/ui/input";
import { Label } from "@/components/e-commerce/ui/label";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Icons } from "@/components/SiteCraft/icons";
import { useSignupForm } from "@/hooks/e-commerce/ecommerceUseSignUpForm"; 

export default function RegisterPage() {
  const [initialColors, setInitialColors] = useState({
    primary: "#000000",
    secondary: "#000000",
    accent: "#000000",
  });

  const path = usePathname();
  const pathSegments = path.split("/");
  const subdomain = pathSegments[2];

  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showConfirmPassword, setShowConfirmPassword] =
    useState<boolean>(false);

  const {
    formData,
    handleInputChange,
    errors,
    signupError,
    isLoading,
    onSubmit,
    clearError,
  } = useSignupForm();

  return (
    <div
      className={`min-h-screen flex pt-20 items-center justify-center px-4 py-8 font-sans`}
      style={{ backgroundColor: "bg-[#FFFFFF]", color: `text-[${initialColors.primary}]` }}
    >
      <div className="max-w-md pt-8 w-full space-y-8">
        <div className="text-center">
          <h2
            className="text-3xl font-bold"
            style={{ color: `text-[${initialColors.primary}]` }}
          >
            Create Account
          </h2>
          <p
            className="mt-2 opacity-60"
            style={{ color: `text-[${initialColors.primary}]` }}
          >
            Join us today
          </p>
        </div>

        <form onSubmit={onSubmit} className="mt-8 space-y-6">
          {signupError && (
            <div className="bg-red-50 border border-red-200 rounded-md p-3">
              <p className="text-red-600 text-sm">{signupError}</p>
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="name" style={{ color: `text-[${initialColors.primary}]` }}>
                Name *
              </Label>
              <Input
                id="name"
                name="name"
                type="text"
                value={formData.name}
                onChange={(e) => {
                  handleInputChange("name", e.target.value);
                  if (errors.name) clearError();
                }}
                placeholder="Full Name"
                className={`mt-1 border-2 rounded-lg`}
                style={{ borderColor: `text-[${initialColors.secondary}]` }}
                required
                autoComplete="name"
                disabled={isLoading}
              />
              {errors.name && (
                <p className="text-sm text-red-600">{errors.name}</p>
              )}
            </div>

            <div>
              <Label htmlFor="email" style={{ color: `text-[${initialColors.primary}]` }}>
                Email address *
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
                className={`mt-1 border-2 rounded-lg`}
                style={{ borderColor: `text-[${initialColors.secondary}]` }}
              />
              {errors.email && (
                <p className="text-sm text-red-600">{errors.email}</p>
              )}
            </div>

            <div>
              <Label htmlFor="phone" style={{ color: `text-[${initialColors.primary}]` }}>
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
                className={`mt-1 border-2 rounded-lg`}
                style={{ borderColor: `text-[${initialColors.secondary}]` }}
              />
              {errors.phone && (
                <p className="text-sm text-red-600">{errors.phone}</p>
              )}
            </div>

            <div>
              <Label
                htmlFor="password"
                style={{ color: `text-[${initialColors.primary}]` }}
              >
                Password *
              </Label>
              <div className="relative mt-1">
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
                  className={`pr-10 border-2 rounded-lg`}
                  style={{ borderColor: `text-[${initialColors.secondary}]` }}
                />

                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                >
                  {showPassword ? (
                    <EyeOff
                      className="h-4 w-4"
                      style={{ color: `text-[${initialColors.primary}]` }}
                    />
                  ) : (
                    <Eye
                      className="h-4 w-4"
                      style={{ color: `text-[${initialColors.primary}]` }}
                    />
                  )}
                </button>
              </div>

              {errors.password && (
                <p className="text-sm text-red-600">{errors.password}</p>
              )}
            </div>

            <div>
              <Label
                htmlFor="confirmPassword"
                style={{ color: `text-[${initialColors.primary}]` }}
              >
                Confirm Password *
              </Label>

              <div className="relative mt-1">
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
                  className={`pr-10 border-2 rounded-lg`}
                  style={{ borderColor: `text-[${initialColors.secondary}]` }}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                >
                  {showConfirmPassword ? (
                    <EyeOff
                      className="h-4 w-4"
                      style={{ color: `text-[${initialColors.primary}]` }}
                    />
                  ) : (
                    <Eye
                      className="h-4 w-4"
                      style={{ color: `text-[${initialColors.primary}]` }}
                    />
                  )}
                </button>
              </div>

              {errors.confirmPassword && (
                <p className="text-sm text-red-600">{errors.confirmPassword}</p>
              )}
            </div>
          </div>

          <Button
            type="submit"
            className={`w-full text-white hover:opacity-90 rounded-lg`}
            style={{ backgroundColor: `bg-[${initialColors.secondary}]` }}
            disabled={isLoading}
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

          <div className="text-center">
            <p
              className="text-sm opacity-60"
              style={{ color: `text-[${initialColors.primary}]` }}
            >
              Already have an account?{" "}
              <Link
                href={`/e-commerce/${subdomain}/login`}
                className="font-medium hover:underline"
                style={{ color: `text-[${initialColors.primary}]` }}
              >
                Sign in
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}


