'use client';

import type { LetterUI } from '@/lib/types';
import { useState } from 'react';
import { Heart, ArrowLeft, Mail } from 'lucide-react';
import { BeeIcon } from '@/components/icons/BeeIcon';
import { WaxSealIcon } from '@/components/icons/WaxSealIcon';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { useTranslation } from '@/hooks/use-translation';
import { es } from 'date-fns/locale';
import Link from 'next/link';

const paperColorClasses = {
  cream: 'bg-[#FFFDF5]',
  pink: 'bg-[#FFDFE6]',
  crimson: 'bg-[#FADADD]',
  honey: 'bg-[#FFF8DD]',
  'light-pink': 'bg-pink-100',
  lavender: 'bg-[#E6E6FA]',
  mint: 'bg-[#E0F8E0]',
  peach: 'bg-[#FFE5B4]',
  sky: 'bg-[#E0F2FE]',
  rose: 'bg-[#FFE4E1]',
};

const fontClasses = {
  Indie_Flower: 'font-handwriting',
  Alegreya: 'font-sans', // Assuming Alegreya is default
  Belleza: 'font-display',
  Dancing_Script: 'font-dancing',
  Pacifico: 'font-pacifico',
  Caveat: 'font-caveat',
  Sacramento: 'font-sacramento',
  Great_Vibes: 'font-greatvibes',
  Shadows_Into_Light: 'font-shadows',
  Amatic_SC: 'font-amatic',
  Permanent_Marker: 'font-permanent',
  Satisfy: 'font-satisfy',
  Kalam: 'font-kalam',
};

const borderClasses = {
  simple: 'border-simple',
  airmail: 'airmail-border',
  dashed: 'border-dashed-style',
  floral: 'border-floral',
};

const stampIcons = {
  heart: <Heart className="size-full fill-current" />,
  bee: <BeeIcon className="size-full fill-current" />,
  'wax-seal': <WaxSealIcon className="size-full fill-current" />,
  'rose-emoji': <span className="text-4xl">🌹</span>,
  'star-emoji': <span className="text-4xl">⭐</span>,
  'kiss-emoji': <span className="text-4xl">💋</span>,
  'sparkle-emoji': <span className="text-4xl">✨</span>,
  'sun-emoji': <span className="text-4xl">☀️</span>,
  'moon-emoji': <span className="text-4xl">🌙</span>,
};

export function LetterOpener({ letter }: { letter: LetterUI }) {
  const [isOpened, setIsOpened] = useState(false);
  const { t, locale } = useTranslation();

  const getTranslatedName = (name: string) => {
    if (name === 'You' || name === 'Tú') return t('users.you');
    if (name === 'Your Love' || name === 'Tu Amor') return t('users.yourLove');
    return name;
  };

  const getAdaptiveFontSize = () => {
    const length = letter.content.length;
    if (length < 100) return 'text-3xl md:text-4xl lg:text-5xl leading-[48px] md:leading-[56px] lg:leading-[64px]';
    if (length < 250) return 'text-2xl md:text-3xl lg:text-4xl leading-[42px] md:leading-[48px] lg:leading-[56px]';
    if (length < 500) return 'text-xl md:text-2xl lg:text-3xl leading-[38px] md:leading-[42px] lg:leading-[48px]';
    if (length < 800) return 'text-lg md:text-xl lg:text-2xl leading-[34px] md:leading-[38px] lg:leading-[42px]';
    return 'text-base md:text-lg lg:text-xl leading-[30px] md:leading-[34px] lg:leading-[38px]';
  };

  const getFontClass = () => {
    const fontClass = fontClasses[letter.config.font] || 'font-handwriting';
    if (letter.config.font === 'Amatic_SC') return `${fontClass} scale-110`;
    return fontClass;
  };

  if (isOpened) {
      return (
          <div className="flex min-h-screen flex-col bg-[#F0F4F8] animate-in fade-in duration-500">
              <div className="sticky top-0 z-20 bg-[#F0F4F8]/95 p-4 backdrop-blur-sm">
                  <Link href="/inbox" className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 shadow-sm transition-all hover:shadow-md active:scale-95">
                      <ArrowLeft className="size-5 text-gray-600" />
                      <span className="text-sm font-medium text-gray-700">Volver</span>
                  </Link>
              </div>

              <div className="flex-1 p-4 pb-32 lg:p-8">
                  <div className="mx-auto max-w-2xl">
                      <div className={cn(
                          "relative overflow-hidden rounded-lg shadow-2xl",
                          borderClasses[letter.config.borderStyle || 'simple'],
                          paperColorClasses[letter.config.paperColor]
                      )}>
                          <div className="absolute left-0 right-0 top-0 h-3 bg-gradient-to-r from-primary/30 via-transparent to-primary/30"></div>
                          <div className="absolute bottom-0 left-0 right-0 h-3 bg-gradient-to-r from-primary/30 via-transparent to-primary/30"></div>

                          <div className="p-8 lg:p-12">
                              <div className="mb-8 flex items-start justify-between border-b border-dashed border-gray-300 pb-6">
                                  <div className="space-y-1">
                                      <div className="text-xs uppercase tracking-wider text-gray-500">
                                          {format(new Date(letter.createdAt), 'd MMMM yyyy', { locale: locale === 'es' ? es : undefined })}
                                      </div>
                                      <div className="text-xl text-gray-800">
                                          De: <span className="font-semibold text-primary">{getTranslatedName(letter.senderName)}</span>
                                      </div>
                                  </div>
                                  
                                  <div className="flex size-16 items-center justify-center rounded-full bg-white/80 text-primary shadow-inner">
                                      {stampIcons[letter.config.stamp]}
                                  </div>
                              </div>

                              <div className={cn(
                                  "min-h-[40vh] whitespace-pre-wrap text-gray-800 transition-all",
                                  getAdaptiveFontSize(),
                                  getFontClass()
                              )}>
                                  {letter.content}
                              </div>

                              <div className="mt-12 flex items-center justify-center gap-2 border-t border-dashed border-gray-300 pt-6">
                                  <BeeIcon className="size-6 text-accent opacity-60" />
                                  <span className="text-sm text-gray-400">HoneyNotes</span>
                              </div>
                          </div>
                      </div>
                  </div>
              </div>
          </div>
      );
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-[#E8E8F6] to-[#F0F4F8] p-4">
        <div className="text-center">
            <button
                onClick={() => setIsOpened(true)}
                className="group relative mx-auto mb-8 block transition-transform hover:scale-105 active:scale-95"
            >
                <div className="relative flex h-56 w-80 items-center justify-center overflow-hidden rounded-sm bg-[#FFFEF5] shadow-[0_10px_40px_rgba(0,0,0,0.15)] transition-all group-hover:shadow-[0_15px_50px_rgba(220,20,60,0.2)]">
                    <Mail className="size-24 text-primary/20" />
                    
                    <div className="absolute right-6 top-6 rounded-full bg-primary p-3 shadow-lg">
                        <div className="size-8 text-white">
                            {stampIcons[letter.config.stamp]}
                        </div>
                    </div>

                    <div className="absolute bottom-4 left-4 right-4">
                        <div className="h-1 w-full rounded bg-gray-200"></div>
                        <div className="mt-1 h-1 w-3/4 rounded bg-gray-200"></div>
                    </div>
                </div>
            </button>

            <div className="space-y-2">
                <p className="text-xl text-gray-600 animate-bounce">
                    ✨ {t('letterOpener.tapToOpen')} ✨
                </p>
                <p className="text-sm text-gray-400">
                    De: {getTranslatedName(letter.senderName)}
                </p>
            </div>
        </div>
    </div>
  );
}
