
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Card, CardContent } from '@/components/ui/card';
import { Icon } from '@/components/Icon';
import { motion } from 'framer-motion';

interface InstallationDemoProps {
  onComplete: () => void;
}

export function InstallationDemo({ onComplete }: InstallationDemoProps) {
  const [stage, setStage] = useState<'start' | 'app-open' | 'permission' | 'shield-active' | 'complete'>('start');
  const [progress, setProgress] = useState(0);
  
  // Progress bar based on current stage
  const getStageProgress = () => {
    switch (stage) {
      case 'start': return 0;
      case 'app-open': return 33;
      case 'permission': return 66;
      case 'shield-active': return 100;
      case 'complete': return 100;
      default: return 0;
    }
  };
  
  const handleStartDemo = () => {
    setStage('app-open');
    
    // Auto advance to permission request after showing the app
    setTimeout(() => {
      setStage('permission');
    }, 1500);
  };
  
  const handlePermissionResponse = () => {
    setStage('shield-active');
    
    // Auto advance to complete after showing shield
    setTimeout(() => {
      setStage('complete');
    }, 3000);
  };
  
  return (
    <div className="space-y-6">
      <div className="relative">
        {/* Progress indicator */}
        <div className="mb-4">
          <Progress value={getStageProgress()} className="h-2" />
          <div className="flex justify-between text-xs text-muted-foreground mt-1">
            <span>Open App</span>
            <span>Permission Request</span>
            <span>VDC Protection</span>
            <span>Complete</span>
          </div>
        </div>
        
        {/* Demo content based on stage */}
        <div className="min-h-[350px] flex flex-col items-center justify-center p-4">
          {stage === 'start' && (
            <div className="text-center space-y-6">
              <div className="h-24 w-24 mx-auto bg-shield/10 rounded-xl border border-shield/20 flex items-center justify-center">
                <Icon name="smartphone" className="h-12 w-12 text-shield-light" />
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">See Virtual Shield in Action</h3>
                <p className="text-muted-foreground mb-6">
                  See how Virtual Shield protects your privacy when apps request permissions to your data.
                </p>
                <Button onClick={handleStartDemo} className="bg-shield hover:bg-shield-secondary">
                  Start
                </Button>
              </div>
            </div>
          )}
          
          {stage === 'app-open' && (
            <div className="text-center space-y-4">
              <Card className="border border-shield-dark/20 p-6 w-64 mx-auto">
                <CardContent className="p-0 flex flex-col items-center">
                  <div className="mb-4 h-16 w-16 bg-gray-200 rounded-xl flex items-center justify-center">
                    <span className="text-black text-lg font-bold">APP</span>
                  </div>
                  <h3 className="font-medium">Social Media App</h3>
                  <p className="text-xs text-muted-foreground mt-1">Opening app...</p>
                </CardContent>
              </Card>
            </div>
          )}
          
          {stage === 'permission' && (
            <div className="text-center space-y-4">
              <Card className="border border-shield-dark/20 p-6 w-80 mx-auto">
                <CardContent className="p-0">
                  <div className="flex items-center mb-4">
                    <div className="h-10 w-10 rounded-md bg-gray-200 flex items-center justify-center">
                      <span className="text-black text-xs font-bold">APP</span>
                    </div>
                    <div className="ml-3 text-left">
                      <h3 className="font-medium">Social Media App</h3>
                      <p className="text-xs text-muted-foreground">Requesting Permission</p>
                    </div>
                  </div>
                  
                  <div className="bg-shield-dark/10 p-3 rounded-md mb-4 text-left">
                    <p className="text-sm">This app is requesting access to your <span className="font-semibold">Contacts</span></p>
                    <div className="mt-2">
                      <div className="flex items-center text-xs text-muted-foreground">
                        <Icon name="alert-triangle" className="h-3 w-3 mr-1 text-amber-400" />
                        Virtual Shield detected a suspicious request
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex justify-end space-x-2">
                    <Button variant="ghost" size="sm" onClick={handlePermissionResponse}>
                      Deny
                    </Button>
                    <Button className="bg-shield hover:bg-shield-secondary" size="sm" onClick={handlePermissionResponse}>
                      Allow with Virtual Data
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
          
          {stage === 'shield-active' && (
            <div className="relative">
              <Card className="border border-shield-dark/20 p-6 w-80 mx-auto opacity-50">
                <CardContent className="p-0">
                  <div className="flex items-center mb-4">
                    <div className="h-10 w-10 rounded-md bg-gray-200 flex items-center justify-center">
                      <span className="text-black text-xs font-bold">APP</span>
                    </div>
                    <div className="ml-3 text-left">
                      <h3 className="font-medium">Social Media App</h3>
                      <p className="text-xs text-muted-foreground">Accessing Contacts</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              {/* Floating shield animation */}
              <motion.div 
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
              >
                <div className="h-16 w-16 bg-gradient-to-br from-shield to-shield-secondary rounded-full flex items-center justify-center shadow-lg">
                  <Icon name="shield" className="h-8 w-8 text-white" />
                </div>
                
                <motion.div 
                  className="absolute -top-2 -right-2 h-6 w-6 bg-shield-accent rounded-full flex items-center justify-center"
                  initial={{ scale: 0 }}
                  animate={{ scale: [0, 1.2, 1] }}
                  transition={{ delay: 0.3, duration: 0.5 }}
                >
                  <Icon name="shield-check" className="h-4 w-4 text-white" />
                </motion.div>
                
                <div className="mt-4 bg-white/10 backdrop-blur-md rounded-md px-3 py-2 text-center">
                  <p className="text-sm">Virtual Shield Active</p>
                  <p className="text-xs text-shield-accent">Providing virtual contacts data</p>
                </div>
              </motion.div>
            </div>
          )}
          
          {stage === 'complete' && (
            <div className="text-center space-y-6">
              <div className="h-16 w-16 mx-auto bg-shield-accent/20 rounded-full flex items-center justify-center">
                <Icon name="check" className="h-8 w-8 text-shield-accent" />
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">Privacy Protected</h3>
                <p className="text-muted-foreground mb-6">
                  Virtual Shield has protected your privacy by providing virtual data
                  instead of your real information.
                </p>
                <Button onClick={onComplete} className="bg-shield hover:bg-shield-secondary">
                  Continue to Virtual Shield
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default InstallationDemo;
