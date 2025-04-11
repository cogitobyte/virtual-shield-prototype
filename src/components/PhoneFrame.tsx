
import { ReactNode, useEffect, useState } from 'react';
import { useIsMobile } from '@/hooks/use-mobile';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Icon } from './Icon';
import { ScrollArea } from "@/components/ui/scroll-area";
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
import { Button } from "@/components/ui/button"; // Adding the missing Button import
import { App, PermissionType } from '@/modules/types';
import UISkinModule from '@/modules/UISkinModule';
import AppRequirementsModule from '@/modules/AppRequirementsModule';
import { Badge } from '@/components/ui/badge';
import { toast } from '@/components/ui/use-toast';
import { motion } from 'framer-motion';

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

const FloatingShieldIcon = ({ visible, onClick }: { visible: boolean, onClick: () => void }) => {
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
};

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
      {appLaunched && !shieldActivated && (
        <div className="absolute inset-0 z-20 bg-black/50 backdrop-blur-sm flex items-center justify-center">
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white rounded-xl p-5 shadow-lg w-[85%] max-w-md"
          >
            <div className="flex items-center mb-4">
              <div className="h-10 w-10 rounded-md bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center">
                <Icon name="instagram" className="h-6 w-6 text-white" />
              </div>
              <div className="ml-3">
                <h3 className="font-medium">Allow Contact Access</h3>
                <p className="text-xs text-muted-foreground">Social Connect wants to access your contacts</p>
              </div>
            </div>
            
            <p className="text-sm mb-4">This permission allows the app to:</p>
            
            <ul className="text-sm space-y-2 mb-6">
              <li className="flex items-start">
                <Icon name="check" className="h-4 w-4 text-green-500 mr-2 mt-0.5" />
                <span>Find friends using your contacts</span>
              </li>
              <li className="flex items-start">
                <Icon name="check" className="h-4 w-4 text-green-500 mr-2 mt-0.5" />
                <span>Suggest people you might know</span>
              </li>
              <li className="flex items-start">
                <Icon name="alert-triangle" className="h-4 w-4 text-amber-500 mr-2 mt-0.5" />
                <span className="text-amber-700">Upload your contacts to their servers</span>
              </li>
            </ul>
            
            <div className="flex justify-end space-x-2">
              <Button variant="secondary" size="sm" onClick={() => setAppLaunched(false)}>
                Don't Allow
              </Button>
              <Button className="bg-blue-500 hover:bg-blue-600 text-white" size="sm" onClick={() => setAppLaunched(false)}>
                OK
              </Button>
            </div>
          </motion.div>
        </div>
      )}
      
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
