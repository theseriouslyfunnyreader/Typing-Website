import { forwardRef } from 'react';
import type { ReactNode, ButtonHTMLAttributes } from 'react';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'icon';
  size?: 'sm' | 'md' | 'lg';
  children: ReactNode;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className = '', variant = 'primary', size = 'md', children, ...props }, ref) => {
    
    // Premium inline styling base
    const baseStyles: React.CSSProperties = {
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '0.5rem',
      fontWeight: 600,
      fontFamily: 'inherit',
      cursor: 'pointer',
      transition: 'all 0.18s ease',
      border: 'none',
      outline: 'none',
    };

    let variantStyles: React.CSSProperties = {};
    if (variant === 'primary') {
      variantStyles = {
        background: 'var(--accent)',
        color: '#fff',
        boxShadow: 'var(--shadow-accent)',
        border: '1px solid transparent',
      };
    } else if (variant === 'secondary') {
      variantStyles = {
        background: 'var(--surface-2)',
        color: 'var(--text-1)',
        border: '1px solid var(--border)',
        boxShadow: 'var(--shadow-sm)',
      };
    } else if (variant === 'icon') {
      variantStyles = {
        background: 'transparent',
        color: 'var(--text-2)',
        padding: '0.5rem',
        borderRadius: '50%',
      };
    }

    let sizeStyles: React.CSSProperties = {};
    if (variant !== 'icon') {
      if (size === 'sm') {
        sizeStyles = { padding: '0.5rem 1rem', fontSize: '0.85rem', borderRadius: '8px' };
      } else if (size === 'md') {
        sizeStyles = { padding: '0.75rem 1.5rem', fontSize: '0.95rem', borderRadius: '10px' };
      } else if (size === 'lg') {
        sizeStyles = { padding: '1rem 2rem', fontSize: '1.05rem', borderRadius: '12px' };
      }
    }

    return (
      <button
        ref={ref}
        className={className}
        style={{ ...baseStyles, ...variantStyles, ...sizeStyles }}
        onMouseOver={(e) => {
          if (variant === 'primary') e.currentTarget.style.background = 'var(--accent-2)';
          if (variant === 'secondary') e.currentTarget.style.background = 'var(--border)';
          if (variant === 'icon') e.currentTarget.style.color = 'var(--accent)';
        }}
        onMouseOut={(e) => {
          if (variant === 'primary') e.currentTarget.style.background = 'var(--accent)';
          if (variant === 'secondary') e.currentTarget.style.background = 'var(--surface-2)';
          if (variant === 'icon') e.currentTarget.style.color = 'var(--text-2)';
        }}
        {...props}
      >
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';
