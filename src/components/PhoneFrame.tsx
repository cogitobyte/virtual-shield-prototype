
import { ReactNode, useEffect, useState } from 'react';
import { useIsMobile } from '@/hooks/use-mobile';
import { ScrollArea } from "@/components/ui/scroll-area";
import { App, PermissionType } from '@/modules/types';
import UISkinModule from '@/modules/UISkinModule';
import { Icon } from './Icon';
import { toast } from '@/components/ui/use-toast';
import { ConfirmationDialog } from './ConfirmationDialog';
import { FloatingShieldIcon } from './FloatingShieldIcon';
import { AppPermissionDialog } from './AppPermissionDialog';

interface PhoneFrameProps {
  children: ReactNode;
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
  const [appLaunched, setAppLaunched] = useState(false);
  const [showFloatingIcon, setShowFloatingIcon] = useState(false);
  const [shieldActivated, setShieldActivated] = useState(false);
  const isMobile = useIsMobile();

  useEffect(() => {
    // Auto-launch the app permission flow for first-time users
    const hasVisited = localStorage.getItem('virtualShield_hasVisited');
    if (!hasVisited) {
      setTimeout(() => {
        setAppLaunched(true);
        
        // Show floating icon after a delay
        setTimeout(() => {
          setShowFloatingIcon(true);
        }, 1500);
      }, 1000);
    } else {
      // Already seen the demo, so shield is already active
      setShieldActivated(true);
    }
  }, []);

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

  const handleActivateShield = () => {
    setShieldActivated(true);
    setShowFloatingIcon(false);
    
    // Create an actual log entry in the system through UISkinModule
    const demoApp = {
      id: 'demo-social-app',
      name: 'Social Media App',
      icon: 'instagram',
      trusted: false
    };
    
    const uiSkinModule = UISkinModule.getInstance();
    
    // Process a real permission request to create logs
    uiSkinModule.requestPermission(demoApp, 'CONTACTS')
      .then(() => {
        toast({
          title: "Virtual Shield Active",
          description: "Your privacy is now being protected",
        });
        
        // Set visited flag for future visits
        localStorage.setItem('virtualShield_hasVisited', 'true');
      })
      .catch(error => {
        console.error('Error activating shield:', error);
      });
  };

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
      
      {/* App permission dialog */}
      <AppPermissionDialog 
        visible={appLaunched && !shieldActivated} 
        onClose={() => setAppLaunched(false)} 
      />
      
      {/* Floating shield icon */}
      <FloatingShieldIcon visible={showFloatingIcon} onClick={handleActivateShield} />
      
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
