import Image from 'next/image'
import { Button } from '@/components/ui/button'

export interface Template {
  id: string
  title: string
  description: string
  imageUrl: string
  rating: number
}

export function TemplateCard({ template }: { template: Template }) {
  return (
    <div className="border border-black-border rounded-lg overflow-hidden shadow-sm bg-background transform transition-all duration-300 hover:scale-105 hover:shadow-lg">
      <div className="relative w-full h-40">
        <Image
          src={template.imageUrl}
          alt={template.title}
          fill
          className="object-cover"
        />
      </div>
      <div className="p-4">
        <h2 className="text-lg font-semibold text-black ">{template.title}</h2>
        <p className="text-sm text-muted-foreground mb-2">
          {template.description}
        </p>
        <div className="flex items-center justify-between">
          <span className="text-sm text-black">⭐ {template.rating.toFixed(1)}</span>
          <div className="space-x-2">
            <Button 
              size="sm" 
              variant="ghost"
              className="hover:bg-logo-light-button-hover hover:bg-gray-100 transition-colors"
            >
              Preview
            </Button>
            <Button 
              size="sm" 
              className="bg-black text-primary-foreground hover:bg-gray-800 transition-colors"
            >
              Select
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
