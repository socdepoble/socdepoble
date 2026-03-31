import React from 'react';
import { motion } from 'framer-motion';
import { Haptics, ImpactStyle } from '@capacitor/haptics';

const TactileButton = ({
  children,
  onClick,
  className = '',
  impactStyle = ImpactStyle.Light,
  scaleDown = 0.95,
  type = "button",
  ...props
}) => {
  const handleTapStart = async () => {
    try {
      // Trigger native haptic feedback
      await Haptics.impact({ style: impactStyle });
    } catch (err) {
      // Silently fail on web or unsupported platforms
    }
  };

  return (
    <motion.button
      type={type}
      whileTap={{ scale: scaleDown }}
      transition={{ type: 'spring', stiffness: 500, damping: 30 }}
      onTapStart={handleTapStart}
      onClick={onClick}
      className={`btn-tactile outline-none transition-colors duration-200 ${className}`}
      {...props}
    >
      {children}
    </motion.button>
  );
};

export default TactileButton;
