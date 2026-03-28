import { cva } from 'class-variance-authority';
import { typeScale, fontWeights, tracking, lineHeights, colors } from '../../tokens/typography';

export const textVariants = cva('block transition-colors duration-200', {
  variants: {
    variant: {
      h1: `${typeScale.h1} ${fontWeights.black} uppercase ${tracking.wide} ${colors.primary}`,
      h2: `${typeScale.h2} ${fontWeights.black} uppercase ${tracking.wide} ${colors.primary}`,
      h3: `${typeScale.h3} ${fontWeights.bold} ${colors.primary}`,
      subtitle: `${typeScale.subtitle} ${fontWeights.medium} ${colors.muted}`,
      paragraph: `${typeScale.paragraph} ${lineHeights.relaxed} ${colors.paragraph}`,
      secondary: `${typeScale.secondary} ${colors.secondary}`,
      overline: `${typeScale.overline} uppercase ${tracking.wide} ${fontWeights.black} ${colors.primary}`,
    },
    glow: {
      none: '',
      soft: 'drop-shadow-sm',
      md: 'drop-shadow-md',
      xl: 'drop-shadow-xl',
    }
  },
  defaultVariants: {
    variant: 'paragraph',
    glow: 'none'
  },
});
