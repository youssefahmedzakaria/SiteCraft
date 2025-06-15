"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Icons } from "../../icons";
import { Alert, AlertDescription } from "../../ui/alert";
import { AlertCircle } from "lucide-react";
import Link from "next/link";

export function ForgotPasswordForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState("");

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      // TODO: Implement password reset logic here
      // For now, we'll just simulate a successful submission
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setIsSubmitted(true);
    } catch (err) {
      setError("Failed to send reset email. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }

  if (isSubmitted) {
    return (
      <div className="w-full space-y-6 text-center">
        <div className="space-y-2">
          <h1 className="text-2xl font-semibold tracking-tight">
            Check your email
          </h1>
          <p className="text-sm text-muted-foreground">
            We've sent you a password reset link to {email}
          </p>
        </div>
        <Button
          variant="link"
          className="text-primary hover:text-primary/90"
          onClick={() => setIsSubmitted(false)}
        >
          Try another email
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="w-full space-y-6">
      <div className="space-y-2 text-center">
        <h1 className="text-2xl font-semibold tracking-tight">
          Forgot password
        </h1>
        <p className="text-sm text-muted-foreground">
          Enter your email address and we'll send you a link to reset your
          password
        </p>
      </div>

      {error && (
        <Alert variant="destructive" className="text-sm">
          <div className="flex items-center gap-2">
            <AlertCircle className="h-4 w-4 flex-shrink-0" />
            <AlertDescription>{error}</AlertDescription>
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
            onChange={(e) => setEmail(e.target.value)}
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
            Sending reset link...
          </>
        ) : (
          "Send reset link"
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
