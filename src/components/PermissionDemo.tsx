
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';
import { Icon } from '@/components/Icon';
import PermissionRequestDialog from '@/components/PermissionRequestDialog';
import VirtualShieldPrompt from '@/components/VirtualShieldPrompt';
import { App } from '@/modules/types';
import { motion, AnimatePresence } from 'framer-motion';

interface PermissionDemoProps {
  onComplete: () => void;
  onOpenDashboard: () => void;
}

const demoApp: App = {
  id: 'demo-app-1',
  name: 'Social Media App',
  icon: '📱',
  trusted: false
};

export function PermissionDemo({ onComplete, onOpenDashboard }: PermissionDemoProps) {
  const [showPermissionDialog, setShowPermissionDialog] = useState(false);
  const [showFloatingIcon, setShowFloatingIcon] = useState(false);
  
  // Show permission dialog when component mounts
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowPermissionDialog(true);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  // Handle permission denial - show floating icon
  const handleDenyPermission = () => {
    setShowPermissionDialog(false);
    
    // Show the floating Virtual Shield icon after a delay
    setTimeout(() => {
      setShowFloatingIcon(true);
    }, 1000);
  };
  
  // Handle permission approval - end demo
  const handleAllowPermission = () => {
    setShowPermissionDialog(false);
    
    // End demo after a delay
    toast({
      title: "Permission Allowed",
      description: "You've granted permission to the app.",
    });
    
    setTimeout(() => {
      onComplete();
    }, 1500);
  };
  
  // Handle opening the dashboard from the floating icon
  const handleOpenFromFloatingIcon = () => {
    setShowFloatingIcon(false);
    onOpenDashboard();
  };
  
  return (
    <div className="space-y-6 py-4 relative min-h-[500px]">
      <motion.div 
        className="bg-shield-dark/30 p-6 rounded-lg border border-shield-dark/50"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h3 className="text-xl font-bold mb-4 text-shield-light flex items-center">
          <Icon name="shield" className="mr-2 h-5 w-5" />
          View Protection Flow
        </h3>
        
        <div className="space-y-4 text-gray-300">
          <p>
            When an app requests permissions, you can choose to allow or deny access.
            If denied, Virtual Shield can help protect your privacy.
          </p>
          
          <div className="flex flex-col items-center py-10 text-center space-y-6">
            <div className="h-16 w-16 bg-shield/30 rounded-full flex items-center justify-center animate-pulse">
              <Icon name="smartphone" className="h-8 w-8 text-shield-light" />
            </div>
            <p className="text-lg">App is loading...</p>
          </div>
          
          <div className="flex justify-between mt-6">
            <Button variant="outline" onClick={onComplete}>
              Skip Demo
            </Button>
          </div>
        </div>
      </motion.div>
      
      {/* Permission Request Dialog - System Style */}
      <PermissionRequestDialog
        open={showPermissionDialog}
        onOpenChange={setShowPermissionDialog}
        app={demoApp}
        permissionType="GENERAL"
        onAllow={handleAllowPermission}
        onDeny={handleDenyPermission}
      />
      
      {/* Floating Virtual Shield Icon */}
      <VirtualShieldPrompt
        open={showFloatingIcon}
        onOpenChange={setShowFloatingIcon}
        onOpenDashboard={handleOpenFromFloatingIcon}
        isFloatingMode={true}
      />
    </div>
  );
}

export default PermissionDemo;
