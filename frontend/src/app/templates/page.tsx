'use client'

import Link from 'next/link'
import { TemplateCard } from "@/components/templates/TemplateCard"
import { suggestedTemplates } from "@/lib/templates"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

export default function SuggestedTemplatesPage() {
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

        <h1 className="text-2xl md:text-3xl font-bold mt-2">Suggested Templates</h1>
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mt-2 mb-6 space-y-4 md:space-y-0">
          <p className="text-gray-500 w-full md:w-auto">
            Choose from our suggested collection of professional templates
          </p>
          <Link href="/templates/view-all" className="w-full md:w-auto">
            <Button
              className="bg-black text-white hover:bg-gray-800 w-full"
            >
              View All Templates
            </Button>
          </Link>
        </div>

        {/* Templates Card */}
        <Card className="bg-white shadow-md">
          <CardContent className="pt-2 pb-2">
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {suggestedTemplates.map((template) => (
                <TemplateCard key={template.id} template={template} />
              ))}
            </div>
          </CardContent>
        </Card>
        
        <div className="mt-6">
          <Button
            variant="outline"
            onClick={() => window.location.href = "/branding/color-palette"}
            className="border-gray-300 hover:bg-gray-100"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
            </svg>
            Back
          </Button>
        </div>
      </main>
    </div>
  )
}