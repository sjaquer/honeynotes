'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Inbox,
  PenSquare,
  ListTodo,
  Store,
  type LucideIcon,
} from 'lucide-react';
import { cn } from '@/lib/utils';

type NavItem = {
  href: string;
  label: string;
  icon: LucideIcon;
};

const navItems: NavItem[] = [
  { href: '/inbox', label: 'Inbox', icon: Inbox },
  { href: '/new-letter', label: 'New Letter', icon: PenSquare },
  { href: '/tasks', label: 'Tasks', icon: ListTodo },
  { href: '/shop', label: 'Shop', icon: Store },
];

export function BottomNav() {
  const pathname = usePathname();

  return (
    <footer className="sticky bottom-0 z-10 mt-auto w-full border-t bg-background/95 backdrop-blur-sm">
      <nav className="flex h-[70px] items-center justify-around">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex h-full flex-1 flex-col items-center justify-center gap-1 text-xs font-medium transition-colors',
                isActive ? 'text-primary' : 'text-foreground/60 hover:text-primary'
              )}
            >
              <item.icon className="size-6" />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </footer>
  );
}
