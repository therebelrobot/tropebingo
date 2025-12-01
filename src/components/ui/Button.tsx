import { cn } from '@utils/cn';
import type { ButtonHTMLAttributes, PropsWithChildren } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
}

export function Button({
  children,
  variant = 'primary',
  size = 'md',
  className,
  disabled,
  ...props
}: PropsWithChildren<ButtonProps>) {
  return (
    <button
      className={cn(
        'inline-flex items-center justify-center rounded-lg font-medium',
        'transition-all duration-200',
        'focus:outline-none focus:ring-2 focus:ring-offset-2',
        'disabled:opacity-50 disabled:cursor-not-allowed',
        
        // Variants
        variant === 'primary' && [
          'bg-[var(--color-primary)] text-white',
          'hover:bg-[var(--color-primary-hover)]',
          'focus:ring-[var(--color-primary)]',
        ],
        variant === 'secondary' && [
          'bg-[var(--color-surface)] text-[var(--color-text)]',
          'hover:bg-[var(--color-border)]',
          'focus:ring-[var(--color-border)]',
        ],
        variant === 'outline' && [
          'border-2 border-[var(--color-primary)] text-[var(--color-primary)]',
          'hover:bg-[var(--color-primary)] hover:text-white',
          'focus:ring-[var(--color-primary)]',
        ],
        variant === 'ghost' && [
          'text-[var(--color-text)]',
          'hover:bg-[var(--color-surface)]',
        ],
        
        // Sizes
        size === 'sm' && 'px-3 py-1.5 text-sm',
        size === 'md' && 'px-4 py-2 text-base',
        size === 'lg' && 'px-6 py-3 text-lg',
        
        className
      )}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
}