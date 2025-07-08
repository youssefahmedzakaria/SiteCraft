'use client';

import { useTranslation } from '@/contexts/translation-context';
import { Button } from '@/components/SiteCraft/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/SiteCraft/ui/dropdown-menu';
import { Globe } from 'lucide-react';

export const LanguageSwitcher = () => {
  const { language, setLanguage, t } = useTranslation();

  const handleLanguageChange = (newLanguage: 'en' | 'ar') => {
    setLanguage(newLanguage);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="flex items-center gap-2">
          <Globe className="h-4 w-4" />
          <span className="hidden sm:inline">{t('common.language')}</span>
          <span className="text-xs font-medium">
            {language === 'en' ? 'EN' : 'عربي'}
          </span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-32">
        <DropdownMenuItem
          onClick={() => handleLanguageChange('en')}
          className={`cursor-pointer ${language === 'en' ? 'bg-accent' : ''}`}
        >
          <span className="flex items-center gap-2">
            <span className="text-sm">🇺🇸</span>
            {t('common.english')}
          </span>
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => handleLanguageChange('ar')}
          className={`cursor-pointer ${language === 'ar' ? 'bg-accent' : ''}`}
        >
          <span className="flex items-center gap-2">
            <span className="text-sm">🇸🇦</span>
            {t('common.arabic')}
          </span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}; 