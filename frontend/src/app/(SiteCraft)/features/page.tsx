"use client"

import { 
  Palette, 
  Server, 
  CreditCard, 
  Package, 
  HeadphonesIcon, 
  BarChart3, 
  Languages, 
  ShoppingCart,
  FileText,
  Users
} from "lucide-react"

const features = [
  {
    title: "Templates & Customization",
    description: "Choose from a variety of templates and customize every aspect of your store, from colors and fonts to layouts and buttons.",
    icon: Palette
  },
  {
    title: "Secure Hosting",
    description: "Worry-free hosting with top-tier security and reliability for your online store.",
    icon: Server
  },
  {
    title: "Local Payment Integration",
    description: "Support for multiple payment methods including ValU, Meeza, MasterCard, and Fawry.",
    icon: CreditCard
  },
  {
    title: "Inventory Management",
    description: "Efficiently manage products, track stock levels, and import products from external sources.",
    icon: Package
  },
  {
    title: "24/7 Customer Support",
    description: "Access to comprehensive help resources, email support, and knowledge base.",
    icon: HeadphonesIcon
  },
  {
    title: "Advanced Analytics",
    description: "Real-time insights into sales, visitor behavior, and business performance metrics.",
    icon: BarChart3
  },
  {
    title: "Arabic Translation",
    description: "Full Arabic language support for enhanced accessibility and local market reach.",
    icon: Languages
  },
  {
    title: "Order Management",
    description: "Streamlined order processing and fulfillment tracking system.",
    icon: ShoppingCart
  },
  {
    title: "Receipt & Policies",
    description: "Customizable receipts and easy management of business policies.",
    icon: FileText
  },
  {
    title: "Customer Management",
    description: "Tools to manage customer relationships and track purchase histories.",
    icon: Users
  }
]

export default function FeaturesPage() {
  return (
    <div className="container pt-24 pb-16">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">Features</h1>
        <p className="text-xl text-muted-foreground">
          Everything you need to create and grow your online store
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {features.map((feature, index) => (
          <div key={index} className="p-6 border rounded-lg border-logo-border">
            <feature.icon className="h-12 w-12 text-primary mb-4" />
            <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
            <p className="text-muted-foreground">{feature.description}</p>
          </div>
        ))}
      </div>
    </div>
  )
} 