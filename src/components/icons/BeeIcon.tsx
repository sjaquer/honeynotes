import type { SVGProps } from 'react';

export function BeeIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M12 2l-2.5 2.5-1-1.5-1 1.5-2.5-2.5-1.5 1 2.5 2.5-2.5 2.5 1 1.5 1-1.5 2.5 2.5-2.5 2.5 1.5 1 2.5-2.5 2.5 2.5 1.5-1 1-1.5-2.5-2.5 2.5-2.5-1-1.5-1 1.5-2.5-2.5z" />
      <path d="M9 9l6 6" />
      <path d="M12.5 4.5l5 5" />
      <path d="M4.5 12.5l5 5" />
    </svg>
  );
}
