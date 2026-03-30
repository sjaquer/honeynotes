'use client';

import type { LetterUI, BorderStyle } from '@/lib/types';
import { ANIMATED_BORDERS } from '@/lib/types';
import { useState } from 'react';
import { Heart, ArrowLeft, Mail, Sparkles, Send, CalendarDays, UserRound } from 'lucide-react';
import { WaxSealIcon } from '@/components/icons/WaxSealIcon';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { useTranslation } from '@/hooks/use-translation';
import { es } from 'date-fns/locale';
import Link from 'next/link';

const paperColorClasses: Record<string, string> = {
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
  // Premium colors
  sunset: 'bg-gradient-to-br from-orange-100 to-pink-100',
  ocean: 'bg-gradient-to-br from-blue-100 to-teal-100',
  aurora: 'bg-gradient-to-br from-purple-100 to-green-100',
  'rose-gold': 'bg-gradient-to-br from-rose-100 to-amber-50',
  champagne: 'bg-[#F7E7CE]',
  moonlight: 'bg-gradient-to-br from-slate-100 to-indigo-100',
  'cherry-blossom': 'bg-gradient-to-br from-pink-100 to-rose-50',
};

const fontClasses: Record<string, string> = {
  Indie_Flower: 'font-handwriting',
  Alegreya: 'font-sans',
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
  Patrick_Hand: 'font-patrick',
  Architects_Daughter: 'font-architects',
  Cookie: 'font-cookie',
  Courgette: 'font-courgette',
  Lobster: 'font-lobster',
  Allura: 'font-allura',
  Tangerine: 'font-tangerine',
  Alex_Brush: 'font-alexbrush',
  Mr_Dafoe: 'font-mrdafoe',
};

const borderClasses: Record<string, string> = {
  simple: 'border-simple',
  airmail: 'airmail-border',
  dashed: 'border-dashed-style',
  floral: 'border-floral',
  hearts: 'border-hearts',
  stars: 'border-stars',
  waves: 'border-waves',
  ribbon: 'border-ribbon',
  vintage: 'border-vintage',
  ornate: 'border-ornate',
  gold: 'border-gold',
  lace: 'border-lace',
};

