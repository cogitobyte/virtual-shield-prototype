import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Icon } from '@/components/Icon';

interface VDCSystemNotificationProps {
  show: boolean;
  message: string;
  type: 'protected' | 'blocked' | 'allowed';
  onComplete?: () => void;
}

export function VDCSystemNotification({ 
  show, 
  message, 
  type,
  onComplete 
}: VDCSystemNotificationProps) {
  const getIcon = () => {
    switch (type) {
      case 'protected':
        return 'shield';
      case 'blocked':
        return 'x-circle';
      case 'allowed':
        return 'check-circle';
      default:
        return 'info';
    }
  };

  const getColor = () => {
    switch (type) {
      case 'protected':
        return 'bg-shield';
      case 'blocked':
        return 'bg-red-500';
      case 'allowed':
        return 'bg-green-500';
      default:
        return 'bg-blue-500';
    }
  };

  React.useEffect(() => {
    if (show) {
      const timer = setTimeout(() => {
        onComplete?.();
      }, 3000);
      
      return () => clearTimeout(timer);
    }
  }, [show, onComplete]);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0, y: -50, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -30, scale: 0.9 }}
          className="fixed top-16 left-1/2 transform -translate-x-1/2 z-50"
          transition={{ type: 'spring', damping: 20, stiffness: 300 }}
        >
          <div className="flex items-center space-x-3 bg-white/95 backdrop-blur-sm rounded-2xl px-4 py-3 shadow-lg border border-gray-100">
            <motion.div 
              className={`${getColor()} p-2 rounded-full`}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.1, type: 'spring', stiffness: 500 }}
            >
              <Icon name={getIcon()} className="h-4 w-4 text-white" />
            </motion.div>
            <span className="font-medium text-gray-800 text-sm">
              {message}
            </span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default VDCSystemNotification;