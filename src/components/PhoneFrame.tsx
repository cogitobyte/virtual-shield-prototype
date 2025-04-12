
import { ReactNode, useEffect, useState } from 'react';
import { useIsMobile } from '@/hooks/use-mobile';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Icon } from './Icon';
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { 
  AlertDialog, 
  AlertDialogContent, 
  AlertDialogHeader, 
  AlertDialogTitle, 
  AlertDialogDescription, 
  AlertDialogFooter, 
  AlertDialogAction, 
  AlertDialogCancel
} from "@/components/ui/alert-dialog";
import { App, PermissionType } from '@/modules/types';
import UISkinModule from '@/modules/UISkinModule';
import AppRequirementsModule from '@/modules/AppRequirementsModule';
import { Badge } from '@/components/ui/badge';

interface PhoneFrameProps {
  children: ReactNode;
}

interface ConfirmationDialogProps {
  open: boolean;
  requestId: string;
  app: App | null;
  permissionType: PermissionType | null;
  warningMessage: string;
  onOpenChange: (open: boolean) => void;
}

function ConfirmationDialog({ open, requestId, app, permissionType, warningMessage, onOpenChange }: ConfirmationDialogProps) {
  const [appCategory, setAppCategory] = useState<string>('');
  
  useEffect(() => {
    if (app) {
      const category = AppRequirementsModule.getInstance().getAppCategory(app);
      setAppCategory(category.name);
    }
  }, [app]);
  
  const handleApprove = () => {
    if (requestId) {
      UISkinModule.getInstance().respondToConfirmation(requestId, true);
      onOpenChange(false);
    }
  };
  
  const handleDeny = () => {
    if (requestId) {
      UISkinModule.getInstance().respondToConfirmation(requestId, false);
      onOpenChange(false);
    }
  };
  
  if (!app || !permissionType) return null;
  
  const permissionName = {
    'CALL_LOGS': 'Call Logs',
    'MESSAGES': 'Messages',
    'FILE_ACCESS': 'File Access',
    'CONTACTS': 'Contacts',
    'LOCATION': 'Location'
  }[permissionType];
  
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="bg-background border-shield-dark/30">
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center">
            <Icon name="alertTriangle" className="h-5 w-5 text-shield-accent mr-2" />
            Suspicious Permission Request
          </AlertDialogTitle>
          <div className="flex items-center gap-2 mb-2">
            <span className="font-semibold text-shield-accent">{app.name}</span> 
            <Badge variant="outline" className="bg-shield-dark/10">{appCategory} App</Badge>
          </div>
          <AlertDialogDescription>
            This app is requesting access to your <span className="font-semibold">{permissionName}</span>. 
            <div className="mt-2 bg-shield-dark/10 p-3 rounded-md text-sm">
              {warningMessage}
            </div>
            <div className="mt-2">
              Would you like to allow this request anyway?
            </div>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={handleDeny}>Deny</AlertDialogCancel>
          <AlertDialogAction onClick={handleApprove} className="bg-shield-accent hover:bg-shield-accent/80">Allow</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

export function PhoneFrame({ children }: PhoneFrameProps) {
  const [dataPackets, setDataPackets] = useState<Array<{ id: number; top: number; left: number; size: number }>>([]);
  const [confirmationDialog, setConfirmationDialog] = useState({
    open: false,
    requestId: '',
    app: null as App | null,
    permissionType: null as PermissionType | null,
    warningMessage: ''
  });
  const isMobile = useIsMobile();

  // Create animating data packets effect
  useEffect(() => {
    const intervalId = setInterval(() => {
      // Add a new data packet
      const newPacket = {
        id: Date.now(),
        top: Math.random() * 100,
        left: Math.random() * 100,
        size: Math.random() * 6 + 4
      };

      setDataPackets(prev => [...prev, newPacket]);

      // Clean up old packets
      setTimeout(() => {
        setDataPackets(prev => prev.filter(packet => packet.id !== newPacket.id));
      }, 2000);
    }, 300);

    return () => clearInterval(intervalId);
  }, []);
  
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
      
      {/* Data packet animations */}
      {dataPackets.map(packet => (
        <div 
          key={packet.id} 
          className="data-packet animate-data-flow" 
          style={{
            top: `${packet.top}%`,
            left: `${packet.left}%`,
            width: `${packet.size}px`,
            height: `${packet.size}px`,
          }}
        />
      ))}
      
      {/* Content */}
      <ScrollArea className="h-full pt-10">
        <div className="p-6 pt-4">
          {children}
        </div>
      </ScrollArea>
      
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
