'use client';

import { Mail, Search, Sparkles, Loader2, Heart } from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { formatDistanceToNow } from 'date-fns';
import { useTranslation } from '@/hooks/use-translation';
import { es } from 'date-fns/locale';
import { BeeIcon } from '@/components/icons/BeeIcon';
import { WaxSealIcon } from '@/components/icons/WaxSealIcon';
import { useFirebase, useUser, useCollection, useMemoFirebase } from '@/firebase';
import { collection, query, orderBy } from 'firebase/firestore';
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
  const { user } = useUser();

  const lettersQuery = useMemoFirebase(() => {
    if (!user) return null;
    return query(collection(firestore, 'users', user.uid, 'letters'), orderBy('createdAt', 'desc'));
  }, [firestore, user]);

  const { data: letters, isLoading } = useCollection<Letter>(lettersQuery);

  const getTranslatedName = (name: string) => {
    if (name === 'You' || name === 'Tú') return t('users.you');
    if (name === 'Your Love' || name === 'Tu Amor') return t('users.yourLove');
    return name;
  };
  
  const unreadCount = letters?.filter((l) => !l.isRead).length ?? 0;

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
              {isLoading ? '...' : t('inbox.unread', { count: unreadCount })}
            </p>
             <button className="rounded-xl border-2 border-dashed border-gray-300 p-2 text-gray-400 hover:border-primary hover:text-primary">
                 <Search className="size-5" />
             </button>
        </div>
      </header>

      <div className="flex-1 overflow-y-auto p-4 lg:p-8">
        {isLoading && (
          <div className="flex h-full flex-col items-center justify-center">
            <Loader2 className="size-12 animate-spin text-primary" />
          </div>
        )}
        {!isLoading && letters?.length === 0 && (
          <div className="flex h-full flex-col items-center justify-center space-y-4 text-center">
             <div className="rounded-full bg-white p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
                <Sparkles className="size-12 text-gray-300" />
             </div>
            <div className="text-xl text-gray-400">
              <p>{t('inbox.empty')}</p>
              <p className="text-base">{t('inbox.waiting')}</p>
            </div>
          </div>
        )}
        {!isLoading && letters && letters.length > 0 && (
          <ul className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {letters.map((letter) => (
              <li key={letter.id} className="group relative pt-4">
                 <div className="absolute left-1/2 top-0 z-20 h-7 w-20 -translate-x-1/2 rotate-[-2deg] rounded-sm bg-[#e3d5ca] opacity-90 shadow-sm after:absolute after:inset-0 after:bg-[url('https://www.transparenttextures.com/patterns/washi.png')] after:opacity-20"></div>
                 
                <Link
                  href={`/letter/${letter.id}`}
                  className={cn(
                    'relative block overflow-hidden rounded-lg p-1.5 transition-all hover:-translate-y-1 hover:rotate-1 hover:shadow-xl active:scale-[0.98]',
                    'shadow-[0_2px_8px_rgba(0,0,0,0.08),0_4px_16px_rgba(0,0,0,0.08)]',
                    paperColorClasses[letter.config?.paperColor] || 'bg-[#FFFDF5]'
                  )}
                >
                  {!letter.isRead && (
                      <div className="absolute -right-6 top-3 z-10 w-24 rotate-45 bg-primary py-0.5 text-center text-[10px] font-bold tracking-wider text-white shadow-sm">
                          NEW
                      </div>
                  )}

                  <div className={cn(
                    "flex h-44 flex-col justify-between rounded-md bg-[url('https://www.transparenttextures.com/patterns/paper-fibers.png')] p-5",
                    borderClasses[letter.config?.borderStyle || 'simple']
                  )}>
                    <div className="flex items-start justify-between">
                         <div className="rounded-lg border border-gray-100 bg-white/80 p-2 shadow-sm">
                            <Mail className={cn("size-5 text-primary/80", !letter.isRead && "animate-pulse")} />
                         </div>
                         <div className="text-xs text-gray-500">
                             {formatDistanceToNow(letter.createdAt.toDate(), {
                            addSuffix: true,
                            locale: locale === 'es' ? es : undefined,
                          })}
                         </div>
                    </div>

                    <div className="text-center">
                        <p className="text-lg text-gray-800">
                             Para: <span className="font-semibold text-primary">{getTranslatedName(letter.recipientName)}</span>
                        </p>
                         <p className="text-sm text-gray-500">
                             De: {getTranslatedName(letter.senderName)}
                        </p>
                    </div>

                    <div className="flex justify-center">
                         <div className="flex size-10 items-center justify-center text-primary/60 transition-colors group-hover:text-primary/80">
                              {stampIcons[letter.config?.stamp] || <WaxSealIcon className="size-full rotate-12" />}
                         </div>
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
