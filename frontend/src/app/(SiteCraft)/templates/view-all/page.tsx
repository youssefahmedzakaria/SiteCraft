"use client";

import { TemplateCard } from "@/components/SiteCraft/templates/TemplateCard";
import { allTemplates } from "@/lib/templates";
import { Button } from "@/components/SiteCraft/ui/button";
import { Card, CardContent } from "@/components/SiteCraft/ui/card";

export default function ViewAllTemplatesPage() {
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

        {/* Title */}
        <h1 className="text-2xl md:text-3xl font-bold mt-2">All Templates</h1>
        <p className="text-gray-500 mt-2 mb-6">
          Browse our complete collection of professional templates
        </p>

        {/* Templates Card */}
        <Card className="bg-white shadow-md">
          <CardContent className="pt-2 pb-2">
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {allTemplates.map((template) => (
                <TemplateCard key={template.id} template={template} />
              ))}
            </div>
          </CardContent>
        </Card>

        <div className="mt-6">
          <Button
            variant="outline"
            onClick={() => (window.location.href = "/templates")}
            className="border-gray-300 hover:bg-gray-100"
          >
            <svg
              className="w-4 h-4 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              ></path>
            </svg>
            Back
          </Button>
        </div>
      </main>
    </div>
  );
}
