'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Inbox,
  PenSquare,
  ListTodo,
  Settings,
  Store,
  type LucideIcon,
  Heart
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
  { href: '/new-letter', labelKey: 'nav.newLetter', icon: PenSquare },
  { href: '/shop', labelKey: 'nav.shop', icon: Store },
  { href: '/tasks', labelKey: 'nav.tasks', icon: ListTodo },
  { href: '/settings', labelKey: 'nav.settings', icon: Settings },
];

export function BottomNav() {
  const pathname = usePathname();
  const { t } = useTranslation();

  return (
    <div className="fixed bottom-6 left-1/2 z-50 w-[95%] max-w-sm -translate-x-1/2">
      <nav className="relative flex h-20 items-center justify-around rounded-[2.5rem] bg-[#FFFdf5] px-2 shadow-[0_8px_30px_rgb(0,0,0,0.12)] border-2 border-gray-100">
         {/* Decorative Tape */}
         <div className="absolute -top-3 left-1/2 h-6 w-24 -translate-x-1/2 rotate-1 bg-[#ffb7b2] opacity-80 shadow-sm after:absolute after:inset-0 after:bg-[url('https://www.transparenttextures.com/patterns/washi.png')] after:opacity-30"></div>

        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'group relative flex flex-1 flex-col items-center justify-center gap-1 p-2 transition-all',
                isActive ? '-translate-y-4' : 'hover:-translate-y-1'
              )}
            >
              {/* Active Circle Background */}
              <div 
                className={cn(
                  "absolute flex size-14 items-center justify-center rounded-full transition-all duration-300",
                  isActive 
                    ? "bg-primary shadow-lg scale-100 rotate-[-3deg]" 
                    : "bg-transparent scale-0"
                )}
              >
                  {/* Decorative Heart for active */}
                   {isActive && <Heart className="absolute -right-1 -top-1 size-4 fill-secondary text-secondary animate-pulse" />}
              </div>

              {/* Icon */}
              <div className={cn(
                  "relative z-10 transition-colors duration-300",
                  isActive ? "text-white" : "text-gray-400 group-hover:text-primary"
              )}>
                  <item.icon className={cn("size-7", isActive && "stroke-[2.5px]")} />
              </div>

              {/* Label */}
              <span className={cn(
                  "absolute -bottom-6 text-xs font-semibold transition-all duration-300",
                  isActive ? "opacity-100 text-primary scale-110" : "opacity-0 scale-0"
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
