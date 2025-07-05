"use client";

import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/e-commerce/ui/button";
import { Input } from "@/components/e-commerce/ui/input";
import { Label } from "@/components/e-commerce/ui/label";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useLoginForm } from "@/hooks/e-commerce/ecommerceUseLoginForm";
import { Icons } from "@/components/SiteCraft/icons";

export default function LoginPage() {
  const path = usePathname();
  const pathSegments = path.split("/");
  const subdomain = pathSegments[2];
  const [showPassword, setShowPassword] = useState<boolean>(false);

  const [initialColors, setInitialColors] = useState({
    primary: "#000000",
    secondary: "#000000",
    accent: "#000000",
  });

  const {
    email,
    setEmail,
    password,
    setPassword,
    isLoading,
    loginError,
    onSubmit,
    clearError,
  } = useLoginForm();

  return (
    <div
      className={`min-h-screen flex pt-20 items-center justify-center px-4 bg-[#ffffff] font-sans `}
    >
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h2
            className="text-3xl font-bold"
            style={{ color: initialColors.primary }}
          >
            Welcome Back
          </h2>
          <p
            className="mt-2 opacity-60"
            style={{ color: initialColors.primary }}
          >
            Sign in to your account
          </p>
        </div>

        <form onSubmit={onSubmit} className="mt-8 space-y-6">
          {loginError && (
            <div className="bg-red-50 border border-red-200 rounded-md p-3">
              <p className="text-red-600 text-sm">{loginError}</p>
            </div>
          )}

          <div className="space-y-4">
            <div>
              <Label htmlFor="email" style={{ color: initialColors.primary }}>
                Email address
              </Label>
              <Input
                id="email"
                type="email"
                autoComplete="email"
                name="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (loginError) {
                    clearError();
                  }
                }}
                placeholder="name@example.com"
                className={`mt-1 border-2 rounded-lg`}
                style={{ borderColor: initialColors.secondary }}
                required
                disabled={isLoading}
              />
            </div>

            <div>
              <Label
                htmlFor="password"
                style={{ color: initialColors.primary }}
              >
                Password
              </Label>
              <div className="relative mt-1">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (loginError) {
                      clearError();
                    }
                  }}
                  placeholder="••••••••"
                  className={`pr-10 border-2 rounded-lg`}
                  style={{ borderColor: initialColors.secondary }}
                  required
                  autoComplete="current-password"
                  disabled={isLoading}
                  name="password"
                />

                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                >
                  {showPassword ? (
                    <EyeOff
                      className="h-4 w-4"
                      style={{ color: initialColors.primary }}
                    />
                  ) : (
                    <Eye
                      className="h-4 w-4"
                      style={{ color: initialColors.primary }}
                    />
                  )}
                </button>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <Link
              href={`/e-commerce/${subdomain}/forgot-password`}
              className="text-sm hover:underline"
              style={{ color: initialColors.primary }}
            >
              Forgot your password?
            </Link>
          </div>

          <Button
            type="submit"
            className={`w-full text-white hover:opacity-90 rounded-lg`}
            style={{ backgroundColor: initialColors.secondary }}
            disabled={isLoading}
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

          <div className="text-center">
            <p
              className="text-sm opacity-60"
              style={{ color: initialColors.primary }}
            >
              {"Don't have an account? "}
              <Link
                href={`/e-commerce/${subdomain}/register`}
                className="font-medium hover:underline"
                style={{ color: initialColors.primary }}
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
