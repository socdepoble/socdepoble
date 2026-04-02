import { cva } from 'class-variance-authority';

export const cardVariants = cva(
  `
    group flex flex-col w-full min-w-0 h-full relative
    rounded-[28px] overflow-hidden
    bg-[#000000] border-[1px] border-[#169CF9] text-[#FFFFFF]
    transition-colors duration-300 ease-in-out
    [.theme-light_&]:bg-[#FFFFFF] [.theme-light_&]:border-[#0e0e0e] [.theme-light_&]:text-[#0e0e0e]
  `,
  {
    variants: {
      viewMode: {
        grid: 'max-w-[480px] mx-auto md:mx-0 min-h-[500px]',
        list: 'max-w-full !rounded-[28px] border-b border-white/5 bg-transparent shadow-none hover:bg-white/5',
        masonry: 'inline-block w-full mb-6 break-inside-avoid',
        single: 'max-w-3xl border-none',
        compact: 'w-[140px] md:w-[180px] shrink-0',
      },
      variant: {
        post: '',
        mercat: 'border-[2px] border-[#F97316]',
        alert: 'border-red-500',
        official: 'border-[#169CF9]',
        sostenible: 'border-emerald-500'
      },
      interactive: {
        true: 'cursor-pointer',
        false: 'select-text',
      },
      seniorMode: {
        true: 'border-[3px] text-lg',
        false: '',
      },
      forensicMode: {
        true: 'outline-2 outline-dashed outline-cyan-400',
        false: '',
      },
      gloveMode: {
        true: '',
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
