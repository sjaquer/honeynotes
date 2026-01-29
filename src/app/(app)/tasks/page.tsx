'use client';

import { ListTodo } from 'lucide-react';
import { useTranslation } from '@/hooks/use-translation';

export default function TasksPage() {
  const { t } = useTranslation();
  return (
    <div className="flex flex-1 flex-col">
      <header className="sticky top-0 z-10 border-b bg-background/80 p-4 backdrop-blur-sm">
        <h1 className="font-headline text-3xl font-bold text-primary">{t('tasksPage.title')}</h1>
      </header>
      <div className="flex flex-1 flex-col items-center justify-center p-8 text-center">
        <ListTodo className="size-24 text-foreground/20" />
        <h2 className="mt-6 font-headline text-2xl">{t('tasksPage.comingSoon')}</h2>
        <p className="mt-2 max-w-sm text-foreground/70">
          {t('tasksPage.description')}
        </p>
      </div>
    </div>
  );
}
