'use client';

import { useState } from 'react';
import { Mail, Search, Sparkles, Loader2, Heart, Send, Inbox } from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { formatDistanceToNow } from 'date-fns';
import { useTranslation } from '@/hooks/use-translation';
import { es } from 'date-fns/locale';
import { BeeIcon } from '@/components/icons/BeeIcon';
import { WaxSealIcon } from '@/components/icons/WaxSealIcon';
import { useFirebase, useUser, useCollection, useMemoFirebase } from '@/firebase';
import { collection, query, orderBy, where } from 'firebase/firestore';
import type { Letter, PaperColor, Stamp } from '@/lib/types';

// Paper color classes for preview
const paperColorClasses: Record<PaperColor, string> = {
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

// Stamp icons for preview
const stampIcons: Record<Stamp, React.ReactNode> = {
  heart: <Heart className="size-full fill-current" />,
  bee: <BeeIcon className="size-full" />,
  'wax-seal': <WaxSealIcon className="size-full" />,
  'rose-emoji': <span className="text-2xl">🌹</span>,
  'star-emoji': <span className="text-2xl">⭐</span>,
  'kiss-emoji': <span className="text-2xl">💋</span>,
  'sparkle-emoji': <span className="text-2xl">✨</span>,
  'sun-emoji': <span className="text-2xl">☀️</span>,
  'moon-emoji': <span className="text-2xl">🌙</span>,
};

// Border style classes for preview
const borderClasses: Record<string, string> = {
  simple: 'border-2 border-primary/20',
  airmail: 'airmail-border',
  dashed: 'border-2 border-dashed border-primary/30',
  floral: 'border-floral',
};

export default function InboxPage() {
  const { t, locale } = useTranslation();
  const { firestore } = useFirebase();
  const { user, isUserLoading } = useUser();
  const [viewMode, setViewMode] = useState<'received' | 'sent'>('received');

  const lettersQuery = useMemoFirebase(() => {
    if (!user) return null;
    // Query from root /letters collection, filter by recipientId or senderId based on view mode
    const filterField = viewMode === 'received' ? 'recipientId' : 'senderId';
    return query(
      collection(firestore, 'letters'),
      where(filterField, '==', user.uid),
      orderBy('createdAt', 'desc')
    );
  }, [firestore, user, viewMode]);

  const { data: letters, isLoading, error } = useCollection<Letter>(lettersQuery);

  const getTranslatedName = (name: string) => {
    if (name === 'You' || name === 'Tú') return t('users.you');
    if (name === 'Your Love' || name === 'Tu Amor') return t('users.yourLove');
    return name;
  };
  
  const unreadCount = letters?.filter((l) => !l.isRead).length ?? 0;

  // Debug: log errors to console
  if (error) {
    console.error('Inbox error:', error);
  }

  return (
    <div className="flex flex-1 flex-col bg-[#F0F4F8]">
      {/* Header */}
      <header className="sticky top-0 z-10 flex flex-col gap-2 bg-[#F0F4F8]/95 p-6 backdrop-blur-sm lg:p-8">
        <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold text-primary lg:text-4xl">{t('inbox.title')}</h1>
            <div className="rounded-full bg-white p-2 shadow-sm">
                <BeeIcon className="size-6 text-accent" />
            </div>
        </div>
        <div className="flex items-center justify-between">
            <p className="text-base text-gray-600">
              {isLoading ? '...' : viewMode === 'received' ? t('inbox.unread', { count: unreadCount }) : t('inbox.sentCount', { count: letters?.length ?? 0 })}
            </p>
             <button className="rounded-xl border-2 border-dashed border-gray-300 p-2 text-gray-400 hover:border-primary hover:text-primary">
                 <Search className="size-5" />
             </button>
        </div>
        {/* Toggle between received and sent */}
        <div className="mt-4 flex rounded-2xl bg-white p-1 shadow-sm">
          <button
            onClick={() => setViewMode('received')}
            className={cn(
              'flex flex-1 items-center justify-center gap-2 rounded-xl py-3 text-sm font-semibold transition-all',
              viewMode === 'received'
                ? 'bg-primary text-white shadow-sm'
                : 'text-gray-500 hover:text-gray-700'
            )}
          >
            <Inbox className="size-4" />
            {t('inbox.received')}
          </button>
          <button
            onClick={() => setViewMode('sent')}
            className={cn(
              'flex flex-1 items-center justify-center gap-2 rounded-xl py-3 text-sm font-semibold transition-all',
              viewMode === 'sent'
                ? 'bg-primary text-white shadow-sm'
                : 'text-gray-500 hover:text-gray-700'
            )}
          >
            <Send className="size-4" />
            {t('inbox.sent')}
          </button>
        </div>
      </header>

      <div className="flex-1 overflow-y-auto p-4 lg:p-8">
        {/* Show error if any */}
        {error && (
          <div className="mb-4 rounded-xl border border-red-200 bg-red-50 p-4 text-center">
            <p className="font-semibold text-red-600">Error al cargar cartas</p>
            <p className="text-sm text-red-500">{error.message}</p>
          </div>
        )}
        {/* Show message if user not logged in */}
        {!user && !isUserLoading && (
          <div className="flex h-full flex-col items-center justify-center space-y-4 text-center">
            <div className="rounded-full bg-white p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
              <Mail className="size-12 text-gray-300" />
            </div>
            <div className="text-xl text-gray-400">
              <p>Inicia sesión para ver tus cartas</p>
            </div>
          </div>
        )}
        {(isLoading || isUserLoading) && (
          <div className="flex h-full flex-col items-center justify-center">
            <Loader2 className="size-12 animate-spin text-primary" />
          </div>
        )}
        {!isLoading && !isUserLoading && !error && user && letters?.length === 0 && (
          <div className="flex h-full flex-col items-center justify-center space-y-4 text-center">
             <div className="rounded-full bg-white p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
                {viewMode === 'received' ? <Sparkles className="size-12 text-gray-300" /> : <Send className="size-12 text-gray-300" />}
             </div>
            <div className="text-xl text-gray-400">
              <p>{viewMode === 'received' ? t('inbox.empty') : t('inbox.emptySent')}</p>
              {viewMode === 'received' && <p className="text-base">{t('inbox.waiting')}</p>}
            </div>
          </div>
        )}
        {!isLoading && !isUserLoading && !error && user && letters && letters.length > 0 && (
          <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {letters.map((letter) => (
              <li key={letter.id} className="group relative pt-4">
                 <div className="absolute left-1/2 top-0 z-20 h-6 w-16 -translate-x-1/2 rotate-[-2deg] rounded-sm bg-[#e3d5ca] opacity-90 shadow-sm after:absolute after:inset-0 after:bg-[url('https://www.transparenttextures.com/patterns/washi.png')] after:opacity-20 sm:h-7 sm:w-20"></div>
                 
                <Link
                  href={`/letter/${letter.id}`}
                  className={cn(
                    'relative block overflow-hidden rounded-xl p-1 transition-all hover:-translate-y-1 hover:rotate-1 hover:shadow-xl active:scale-[0.98] sm:rounded-lg sm:p-1.5',
                    'shadow-[0_2px_8px_rgba(0,0,0,0.08),0_4px_16px_rgba(0,0,0,0.08)]',
                    paperColorClasses[letter.config?.paperColor] || 'bg-[#FFFDF5]'
                  )}
                >
                  {!letter.isRead && viewMode === 'received' && (
                      <div className="absolute -right-5 top-2 z-10 w-20 rotate-45 bg-primary py-0.5 text-center text-[9px] font-bold tracking-wider text-white shadow-sm sm:-right-6 sm:top-3 sm:w-24 sm:text-[10px]">
                          NEW
                      </div>
                  )}

                  <div className={cn(
                    "flex min-h-[180px] flex-col justify-between rounded-lg bg-[url('https://www.transparenttextures.com/patterns/paper-fibers.png')] p-4 sm:min-h-[200px] sm:rounded-md sm:p-5",
                    borderClasses[letter.config?.borderStyle || 'simple']
                  )}>
                    {/* Header: Stamp and Date */}
                    <div className="flex items-start justify-between">
                      <div className="flex size-10 items-center justify-center rounded-full bg-white/80 text-primary/70 shadow-sm transition-colors group-hover:text-primary sm:size-12">
                        {stampIcons[letter.config?.stamp] || <WaxSealIcon className="size-full rotate-12" />}
                      </div>
                      <div className="text-[10px] text-gray-500 sm:text-xs">
                        {formatDistanceToNow(letter.createdAt.toDate(), {
                          addSuffix: true,
                          locale: locale === 'es' ? es : undefined,
                        })}
                      </div>
                    </div>

                    {/* Title (if exists) */}
                    {letter.title && (
                      <div className="mt-2 text-center">
                        <p className="line-clamp-2 font-display text-base font-bold text-primary sm:text-lg">
                          {letter.title}
                        </p>
                      </div>
                    )}

                    {/* Names: To/From */}
                    <div className="mt-auto pt-3 text-center">
                      <p className="text-sm text-gray-800 sm:text-base">
                        {viewMode === 'received' ? 'De' : 'Para'}: <span className="font-semibold text-primary">
                          {viewMode === 'received' ? getTranslatedName(letter.senderName) : getTranslatedName(letter.recipientName)}
                        </span>
                      </p>
                      <p className="mt-0.5 text-xs text-gray-500 sm:text-sm">
                        {viewMode === 'received' ? 'Para' : 'De'}: {viewMode === 'received' ? getTranslatedName(letter.recipientName) : getTranslatedName(letter.senderName)}
                      </p>
                    </div>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
