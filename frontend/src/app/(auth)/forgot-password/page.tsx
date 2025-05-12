"use client";

import { ForgotPasswordForm } from "@/components/auth/ForgotPassword/forgot-password-form";
import Link from "next/link";
import Image from "next/image";

export default function ForgotPasswordPage() {
  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden">
      <div className="container px-4 py-8 flex flex-col md:flex-row items-center justify-between max-w-6xl">
        {/* Left Side - Branding */}
        <div className="w-full md:w-1/2 flex flex-col items-center md:items-start mb-8 md:mb-0">
          <Link
            href="/"
            className="flex items-center mb-0 group transition-opacity hover:opacity-90"
          >
            <Image
              src="/logo.png"
              alt="SiteCraft Logo"
              width={48}
              height={48}
              className="h-12 w-auto object-contain"
            />
            <Image
              src="/font.png"
              alt="SiteCraft"
              width={180}
              height={36}
              className="h-18 w-auto xl-3 object-contain"
            />
          </Link>
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-6 text-center md:text-left">
            Reset your password,
            <br />
            Get back to business.
          </h1>
          <p className="text-muted-foreground text-center md:text-left max-w-md text-lg">
            Don't worry! It happens. Please enter your email address and we'll
            send you a link to reset your password.
          </p>
          <div className="mt-4 md:mt-8 flex justify-center md:justify-start w-full">
            <Image
              src="/auth.svg"
              alt="Authentication illustration"
              width={400}
              height={300}
              className="max-w-full h-auto"
              priority
            />
          </div>
        </div>

        {/* Right Side - Form */}
        <div className="w-full md:w-1/2 flex justify-center md:justify-end">
          <div className="w-full max-w-md relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-primary/40 to-primary/20 rounded-lg blur-md opacity-75 group-hover:opacity-100 transition duration-1000"></div>
            <div className="relative bg-background/90 backdrop-blur-sm p-12 rounded-lg border border-border/20">
              <ForgotPasswordForm />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
