"use client";

import { PricingCards } from "@/components/SiteCraft/pricing/pricing-cards";
import { Check } from "lucide-react";
import { useTranslation } from "@/contexts/translation-context";

export default function PricingPage() {
  const { t, isRTL } = useTranslation();

  return (
    <div className="container pt-24 pb-16" dir={isRTL ? 'rtl' : 'ltr'}>
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">{t('pricing.title')}</h1>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
          {t('pricing.subtitle')}
        </p>
      </div>

      <PricingCards />

      <div className="mt-16">
        <h2 className="text-2xl font-bold text-center mb-8">
          {t('pricing.allPlansInclude')}
        </h2>
        <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          {/* First row benefits */}
          <div className="flex items-start gap-2">
            <Check className="h-5 w-5 text-green-500 mt-1" />
            <div>
              <h3 className="font-semibold mb-1">{t('pricing.benefits.analytics.title')}</h3>
              <p className="text-sm text-muted-foreground">
                {t('pricing.benefits.analytics.description')}
              </p>
            </div>
          </div>
          <div className="flex items-start gap-2">
            <Check className="h-5 w-5 text-green-500 mt-1" />
            <div>
              <h3 className="font-semibold mb-1">{t('pricing.benefits.hosting.title')}</h3>
              <p className="text-sm text-muted-foreground">
                {t('pricing.benefits.hosting.description')}
              </p>
            </div>
          </div>
          <div className="flex items-start gap-2">
            <Check className="h-5 w-5 text-green-500 mt-1" />
            <div>
              <h3 className="font-semibold mb-1">{t('pricing.benefits.payments.title')}</h3>
              <p className="text-sm text-muted-foreground">
                {t('pricing.benefits.payments.description')}
              </p>
            </div>
          </div>

          {/* Second row benefits */}
          <div className="flex items-start gap-2">
            <Check className="h-5 w-5 text-green-500 mt-1" />
            <div>
              <h3 className="font-semibold mb-1">{t('pricing.benefits.arabic.title')}</h3>
              <p className="text-sm text-muted-foreground">
                {t('pricing.benefits.arabic.description')}
              </p>
            </div>
          </div>
          <div className="flex items-start gap-2">
            <Check className="h-5 w-5 text-green-500 mt-1" />
            <div>
              <h3 className="font-semibold mb-1">{t('pricing.benefits.support.title')}</h3>
              <p className="text-sm text-muted-foreground">
                {t('pricing.benefits.support.description')}
              </p>
            </div>
          </div>
          <div className="flex items-start gap-2">
            <Check className="h-5 w-5 text-green-500 mt-1" />
            <div>
              <h3 className="font-semibold mb-1">{t('pricing.benefits.mobile.title')}</h3>
              <p className="text-sm text-muted-foreground">
                {t('pricing.benefits.mobile.description')}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
