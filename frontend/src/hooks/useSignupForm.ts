import { useState } from "react";
import { useAuth } from "./useAuth";
import { useRouter } from "next/navigation";
import { siteCraftCache } from "@/lib/cache";
import { checkEmail } from "@/lib/auth";

export const useSignupForm = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    name: "",
    phone: "",
    gender: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [emailAvailabilityError, setEmailAvailabilityError] = useState<string>("");
  const { signupError, isLoading, clearError } = useAuth();
  const router = useRouter();

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
    // Clear email availability error when email field changes
    if (field === 'email' && emailAvailabilityError) {
      setEmailAvailabilityError("");
    }
  };

  const onSubmit = async (event: React.SyntheticEvent) => {
    event.preventDefault();
    console.log("📝 Form submitted with data:", formData);
    clearError();
    setEmailAvailabilityError("");
    siteCraftCache.clearCache();

    if (!validateForm()) {
      console.log("❌ Form validation failed");
      return;
    }

    console.log("✅ Form validation passed, checking email availability...");
    
    try {
      // Check email availability
      await checkEmail(formData.email);
      console.log("✅ Email is available");
    } catch (error: any) {
      console.log("❌ Email availability check failed:", error);
      setEmailAvailabilityError(error.message || "User with this email already exists.");
      return;
    }

    console.log("✅ Email availability check passed, saving to cache...");
    try {
      // Save user data to cache instead of registering immediately
      const userData = {
        email: formData.email,
        password: formData.password,
        name: formData.name,
        phone: formData.phone,
        gender: formData.gender,
      };

      siteCraftCache.saveUserData(userData);
      console.log("💾 User data saved to cache:", userData);

      console.log("🎯 Redirecting to branding page...");
      // Redirect to branding page after saving to cache
      router.push("/branding");
    } catch (error) {
      console.error("💥 Registration error in form:", error);
    }
  };

  return {
    formData,
    handleInputChange,
    errors,
    emailAvailabilityError,
    signupError,
    isLoading,
    onSubmit,
    clearError,
  };
};
