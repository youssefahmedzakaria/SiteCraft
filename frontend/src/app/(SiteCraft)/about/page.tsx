"use client";

import { Card, CardContent } from "@/components/SiteCraft/ui/card";
import { Target, Users, Zap } from "lucide-react";
import { useTranslation } from "@/contexts/translation-context";

export default function AboutPage() {
  const { t, isRTL } = useTranslation();

  const missions = [
    {
      title: t('about.missions.mission.title'),
      description: t('about.missions.mission.description'),
      icon: Target,
    },
    {
      title: t('about.missions.vision.title'),
      description: t('about.missions.vision.description'),
      icon: Zap,
    },
    {
      title: t('about.missions.values.title'),
      description: t('about.missions.values.description'),
      icon: Users,
    },
  ];

  return (
    <div className="container pt-24 pb-16" dir={isRTL ? 'rtl' : 'ltr'}>
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">{t('about.title')}</h1>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
          {t('about.subtitle')}
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-8 mb-16">
        {missions.map((mission, index) => (
          <Card key={index} className="border-logo-border">
            <CardContent className="pt-6 ">
              <mission.icon className="h-12 w-12 text-primary mb-4" />
              <h3 className="text-xl font-semibold mb-2">{mission.title}</h3>
              <p className="text-muted-foreground">{mission.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="space-y-8">
        <div>
          <h2 className="text-2xl font-bold mb-4">{t('about.whyChoose.title')}</h2>
          <p className="text-muted-foreground">
            {t('about.whyChoose.description')}
          </p>
        </div>

        <div>
          <h2 className="text-2xl font-bold mb-4">{t('about.story.title')}</h2>
          <p className="text-muted-foreground">
            {t('about.story.description')}
          </p>
        </div>

        <div>
          <h2 className="text-2xl font-bold mb-4">{t('about.commitment.title')}</h2>
          <p className="text-muted-foreground">
            {t('about.commitment.description')}
          </p>
        </div>
      </div>
    </div>
  );
}
