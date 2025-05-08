
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';
import { Icon } from '@/components/Icon';
import PermissionRequestDialog from '@/components/PermissionRequestDialog';
import VirtualShieldPrompt from '@/components/VirtualShieldPrompt';
import { App, PermissionType } from '@/modules/types';

interface PermissionDemoProps {
  onComplete: () => void;
  onOpenDashboard: () => void;
}

const demoApp: App = {
  id: 'demo-app-1',
  name: 'Social Media App',
  publisher: 'Demo Apps Inc.',
  installedDate: new Date(),
  lastUpdated: new Date(),
  version: '1.0.0',
  permissions: ['CONTACTS', 'LOCATION'],
  description: 'A social media app for connecting with friends and sharing updates.',
  category: 'social',
  icon: '📱'
};

export function PermissionDemo({ onComplete, onOpenDashboard }: PermissionDemoProps) {
  const [step, setStep] = useState(0);
  const [showPermissionDialog, setShowPermissionDialog] = useState(false);
  const [showVirtualShield, setShowVirtualShield] = useState(false);
  const [showFloatingIcon, setShowFloatingIcon] = useState(false);
  
  // Progress through demo steps
  useEffect(() => {
    if (step === 0) {
      // Start the demo by showing the system permission dialog after a delay
      const timer = setTimeout(() => {
        setShowPermissionDialog(true);
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [step]);

  // Handle permission denial
  const handleDenyPermission = () => {
    setShowPermissionDialog(false);
    toast({
      title: "Permission Denied",
      description: "You've denied access to your contacts",
      variant: "destructive"
    });
    
    // Show the Virtual Shield prompt after a delay
    setTimeout(() => {
      setShowVirtualShield(true);
    }, 1500);
  };
  
  // Handle Shield cancellation to show floating icon
  const handleShieldCancel = () => {
    setShowVirtualShield(false);
    setTimeout(() => {
      setShowFloatingIcon(true);
    }, 1000);
  };
  
  // Skip demo
  const handleSkip = () => {
    onComplete();
  };
  
  return (
    <div className="space-y-6 py-4 relative min-h-[500px]">
      <div className="bg-shield-dark/30 p-6 rounded-lg border border-shield-dark/50">
        <h3 className="text-xl font-bold mb-4 text-shield-light flex items-center">
          <Icon name="smartphone" className="mr-2 h-5 w-5" />
          App Permission Flow Demo
        </h3>
        
        <div className="space-y-4 text-gray-300">
          <p>
            This demo shows how Virtual Shield protects your privacy when apps 
            request permissions. The app will request access to your contacts.
          </p>
          
          {step === 0 && (
            <div className="flex flex-col items-center py-10 text-center space-y-6">
              <div className="h-16 w-16 bg-shield/30 rounded-full flex items-center justify-center animate-pulse">
                <Icon name="smartphone" className="h-8 w-8 text-shield-light" />
              </div>
              <p className="text-lg">App is starting...</p>
            </div>
          )}
          
          <div className="flex justify-between mt-6">
            <Button variant="outline" onClick={handleSkip}>
              Skip Demo
            </Button>
            
            <Button onClick={onComplete} className="bg-shield hover:bg-shield-accent">
              Complete Demo
            </Button>
          </div>
        </div>
      </div>
      
      {/* Permission Request Dialog */}
      <PermissionRequestDialog
        open={showPermissionDialog}
        onOpenChange={setShowPermissionDialog}
        app={demoApp}
        permissionType={"CONTACTS" as PermissionType}
        onAllow={() => {
          setShowPermissionDialog(false);
          onComplete(); // Skip to the end of demo on allow
        }}
        onDeny={handleDenyPermission}
      />
      
      {/* Virtual Shield Prompt */}
      <VirtualShieldPrompt
        open={showVirtualShield}
        onOpenChange={(open) => {
          setShowVirtualShield(open);
          if (!open) handleShieldCancel();
        }}
        onOpenDashboard={onOpenDashboard}
      />
      
      {/* Floating Virtual Shield Icon */}
      <VirtualShieldPrompt
        open={showFloatingIcon}
        onOpenChange={setShowFloatingIcon}
        onOpenDashboard={onOpenDashboard}
        isFloatingMode={true}
      />
    </div>
  );
}

export default PermissionDemo;
