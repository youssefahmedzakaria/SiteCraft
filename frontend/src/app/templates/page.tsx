'use client'

import Link from 'next/link'
import { TemplateCard } from "@/components/templates/TemplateCard"
import { suggestedTemplates } from "@/lib/templates"
import { Button } from "@/components/ui/button"

export default function SuggestedTemplatesPage() {
  return (
    <div className="container mx-auto px-4 pt-16 pb-8">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4 text-logo-txt">Suggested Templates</h1>
        <p className="text-xl text-muted-foreground">
          Choose from our suggested collection of professional templates
        </p>
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