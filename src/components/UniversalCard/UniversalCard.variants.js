import { cva } from 'class-variance-authority';

export const cardVariants = cva(
  `
    relative w-full overflow-hidden 
    bg-theme-panel shadow-2xl border border-white/5 
    flex flex-col transition-all duration-500 
    hover:shadow-black/50 hover:-translate-y-1 hover:scale-[1.01]
  `,
  {
    variants: {
      variant: {
        post: 'rounded-[var(--card-radius)]',
        mercat: 'rounded-[var(--card-radius)] border-primary/20',
        market: 'rounded-[var(--card-radius)] border-primary/20',
        pobles: 'rounded-[var(--card-radius)]',
        ajuntament: 'rounded-[var(--card-radius)]',
        official: 'rounded-[var(--card-radius)] border-2 border-primary',
        alert: 'rounded-[var(--card-radius)] border-2 border-feedback-error',
        sostenible: 'rounded-[var(--card-radius)] border-2 border-feedback-success',
      },
      viewMode: {
        grid: 'h-auto mx-auto max-w-[var(--card-max-width)] min-h-[var(--card-grid-height)]',
        list: 'min-h-[var(--card-list-height)] bg-white/5 hover:bg-white/10 border-white/10 hover:border-primary !shadow-none !h-auto flex-row',
        single: 'h-auto max-w-[var(--card-max-width)] mx-auto',
      },
      interactive: {
        true: 'cursor-pointer hover:border-primary',
        false: 'cursor-default',
      },
      seniorMode: {
        true: 'border-2 text-lg',
        false: '',
      },
      forensicMode: {
        true: 'outline-2 outline-dashed outline-cyan-400',
        false: '',
      },
      gloveMode: {
        true: 'scale-105',
        false: '',
      },
      isBating: {
        true: 'animate-bategat',
        false: '',
      }
    },
    defaultVariants: {
      variant: 'post',
      viewMode: 'grid',
      interactive: true,
      seniorMode: false,
      gloveMode: false,
      forensicMode: false,
      isBating: false
    },
  }
);
