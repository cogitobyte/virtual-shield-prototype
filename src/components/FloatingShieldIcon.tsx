
import { motion } from 'framer-motion';
import { Icon } from './Icon';

interface FloatingShieldIconProps {
  visible: boolean;
  onClick: () => void;
}

export function FloatingShieldIcon({ visible, onClick }: FloatingShieldIconProps) {
  if (!visible) return null;
  
  return (
    <motion.div 
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="absolute bottom-20 right-6 z-50 cursor-pointer"
      onClick={onClick}
    >
      <div className="h-14 w-14 bg-gradient-to-br from-shield to-shield-secondary rounded-full flex items-center justify-center shadow-lg">
        <Icon name="shield" className="h-7 w-7 text-white" />
      </div>
      
      <motion.div 
        className="absolute -top-2 -right-2 h-5 w-5 bg-shield-accent rounded-full flex items-center justify-center"
        initial={{ scale: 0 }}
        animate={{ scale: [0, 1.2, 1] }}
        transition={{ delay: 0.3, duration: 0.5, repeat: Infinity, repeatDelay: 3 }}
      >
        <Icon name="bell" className="h-3 w-3 text-white" />
      </motion.div>
      
      <motion.div 
        className="absolute -top-8 -left-8 h-3 w-3 rounded-full bg-shield-accent/40"
        animate={{ 
          x: [0, 15, 30, 45, 60],
          y: [0, -15, -8, -20, -15],
          opacity: [1, 0.8, 0.6, 0.4, 0]
        }}
        transition={{ repeat: Infinity, duration: 2 }}
      />
      
      <motion.div 
        className="absolute -bottom-15 right-8 h-2 w-2 rounded-full bg-shield-accent/40"
        animate={{ 
          x: [0, -15, -30, -45],
          y: [0, 8, 15, 8],
          opacity: [1, 0.8, 0.6, 0]
        }}
        transition={{ repeat: Infinity, duration: 1.8, delay: 0.5 }}
      />
    </motion.div>
  );
}

export default FloatingShieldIcon;
