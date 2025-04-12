import { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import AppSelector from './AppSelector';
import PermissionSelector from './PermissionSelector';
import PermissionResult from './PermissionResult';
import PermissionLog from './PermissionLog';
import PrivacyDashboard from './PrivacyDashboard';
import InstallationDemo from './InstallationDemo';
import { App, PermissionType, PermissionResponse } from '@/modules/types';
import UISkinModule from '@/modules/UISkinModule';
import { Icon } from '@/components/Icon';
import { useIsMobile } from '@/hooks/use-mobile';

export function Dashboard() {
  const [selectedApp, setSelectedApp] = useState<App | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [permissionResult, setPermissionResult] = useState<PermissionResponse | null>(null);
  const [lastPermissionType, setLastPermissionType] = useState<PermissionType | null>(null);
  const [activeTab, setActiveTab] = useState("request");
  const [showHelp, setShowHelp] = useState(true);
  const [showDemo, setShowDemo] = useState(true);
  const isMobile = useIsMobile();
  
  // First-time user guide
  useEffect(() => {
    // Store first visit in localStorage
    const hasVisited = localStorage.getItem('virtualShield_hasVisited');
    if (!hasVisited) {
      setShowHelp(true);
      localStorage.setItem('virtualShield_hasVisited', 'true');
    } else {
      setShowHelp(false);
    }
    
    // Set demo to be initially shown by default now
    setShowDemo(true);
  }, []);
  
  const handleSelectApp = (app: App) => {
    setSelectedApp(app);
    // Clear previous results when switching apps
    setPermissionResult(null);
  };
  
  const handleRequestPermission = async (permissionType: PermissionType) => {
    if (!selectedApp) {
      toast({
        title: "Error",
        description: "Please select an app first",
        variant: "destructive"
      });
      return;
    }
    
    setIsLoading(true);
    setLastPermissionType(permissionType);
    
    try {
      // Delay to simulate processing
      const uiSkinModule = UISkinModule.getInstance();
      const response = await uiSkinModule.requestPermission(selectedApp, permissionType);
      
      // Set the result
      setPermissionResult(response);
      
      // Show toast notification
      toast({
        title: response.granted ? "Permission Granted" : "Permission Denied",
        description: response.message,
        variant: response.granted ? "default" : "destructive"
      });
    } catch (error) {
      console.error('Error requesting permission:', error);
      toast({
        title: "Error",
        description: "An error occurred while processing the permission request",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleCompleteDemoView = () => {
    setShowDemo(false);
  };
  
  // If demo is shown, only display the demo
  if (showDemo) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-shield to-shield-dark flex items-center justify-center">
              <Icon name="shield" className="h-5 w-5 text-white" />
            </div>
            <div className="text-left">
              <h2 className="text-xl font-bold tracking-tight">Virtual Shield</h2>
              <p className="text-xs text-muted-foreground">Privacy-focused management</p>
            </div>
          </div>
          
          <Button variant="outline" size="sm" onClick={handleCompleteDemoView}>
            Continue to Shield
          </Button>
        </div>
        
        <InstallationDemo onComplete={handleCompleteDemoView} />
      </div>
    );
  }
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-3">
          <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-shield to-shield-dark flex items-center justify-center">
            <Icon name="shield" className="h-5 w-5 text-white" />
          </div>
          <div className="text-left">
            <h2 className="text-xl font-bold tracking-tight">Virtual Shield</h2>
            <p className="text-xs text-muted-foreground">Privacy-focused management</p>
          </div>
        </div>
        
        <Button variant="ghost" size="icon" onClick={() => setShowHelp(true)}>
          <Icon name="helpCircle" size={20} className="text-shield-accent" />
        </Button>
      </div>
      
      {isMobile ? (
        // Mobile tabs with bottom navigation
        <>
          <div className="px-1 pb-20">
            {activeTab === "request" && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 gap-4">
                  <AppSelector 
                    selectedApp={selectedApp} 
                    onSelectApp={handleSelectApp} 
                  />
                  
                  <PermissionSelector
                    onSelectPermission={handleRequestPermission}
                    isLoading={isLoading}
                  />
                </div>
                
                {isLoading && (
                  <div className="text-center py-2 text-muted-foreground">
                    <Icon name="loader" className="h-4 w-4 mx-auto animate-spin mb-2" />
                    Processing request...
                  </div>
                )}
                
                <PermissionResult 
                  result={permissionResult} 
                  permissionType={lastPermissionType}
                />
              </div>
            )}
            
            {activeTab === "logs" && <PermissionLog />}
            
            {activeTab === "dashboard" && <PrivacyDashboard />}
          </div>
          
          {/* Bottom Navigation */}
          <div className="fixed bottom-0 left-0 right-0 h-16 bg-background/80 backdrop-blur-md border-t border-border z-50 flex items-center justify-around">
            <Button 
              variant="ghost" 
              className={`flex flex-col items-center px-0 h-full w-1/3 rounded-none ${activeTab === "request" ? "text-shield-light border-t-2 border-shield" : ""}`}
              onClick={() => setActiveTab("request")}
            >
              <Icon name="shield" className="h-5 w-5 mb-1" />
              <span className="text-xs">Permissions</span>
            </Button>
            <Button 
              variant="ghost" 
              className={`flex flex-col items-center px-0 h-full w-1/3 rounded-none ${activeTab === "dashboard" ? "text-shield-light border-t-2 border-shield" : ""}`}
              onClick={() => setActiveTab("dashboard")}
            >
              <Icon name="bar-chart-4" className="h-5 w-5 mb-1" />
              <span className="text-xs">Dashboard</span>
            </Button>
            <Button 
              variant="ghost" 
              className={`flex flex-col items-center px-0 h-full w-1/3 rounded-none ${activeTab === "logs" ? "text-shield-light border-t-2 border-shield" : ""}`}
              onClick={() => setActiveTab("logs")}
            >
              <Icon name="list" className="h-5 w-5 mb-1" />
              <span className="text-xs">Activity</span>
            </Button>
          </div>
        </>
      ) : (
        // Desktop tabs
        <Tabs defaultValue="request" className="space-y-4">
          <TabsList className="grid grid-cols-3">
            <TabsTrigger value="request" className="data-[state=active]:bg-shield data-[state=active]:text-white">
              <Icon name="shield" className="h-4 w-4 mr-2" />
              Permission Manager
            </TabsTrigger>
            <TabsTrigger value="dashboard" className="data-[state=active]:bg-shield data-[state=active]:text-white">
              <Icon name="bar-chart-4" className="h-4 w-4 mr-2" />
              Privacy Dashboard
            </TabsTrigger>
            <TabsTrigger value="logs" className="data-[state=active]:bg-shield data-[state=active]:text-white">
              <Icon name="list" className="h-4 w-4 mr-2" />
              Activity Log
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="request" className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <AppSelector 
                selectedApp={selectedApp} 
                onSelectApp={handleSelectApp} 
              />
              
              <PermissionSelector
                onSelectPermission={handleRequestPermission}
                isLoading={isLoading}
              />
              
              {isLoading && (
                <div className="col-span-2 text-center py-2 text-muted-foreground">
                  <Button variant="ghost" disabled className="pointer-events-none">
                    <Icon name="loader" className="h-4 w-4 mr-2 animate-spin" />
                    Processing request...
                  </Button>
                </div>
              )}
              
              <div className="col-span-2">
                <PermissionResult 
                  result={permissionResult} 
                  permissionType={lastPermissionType}
                />
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="dashboard">
            <PrivacyDashboard />
          </TabsContent>
          
          <TabsContent value="logs">
            <PermissionLog />
          </TabsContent>
        </Tabs>
      )}
      
      <div className="px-4 py-3 bg-shield-dark/10 rounded-lg text-sm text-muted-foreground border border-shield-dark/20">
        <h3 className="font-medium mb-2 flex items-center">
          <Icon name="info" className="h-4 w-4 mr-2 text-shield-light" />
          About Virtual Shield
        </h3>
        <p className="mb-2 text-xs leading-relaxed">
          This prototype demonstrates a privacy-protection system that provides apps with
          virtualized data instead of real user information.
        </p>
        <p className="text-xs leading-relaxed">
          When an app requests sensitive information like call logs or location data, 
          our AI validates the request and generates realistic dummy data to satisfy the app
          without compromising user privacy.
        </p>
      </div>
      
      {/* First-time user help sheet */}
      <Sheet open={showHelp} onOpenChange={setShowHelp}>
        <SheetContent side="bottom" className="h-[85%] bg-gradient-to-b from-shield-dark to-background rounded-t-3xl">
          <SheetHeader className="text-center mb-6">
            <SheetTitle className="text-2xl text-white">Welcome to Virtual Shield</SheetTitle>
            <SheetDescription className="text-shield-light">
              Your privacy protection system
            </SheetDescription>
          </SheetHeader>
          
          <div className="space-y-6">
            <div className="bg-black/20 p-4 rounded-xl">
              <div className="flex items-start space-x-3 mb-2">
                <div className="h-8 w-8 bg-shield rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <Icon name="smartphone" className="h-4 w-4 text-white" />
                </div>
                <div>
                  <h3 className="font-medium text-white">How it works</h3>
                  <p className="text-sm text-gray-300">
                    Virtual Shield intercepts app permission requests and provides realistic 
                    dummy data instead of your actual personal information.
                  </p>
                </div>
              </div>
            </div>
            
            <ol className="space-y-6">
              <li className="flex items-start">
                <div className="h-7 w-7 rounded-full bg-shield-secondary/90 flex items-center justify-center mr-3 flex-shrink-0 mt-1">
                  <span className="text-white font-medium">1</span>
                </div>
                <div>
                  <h4 className="font-medium text-white">Select an app</h4>
                  <p className="text-sm text-gray-300">
                    Choose which app you want to test permission handling for
                  </p>
                </div>
              </li>
              
              <li className="flex items-start">
                <div className="h-7 w-7 rounded-full bg-shield-secondary/90 flex items-center justify-center mr-3 flex-shrink-0 mt-1">
                  <span className="text-white font-medium">2</span>
                </div>
                <div>
                  <h4 className="font-medium text-white">Request permission</h4>
                  <p className="text-sm text-gray-300">
                    Select a permission type that the app is requesting
                  </p>
                </div>
              </li>
              
              <li className="flex items-start">
                <div className="h-7 w-7 rounded-full bg-shield-secondary/90 flex items-center justify-center mr-3 flex-shrink-0 mt-1">
                  <span className="text-white font-medium">3</span>
                </div>
                <div>
                  <h4 className="font-medium text-white">View results</h4>
                  <p className="text-sm text-gray-300">
                    See the virtualized data that would be provided to the app
                  </p>
                </div>
              </li>
              
              <li className="flex items-start">
                <div className="h-7 w-7 rounded-full bg-shield-secondary/90 flex items-center justify-center mr-3 flex-shrink-0 mt-1">
                  <span className="text-white font-medium">4</span>
                </div>
                <div>
                  <h4 className="font-medium text-white">Check the dashboard</h4>
                  <p className="text-sm text-gray-300">
                    View your privacy score and detailed risk assessment for each app
                  </p>
                </div>
              </li>
              
              <li className="flex items-start">
                <div className="h-7 w-7 rounded-full bg-shield-secondary/90 flex items-center justify-center mr-3 flex-shrink-0 mt-1">
                  <span className="text-white font-medium">5</span>
                </div>
                <div>
                  <h4 className="font-medium text-white">Review logs</h4>
                  <p className="text-sm text-gray-300">
                    Check the Activity tab to see a history of all permission requests
                  </p>
                </div>
              </li>
            </ol>
            
            <Button 
              className="w-full bg-shield hover:bg-shield-secondary transition-colors"
              onClick={() => setShowHelp(false)}
            >
              Start Using Virtual Shield
            </Button>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}

export default Dashboard;
