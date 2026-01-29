'use client';

import type { Letter } from '@/lib/types';
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Mail, Heart } from 'lucide-react';
import { BeeIcon } from '@/components/icons/BeeIcon';
import { WaxSealIcon } from '@/components/icons/WaxSealIcon';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { useTranslation } from '@/hooks/use-translation';
import { es } from 'date-fns/locale';


const paperColorClasses = {
  cream: 'bg-[#FFFDF5]',
  pink: 'bg-[#FFDFE6]',
  crimson: 'bg-[#FADADD]',
  honey: 'bg-[#FFF8DD]',
  'light-pink': 'bg-pink-100',
};

const fontClasses = {
  Alegreya: 'font-body',
  Belleza: 'font-headline',
};

const stampIcons = {
  heart: <Heart className="size-full fill-current" />,
  bee: <BeeIcon className="size-full fill-current" />,
  'wax-seal': <WaxSealIcon className="size-full fill-current" />,
};

export function LetterOpener({ letter }: { letter: Letter }) {
  const [isOpening, setIsOpening] = useState(false);
  const [isOpened, setIsOpened] = useState(false);
  const { t, locale } = useTranslation();

  useEffect(() => {
    if (isOpening) {
      const timer = setTimeout(() => setIsOpened(true), 1000);
      return () => clearTimeout(timer);
    }
  }, [isOpening]);

  const getTranslatedName = (name: string) => {
    if (name === 'You') return t('users.you');
    if (name === 'Your Love') return t('users.yourLove');
    return name;
  };

  if (!isOpened) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center bg-secondary/30 p-8">
        <div
          className={cn(
            'relative transition-all duration-1000',
            isOpening ? 'scale-[2.5] opacity-0' : 'scale-100 opacity-100'
          )}
        >
          <Mail className="size-48 text-primary" />
          <div className="absolute right-4 top-4 size-12 text-primary">
            {stampIcons[letter.config.stamp]}
          </div>
        </div>
        <Button
          size="lg"
          onClick={() => setIsOpening(true)}
          disabled={isOpening}
          className="mt-12 h-[60px] rounded-3xl bg-primary px-8 text-lg font-bold shadow-lg"
        >
          {isOpening ? t('letterOpener.opening') : t('letterOpener.open')}
        </Button>
      </div>
    );
  }

  return (
    <div
      className={cn(
        'flex flex-1 flex-col p-6 shadow-inner transition-colors duration-500 animate-in fade-in',
        paperColorClasses[letter.config.paperColor],
        fontClasses[letter.config.font]
      )}
    >
      <div className="mb-8 flex items-start justify-between">
        <div>
          <p className="text-lg">{t('letterOpener.from', { sender: getTranslatedName(letter.senderName) })}</p>
          <p className="text-xs text-foreground/60">
            {t('letterOpener.sentOn', { date: format(new Date(letter.createdAt), 'MMMM d, yyyy', { locale: locale === 'es' ? es : undefined }) })}
          </p>
        </div>
        <div className="size-10 text-primary">
          {stampIcons[letter.config.stamp]}
        </div>
      </div>
      <div className="flex-1 space-y-4 whitespace-pre-wrap text-lg leading-relaxed text-foreground/90">
        {letter.content}
      </div>
    </div>
  );
}
