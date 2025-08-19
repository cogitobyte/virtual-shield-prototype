import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogFooter,
  DialogDescription
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Icon } from '@/components/Icon';
import { App, PermissionType } from '@/modules/types';

interface OSPermissionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  app: App | null;
  permissionType: PermissionType | null;
  onAllow: () => void;
  onDeny: () => void;
}

interface VDCDecision {
  action: 'allow' | 'protect' | 'block';
  message: string;
  riskLevel: 'low' | 'medium' | 'high';
}

const getPermissionIcon = (permissionType: PermissionType): string => {
  switch (permissionType) {
    case 'CONTACTS':
      return 'users';
    case 'LOCATION':
      return 'map-pin';
    case 'FILE_ACCESS':
      return 'folder';
    case 'CALL_LOGS':
      return 'phone';
    case 'MESSAGES':
      return 'message-square';
    case 'CAMERA':
      return 'camera';
    case 'MICROPHONE':
      return 'mic';
    case 'STORAGE':
      return 'hard-drive';
    default:
      return 'shield';
  }
};

const getPermissionDescription = (permissionType: PermissionType): string => {
  switch (permissionType) {
    case 'CONTACTS':
      return 'access your contacts';
    case 'LOCATION':
      return 'access your location';
    case 'FILE_ACCESS':
      return 'access your files';
    case 'CALL_LOGS':
      return 'access your call history';
    case 'MESSAGES':
      return 'access your messages';
    case 'CAMERA':
      return 'use your camera';
    case 'MICROPHONE':
      return 'use your microphone';
    case 'STORAGE':
      return 'access your storage';
    default:
      return 'access your data';
  }
};

// Simulate VDC decision logic
const getVDCDecision = (app: App, permissionType: PermissionType): VDCDecision => {
  // High-risk apps get protection for sensitive permissions
  if (app.trustLevel === 'low') {
    if (['CONTACTS', 'LOCATION', 'CALL_LOGS', 'MESSAGES'].includes(permissionType)) {
      return {
        action: 'protect',
        message: 'Protected by VDC',
        riskLevel: 'high'
      };
    }
    if (['CAMERA', 'MICROPHONE'].includes(permissionType)) {
      return {
        action: 'block',
        message: 'Blocked by VDC',
        riskLevel: 'high'
      };
    }
  }

  // Medium-risk apps get protection for very sensitive permissions
  if (app.trustLevel === 'medium') {
    if (['CONTACTS', 'CALL_LOGS'].includes(permissionType)) {
      return {
        action: 'protect',
        message: 'Protected by VDC',
        riskLevel: 'medium'
      };
    }
  }

  return {
    action: 'allow',
    message: 'Permission granted',
    riskLevel: 'low'
  };
};

