
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Icon } from '@/components/Icon';
import { PermissionType } from '@/modules/types';

interface PermissionActionFeedbackProps {
  action: 'grant' | 'deny' | 'shield' | null;
  permissionType: PermissionType | null;
  isVisible: boolean;
}

export function PermissionActionFeedback({ 
  action, 
  permissionType,
  isVisible 
}: PermissionActionFeedbackProps) {
  if (!isVisible || !action) return null;
  
  const getIcon = () => {
    switch (action) {
      case 'grant':
        return 'check';
      case 'deny':
        return 'x';
      case 'shield':
        return 'shield';
      default:
        return 'info';
    }
  };
  
  const getColor = () => {
    switch (action) {
      case 'grant':
        return 'bg-green-500';
      case 'deny':
        return 'bg-red-500';
      case 'shield':
        return 'bg-shield';
      default:
        return 'bg-blue-500';
    }
  };
  
  const getMessage = () => {
    if (!permissionType) return '';
    
    switch (action) {
      case 'grant':
        return `${permissionType.toLowerCase()} access granted`;
      case 'deny':
        return `${permissionType.toLowerCase()} access denied`;
      case 'shield':
        return `Virtual Shield protecting your ${permissionType.toLowerCase()}`;
      default:
        return '';
    }
  };
  
  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: -50, scale: 0.8 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8, y: -20 }}
          className="fixed top-24 left-1/2 transform -translate-x-1/2 z-50"
          transition={{ type: 'spring', damping: 15 }}
        >
          <div className="flex items-center space-x-2 rounded-full px-4 py-2 shadow-lg">
            <div className={`${getColor()} p-2 rounded-full`}>
              <Icon name={getIcon()} className="h-5 w-5 text-white" />
            </div>
            <span className="font-medium text-gray-800">{getMessage()}</span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default PermissionActionFeedback;
