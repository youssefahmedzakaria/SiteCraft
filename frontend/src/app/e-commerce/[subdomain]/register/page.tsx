"use client";

import type React from "react";
import { useState, type FormEvent } from "react";
import { Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/e-commerce/ui/button";
import { Input } from "@/components/e-commerce/ui/input";
import { Label } from "@/components/e-commerce/ui/label";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

// Theme configuration matching product page
const defaultTheme = {
  backgroundColor: "white",
  textColor: "black",
  accentColor: "white",
  secondaryColor: "black",
  borderRadius: "rounded-lg",
  fontFamily: "font-sans",
};

interface FormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
}

export default function RegisterPage() {
  const path = usePathname();
  const pathSegments = path.split("/");
  const subdomain = pathSegments[2];

  const [formData, setFormData] = useState<FormData>({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showConfirmPassword, setShowConfirmPassword] =
    useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleRegister = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    // Validation
    if (
      !formData.firstName ||
      !formData.lastName ||
      !formData.email ||
      !formData.password
    ) {
      setError("Please fill in all required fields");
      setIsLoading(false);
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      setIsLoading(false);
      return;
    }

    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters long");
      setIsLoading(false);
      return;
    }

    // Simulate loading delay
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Mock registration success
    localStorage.setItem("token", "mock-token-" + Date.now());
    router.push(`/e-commerce/${subdomain}/profile`);

    setIsLoading(false);
  };

  return (
    <div
      className={`min-h-screen flex pt-20 items-center justify-center px-4 py-8 ${defaultTheme.fontFamily}`}
      style={{ backgroundColor: defaultTheme.backgroundColor }}
    >
      <div className="max-w-md pt-8 w-full space-y-8">
        <div className="text-center">
          <h2
            className="text-3xl font-bold"
            style={{ color: defaultTheme.textColor }}
          >
            Create Account
          </h2>
          <p
            className="mt-2 opacity-60"
            style={{ color: defaultTheme.textColor }}
          >
            Join us today
          </p>
        </div>

        <form onSubmit={handleRegister} className="mt-8 space-y-6">
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-md p-3">
              <p className="text-red-600 text-sm">{error}</p>
            </div>
          )}

          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label
                  htmlFor="firstName"
                  style={{ color: defaultTheme.textColor }}
                >
                  First Name *
                </Label>
                <Input
                  id="firstName"
                  name="firstName"
                  type="text"
                  value={formData.firstName}
                  onChange={handleChange}
                  placeholder="First name"
                  className={`mt-1 border-2 ${defaultTheme.borderRadius}`}
                  style={{ borderColor: defaultTheme.secondaryColor }}
                  required
                />
              </div>
              <div>
                <Label
                  htmlFor="lastName"
                  style={{ color: defaultTheme.textColor }}
                >
                  Last Name *
                </Label>
                <Input
                  id="lastName"
                  name="lastName"
                  type="text"
                  value={formData.lastName}
                  onChange={handleChange}
                  placeholder="Last name"
                  className={`mt-1 border-2 ${defaultTheme.borderRadius}`}
                  style={{ borderColor: defaultTheme.secondaryColor }}
                  required
                />
              </div>
            </div>

            <div>
              <Label htmlFor="email" style={{ color: defaultTheme.textColor }}>
                Email address *
              </Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter your email"
                className={`mt-1 border-2 ${defaultTheme.borderRadius}`}
                style={{ borderColor: defaultTheme.secondaryColor }}
                required
              />
            </div>

            <div>
              <Label htmlFor="phone" style={{ color: defaultTheme.textColor }}>
                Phone Number
              </Label>
              <Input
                id="phone"
                name="phone"
                type="tel"
                value={formData.phone}
                onChange={handleChange}
                placeholder="Enter your phone number"
                className={`mt-1 border-2 ${defaultTheme.borderRadius}`}
                style={{ borderColor: defaultTheme.secondaryColor }}
              />
            </div>

            <div>
              <Label
                htmlFor="password"
                style={{ color: defaultTheme.textColor }}
              >
                Password *
              </Label>
              <div className="relative mt-1">
                <Input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Create a password"
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

            <div>
              <Label
                htmlFor="confirmPassword"
                style={{ color: defaultTheme.textColor }}
              >
                Confirm Password *
              </Label>
              <div className="relative mt-1">
                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="Confirm your password"
                  className={`pr-10 border-2 ${defaultTheme.borderRadius}`}
                  style={{ borderColor: defaultTheme.secondaryColor }}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                >
                  {showConfirmPassword ? (
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

          <Button
            type="submit"
            className={`w-full text-white hover:opacity-90 ${defaultTheme.borderRadius}`}
            style={{ backgroundColor: defaultTheme.secondaryColor }}
            disabled={isLoading}
          >
            {isLoading ? "Creating account..." : "Create account"}
          </Button>

          <div className="text-center">
            <p
              className="text-sm opacity-60"
              style={{ color: defaultTheme.textColor }}
            >
              Already have an account?{" "}
              <Link
                href={`/e-commerce/${subdomain}/login`}
                className="font-medium hover:underline"
                style={{ color: defaultTheme.textColor }}
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
