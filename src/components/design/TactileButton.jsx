 
import { Haptics, ImpactStyle } from '@capacitor/haptics';
import { motion } from 'framer-motion';

const TactileButton = ({
  children,
  onClick,
  className = '',
  impactStyle = ImpactStyle.Light,
  scaleDown = 0.95,
  type = "button",
  disabled = false,
  ...props
}) => {
  const handleTapStart = async () => {
    if (disabled) return;
    try {
      // Trigger native haptic feedback
      await Haptics.impact({ style: impactStyle });
    } catch {
      // Silently fail on web or unsupported platforms
    }
  };

  return (
    <motion.button
      type={type}
      disabled={disabled}
      whileTap={disabled ? undefined : { scale: scaleDown }}
      transition={{ type: 'spring', stiffness: 500, damping: 30 }}
      onTapStart={handleTapStart}
      onClick={onClick}
      className={`btn-tactile outline-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70 focus-visible:ring-offset-2 focus-visible:ring-offset-black/50 transition-colors duration-200 ${className}`}
      {...props}
    >
      {children}
    </motion.button>
  );
};

export default TactileButton;
