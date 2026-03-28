import { cva } from 'class-variance-authority';

export const buttonVariants = cva(
  `
    inline-flex items-center justify-center
    font-black uppercase tracking-wide
    transition-all duration-300 ease-out
    focus-visible:outline-2 focus-visible:outline-[var(--theme-accent-primary)] focus-visible:outline-offset-2
    disabled:opacity-50 disabled:cursor-not-allowed
    active:scale-95
  `,
  {
    variants: {
      intent: {
        primary: 'bg-[var(--theme-accent-primary)] text-[var(--on-theme-accent-primary)] hover:opacity-90',
        secondary: 'bg-[var(--theme-accent-secondary)] text-[#111827] hover:brightness-110',
        ghost: 'bg-transparent hover:bg-white/10 text-theme-text',
        danger: 'bg-red-600 text-white hover:bg-red-700',
        glass: 'glass-panel text-theme-text hover:bg-white/10 border-white/20',
        canonic: 'bg-[var(--theme-accent-secondary)] text-[#111827] hover:bg-[#ea580c] shadow-[0_4px_12px_rgba(255,107,0,0.3)]', // To replace old btn-connect-canonic
      },
      size: {
        sm: 'h-8 px-4 text-xs',
        md: 'h-11 px-6 text-sm',
        lg: 'h-14 px-8 text-base',
        touch: 'h-[44px] px-6 text-sm', // Minimum touch target
      },
      shape: {
        rounded: 'rounded-md',
        pill: 'rounded-full',
        square: 'rounded-none',
        genesis: 'rounded-[28px]', // Canonical genesis radius
      },
      fullWidth: {
        true: 'w-full',
        false: '',
      },
      isLoading: {
        true: 'pointer-events-none relative opacity-80',
        false: '',
      },
      context: {
        block: '',
        inline: '!bg-transparent !p-0 !min-h-0 !h-auto text-[var(--theme-accent-primary)] hover:!text-orange-600 underline decoration-2 underline-offset-4 shadow-none hover:shadow-none',
      },
    },
    defaultVariants: {
      intent: 'primary',
      size: 'md',
      shape: 'genesis',
      fullWidth: false,
      isLoading: false,
      context: 'block',
    },
  }
);
