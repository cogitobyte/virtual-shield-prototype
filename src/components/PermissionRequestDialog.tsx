
import React from 'react';
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
  permissionType: PermissionType | null;
  onAllow: () => void;
  onDeny: () => void;
}

const PermissionRequestDialog = ({ 
  open, 
  onOpenChange, 
  app, 
  permissionType, 
  onAllow, 
  onDeny 
}: PermissionRequestDialogProps) => {
  if (!app || !permissionType) return null;
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-white text-black border-0 shadow-xl">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gray-100 rounded-full">
              <Icon name="shield" className="h-5 w-5 text-gray-500" />
            </div>
            <DialogTitle className="text-lg">Permission Request</DialogTitle>
          </div>
          <DialogDescription className="pt-2 text-gray-600">
            This app requires certain permissions to function properly. You can manage these permissions in your device settings.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="flex flex-col gap-2 sm:flex-row sm:justify-end">
          <Button variant="outline" className="w-full sm:w-auto" onClick={onDeny}>
            Don't Allow
          </Button>
          <Button className="w-full sm:w-auto bg-blue-500 hover:bg-blue-600" onClick={onAllow}>
            Allow
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default PermissionRequestDialog;
