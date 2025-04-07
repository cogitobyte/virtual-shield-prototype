
import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';
import AppSelector from './AppSelector';
import PermissionSelector from './PermissionSelector';
import PermissionResult from './PermissionResult';
import PermissionLog from './PermissionLog';
import { App, PermissionType, PermissionResponse } from '@/modules/types';
import UISkinModule from '@/modules/UISkinModule';
import { Icon } from '@/components/Icon';

export function Dashboard() {
  const [selectedApp, setSelectedApp] = useState<App | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [permissionResult, setPermissionResult] = useState<PermissionResponse | null>(null);
  const [lastPermissionType, setLastPermissionType] = useState<PermissionType | null>(null);
  
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
  
  return (
    <div className="p-4 space-y-6">
      <div className="flex items-center space-x-4">
        <div className="h-12 w-12 rounded-lg bg-gradient-to-br from-shield to-shield-dark flex items-center justify-center">
          <Icon name="shield" className="h-6 w-6 text-white" />
        </div>
        <div>
          <h2 className="text-2xl font-bold">Virtual Shield</h2>
          <p className="text-muted-foreground">
            Privacy-focused permission management
          </p>
        </div>
      </div>
      
      <Tabs defaultValue="request" className="space-y-4">
        <TabsList className="grid grid-cols-2">
          <TabsTrigger value="request" className="data-[state=active]:bg-shield data-[state=active]:text-white">
            <Icon name="shield" className="h-4 w-4 mr-2" />
            Permission Manager
          </TabsTrigger>
          <TabsTrigger value="logs" className="data-[state=active]:bg-shield data-[state=active]:text-white">
            <Icon name="list" className="h-4 w-4 mr-2" />
            Activity Log
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="request" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-4">
              <AppSelector 
                selectedApp={selectedApp} 
                onSelectApp={handleSelectApp} 
              />
              
              <PermissionSelector
                onSelectPermission={handleRequestPermission}
                isLoading={isLoading}
              />
              
              {isLoading && (
                <div className="text-center py-2 text-muted-foreground">
                  <Button variant="ghost" disabled className="pointer-events-none">
                    <Icon name="loader-2" className="h-4 w-4 mr-2 animate-spin" />
                    Processing request...
                  </Button>
                </div>
              )}
            </div>
            
            <PermissionResult 
              result={permissionResult} 
              permissionType={lastPermissionType}
            />
          </div>
        </TabsContent>
        
        <TabsContent value="logs">
          <PermissionLog />
        </TabsContent>
      </Tabs>
      
      <div className="p-4 bg-shield-dark/10 rounded-lg text-sm text-muted-foreground border border-shield-dark/20">
        <h3 className="font-medium mb-2 flex items-center">
          <Icon name="info" className="h-4 w-4 mr-2 text-shield-light" />
          About Virtual Shield
        </h3>
        <p className="mb-2">
          This prototype demonstrates a privacy-protection system that provides apps with
          virtualized data instead of real user information.
        </p>
        <p>
          When an app requests sensitive information like call logs or location data, 
          our AI validates the request and generates realistic dummy data to satisfy the app
          without compromising user privacy.
        </p>
      </div>
    </div>
  );
}

export default Dashboard;
