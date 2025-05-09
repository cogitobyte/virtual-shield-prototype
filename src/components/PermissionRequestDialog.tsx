
import React from 'react';
import { motion } from 'framer-motion';
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

interface PermissionRequestDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  app: App | null;
  permissionType: PermissionType | null | 'GENERAL';
  onAllow: () => void;
  onDeny: () => void;
}

const getPermissionIcon = (permissionType: PermissionType | 'GENERAL'): string => {
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
    case 'GENERAL':
      return 'shield';
    default:
      return 'shield';
  }
};

const getPermissionDescription = (permissionType: PermissionType | 'GENERAL'): string => {
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
    case 'GENERAL':
      return 'use certain permissions to function properly';
    default:
      return 'access your data';
  }
};

const PermissionRequestDialog = ({ 
  open, 
  onOpenChange, 
  app, 
  permissionType, 
  onAllow, 
  onDeny 
}: PermissionRequestDialogProps) => {
  if (!app || !permissionType) return null;
  
  const iconName = getPermissionIcon(permissionType);
  const permissionDesc = getPermissionDescription(permissionType);
  
  // Use specific messaging for GENERAL permission
  const generalMessage = permissionType === 'GENERAL' 
    ? "This app requires certain permissions to function properly. You can manage these permissions in your device settings."
    : `${app.name} would like to ${permissionDesc}. This app requires certain permissions to function properly.`;
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-white text-black border-0 shadow-xl max-w-md mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <DialogHeader className="items-center text-center">
            <div className="p-3 bg-gray-100 rounded-full mx-auto mb-4">
              <Icon name={iconName} className="h-8 w-8 text-gray-600" />
            </div>
            <DialogTitle className="text-xl font-semibold">Permission Request</DialogTitle>
            <DialogDescription className="pt-2 text-gray-600 max-w-sm mx-auto">
              {generalMessage}
            </DialogDescription>
          </DialogHeader>
          
          <div className="my-6 p-4 bg-gray-50 rounded-lg border border-gray-100">
            <div className="flex items-start space-x-3">
              <div className="p-1.5 bg-gray-200 rounded-md mt-0.5">
                <Icon name="info" className="h-4 w-4 text-gray-600" />
              </div>
              <div className="text-sm text-gray-600">
                <p>You can manage app permissions in your device settings at any time.</p>
              </div>
            </div>
          </div>
          
          <DialogFooter className="flex flex-col gap-2 sm:flex-row sm:justify-center pt-2">
            <Button 
              variant="outline" 
              className="w-full sm:w-auto border-gray-300" 
              onClick={onDeny}
            >
              Don't Allow
            </Button>
            <Button 
              className="w-full sm:w-auto bg-shield hover:bg-shield-dark" 
              onClick={onAllow}
            >
              Allow
            </Button>
          </DialogFooter>
        </motion.div>
      </DialogContent>
    </Dialog>
  );
};

export default PermissionRequestDialog;
