"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Sidebar } from "@/components/sidebar/sidebar";
import Link from "next/link";
import { ArrowLeft, ChevronDown } from "lucide-react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";

export default function EditShippingPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    governorate: "",
    price: "",
    estimatedDeliveryDays: ""
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // API
      console.log("Submitting shipping location:", formData);
      router.push("/dashboard/shipping");
    } catch (error) {
      console.error("Error editing shipping location:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar />

      {/* Main Content */}
      <main className="flex-1 p-4 md:p-6 lg:ml-80 pt-20 md:pt-20 lg:pt-6 bg-gray-100">
        <div className="flex items-center mb-6">
          {/* <Link href="/dashboard/shipping" className="mr-4">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
          </Link> */}
          <h1 className="text-2xl md:text-3xl font-bold">Edit Shipping Location</h1>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm">
          <form onSubmit={handleSubmit}>
            <div className="mb-6">
              <label htmlFor="governorate" className="block text-sm font-medium text-gray-700 mb-1">
                Governorate Name <span className="text-red-500">*</span>
              </label>
              <Input
                id="governorate"
                name="governorate"
                value={formData.governorate}
                onChange={handleChange}
                required
                placeholder="Cairo, Alexandria, etc."
              />
              <p className="text-xs text-gray-400 mt-1">
                Enter the governorate name for this shipping option.
              </p>
            </div>

            <div className="mb-6">
              <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-1">
                Shipping Price <span className="text-red-500">*</span>
              </label>
              <div className="flex">
                <Input
                  id="price"
                  name="price"
                  value={formData.price}
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
              <label htmlFor="estimatedDeliveryDays" className="block text-sm font-medium text-gray-700 mb-1">
                Estimated Delivery Time <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <select
                  id="estimatedDeliveryDays"
                  name="estimatedDeliveryDays"
                  value={formData.estimatedDeliveryDays}
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
                {isSubmitting ? "Saving..." : "Save Location"}
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