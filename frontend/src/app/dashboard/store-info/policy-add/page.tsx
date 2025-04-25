"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Sidebar } from "@/components/sidebar/sidebar";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";

export default function AddPolicyPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    status: "Active"
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
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
      console.log("Submitting policy:", formData);
    router.push("/dashboard/store-info");
    } catch (error) {
      console.error("Error adding policy:", error);
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
          <Link href="/dashboard/store-info" className="mr-4">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
          </Link>
          <h1 className="text-2xl md:text-3xl font-bold">Add Store Policy</h1>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm">
          <form onSubmit={handleSubmit}>
            <div className="mb-6">
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                Policy Title
              </label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-logo-dark-button focus:border-logo-dark-button"
                placeholder="Return Policy, Privacy Policy, etc."
              />
            </div>

            <div className="mb-6">
              <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-1">
                Policy Content
              </label>
              <textarea
                id="content"
                name="content"
                value={formData.content}
                onChange={handleChange}
                required
                rows={10}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-logo-dark-button focus:border-logo-dark-button"
                placeholder="Enter the full policy text here..."
              ></textarea>
              <p className="mt-1 text-sm text-gray-500">
                Write a clear and concise policy that customers can easily understand.
              </p>
            </div>

            <div className="mb-6">
              <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">
                Policy Status
              </label>
              <select
                id="status"
                name="status"
                value={formData.status}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-logo-dark-button focus:border-logo-dark-button"
              >
                <option value="Active">Active</option>
                <option value="Draft">Draft</option>
              </select>
              <p className="mt-1 text-sm text-gray-500">
                Active policies are visible to customers. Draft policies are only visible to store administrators.
              </p>
            </div>

            <div className="flex justify-end space-x-4">
              <Link href="/dashboard/store-info">
                <Button type="button" variant="outline">
                  Cancel
                </Button>
              </Link>
              <Button 
                type="submit" 
                className="bg-logo-dark-button text-primary-foreground hover:bg-logo-dark-button-hover"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Saving..." : "Save Policy"}
              </Button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}