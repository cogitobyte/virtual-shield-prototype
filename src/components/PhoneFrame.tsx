
import { ReactNode, useEffect, useState } from 'react';
import { useIsMobile } from '@/hooks/use-mobile';
import { Icon } from './Icon';
import { ScrollArea } from "@/components/ui/scroll-area";
import { ConfirmationDialog } from './ConfirmationDialog';
import { FloatingShieldButton } from './FloatingShieldButton';
import { App, PermissionType } from '@/modules/types';
import UISkinModule from '@/modules/UISkinModule';

interface PhoneFrameProps {
  children: ReactNode;
}

export function PhoneFrame({ children }: PhoneFrameProps) {
  const [confirmationDialog, setConfirmationDialog] = useState({
    open: false,
    requestId: '',
    app: null as App | null,
    permissionType: null as PermissionType | null,
    warningMessage: ''
  });
  const isMobile = useIsMobile();
  
  // Listen for permission confirmation requests
  useEffect(() => {
    const handleConfirmationRequest = (event: CustomEvent<{
      requestId: string;
      app: App;
      permissionType: PermissionType;
      warningMessage: string;
    }>) => {
      setConfirmationDialog({
        open: true,
        requestId: event.detail.requestId,
        app: event.detail.app,
        permissionType: event.detail.permissionType,
        warningMessage: event.detail.warningMessage
      });
    };
    
    window.addEventListener('permission-confirmation-required', 
      handleConfirmationRequest as EventListener);
    
    return () => {
      window.removeEventListener('permission-confirmation-required', 
        handleConfirmationRequest as EventListener);
    };
  }, []);

  return (
    <div className={`relative ${isMobile ? "w-full" : "w-[900px] max-h-[700px]"} bg-gradient-to-br from-shield-dark to-black rounded-lg border border-gray-800 shadow-lg overflow-hidden`}>
      {/* Status bar */}
      <div className="absolute top-0 left-0 right-0 h-10 px-4 bg-shield-dark/80 backdrop-blur-md flex justify-between items-center text-xs text-white z-10">
        <div className="flex items-center space-x-2">
          <Icon name="shield" className="h-4 w-4 text-shield-light" />
          <span>Virtual Shield</span>
        </div>
        <div className="flex items-center space-x-1">
          <span className="block h-2.5 w-2.5 rounded-full bg-shield-light"></span>
          <span className="block h-2.5 w-2.5 rounded-full bg-shield-secondary"></span>
          <span className="block h-2.5 w-2.5 rounded-full bg-shield-accent"></span>
        </div>
      </div>
      
      {/* Content */}
      <ScrollArea className="h-full pt-10">
        <div className="p-6 pt-4">
          {children}
        </div>
      </ScrollArea>
      
      {/* Floating Shield Button */}
      <FloatingShieldButton />
      
      {/* Confirmation Dialog */}
      <ConfirmationDialog 
        open={confirmationDialog.open}
        requestId={confirmationDialog.requestId}
        app={confirmationDialog.app}
        permissionType={confirmationDialog.permissionType}
        warningMessage={confirmationDialog.warningMessage}
        onOpenChange={(open) => setConfirmationDialog(prev => ({ ...prev, open }))}
      />
    </div>
  );
}

export default PhoneFrame;
