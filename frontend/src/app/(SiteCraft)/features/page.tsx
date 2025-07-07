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
import { useTranslation } from "@/contexts/translation-context";

export default function FeaturesPage() {
  const { t, isRTL } = useTranslation();

  const features = [
    {
      title: t('features.list.templates.title'),
      description: t('features.list.templates.description'),
      icon: Palette
    },
    {
      title: t('features.list.hosting.title'),
      description: t('features.list.hosting.description'),
      icon: Server
    },
    {
      title: t('features.list.payments.title'),
      description: t('features.list.payments.description'),
      icon: CreditCard
    },
    {
      title: t('features.list.inventory.title'),
      description: t('features.list.inventory.description'),
      icon: Package
    },
    {
      title: t('features.list.support.title'),
      description: t('features.list.support.description'),
      icon: HeadphonesIcon
    },
    {
      title: t('features.list.analytics.title'),
      description: t('features.list.analytics.description'),
      icon: BarChart3
    },
    {
      title: t('features.list.arabic.title'),
      description: t('features.list.arabic.description'),
      icon: Languages
    },
    {
      title: t('features.list.orders.title'),
      description: t('features.list.orders.description'),
      icon: ShoppingCart
    },
    {
      title: t('features.list.receipts.title'),
      description: t('features.list.receipts.description'),
      icon: FileText
    },
    {
      title: t('features.list.customers.title'),
      description: t('features.list.customers.description'),
      icon: Users
    }
  ]

  return (
    <div className="container pt-24 pb-16" dir={isRTL ? 'rtl' : 'ltr'}>
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">{t('features.title')}</h1>
        <p className="text-xl text-muted-foreground">
          {t('features.subtitle')}
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