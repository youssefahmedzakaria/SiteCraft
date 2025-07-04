"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/SiteCraft/ui/button";
import { Sidebar } from "@/components/SiteCraft/sidebar/sidebar";
import Link from "next/link";
import { ArrowLeft, ChevronDown, Loader2, AlertCircle } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { Input } from "@/components/SiteCraft/ui/input";
import { updateShippingInfo, getStoreShippingInfo } from "@/lib/shipping";
import { ShippingInfo } from "@/lib/shipping";
import { useAuth } from "@/hooks/useAuth";

export default function EditShippingPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const shippingId = searchParams.get('id');
  const { isAuthenticated } = useAuth();
  
  const [formData, setFormData] = useState({
    governmentName: "",
    shippingPrice: "",
    estimatedDeliveryTime: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [shippingInfo, setShippingInfo] = useState<ShippingInfo | null>(null);

  // Check if user is authenticated
  if (!isAuthenticated) {
    return (
      <div className="flex min-h-screen bg-gray-100">
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-800 mb-2">Authentication Required</h2>
            <p className="text-gray-600 mb-4">Please log in to edit shipping locations.</p>
            <Button 
              onClick={() => router.push('/login')}
              className="bg-logo-dark-button text-primary-foreground hover:bg-logo-dark-button-hover"
            >
              Login
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Load shipping info data
  useEffect(() => {
    const loadShippingInfo = async () => {
      if (!shippingId) {
        setError("Shipping ID is required");
        setIsLoading(false);
        return;
      }

      try {
        const allShippingInfo = await getStoreShippingInfo();
        const currentShipping = allShippingInfo.find(
          (info: ShippingInfo) => info.id === parseInt(shippingId)
        );

        if (!currentShipping) {
          setError("Shipping location not found");
          setIsLoading(false);
          return;
        }

        setShippingInfo(currentShipping);
        setFormData({
          governmentName: currentShipping.governmentName,
          shippingPrice: currentShipping.shippingPrice.toString(),
          estimatedDeliveryTime: currentShipping.estimatedDeliveryTime,
        });
      } catch (err) {
        console.error("Error loading shipping info:", err);
        setError(err instanceof Error ? err.message : "Failed to load shipping info");
      } finally {
        setIsLoading(false);
      }
    };

    loadShippingInfo();
  }, [shippingId]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      if (!shippingId) {
        throw new Error("Shipping ID is required");
      }

      // Validate form data
      if (!formData.governmentName || !formData.shippingPrice || !formData.estimatedDeliveryTime) {
        throw new Error("Please fill in all required fields");
      }

      const shippingData = {
        governmentName: formData.governmentName,
        shippingPrice: parseFloat(formData.shippingPrice),
        estimatedDeliveryTime: formData.estimatedDeliveryTime,
      };

      console.log("Updating shipping location:", { id: shippingId, data: shippingData });
      
      await updateShippingInfo(parseInt(shippingId), shippingData);
      console.log("✅ Shipping location updated successfully");
      
      router.push("/dashboard/shipping");
    } catch (error) {
      console.error("Error updating shipping location:", error);
      setError(error instanceof Error ? error.message : "Failed to update shipping location");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex min-h-screen bg-gray-100">
        <Sidebar />
        <main className="flex-1 p-4 md:p-6 lg:ml-80 pt-20 md:pt-20 lg:pt-6 bg-gray-100">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-logo-dark-button" />
              <p className="text-gray-600">Loading shipping information...</p>
            </div>
          </div>
        </main>
      </div>
    );
  }

  if (error && !shippingInfo) {
    return (
      <div className="flex min-h-screen bg-gray-100">
        <Sidebar />
        <main className="flex-1 p-4 md:p-6 lg:ml-80 pt-20 md:pt-20 lg:pt-6 bg-gray-100">
          <div className="text-center">
            <p className="text-red-600 mb-4">{error}</p>
            <Link href="/dashboard/shipping">
              <Button variant="outline">Back to Shipping</Button>
            </Link>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar />

      {/* Main Content */}
      <main className="flex-1 p-4 md:p-6 lg:ml-80 pt-20 md:pt-20 lg:pt-6 bg-gray-100">
        {/* Header section with title and subtitle */}
        <div className="mb-6 space-y-2">
          <h1 className="text-2xl md:text-3xl font-bold">
            Edit Shipping Location
          </h1>
          <h2 className="text-lg md:text-xl text-gray-600">
            Edit shipping location information
          </h2>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm">
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-md">
              <p className="text-red-600 text-sm">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="mb-6">
              <label
                htmlFor="governmentName"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Governorate Name <span className="text-red-500">*</span>
              </label>
              <Input
                id="governmentName"
                name="governmentName"
                value={formData.governmentName}
                onChange={handleChange}
                required
                placeholder="Cairo, Alexandria, etc."
              />
              <p className="text-xs text-gray-400 mt-1">
                Enter the governorate name for this shipping option.
              </p>
            </div>

            <div className="mb-6">
              <label
                htmlFor="shippingPrice"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Shipping Price <span className="text-red-500">*</span>
              </label>
              <div className="flex">
                <Input
                  id="shippingPrice"
                  name="shippingPrice"
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.shippingPrice}
                  onChange={handleChange}
                  required
                  placeholder="50"
                />
                <span className="ml-2 inline-flex items-center px-3 py-2 rounded-md border border-gray-300 bg-gray-50 text-gray-500 text-sm">
                  EGP
                </span>
              </div>
              <p className="text-xs text-gray-400 mt-1">
                Enter the shipping cost without currency symbol.
              </p>
            </div>

            <div className="mb-6">
              <label
                htmlFor="estimatedDeliveryTime"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Estimated Delivery Time <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <select
                  id="estimatedDeliveryTime"
                  name="estimatedDeliveryTime"
                  value={formData.estimatedDeliveryTime}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-md focus:outline-none focus:border-gray-300 appearance-none cursor-pointer"
                >
                  <option value="">Select delivery time</option>
                  <option value="1-2 Days">1-2 Days</option>
                  <option value="2-3 Days">2-3 Days</option>
                  <option value="3-4 Days">3-4 Days</option>
                  <option value="4-5 Days">4-5 Days</option>
                  <option value="5-6 Days">5-6 Days</option>
                  <option value="1 Week">1 Week</option>
                  <option value="1-2 Weeks">1-2 Weeks</option>
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                  <ChevronDown className="h-4 w-4 text-gray-500" />
                </div>
              </div>
              <p className="text-xs text-gray-400 mt-1">
                This will be displayed to customers during checkout.
              </p>
            </div>

            <div className="flex justify-start space-x-4">
              <Button
                type="submit"
                className="bg-logo-dark-button text-primary-foreground hover:bg-logo-dark-button-hover"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Saving..." : "Save Changes"}
              </Button>
              <Link href="/dashboard/shipping">
                <Button type="button" variant="outline">
                  Cancel
                </Button>
              </Link>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}
