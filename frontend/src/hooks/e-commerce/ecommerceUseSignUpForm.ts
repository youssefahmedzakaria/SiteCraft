'use client'
import { useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "./ecommerceUseAuth";

export const useSignupForm = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    name: "",
    phone: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const { signup, signupError, isLoading, clearError } = useAuth();
  const router = useRouter();

  const path = usePathname();
  const pathSegments = path.split("/");
  const subdomain = pathSegments[2];

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email is invalid";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters";
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    if (!formData.name) {
      newErrors.name = "Name is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const onSubmit = async (event: React.SyntheticEvent) => {
    event.preventDefault();
    console.log("📝 Form submitted with data:", formData);
    clearError();

    if (!validateForm()) {
      console.log("❌ Form validation failed");
      return;
    }

    console.log("✅ Form validation passed, calling signup...");
    try {
      // Register the user (store will be created automatically by backend)
      const message = await signup({
        email: formData.email,
        password: formData.password,
        name: formData.name,
        phone: formData.phone,
      }, subdomain);

      console.log("📥 Signup returned message:", message);

      if (message && String(message).toLowerCase().includes('success')) {
        console.log("🎯 Redirecting to branding page...");
        // Only redirect if signup was successful
        router.push(`/e-commerce/${subdomain}/login`);
      } else {
        console.log("⚠️ No userId returned from signup");
        // Show error to user
        setErrors({ ...errors, form: String(message) || 'Registration failed' });
      }
    } catch (error) {
      console.error("💥 Registration error in form:", error);
    }
  };

  return {
    formData,
    handleInputChange,
    errors,
    signupError,
    isLoading,
    onSubmit,
    clearError,
  };
};