const stampIcons: Record<string, React.ReactNode> = {
  heart: <Heart className="size-full fill-current" />,
  bee: <span className="text-4xl">🐝</span>,
  'wax-seal': <WaxSealIcon className="size-full fill-current" />,
  'rose-emoji': <span className="text-4xl">🌹</span>,
  'star-emoji': <span className="text-4xl">⭐</span>,
  'butterfly-emoji': <span className="text-4xl">🦋</span>,
  'flower-emoji': <span className="text-4xl">🌺</span>,
  'rainbow-emoji': <span className="text-4xl">🌈</span>,
  'kiss-emoji': <span className="text-4xl">💋</span>,
  'sparkle-emoji': <span className="text-4xl">✨</span>,
  'sun-emoji': <span className="text-4xl">☀️</span>,
  'fire-emoji': <span className="text-4xl">🔥</span>,
  'cupid-emoji': <span className="text-4xl">💘</span>,
  'infinity-emoji': <span className="text-4xl">♾️</span>,
  'ring-emoji': <span className="text-4xl">💍</span>,
  'moon-emoji': <span className="text-4xl">🌙</span>,
  'crown-emoji': <span className="text-4xl">👑</span>,
  'diamond-emoji': <span className="text-4xl">💎</span>,
  'angel-emoji': <span className="text-4xl">👼</span>,
  'dove-emoji': <span className="text-4xl">🕊️</span>,
  'teddy-emoji': <span className="text-4xl">🧸</span>,
  'lovebirds-emoji': <span className="text-4xl">🐦</span>,
  'shooting-star-emoji': <span className="text-4xl">🌠</span>,
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
        if (length < 100) return 'text-2xl md:text-4xl lg:text-5xl leading-[40px] md:leading-[56px] lg:leading-[64px]';
        if (length < 250) return 'text-xl md:text-3xl lg:text-4xl leading-[34px] md:leading-[48px] lg:leading-[56px]';
        if (length < 500) return 'text-lg md:text-2xl lg:text-3xl leading-[32px] md:leading-[42px] lg:leading-[48px]';
        if (length < 800) return 'text-base md:text-xl lg:text-2xl leading-[29px] md:leading-[38px] lg:leading-[42px]';
        return 'text-[15px] md:text-lg lg:text-xl leading-7 md:leading-[34px] lg:leading-[38px]';
  };

  const getFontClass = () => {
    const fontClass = fontClasses[letter.config.font] || 'font-handwriting';
    if (letter.config.font === 'Amatic_SC') return `${fontClass} scale-110`;
    return fontClass;
  };

  // Check if border is animated (premium)
  const isAnimatedBorder = ANIMATED_BORDERS.includes(letter.config.borderStyle as BorderStyle);

  if (isOpened) {
      return (
          <div className="paper-app-bg paper-noise flex min-h-screen flex-col animate-in fade-in duration-500">
              <div className="sticky top-0 z-20 bg-[#FFF8F0]/90 p-2.5 backdrop-blur-sm sm:p-4">
                                    <div className="mx-auto flex w-full max-w-5xl items-center justify-between gap-2">
                                        <Link href="/inbox" className="glass-paper inline-flex touch-manipulation items-center gap-2 rounded-full px-3 py-1.5 transition-all hover:shadow-md active:scale-95 sm:px-4 sm:py-2">
                                                <ArrowLeft className="size-4 text-gray-600 sm:size-5" />
                                                <span className="text-xs font-medium text-gray-700 sm:text-sm">Volver al buzon</span>
                                        </Link>

                                        <Link href="/new-letter" className="inline-flex touch-manipulation items-center gap-1.5 rounded-full bg-primary px-3 py-1.5 text-xs font-semibold text-white shadow-crimson-soft transition-all hover:shadow-crimson-hover sm:gap-2 sm:px-4 sm:py-2 sm:text-sm">
                                            <Send className="size-4" />
                                            Responder
                                        </Link>
                                    </div>
              </div>

              <div className="flex-1 p-2.5 pb-24 sm:p-4 lg:p-8 lg:pb-32">
                                    <div className="mx-auto max-w-5xl">
                                            <div className="mb-5 grid gap-3 sm:grid-cols-3">
                                                <div className="glass-paper rounded-2xl p-3">
                                                    <p className="mb-1 flex items-center gap-2 text-[11px] font-semibold uppercase tracking-wide text-gray-500">
                                                        <UserRound className="size-3.5" /> De
                                                    </p>
                                                    <p className="text-sm font-semibold text-primary sm:text-base">{getTranslatedName(letter.senderName)}</p>
                                                </div>
                                                <div className="glass-paper rounded-2xl p-3">
                                                    <p className="mb-1 flex items-center gap-2 text-[11px] font-semibold uppercase tracking-wide text-gray-500">
                                                        <UserRound className="size-3.5" /> Para
                                                    </p>
                                                    <p className="text-sm font-semibold text-primary sm:text-base">{getTranslatedName(letter.recipientName)}</p>
                                                </div>
                                                <div className="glass-paper rounded-2xl p-3">
                                                    <p className="mb-1 flex items-center gap-2 text-[11px] font-semibold uppercase tracking-wide text-gray-500">
                                                        <CalendarDays className="size-3.5" /> Fecha
                                                    </p>
                                                    <p className="text-sm font-semibold text-gray-700 sm:text-base">{format(new Date(letter.createdAt), 'd MMMM yyyy', { locale: locale === 'es' ? es : undefined })}</p>
                                                </div>
                                            </div>

                      <div className={cn(
                          "relative overflow-hidden rounded-xl shadow-2xl sm:rounded-lg",
                          borderClasses[letter.config.borderStyle || 'simple'],
                          paperColorClasses[letter.config.paperColor],
                          isAnimatedBorder && "animated"
                      )}>
                          <div className="absolute left-0 right-0 top-0 h-2 bg-gradient-to-r from-primary/30 via-transparent to-primary/30 sm:h-3"></div>
                          <div className="absolute bottom-0 left-0 right-0 h-2 bg-gradient-to-r from-primary/30 via-transparent to-primary/30 sm:h-3"></div>

                          <div className="p-4 sm:p-8 lg:p-12">
                              {/* Header with stamp, date, and names */}
                              <div className="mb-6 border-b border-dashed border-gray-300 pb-4 sm:mb-8 sm:pb-6">
                                  <div className="flex items-start justify-between gap-3">
                                      <div className="flex-1 space-y-1.5">
                                          <div className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2 py-0.5 text-[10px] uppercase tracking-wider text-primary sm:text-xs">
                                              Carta abierta
                                          </div>
                                          <div className="text-sm text-gray-600 sm:text-base">
                                              Un mensaje personal para ti
                                          </div>
                                      </div>
                                      
                                      <div className="flex size-12 flex-shrink-0 items-center justify-center rounded-full bg-white/80 text-primary shadow-inner sm:size-16">
                                          {stampIcons[letter.config.stamp]}
                                      </div>
                                  </div>

                                  {/* Title if exists */}
                                  {letter.title && (
                                      <div className="mt-4 sm:mt-6">
                                          <h1 className={cn(
                                              "text-center text-2xl font-bold text-primary sm:text-3xl lg:text-4xl",
                                              getFontClass()
                                          )}>
                                              {letter.title}
                                          </h1>
                                      </div>
                                  )}
                              </div>

                              {/* Letter content */}
                              <div className={cn(
                                  "min-h-[28vh] break-words whitespace-pre-wrap text-gray-800 transition-all sm:min-h-[40vh]",
                                  getAdaptiveFontSize(),
                                  getFontClass()
                              )}>
                                  {letter.content}
                              </div>

                              <div className="mt-8 flex items-center justify-center gap-2 border-t border-dashed border-gray-300 pt-4 sm:mt-12 sm:pt-6">
                                  <Sparkles className="size-4 text-primary/70" />
                                  <span className="text-xs text-gray-500 sm:text-sm">Escrito con HoneyNotes</span>
                              </div>
                          </div>
                      </div>
                  </div>
              </div>
          </div>
      );
  }

  return (
        <div className="paper-app-bg paper-noise flex min-h-screen flex-col items-center justify-center p-4">
        <div className="w-full max-w-sm text-center sm:max-w-md">
            <button
                onClick={() => setIsOpened(true)}
                className="group relative mx-auto mb-6 block w-full touch-manipulation transition-transform hover:scale-105 active:scale-95 sm:mb-8"
            >
                <div className={cn(
                                    "glass-paper relative flex min-h-[200px] w-full flex-col items-center justify-center overflow-hidden rounded-lg p-4 transition-all group-hover:shadow-[0_15px_50px_rgba(220,20,60,0.2)] sm:min-h-[220px] sm:rounded-sm sm:p-6",
                  paperColorClasses[letter.config.paperColor] || 'bg-[#FFFEF5]'
                )}>
                    <div className="absolute inset-x-0 top-0 h-10 bg-gradient-to-b from-primary/10 to-transparent" />

                    {/* Stamp in corner */}
                    <div className="absolute right-3 top-3 rounded-full bg-primary p-2 shadow-lg sm:right-6 sm:top-6 sm:p-3">
                        <div className="size-6 text-white sm:size-8">
                            {stampIcons[letter.config.stamp]}
                        </div>
                    </div>

                    {/* Title if exists */}
                    {letter.title && (
                      <p className="mb-2 line-clamp-2 px-8 font-display text-lg font-bold text-primary sm:text-xl">
                        {letter.title}
                      </p>
                    )}

                    {/* Mail icon */}
                    <Mail className="size-16 text-primary/20 sm:size-24" />

                    {/* Preview lines */}
                    <div className="absolute bottom-4 left-4 right-4 sm:bottom-6 sm:left-6 sm:right-6">
                        <div className="h-1 w-full rounded bg-gray-200"></div>
                        <div className="mt-1 h-1 w-3/4 rounded bg-gray-200"></div>
                    </div>
                </div>
            </button>

            <div className="space-y-2">
                <p className="text-lg text-gray-600 sm:text-xl">
                                        <span className="inline-flex items-center gap-1">
                                            <Sparkles className="size-4 text-primary" /> {t('letterOpener.tapToOpen')} <Sparkles className="size-4 text-primary" />
                                        </span>
                </p>
                <div className="space-y-1">
                  <p className="text-sm text-gray-500 sm:text-base">
                      De: <span className="font-semibold text-primary">{getTranslatedName(letter.senderName)}</span>
                  </p>
                  <p className="text-xs text-gray-400 sm:text-sm">
                      Para: {getTranslatedName(letter.recipientName)}
                  </p>
                </div>
            </div>
        </div>
    </div>
  );
}
