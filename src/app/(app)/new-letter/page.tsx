'use client';

import { LetterEditor } from './_components/LetterEditor';
import { useTranslation } from '@/hooks/use-translation';

export default function NewLetterPage() {
  const { t } = useTranslation();
  return (
    <div className="flex flex-1 flex-col">
       <header className="sticky top-0 z-10 border-b bg-background/80 p-4 backdrop-blur-sm">
        <h1 className="font-headline text-3xl font-bold text-primary">{t('newLetterPage.title')}</h1>
        <p className="text-foreground/70">
          {t('newLetterPage.description')}
        </p>
      </header>
      <LetterEditor />
    </div>
  );
}
