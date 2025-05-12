"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Sidebar } from "@/components/sidebar/sidebar";
import Link from "next/link";
import { ArrowLeft, ChevronDown, ChevronUp } from "lucide-react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export default function AddAboutSectionPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    type: "Text",
    status: "Visible",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [typeDropdownOpen, setTypeDropdownOpen] = useState(false);
  const [statusDropdownOpen, setStatusDropdownOpen] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSelectClick = (field: string) => {
    if (field === "type") {
      setTypeDropdownOpen((prev) => !prev);
    } else if (field === "status") {
      setStatusDropdownOpen((prev) => !prev);
    }
  };

  const handleSelectBlur = (field: string) => {
    setTimeout(() => {
      if (field === "type") {
        setTypeDropdownOpen(false);
      } else if (field === "status") {
        setStatusDropdownOpen(false);
      }
    }, 200);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
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

      <main className="flex-1 p-4 md:p-6 lg:ml-80 pt-20 md:pt-20 lg:pt-6 bg-gray-100">
        {/* Header section with title and subtitle */}
        <div className="mb-6 space-y-2">
          <h1 className="text-2xl md:text-3xl font-bold">Add About Section</h1>
          <h2 className="text-lg md:text-xl text-gray-600">
            Create a new about section for your store
          </h2>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm">
          <form onSubmit={handleSubmit}>
            <div className="mb-6">
              <label
                htmlFor="title"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Title <span className="text-red-500">*</span>
              </label>
              <Input
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
                placeholder="Section Title"
              />
              <p className="text-xs text-gray-400 mt-1">
                The title will be displayed to your customers.
              </p>
            </div>

            <div className="mb-6">
              <label
                htmlFor="content"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Content <span className="text-red-500">*</span>
              </label>
              <Textarea
                id="content"
                name="content"
                value={formData.content}
                onChange={handleChange}
                required
                rows={6}
                placeholder="Section Content"
              />
              <p className="text-xs text-gray-400 mt-1">
                A detailed description for this section that will appear on your
                store.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label
                  htmlFor="type"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Section Type
                </label>
                <div className="relative">
                  <select
                    id="type"
                    name="type"
                    value={formData.type}
                    onChange={handleChange}
                    onClick={() => handleSelectClick("type")}
                    onBlur={() => handleSelectBlur("type")}
                    required
                    className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-md focus:outline-none focus:border-gray-300 appearance-none cursor-pointer"
                  >
                    <option value="Text">Text</option>
                    <option value="Image">Image</option>
                    <option value="Mission">Mission</option>
                    <option value="Team">Team</option>
                    <option value="History">History</option>
                  </select>
                  <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                    {typeDropdownOpen ? (
                      <ChevronUp className="h-4 w-4 text-gray-500" />
                    ) : (
                      <ChevronDown className="h-4 w-4 text-gray-500" />
                    )}
                  </div>
                </div>
              </div>

              <div>
                <label
                  htmlFor="status"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Visibility Status
                </label>
                <div className="relative">
                  <select
                    id="status"
                    name="status"
                    value={formData.status}
                    onChange={handleChange}
                    onClick={() => handleSelectClick("status")}
                    onBlur={() => handleSelectBlur("status")}
                    required
                    className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-md focus:outline-none focus:border-gray-300 appearance-none cursor-pointer"
                  >
                    <option value="Visible">Visible</option>
                    <option value="Hidden">Hidden</option>
                  </select>
                  <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                    {statusDropdownOpen ? (
                      <ChevronUp className="h-4 w-4 text-gray-500" />
                    ) : (
                      <ChevronDown className="h-4 w-4 text-gray-500" />
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-start space-x-4">
              <Button
                type="submit"
                className="bg-logo-dark-button text-primary-foreground hover:bg-logo-dark-button-hover"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Saving..." : "Save Section"}
              </Button>
              <Link href="/dashboard/store-info">
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
