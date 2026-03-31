// eslint-disable-next-line no-unused-vars
import { motion } from 'framer-motion';

// Tech-Huerta Cinematic Easing (Apple-like)
const THEME_EASING = [0.22, 1, 0.36, 1];

const pageVariants = {
  initial: {
    opacity: 0,
    y: 12, // Subtle slide up instead of heavy translate
    scale: 0.99, // Super subtle organic zoom
  },
  animate: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.4,
      ease: THEME_EASING,
      staggerChildren: 0.1, // If we want to stagger internal elements later
    },
  },
  exit: {
    opacity: 0,
    y: -8,
    scale: 0.99,
    transition: {
      duration: 0.25,
      ease: THEME_EASING,
    },
  },
};

export function PageTransition({ children, className = '' }) {
  return (
    <motion.div
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      className={`w-full h-full min-h-0 min-w-0 ${className}`}
    >
      {children}
    </motion.div>
  );
}
