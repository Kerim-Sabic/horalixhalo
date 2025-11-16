import { ButtonHTMLAttributes, ReactNode } from 'react';
import clsx from 'clsx';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  children: ReactNode;
  fullWidth?: boolean;
}

export default function Button({
  variant = 'primary',
  size = 'md',
  children,
  fullWidth = false,
  className,
  disabled,
  ...props
}: ButtonProps) {
  return (
    <button
      className={clsx(
        'inline-flex items-center justify-center rounded-lg font-medium transition-all',
        'focus:outline-none focus:ring-2 focus:ring-offset-2',
        'disabled:opacity-50 disabled:cursor-not-allowed',
        {
          'bg-primary-600 text-white hover:bg-primary-700 focus:ring-primary-500':
            variant === 'primary',
          'bg-neutral-200 text-neutral-900 hover:bg-neutral-300 focus:ring-neutral-400':
            variant === 'secondary',
          'bg-transparent text-neutral-700 hover:bg-neutral-100 focus:ring-neutral-300':
            variant === 'ghost',
          'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500': variant === 'danger',
        },
        {
          'px-3 py-1.5 text-sm': size === 'sm',
          'px-4 py-2 text-base': size === 'md',
          'px-6 py-3 text-lg': size === 'lg',
        },
        {
          'w-full': fullWidth,
        },
        className
      )}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
}
