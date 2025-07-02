import { Truck, Shield, RefreshCw } from "lucide-react"
import type { Product, Review, RelatedProduct } from "./product"

// Sample product data
export const productData: Product = {
  id: "diamond-ring-1",
  name: "Solitaire Ring",
  description:
    "A timeless diamond solitaire ring that captures the essence of elegance.",
  category: "Rings",
  rating: 4.8,
  reviewCount: 124,
  basePrice: 1299,
  compareAtPrice: 1599,
  defaultImages: ["/hand.jpg", "/hand.jpg", "/hand.jpg", "/hand.jpg"],
  shipping: {
    free: true,
    estimatedDays: "2-4",
  },
  variantGroups: [
    {
      id: "metal",
      name: "Metal Type",
      type: "color",
      required: true,
      changesImages: true,
      displayStyle: "color-circles",
      options: [
        {
          id: "white-gold",
          label: "White Gold",
          value: "white-gold",
          colorCode: "#E0E0E0",
          productImages: ["/ring.jpg", "/ring.jpg", "/ring.jpg", "/ring.jpg"],
          metadata: {
            material: "18k White Gold",
            finish: "Polished",
            priceAdjustment: 0,
          },
        },
        {
          id: "yellow-gold",
          label: "Yellow Gold",
          value: "yellow-gold",
          colorCode: "#FFD700",
          productImages: [
            "/hand2.jpg",
            "/ring2.jpg",
            "/ring2.jpg",
            "/ring2.jpg",
          ],
          metadata: {
            material: "18k Yellow Gold",
            finish: "Matte",
            priceAdjustment: 50,
          },
        },
        {
          id: "rose-gold",
          label: "Rose Gold",
          value: "rose-gold",
          colorCode: "#B76E79",
          productImages: [
            "/ring2.jpg",
            "/ring2.jpg",
            "/ring2.jpg",
            "/ring2.jpg",
          ],
          metadata: {
            material: "18k Rose Gold",
            finish: "Brushed",
            priceAdjustment: 100,
          },
        },
        {
          id: "platinum",
          label: "Platinum",
          value: "platinum",
          colorCode: "#E5E4E2",
          productImages: [
            "/ring3.jpg",
            "/ring3.jpg",
            "/ring3.jpg",
            "/ring3.jpg",
          ],
          metadata: {
            material: "Platinum 950",
            finish: "High Polish",
            priceAdjustment: 300,
          },
        },
      ],
    },
    {
      id: "size",
      name: "Ring Size",
      type: "size",
      required: true,
      displayStyle: "buttons",
      options: [
        { id: "size-6", label: "6", value: "6", metadata: { diameter: "16.5mm" } },
        { id: "size-7", label: "7", value: "7", metadata: { diameter: "17.3mm" } },
        { id: "size-8", label: "8", value: "8", metadata: { diameter: "18.2mm" } },
        { id: "size-9", label: "9", value: "9", metadata: { diameter: "19.0mm" } },
        { id: "size-10", label: "10", value: "10", metadata: { diameter: "19.8mm" } },
      ],
    },
  ],
  features: [
    {
      icon: Truck,
      title: "Free Shipping",
      description: "On orders over $500",
    },
    {
      icon: Shield,
      title: "Secure Payment",
      description: "100% secure payment",
    },
    {
      icon: RefreshCw,
      title: "30-Day Returns",
      description: "Hassle-free returns within 30 days",
    },
  ],
  additionalInfoSections: [
    {
      title: "shortDesc",
      description: "A stunning diamond solitaire ring that symbolizes eternal love and commitment.",
    },
    {
      title: "specifications",
      description:
        "Material: 18k White Gold\nDiamond: 1.0 Carat\nCut: Brilliant\nColor: D\nClarity: VVS1\nBand Width: 2mm\nRing Size: Adjustable (4-10)\nWeight: 3.5g",
    },
  ],
}

// Sample reviews data
export const reviewsData: Review[] = [
  {
    id: "review-1",
    author: "Sarah Johnson",
    avatar: "/placeholder.png?height=40&width=40",
    rating: 5,
    date: "2023-11-15",
    title: "Absolutely stunning!",
    comment:
      "I received this ring as an anniversary gift and I couldn't be happier. The diamond sparkles beautifully in any light and the craftsmanship is exceptional. It's comfortable to wear daily and I've received so many compliments!",
    helpful: 24,
    verified: true,
  },
  {
    id: "review-2",
    author: "Michael Thompson",
    rating: 4,
    date: "2023-10-22",
    title: "Beautiful ring, slightly smaller than expected",
    comment:
      "The ring is gorgeous and my fiancée loves it. The diamond quality is excellent and the setting is secure. My only comment is that it appeared slightly smaller in person than in the photos, but that doesn't take away from its beauty.",
    helpful: 12,
    verified: true,
  },
  {
    id: "review-3",
    author: "Emily Davis",
    avatar: "/placeholder.png?height=40&width=40",
    rating: 5,
    date: "2023-09-10",
    title: "Perfect engagement ring",
    comment:
      "I proposed with this ring and it was perfect! The diamond catches the light beautifully and the white gold band complements it perfectly. The packaging was also very elegant. Highly recommend!",
    helpful: 18,
    verified: true,
  },
  {
    id: "review-4",
    author: "Robert Wilson",
    rating: 3,
    date: "2023-08-15",
    title: "Good quality but shipping took longer than expected",
    comment:
      "The ring itself is beautiful and well-made. My only issue was with the shipping time which was longer than the estimated delivery window. Customer service was helpful in tracking the package though.",
    helpful: 5,
    verified: true,
  },
]

// Sample related products
export const relatedProducts: RelatedProduct[] = [
  {
    id: "diamond-necklace-1",
    name: "Diamond Pendant Necklace",
    image: "/neckless.jpg",
    price: 799,
    compareAtPrice: 999,
    rating: 4.9,
    reviewCount: 112,
    category: "Necklaces",
  },
  {
    id: "diamond-bracelet-1",
    name: "Diamond Tennis Bracelet",
    image: "/about.jpg",
    price: 1499,
    rating: 4.8,
    reviewCount: 74,
    category: "Bracelets",
  },
  {
    id: "diamond-earrings-1",
    name: "Diamond Stud Earrings",
    image: "/earing.jpg",
    price: 899,
    compareAtPrice: 1099,
    rating: 4.7,
    reviewCount: 86,
    category: "Earrings",
  },
  {
    id: "diamond-ring-2",
    name: "Three Stone Diamond Ring",
    image: "/ring.jpg",
    price: 1899,
    compareAtPrice: 2199,
    rating: 4.6,
    reviewCount: 58,
    category: "Rings",
  },
]
