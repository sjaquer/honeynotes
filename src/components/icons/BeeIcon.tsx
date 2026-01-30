import type { HTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

interface BeeIconProps extends HTMLAttributes<HTMLSpanElement> {
  size?: 'sm' | 'md' | 'lg' | 'xl' | '2xl';
}

const sizeClasses = {
  sm: 'text-base',
  md: 'text-xl',
  lg: 'text-2xl',
  xl: 'text-3xl',
  '2xl': 'text-4xl',
};

export function BeeIcon({ className, size = 'lg', ...props }: BeeIconProps) {
  return (
    <span 
      role="img" 
      aria-label="Abeja" 
      className={cn('inline-flex items-center justify-center', sizeClasses[size], className)}
      {...props}
    >
      🐝
    </span>
  );
}