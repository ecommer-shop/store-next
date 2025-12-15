import { Button as HeroButton, buttonVariants as btvar, type ButtonProps } from '@heroui/react';
import { tv, type VariantProps } from 'tailwind-variants';

export const buttonVariants = tv({
  extend: btvar,
  base: 'font-medium transition-all',
  variants: {
    size: {
      small: 'text-sm px-2 py-1',
      medium: 'text-base px-4 py-2',
      large: 'text-lg px-6 py-3',
    },
    variant: {
      quaternary: 'bg-purple-500 hover:bg-purple-600 text-white',
      
    }
  },
  defaultVariants: {
    intent: 'primary',
    size: 'medium',
  },
});

type CustomButtonVariants = VariantProps<typeof buttonVariants>;

interface CustomButtonProps
  extends Omit<ButtonProps, 'className' | 'size' | 'variant'>,
  CustomButtonVariants {
  className?: string;
}

export function Button({ size, className, ...props }: CustomButtonProps) {
  return (
    <HeroButton
      className={buttonVariants({ size, className })}
      {...props}
    />
  );
}