'use client';

import Link from "next/link";
import { Button } from "@/components/SiteCraft/ui/button";
import { useTranslation } from "@/contexts/translation-context";

export default function HomePage() {
  const { t, isRTL } = useTranslation();

  return (
    <div className="flex flex-col flex-1" dir={isRTL ? 'rtl' : 'ltr'}>
      <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center space-y-4 text-center">
            <div className="space-y-2">
              <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none">
                {t('homepage.hero.title')}
              </h1>
              <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl dark:text-gray-400">
                {t('homepage.hero.subtitle')}
              </p>
            </div>
            <div className="space-x-4">
              <Link href="/signup">
                <Button
                  size="lg"
                  className="bg-logo-dark-button text-primary-foreground hover:bg-logo-dark-button-hover"
                >
                  {t('common.getStarted')}
                </Button>
              </Link>
              <Link href="/about">
                <Button
                  variant="outline"
                  size="lg"
                  className="text-logo-txt hover:text-logo-txt-hover hover:bg-logo-light-button-hover border-logo-border"
                >
                  {t('common.learnMore')}
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
      <section className="w-full py-12 md:py-24 lg:py-32 bg-logo-colored-bg">
        <div className="container px-4 md:px-6">
          <div className="grid gap-6 lg:grid-cols-3 lg:gap-12">
            <div className="flex flex-col items-center space-y-4 text-center">
              <div className="space-y-2">
                <h3 className="text-xl font-bold">{t('homepage.features.dragDrop.title')}</h3>
                <p className="text-gray-500 dark:text-gray-400">
                  {t('homepage.features.dragDrop.description')}
                </p>
              </div>
            </div>
            <div className="flex flex-col items-center space-y-4 text-center">
              <div className="space-y-2">
                <h3 className="text-xl font-bold">{t('homepage.features.responsive.title')}</h3>
                <p className="text-gray-500 dark:text-gray-400">
                  {t('homepage.features.responsive.description')}
                </p>
              </div>
            </div>
            <div className="flex flex-col items-center space-y-4 text-center">
              <div className="space-y-2">
                <h3 className="text-xl font-bold">{t('homepage.features.customizable.title')}</h3>
                <p className="text-gray-500 dark:text-gray-400">
                  {t('homepage.features.customizable.description')}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
