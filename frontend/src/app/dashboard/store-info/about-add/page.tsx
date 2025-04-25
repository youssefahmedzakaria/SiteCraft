"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Sidebar } from "@/components/sidebar/sidebar";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";

export default function AddAboutSectionPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    type: "Text",
    status: "Visible"
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
      console.log("Submitting about section:", formData);
      router.push("/dashboard/store-info");
    } catch (error) {
      console.error("Error adding about section:", error);
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
          <h1 className="text-2xl md:text-3xl font-bold">Add About Section</h1>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm">
          <form onSubmit={handleSubmit}>
            <div className="mb-6">
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                Title
              </label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-logo-dark-button focus:border-logo-dark-button"
                placeholder="Section Title"
              />
            </div>

            <div className="mb-6">
              <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-1">
                Content
              </label>
              <textarea
                id="content"
                name="content"
                value={formData.content}
                onChange={handleChange}
                required
                rows={6}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-logo-dark-button focus:border-logo-dark-button"
                placeholder="Section Content"
              ></textarea>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-1">
                  Section Type
                </label>
                <select
                  id="type"
                  name="type"
                  value={formData.type}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-logo-dark-button focus:border-logo-dark-button"
                >
                  <option value="Text">Text</option>
                  <option value="Image">Image</option>
                  <option value="Mission">Mission</option>
                  <option value="Team">Team</option>
                  <option value="History">History</option>
                </select>
              </div>

              <div>
                <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">
                  Visibility Status
                </label>
                <select
                  id="status"
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-logo-dark-button focus:border-logo-dark-button"
                >
                  <option value="Visible">Visible</option>
                  <option value="Hidden">Hidden</option>
                </select>
              </div>
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
                {isSubmitting ? "Saving..." : "Save Section"}
              </Button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}