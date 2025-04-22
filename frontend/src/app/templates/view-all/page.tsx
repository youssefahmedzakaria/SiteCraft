'use client'

import { TemplateCard } from "@/components/templates/TemplateCard"
import { allTemplates } from "@/lib/templates"
import Link from 'next/link'
import { ChevronLeft } from 'lucide-react'

export default function ViewAllTemplatesPage() {
  return (
    <div className="container mx-auto px-4 pt-16 pb-8">
      <Link 
        href="/templates" 
        className="inline-flex items-center text-sm text-logo-txt hover:text-logo-txt-hover transition-colors"
      >
        <ChevronLeft className="h-4 w-4 mr-1" />
      </Link>
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4 text-logo-txt">All Templates</h1>
        <p className="text-xl text-muted-foreground">
          Browse our complete collection of professional templates
        </p>
      </div>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {allTemplates.map((template) => (
          <TemplateCard key={template.id} template={template} />
        ))}
      </div>
    </div>
  )
}