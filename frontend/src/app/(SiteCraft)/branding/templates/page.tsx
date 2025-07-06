"use client";

import Link from "next/link";
import { TemplateCard } from "@/components/SiteCraft/templates/TemplateCard";
import { useTemplates } from "@/lib/templates";
import { Button } from "@/components/SiteCraft/ui/button";
import { Card, CardContent } from "@/components/SiteCraft/ui/card";
import { useRouter } from "next/navigation";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { siteCraftCache } from "@/lib/cache";
import { useEffect, useState } from "react";
import { CustomizedTemplate } from "@/lib/customization";

export default function SuggestedTemplatesPage() {
  const { templates: staticTemplates, getTemplate } = useTemplates();
  const [templates, setTemplates] = useState<CustomizedTemplate[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const router = useRouter();

  useEffect(() => {
    // Load templates from cache first, then fall back to static templates
    const cachedData = siteCraftCache.getData();
    if (cachedData.templates && cachedData.templates.length > 0) {
      console.log(
        "📦 Using cached templates with images:",
        cachedData.templates.length
      );
      setTemplates(cachedData.templates);
    } else {
      console.log("📦 Using static templates (no cached templates found)");
      setTemplates(staticTemplates);
    }
    setIsLoading(false);
  }, [staticTemplates]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-100">
        <main className="container mx-auto p-4 md:p-6">
          <div className="flex items-center justify-center h-64">
            <div className="flex items-center space-x-2">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-black"></div>
              <span className="text-lg text-gray-600">
                Loading templates...
              </span>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <main className="container mx-auto p-4 md:p-6">
        {/* Progress Stepper */}
        <div className="mb-8">
          <div className="flex items-center justify-center">
            <div className="flex items-center">
              <div className="flex items-center justify-center w-10 h-10 rounded-full bg-black text-white">
                1
              </div>
              <div className="ml-2 font-medium">Branding</div>
            </div>
            <div className="w-12 h-1 mx-4 bg-black"></div>
            <div className="flex items-center">
              <div className="flex items-center justify-center w-10 h-10 rounded-full bg-black text-white">
                2
              </div>
              <div className="ml-2 font-medium">Color Palette</div>
            </div>
            <div className="w-12 h-1 mx-4 bg-black"></div>
            <div className="flex items-center">
              <div className="flex items-center justify-center w-10 h-10 rounded-full bg-black text-white">
                3
              </div>
              <div className="ml-2 font-medium">Templates</div>
            </div>
          </div>
        </div>

        <h1 className="text-2xl md:text-3xl font-bold mt-2">
          Suggested Templates
        </h1>
        <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-6">
          <p className="text-gray-500 w-full md:w-auto">
            Choose from our suggested collection of professional templates
          </p>
        </div>

        {/* Templates Card */}
        <Card className="bg-white shadow-md">
          <CardContent className="pt-2 pb-2">
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {templates.map((template) => (
                <TemplateCard key={template.id} template={template} />
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Navigation Buttons */}
        <div className="mt-6 flex justify-between">
          <Button
            variant="outline"
            onClick={() => (window.location.href = "/branding/color-palette")}
            className="border-gray-300 hover:bg-gray-100 flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </Button>
        </div>
      </main>
    </div>
  );
}
