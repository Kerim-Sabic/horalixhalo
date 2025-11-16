import { ReactNode } from 'react';
import clsx from 'clsx';

interface BadgeProps {
  children: ReactNode;
  variant?: 'default' | 'success' | 'warning' | 'error' | 'info';
  size?: 'sm' | 'md';
}

export default function Badge({ children, variant = 'default', size = 'sm' }: BadgeProps) {
  return (
    <span
      className={clsx(
        'inline-flex items-center rounded-full font-medium',
        {
          'px-2 py-0.5 text-xs': size === 'sm',
          'px-3 py-1 text-sm': size === 'md',
        },
        {
          'bg-neutral-100 text-neutral-700': variant === 'default',
          'bg-green-100 text-green-700': variant === 'success',
          'bg-yellow-100 text-yellow-700': variant === 'warning',
          'bg-red-100 text-red-700': variant === 'error',
          'bg-blue-100 text-blue-700': variant === 'info',
        }
      )}
    >
      {children}
    </span>
  );
}
