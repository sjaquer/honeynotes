'use client';

import { Mail, Search, Sparkles } from 'lucide-react';
import { mockLetters, currentUser } from '@/lib/data';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { formatDistanceToNow } from 'date-fns';
import { useTranslation } from '@/hooks/use-translation';
import { es } from 'date-fns/locale';
import { BeeIcon } from '@/components/icons/BeeIcon';
import { WaxSealIcon } from '@/components/icons/WaxSealIcon'; // Assuming we have this based on previous files

export default function InboxPage() {
  const { t, locale } = useTranslation();
  const receivedLetters = mockLetters(t).filter(
    (letter) => letter.recipientName === currentUser
  );

  const getTranslatedName = (name: string) => {
    if (name === 'You') return t('users.you');
    if (name === 'Your Love') return t('users.yourLove');
    return name;
  };

  return (
    <div className="flex flex-1 flex-col bg-[#F0F4F8]">
      {/* Header with Handwriting Style */}
      <header className="sticky top-0 z-10 flex flex-col gap-2 bg-[#F0F4F8]/95 p-6 backdrop-blur-sm lg:p-8">
        <div className="flex items-center justify-between">
            <h1 className="font-display text-4xl font-bold text-primary drop-shadow-sm">{t('inbox.title')}</h1>
            <div className="rounded-full bg-white p-2 shadow-sm">
                <BeeIcon className="size-6 text-accent" />
            </div>
        </div>
        <div className="flex items-center justify-between">
            <p className="font-handwriting text-xl text-gray-600">
            {t('inbox.unread', { count: receivedLetters.filter((l) => !l.isRead).length })}
            </p>
             {/* Filter/Search Placeholder */}
             <button className="rounded-xl border-2 border-dashed border-gray-300 p-2 text-gray-400 hover:border-primary hover:text-primary">
                 <Search className="size-5" />
             </button>
        </div>
      </header>

      <div className="flex-1 overflow-y-auto p-4 lg:p-8">
        {receivedLetters.length === 0 ? (
          <div className="flex h-full flex-col items-center justify-center space-y-4 text-center">
             <div className="rounded-full bg-white p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
                <Sparkles className="size-12 text-gray-300" />
             </div>
            <div className="font-handwriting text-2xl text-gray-400">
              <p>{t('inbox.empty')}</p>
              <p>{t('inbox.waiting')}</p>
            </div>
          </div>
        ) : (
          <ul className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {receivedLetters.map((letter) => (
              <li key={letter.id} className="group relative pt-4">
                 {/* Washi Tape Effect */}
                 <div className="absolute left-1/2 top-0 z-20 h-7 w-20 -translate-x-1/2 rotate-[-2deg] rounded-sm bg-[#e3d5ca] opacity-90 shadow-sm after:absolute after:inset-0 after:bg-[url('https://www.transparenttextures.com/patterns/washi.png')] after:opacity-20"></div>
                 
                <Link
                  href={`/letter/${letter.id}`}
                  className={cn(
                    'relative block overflow-hidden rounded-lg bg-[#FFFdf5] p-1.5 transition-all hover:-translate-y-1 hover:rotate-1 hover:shadow-xl active:scale-[0.98]',
                    'shadow-[0_2px_8px_rgba(0,0,0,0.08),0_4px_16px_rgba(0,0,0,0.08)]'
                  )}
                >
                  {/* Unread Indicator: Shake animation + New Badge */}
                  {!letter.isRead && (
                      <div className="absolute -right-6 top-3 z-10 w-24 rotate-45 bg-primary py-0.5 text-center font-display text-[10px] font-bold tracking-wider text-white shadow-sm">
                          NEW
                      </div>
                  )}

                  <div className="flex h-44 flex-col justify-between rounded-md border-2 border-dashed border-primary/10 bg-[url('https://www.transparenttextures.com/patterns/paper-fibers.png')] p-5">
                    {/* Top Row: Stamp & Date */}
                    <div className="flex items-start justify-between">
                         <div className="rounded-lg border border-gray-100 bg-white p-2 shadow-sm">
                            <Mail className={cn("size-5 text-primary/80", !letter.isRead && "animate-pulse")} />
                         </div>
                         <div className="font-handwriting text-xs text-gray-400">
                             {formatDistanceToNow(new Date(letter.createdAt), {
                            addSuffix: true,
                            locale: locale === 'es' ? es : undefined,
                          })}
                         </div>
                    </div>

                    {/* Middle: Recipient/Sender */}
                    <div className="text-center">
                        <p className="font-handwriting text-lg text-gray-800">
                             Para: <span className="font-bold text-primary">{t('users.you')}</span>
                        </p>
                         <p className="font-handwriting text-sm text-gray-500">
                             De: {getTranslatedName(letter.senderName)}
                        </p>
                    </div>

                    {/* Bottom: Seal */}
                    <div className="flex justify-center">
                         <div className="text-primary/20 transition-colors group-hover:text-primary/40">
                              <WaxSealIcon className="size-10 rotate-12" />
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
