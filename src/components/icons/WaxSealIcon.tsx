import type { SVGProps } from 'react';

export function WaxSealIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10 10-4.5 10-10S17.5 2 12 2z" fill="currentColor" />
      <path d="M12 2c1.5 0 2.5 2 4.5 3s4 1.5 4 4.5-1.5 2.5-3 4.5-1.5 4-4.5 4-2.5-2-4.5-3-4-1.5-4-4.5 1.5-2.5 3-4.5 1.5-4 4.5-4z" fill="currentColor" />
      <path d="M10 13l-2-2m6 0l-2 2-2-2" stroke="var(--primary-foreground, #fff)" strokeWidth="2"/>
    </svg>
  );
}
