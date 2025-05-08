import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';
import { Icon } from '@/components/Icon';
import PermissionRequestDialog from '@/components/PermissionRequestDialog';
import VirtualShieldPrompt from '@/components/VirtualShieldPrompt';
import { App, PermissionType } from '@/modules/types';
import { motion, AnimatePresence } from 'framer-motion';
import PermissionActionFeedback from '@/components/PermissionActionFeedback';
import InteractivePermissionLearning from '@/components/InteractivePermissionLearning';
import CustomizableDashboard from '@/components/CustomizableDashboard';

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
  const [demoStep, setDemoStep] = useState<'intro' | 'tutorial' | 'permission' | 'dashboard'>('intro');
  const [showPermissionDialog, setShowPermissionDialog] = useState(false);
  const [showFloatingIcon, setShowFloatingIcon] = useState(false);
  const [actionFeedback, setActionFeedback] = useState<'grant' | 'deny' | 'shield' | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  
  // Show permission dialog when in permission step
  useEffect(() => {
    if (demoStep === 'permission') {
      const timer = setTimeout(() => {
        setShowPermissionDialog(true);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [demoStep]);

  // Show action feedback and auto-hide after delay
  useEffect(() => {
    if (showFeedback) {
      const timer = setTimeout(() => {
        setShowFeedback(false);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [showFeedback]);

  // Handle permission denial - show floating icon
  const handleDenyPermission = () => {
    setShowPermissionDialog(false);
    
    // Show denial action feedback
    setActionFeedback('deny');
    setShowFeedback(true);
    
    // Show the floating Virtual Shield icon after a delay
    setTimeout(() => {
      setShowFloatingIcon(true);
    }, 1500);
  };
  
  // Handle permission approval - end demo
  const handleAllowPermission = () => {
    setShowPermissionDialog(false);
    
    // Show approval action feedback
    setActionFeedback('grant');
    setShowFeedback(true);
    
    // End demo after a delay
    setTimeout(() => {
      onComplete();
    }, 1500);
  };
  
  // Handle opening the dashboard from the floating icon
  const handleOpenFromFloatingIcon = () => {
    setShowFloatingIcon(false);
    
    // Show shield protection feedback
    setActionFeedback('shield');
    setShowFeedback(true);
    
    // Change to dashboard step
    setTimeout(() => {
      setDemoStep('dashboard');
    }, 1000);
  };
  
  // Based on the current step, show the appropriate content
  const renderDemoContent = () => {
    switch (demoStep) {
      case 'intro':
        return (
          <motion.div 
            className="bg-shield-dark/30 p-6 rounded-lg border border-shield-dark/50"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h3 className="text-xl font-bold mb-4 text-shield-light flex items-center">
              <Icon name="shield" className="mr-2 h-5 w-5" />
              Privacy Protection Demo
            </h3>
            
            <div className="space-y-4 text-gray-300">
              <p>
                Welcome to the Virtual Shield privacy demo! This interactive experience will show you:
              </p>
              
              <ul className="space-y-3">
                <li className="flex items-start">
                  <div className="h-6 w-6 rounded-full bg-shield-secondary/90 flex items-center justify-center mr-2 flex-shrink-0 mt-0.5">
                    <span className="text-white text-xs">1</span>
                  </div>
                  <span>How permission requests work on your device</span>
                </li>
                <li className="flex items-start">
                  <div className="h-6 w-6 rounded-full bg-shield-secondary/90 flex items-center justify-center mr-2 flex-shrink-0 mt-0.5">
                    <span className="text-white text-xs">2</span>
                  </div>
                  <span>How Virtual Shield protects your privacy</span>
                </li>
                <li className="flex items-start">
                  <div className="h-6 w-6 rounded-full bg-shield-secondary/90 flex items-center justify-center mr-2 flex-shrink-0 mt-0.5">
                    <span className="text-white text-xs">3</span>
                  </div>
                  <span>How to customize your privacy settings</span>
                </li>
              </ul>
              
              <div className="pt-4 flex justify-between">
                <Button variant="outline" onClick={onComplete}>
                  Skip Demo
                </Button>
                
                <Button 
                  onClick={() => setDemoStep('tutorial')} 
                  className="bg-shield hover:bg-shield-accent"
                >
                  Start Learning <Icon name="arrow-right" className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </div>
          </motion.div>
        );
        
      case 'tutorial':
        return (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <InteractivePermissionLearning onComplete={() => setDemoStep('permission')} />
          </motion.div>
        );
        
      case 'permission':
        return (
          <motion.div 
            className="bg-shield-dark/30 p-6 rounded-lg border border-shield-dark/50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <h3 className="text-xl font-bold mb-4 text-shield-light flex items-center">
              <Icon name="smartphone" className="mr-2 h-5 w-5" />
              App Permission Request
            </h3>
            
            <div className="space-y-4 text-gray-300">
              <p>
                Now let's see what happens when an app requests permission to access your data.
              </p>
              
              <div className="flex flex-col items-center py-10 text-center space-y-6">
                <div className="h-16 w-16 bg-shield/30 rounded-full flex items-center justify-center animate-pulse">
                  <Icon name="smartphone" className="h-8 w-8 text-shield-light" />
                </div>
                <p className="text-lg">App is requesting permissions...</p>
              </div>
              
              <div className="flex justify-between mt-6">
                <Button variant="outline" onClick={onComplete}>
                  Skip Demo
                </Button>
                
                <Button onClick={() => setShowPermissionDialog(true)} className="bg-shield hover:bg-shield-accent">
                  Show Request
                </Button>
              </div>
            </div>
          </motion.div>
        );
        
      case 'dashboard':
        return (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <CustomizableDashboard />
            
            <div className="flex justify-end mt-6">
              <Button onClick={onComplete} className="bg-shield hover:bg-shield-accent">
                Complete Demo
              </Button>
            </div>
          </motion.div>
        );
    }
  };
  
  return (
    <div className="space-y-6 py-4 relative min-h-[500px]">
      <AnimatePresence mode="wait">
        {renderDemoContent()}
      </AnimatePresence>
      
      {/* Visual feedback for user actions */}
      <PermissionActionFeedback
        action={actionFeedback}
        permissionType={"CONTACTS" as PermissionType}
        isVisible={showFeedback}
      />
      
      {/* Permission Request Dialog - System Style */}
      <PermissionRequestDialog
        open={showPermissionDialog}
        onOpenChange={setShowPermissionDialog}
        app={demoApp}
        permissionType={"CONTACTS" as PermissionType}
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
