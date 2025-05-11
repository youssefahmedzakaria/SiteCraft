'use client'

import Link from 'next/link'
import { TemplateCard } from "@/components/templates/TemplateCard"
import { suggestedTemplates } from "@/lib/templates"
import { Button } from "@/components/ui/button"

export default function SuggestedTemplatesPage() {
  return (
    <div className="container mx-auto px-4 pt-8 pb-8">
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

      <div className="flex items-center justify-between mb-8">
        <div>
          <Button
            variant="outline"
            onClick={() => window.location.href = "/branding/color-palette"}
            className="border-gray-300"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
            </svg>
            Back
          </Button>
        </div>

        <div className="text-center">
          <h1 className="text-4xl font-bold text-black">Suggested Templates</h1>
          <p className="text-xl text-muted-foreground">
            Choose from our suggested collection of professional templates
          </p>
        </div>

        {/* Empty div to balance the flex layout */}
        <div className="w-[100px]"></div>
      </div>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {suggestedTemplates.map((template) => (
          <TemplateCard key={template.id} template={template} />
        ))}
      </div>
      <div className="mt-12 text-center">
        <Link href="/templates/view-all">
          <Button
            className="bg-logo-dark-button text-primary-foreground hover:bg-logo-dark-button-hover transition-colors"
          >
            View All Templates
          </Button>
        </Link>
      </div>
    </div>
  )
}