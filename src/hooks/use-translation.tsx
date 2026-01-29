'use client';

import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import en from '@/lib/locales/en.json';
import es from '@/lib/locales/es.json';

type Locale = 'en' | 'es';

const translations = { en, es };

interface LanguageContextType {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (key: string, replacements?: { [key: string]: string | number }) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  // Set Spanish as default
  const [locale, setLocaleState] = useState<Locale>('es');
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    const savedLocale = localStorage.getItem('locale') as Locale;
    if (savedLocale && ['en', 'es'].includes(savedLocale)) {
      setLocaleState(savedLocale);
    } else {
        // If no locale is saved, set the default
        localStorage.setItem('locale', 'es');
    }
    setIsMounted(true);
  }, []);

  const setLocale = (newLocale: Locale) => {
    localStorage.setItem('locale', newLocale);
    setLocaleState(newLocale);
  };

  const t = useCallback((key: string, replacements?: { [key: string]: string | number }): string => {
      const getNestedValue = (obj: any, path: string) => {
        return path.split('.').reduce((acc, part) => acc && acc[part], obj);
      };
  
      let translation = getNestedValue(translations[locale], key);
  
      if (translation === undefined) {
        // Fallback to Spanish if translation is missing in current locale
        translation = getNestedValue(translations.es, key);
      }

      if (translation === undefined) {
        // Fallback to English if translation is missing in Spanish too
        translation = getNestedValue(translations.en, key);
      }
      
      if (typeof translation !== 'string') {
        // if translation is still not found, return the key itself
        console.warn(`Translation not found for key: ${key} in locale: ${locale}`);
        return key;
      }
  
      if (replacements) {
        Object.entries(replacements).forEach(([replaceKey, value]) => {
          translation = translation.replace(`{${replaceKey}}`, String(value));
        });
      }
  
      return translation;
    },
    [locale]
  );
  
  if (!isMounted) {
    // Render a simple loading state or null while waiting for the locale to be determined
    return <div className="flex h-screen w-full items-center justify-center"></div>;
  }

  return (
    <LanguageContext.Provider value={{ locale, setLocale, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useTranslation() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useTranslation must be used within a LanguageProvider');
  }
  return context;
}
