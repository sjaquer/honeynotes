'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Inbox,
  Feather,
  ClipboardCheck,
  SlidersHorizontal,
  ShoppingBag,
  type LucideIcon,
  Sparkles,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useTranslation } from '@/hooks/use-translation';

type NavItem = {
  href: string;
  labelKey: string;
  icon: LucideIcon;
};

const navItems: NavItem[] = [
  { href: '/inbox', labelKey: 'nav.inbox', icon: Inbox },
  { href: '/new-letter', labelKey: 'nav.newLetter', icon: Feather },
  { href: '/shop', labelKey: 'nav.shop', icon: ShoppingBag },
  { href: '/tasks', labelKey: 'nav.tasks', icon: ClipboardCheck },
  { href: '/settings', labelKey: 'nav.settings', icon: SlidersHorizontal },
];

export function BottomNav() {
  const pathname = usePathname();
  const { t } = useTranslation();

  return (
    <div className="fixed bottom-5 left-1/2 z-50 w-[95%] max-w-sm -translate-x-1/2 touch-none">
      <nav className="glass-paper relative flex h-[4.75rem] items-center justify-around rounded-[2rem] px-2 border border-white/60">
         {/* Decorative Tape */}
         <div className="absolute -top-2 left-1/2 h-5 w-20 -translate-x-1/2 rotate-1 rounded-sm bg-primary/65 opacity-90 shadow-sm after:absolute after:inset-0 after:bg-[url('https://www.transparenttextures.com/patterns/washi.png')] after:opacity-30 pointer-events-none"></div>

        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              prefetch={true}
              className={cn(
                'group relative flex flex-1 flex-col items-center justify-center gap-1 p-2 transition-all duration-200 touch-manipulation',
                isActive ? '-translate-y-3' : 'hover:-translate-y-1 active:scale-[0.97]'
              )}
            >
              {/* Active Circle Background */}
              <div 
                className={cn(
                  "absolute flex size-14 items-center justify-center rounded-full transition-all duration-300 pointer-events-none",
                  isActive 
                    ? "bg-primary shadow-crimson-deep scale-100" 
                    : "bg-transparent scale-0"
                )}
              >
                  {isActive && <Sparkles className="absolute -right-1 -top-1 size-4 text-amber-300" />}
              </div>

              {/* Icon */}
              <div className={cn(
                  "relative z-10 transition-all duration-300 pointer-events-none",
                  isActive ? "text-white" : "text-gray-400 group-hover:text-primary group-active:scale-90"
              )}>
                  <item.icon className={cn("size-[1.35rem]", isActive && "stroke-[2.5px]")} />
              </div>

              {/* Label */}
              <span className={cn(
                  "absolute -bottom-5 text-[11px] font-semibold transition-all duration-300 pointer-events-none",
                  isActive ? "opacity-100 text-primary scale-100" : "opacity-0 scale-0"
              )}>
                  {t(item.labelKey)}
              </span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