export function OSPermissionDialog({ 
  open, 
  onOpenChange, 
  app, 
  permissionType, 
  onAllow, 
  onDeny 
}: OSPermissionDialogProps) {
  const [vdcDecision, setVDCDecision] = useState<VDCDecision | null>(null);
  const [showVDCShield, setShowVDCShield] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);

  useEffect(() => {
    if (open && app && permissionType) {
      setAnalyzing(true);
      
      // Simulate VDC analysis
      setTimeout(() => {
        const decision = getVDCDecision(app, permissionType);
        setVDCDecision(decision);
        setShowVDCShield(decision.action !== 'allow');
        setAnalyzing(false);
      }, 800);
    } else {
      setVDCDecision(null);
      setShowVDCShield(false);
      setAnalyzing(false);
    }
  }, [open, app, permissionType]);

  if (!app || !permissionType) return null;
  
  const iconName = getPermissionIcon(permissionType);
  const permissionDesc = getPermissionDescription(permissionType);

  const handleAllow = () => {
    if (vdcDecision?.action === 'block') {
      onDeny();
    } else {
      onAllow();
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-white/95 backdrop-blur-sm text-black border-0 shadow-2xl max-w-sm mx-auto rounded-3xl">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.2 }}
        >
          <DialogHeader className="items-center text-center pb-2">
            <div className="relative p-4 bg-gray-50 rounded-full mx-auto mb-4">
              <Icon name={iconName} className="h-8 w-8 text-gray-700" />
              
              {/* VDC Shield Overlay */}
              <AnimatePresence>
                {(showVDCShield || analyzing) && (
                  <motion.div
                    className="absolute -top-1 -right-1"
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0, opacity: 0 }}
                    transition={{ type: 'spring', damping: 15 }}
                  >
                    <motion.div
                      className="bg-shield rounded-full p-1.5 shadow-lg"
                      animate={analyzing ? { 
                        scale: [1, 1.1, 1],
                        rotate: [0, 360]
                      } : {}}
                      transition={{ 
                        duration: analyzing ? 1.5 : 0,
                        repeat: analyzing ? Infinity : 0
                      }}
                    >
                      <Icon name="shield" className="h-3 w-3 text-white" />
                    </motion.div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            
            <DialogTitle className="text-lg font-medium text-gray-900">
              "{app.name}" wants to {permissionDesc}
            </DialogTitle>
          </DialogHeader>
          
          {/* VDC Status Message */}
          <AnimatePresence>
            {vdcDecision && !analyzing && (
              <motion.div
                className={`mb-4 p-3 rounded-2xl border ${
                  vdcDecision.action === 'protect' 
                    ? 'bg-shield/10 border-shield/20' 
                    : vdcDecision.action === 'block'
                    ? 'bg-red-500/10 border-red-500/20'
                    : 'bg-green-500/10 border-green-500/20'
                }`}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
              >
                <div className="flex items-center space-x-2">
                  <Icon 
                    name={vdcDecision.action === 'protect' ? 'shield' : vdcDecision.action === 'block' ? 'x-circle' : 'check-circle'} 
                    className={`h-4 w-4 ${
                      vdcDecision.action === 'protect' 
                        ? 'text-shield' 
                        : vdcDecision.action === 'block'
                        ? 'text-red-500'
                        : 'text-green-500'
                    }`} 
                  />
                  <span className={`text-sm font-medium ${
                    vdcDecision.action === 'protect' 
                      ? 'text-shield' 
                      : vdcDecision.action === 'block'
                      ? 'text-red-700'
                      : 'text-green-700'
                  }`}>
                    {vdcDecision.message}
                  </span>
                </div>

                {vdcDecision.action === 'protect' && (
                  <p className="text-xs text-gray-600 mt-1">
                    Dummy data will be provided to protect your privacy
                  </p>
                )}
                
                {vdcDecision.action === 'block' && (
                  <p className="text-xs text-gray-600 mt-1">
                    Permission denied for security reasons
                  </p>
                )}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Analyzing State */}
          <AnimatePresence>
            {analyzing && (
              <motion.div
                className="mb-4 p-3 rounded-2xl bg-gray-50 border border-gray-100"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <div className="flex items-center space-x-2">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  >
                    <Icon name="loader" className="h-4 w-4 text-shield" />
                  </motion.div>
                  <span className="text-sm text-gray-600">Analyzing with VDC...</span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
          
          <DialogFooter className="flex flex-row gap-3 pt-4">
            <Button 
              variant="outline" 
              className="flex-1 rounded-2xl border-gray-200 hover:bg-gray-50" 
              onClick={onDeny}
              disabled={analyzing}
            >
              Don't Allow
            </Button>
            <Button 
              className={`flex-1 rounded-2xl ${
                vdcDecision?.action === 'block' 
                  ? 'bg-red-500 hover:bg-red-600' 
                  : vdcDecision?.action === 'protect'
                  ? 'bg-shield hover:bg-shield-dark'
                  : 'bg-blue-500 hover:bg-blue-600'
              }`}
              onClick={handleAllow}
              disabled={analyzing}
            >
              {vdcDecision?.action === 'block' 
                ? 'Blocked' 
                : vdcDecision?.action === 'protect'
                ? 'Allow with Protection'
                : 'Allow'
              }
            </Button>
          </DialogFooter>
        </motion.div>
      </DialogContent>
    </Dialog>
  );
}

export default OSPermissionDialog;