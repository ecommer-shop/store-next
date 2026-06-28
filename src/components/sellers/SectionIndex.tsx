'use client';

interface SectionIndexProps {
  number: string;
  side: 'left' | 'right';
}

export function SectionIndex({ number, side }: SectionIndexProps) {
  return (
    <span
      aria-hidden
      className={`pointer-events-none absolute top-1/2 -translate-y-1/2 z-0 text-[clamp(5rem,20vw,8rem)] font-black tracking-tight text-[#12123F] dark:text-[#F1F1F1] opacity-[0.04] select-none ${
        side === 'left' ? 'left-4 md:left-8' : 'right-4 md:right-8'
      }`}
    >
      {number}
    </span>
  );
}