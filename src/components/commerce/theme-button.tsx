'use client';

import { Button as HeroButton, ButtonProps as HeroButtonProps } from '@heroui/react';
import Link from 'next/link';

export type ThemeButtonVariant = 'primary' | 'secondary' | 'accent' | 'outline';

export interface ThemeButtonProps extends Omit<HeroButtonProps, 'variant'> {
  variant?: ThemeButtonVariant;
  href?: string;
}

export function ThemeButton({ variant = 'primary', href, className = '', children, ...props }: ThemeButtonProps) {
  let styleClasses = '';

  switch (variant) {
    case 'primary':
      // Light: #12123F (Dark Blue) | Dark: #F1F1F1 (White)
      styleClasses = 'bg-[var(--accent)] text-[var(--accent-foreground)] hover:opacity-90';
      break;
    case 'secondary':
      // Light: Candy Grape Fizz (#9969F8) | Dark: Blue Mana (#6BB8FF)
      styleClasses = 'bg-[#9969F8] dark:bg-[#6BB8FF] text-[#12123F] hover:opacity-90';
      break;
    case 'accent':
      // Light & Dark: #6BB8FF (Blue Mana) background, but hovers to var(--accent)
      styleClasses = 'bg-[var(--accent-hover)] text-[var(--accent-foreground)] hover:bg-[var(--accent)] hover:text-[var(--accent-foreground)] transition-colors';
      break;
    case 'outline':
      styleClasses = 'bg-transparent border border-[var(--accent)] text-[var(--accent)] hover:bg-[var(--accent)] hover:text-[var(--accent-foreground)] transition-colors';
      break;
    default:
      styleClasses = 'bg-[var(--accent)] text-[var(--accent-foreground)]';
  }

  const combinedClasses = `font-medium ${styleClasses} ${className}`;

  if (href) {
    return (
      <HeroButton as={Link} href={href} className={combinedClasses} {...props as any}>
        {children}
      </HeroButton>
    );
  }

  return (
    <HeroButton className={combinedClasses} {...props}>
      {children}
    </HeroButton>
  );
}
