import type { Template } from '@/components/SiteCraft/templates/TemplateCard'

export const suggestedTemplates: Template[] = [
  {
    id: '1',
    title: 'Flora Shop',
    description: 'Bright, floral‑themed store template',
    imageUrl: '/images/sample.png',
    rating: 4.8,
  },
  {
    id: '2',
    title: 'Modern Store',
    description: 'Clean lines and minimalist design',
    imageUrl: '/images/sample.png',
    rating: 4.7,
  },
  {
    id: '3',
    title: 'Pants Store',
    description: 'Sharp lines and eye-catching design',
    imageUrl: '/images/sample.png',
    rating: 4.1,
  },
  {
    id: '4',
    title: 'T-Shirt Store',
    description: 'smooth edges and colorful design',
    imageUrl: '/images/sample.png',
    rating: 3.2,
  },
]

export const allTemplates: Template[] = [
  ...suggestedTemplates,
  {
    id: '5',
    title: 'Vintage Market',
    description: 'Retro vibes for niche boutiques',
    imageUrl: '/images/sample.png',
    rating: 4.5,
  },
  {
    id: '6',
    title: 'Tech Gadgets',
    description: 'Sleek tech store layout',
    imageUrl: '/images/sample.png',
    rating: 4.6,
  },
  // add more “all” items here…
]
