
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Icon } from '@/components/Icon';
import { Button } from '@/components/ui/button';

interface VirtualShieldPromptProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onOpenDashboard: () => void;
  isFloatingMode?: boolean;
}

export function VirtualShieldPrompt({
  open,
  onOpenChange,
  onOpenDashboard,
  isFloatingMode = false
}: VirtualShieldPromptProps) {
  const [pulseAnimation, setPulseAnimation] = useState(false);
  const [showRipple, setShowRipple] = useState(false);

  // Trigger pulse animation at intervals when in floating mode
  useEffect(() => {
    if (isFloatingMode && open) {
      const interval = setInterval(() => {
        setPulseAnimation(true);
        setTimeout(() => setPulseAnimation(false), 1000);
      }, 5000);
      
      return () => clearInterval(interval);
    }
  }, [isFloatingMode, open]);

  // Create ripple effect on click
  const handleShieldClick = () => {
    setShowRipple(true);
    setTimeout(() => setShowRipple(false), 700);
    onOpenDashboard();
  };

  if (!open) return null;

  if (isFloatingMode) {
    return (
      <AnimatePresence>
        <motion.div
          className="fixed bottom-20 right-4 z-50"
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 400, damping: 15 }}
        >
          <motion.div 
            className="relative" 
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            animate={pulseAnimation ? { scale: [1, 1.2, 1] } : {}}
            transition={{ duration: 0.5 }}
            onClick={handleShieldClick}
          >
            {/* Ripple effect on click */}
            <AnimatePresence>
              {showRipple && (
                <motion.div 
                  className="absolute inset-0 rounded-full bg-shield-light/30"
                  initial={{ scale: 1, opacity: 0.8 }}
                  animate={{ scale: 2.5, opacity: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.7 }}
                />
              )}
            </AnimatePresence>
            
            {/* Glow effect */}
            <motion.div 
              className="absolute inset-0 rounded-full bg-shield-light/30 blur-md"
              animate={{ 
                opacity: [0.3, 0.6, 0.3],
                scale: [1, 1.1, 1]
              }}
              transition={{ 
                duration: 2, 
                repeat: Infinity,
                repeatType: "reverse"
              }}
            />
            
            <motion.div
              className="h-12 w-12 bg-gradient-to-br from-shield to-shield-dark rounded-full shadow-lg flex items-center justify-center cursor-pointer relative z-10"
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ 
                duration: 6,
                repeat: Infinity,
                repeatType: "reverse",
                ease: "easeInOut"
              }}
            >
              <Icon name="shield" className="h-6 w-6 text-white" />
            </motion.div>
          </motion.div>
          
          <motion.p 
            className="text-xs text-center mt-1 text-white bg-shield-dark/80 px-2 py-1 rounded-md"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            Tap to protect
          </motion.p>
        </motion.div>
      </AnimatePresence>
    );
  }

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={() => onOpenChange(false)}
      >
        <motion.div 
          className="bg-gradient-to-b from-shield-dark to-background rounded-lg max-w-sm mx-4 overflow-hidden"
          initial={{ scale: 0.9, y: 20, opacity: 0 }}
          animate={{ scale: 1, y: 0, opacity: 1 }}
          exit={{ scale: 0.9, y: 20, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 400, damping: 30 }}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="p-6 text-center">
            <motion.div 
              className="mx-auto w-20 h-20 rounded-full bg-shield-light/20 flex items-center justify-center mb-4"
              animate={{ 
                scale: [1, 1.1, 1],
                rotate: [0, 5, -5, 0]
              }}
              transition={{ 
                duration: 4, 
                repeat: Infinity,
                repeatType: "reverse" 
              }}
            >
              <Icon name="shield" className="h-10 w-10 text-shield-light" />
            </motion.div>
            
            <motion.h3 
              className="text-xl font-bold text-white mb-2"
              initial={{ y: 10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              Use Virtual Shield?
            </motion.h3>
            
            <motion.p 
              className="text-gray-300 mb-6"
              initial={{ y: 10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              Would you like to use Virtual Shield to protect your privacy with simulated data?
            </motion.p>
            
            <div className="space-y-3">
              <motion.div
                initial={{ y: 10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.4 }}
              >
                <Button 
                  className="w-full bg-shield hover:bg-shield-light transition-all"
                  onClick={onOpenDashboard}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Icon name="shield" className="h-4 w-4 mr-2" />
                  Protect with Virtual Shield
                </Button>
              </motion.div>
              
              <motion.div
                initial={{ y: 10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.5 }}
              >
                <Button 
                  variant="ghost" 
                  className="w-full text-gray-300 hover:text-white"
                  onClick={() => onOpenChange(false)}
                >
                  Dismiss
                </Button>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

export default VirtualShieldPrompt;
