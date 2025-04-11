
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Card, CardContent } from '@/components/ui/card';
import { Icon } from '@/components/Icon';
import { motion } from 'framer-motion';
import UISkinModule from '@/modules/UISkinModule';
import { App, PermissionType } from '@/modules/types';
import { toast } from '@/components/ui/use-toast';

interface InstallationDemoProps {
  onComplete: () => void;
}

export function InstallationDemo({ onComplete }: InstallationDemoProps) {
  const [stage, setStage] = useState<'start' | 'app-open' | 'permission' | 'shield-active' | 'complete'>('start');
  const [progress, setProgress] = useState(0);
  
  // Demo app data
  const demoApp: App = {
    id: 'demo-social-app',
    name: 'Social Media App',
    icon: 'instagram',
    trusted: false
  };
  
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
  
  const handleOpenApp = () => {
    setStage('app-open');
    
    // Auto advance to permission request after showing the app
    setTimeout(() => {
      setStage('permission');
    }, 1000);
  };
  
  const handlePermissionResponse = async (allow: boolean) => {
    setStage('shield-active');
    
    // Process the permission request through the actual VDC system
    const uiSkinModule = UISkinModule.getInstance();
    
    try {
      // This will create a real log entry using the existing permission system
      const response = await uiSkinModule.requestPermission(demoApp, 'CONTACTS');
      
      // Show toast notification
      toast({
        title: "Virtual Shield Active",
        description: "Your data is being protected",
        variant: "default"
      });
      
    } catch (error) {
      console.error('Error processing demo permission:', error);
    }
    
    // Auto advance to complete after showing shield
    setTimeout(() => {
      setStage('complete');
    }, 3000);
  };
  
  useEffect(() => {
    // Update progress indicator when stage changes
    setProgress(getStageProgress());
  }, [stage]);
  
  return (
    <div className="space-y-6">
      <div className="relative">
        {/* Progress indicator */}
        <div className="mb-4">
          <Progress value={progress} className="h-2" />
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
                <h3 className="text-xl font-semibold mb-2">See How Apps Request Your Data</h3>
                <p className="text-muted-foreground mb-6">
                  Learn how Virtual Shield protects your privacy when apps request access to your personal data.
                </p>
                <Button onClick={handleOpenApp} className="bg-shield hover:bg-shield-secondary">
                  Open App
                </Button>
              </div>
            </div>
          )}
          
          {stage === 'app-open' && (
            <div className="text-center space-y-4 w-full max-w-md">
              <div className="bg-gradient-to-r from-purple-500 to-pink-500 h-16 rounded-t-lg flex items-center px-4">
                <div className="flex items-center">
                  <div className="h-9 w-9 rounded-full bg-white flex items-center justify-center">
                    <Icon name="instagram" className="h-5 w-5 text-pink-500" />
                  </div>
                  <h3 className="text-white font-medium ml-3">Social Connect</h3>
                </div>
              </div>
              
              <Card className="shadow-md">
                <CardContent className="p-6">
                  <div className="flex flex-col space-y-4">
                    <div className="bg-gray-100 h-8 w-full rounded-md animate-pulse"></div>
                    <div className="bg-gray-100 h-24 w-full rounded-md animate-pulse"></div>
                    <div className="flex justify-between">
                      <div className="bg-gray-100 h-10 w-10 rounded-full"></div>
                      <div className="bg-gray-100 h-10 w-10 rounded-full"></div>
                      <div className="bg-gray-100 h-10 w-10 rounded-full"></div>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <div className="text-sm text-muted-foreground mt-2">
                App is opening...
              </div>
            </div>
          )}
          
          {stage === 'permission' && (
            <div className="text-center space-y-4 w-full max-w-md relative">
              <div className="bg-gradient-to-r from-purple-500 to-pink-500 h-16 rounded-t-lg flex items-center px-4">
                <div className="flex items-center">
                  <div className="h-9 w-9 rounded-full bg-white flex items-center justify-center">
                    <Icon name="instagram" className="h-5 w-5 text-pink-500" />
                  </div>
                  <h3 className="text-white font-medium ml-3">Social Connect</h3>
                </div>
              </div>
              
              <Card className="shadow-md border border-shield-dark/20">
                <CardContent className="p-6">
                  <div className="mb-4 text-left">
                    <h3 className="font-medium text-lg">Connect With Friends</h3>
                    <p className="text-sm text-muted-foreground">
                      Find people you know by connecting your contacts
                    </p>
                  </div>
                  
                  {/* Permission Dialog */}
                  <motion.div 
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="bg-white border border-gray-200 rounded-xl p-4 shadow-lg"
                  >
                    <div className="flex items-center mb-4">
                      <div className="h-10 w-10 rounded-md bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center">
                        <Icon name="users" className="h-6 w-6 text-white" />
                      </div>
                      <div className="ml-3 text-left">
                        <h3 className="font-medium">Allow Contact Access</h3>
                        <p className="text-xs text-muted-foreground">Social Connect wants to access your contacts</p>
                      </div>
                    </div>
                    
                    <div className="bg-shield-dark/10 p-3 rounded-md mb-4 text-left">
                      <p className="text-sm">This app is requesting access to your <span className="font-semibold">Contacts</span></p>
                      <div className="mt-2">
                        <div className="flex items-center text-xs text-muted-foreground">
                          <Icon name="alert-triangle" className="h-3 w-3 mr-1 text-amber-400" />
                          Apps can use your contacts data to track your connections
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex justify-end space-x-2">
                      <Button variant="ghost" size="sm" onClick={() => handlePermissionResponse(false)}>
                        Deny
                      </Button>
                      <Button className="bg-shield hover:bg-shield-secondary" size="sm" onClick={() => handlePermissionResponse(true)}>
                        Allow with Virtual Shield
                      </Button>
                    </div>
                  </motion.div>
                </CardContent>
              </Card>
            </div>
          )}
          
          {stage === 'shield-active' && (
            <div className="relative">
              <div className="opacity-50 blur-[1px] w-full max-w-md">
                <div className="bg-gradient-to-r from-purple-500 to-pink-500 h-16 rounded-t-lg flex items-center px-4">
                  <div className="flex items-center">
                    <div className="h-9 w-9 rounded-full bg-white flex items-center justify-center">
                      <Icon name="instagram" className="h-5 w-5 text-pink-500" />
                    </div>
                    <h3 className="text-white font-medium ml-3">Social Connect</h3>
                  </div>
                </div>
                
                <Card className="shadow-md">
                  <CardContent className="p-6">
                    <div className="flex flex-col space-y-4">
                      <div className="bg-gray-100 h-8 w-full rounded-md"></div>
                      <div className="bg-gray-100 h-24 w-full rounded-md"></div>
                      <div className="flex justify-between">
                        <div className="bg-gray-100 h-10 w-10 rounded-full"></div>
                        <div className="bg-gray-100 h-10 w-10 rounded-full"></div>
                        <div className="bg-gray-100 h-10 w-10 rounded-full"></div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
              
              {/* Floating shield animation */}
              <motion.div 
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10"
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
                
                <motion.div 
                  className="absolute -top-10 -left-10 h-4 w-4 rounded-full bg-shield-accent/40"
                  animate={{ 
                    x: [0, 20, 40, 60, 80],
                    y: [0, -20, -10, -30, -20],
                    opacity: [1, 0.8, 0.6, 0.4, 0]
                  }}
                  transition={{ repeat: Infinity, duration: 2 }}
                />
                
                <motion.div 
                  className="absolute -bottom-20 right-10 h-3 w-3 rounded-full bg-shield-accent/40"
                  animate={{ 
                    x: [0, -20, -40, -60],
                    y: [0, 10, 20, 10],
                    opacity: [1, 0.8, 0.6, 0]
                  }}
                  transition={{ repeat: Infinity, duration: 1.8, delay: 0.5 }}
                />
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
                  instead of your real information. Check the Activity Log to see this interaction.
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
