import { cva } from 'class-variance-authority';

export const cardVariants = cva(
  `
    group flex flex-col flex-auto w-full relative
    rounded-[28px]
    text-[#FFFFFF]
    bg-[#141417]
    !border-0
    transition duration-300 ease-in-out
    shadow-lg shadow-black/40
    hover:shadow-xl hover:shadow-black/60
    transform-gpu
    [.theme-light_&]:text-[#0e0e10] 
    [.theme-light_&]:bg-white
    [.theme-light_&]:shadow-md [.theme-light_&]:shadow-black/20
    [.theme-light_&]:hover:shadow-lg [.theme-light_&]:hover:shadow-black/30
  `,
  {
    variants: {
      viewMode: {
        grid: 'w-full',
        list: 'max-w-full !rounded-[28px] !bg-transparent hover:!bg-white/5 [.theme-light_&]:!bg-transparent',
        masonry: 'inline-block w-full mb-6 break-inside-avoid',
        single: 'max-w-3xl mx-auto w-full',
        compact: 'w-[140px] md:w-[180px] shrink-0',
      },
      variant: {
        post: '',
        mercat: '',
        alert: '',
        official: '',
        sostenible: ''
      },
      interactive: {
        true: 'cursor-pointer',
        false: 'select-text',
      },
      seniorMode: {
        true: 'text-lg',
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
