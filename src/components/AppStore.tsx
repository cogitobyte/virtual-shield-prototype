import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Icon } from '@/components/Icon';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { App, PermissionType } from '@/modules/types';
import OSPermissionDialog from './OSPermissionDialog';
import VDCSystemNotification from './VDCSystemNotification';
import UISkinModule from '@/modules/UISkinModule';

interface AppStoreApp extends App {
  rating: number;
  downloads: string;
  category: string;
  screenshots: string[];
  description: string;
  permissions: PermissionType[];
  size: string;
}

const MOCK_APPS: AppStoreApp[] = [
  {
    id: 'instagram',
    name: 'Instagram',
    icon: 'camera',
    category: 'Photo & Video',
    trustLevel: 'low',
    rating: 4.5,
    downloads: '1B+',
    description: 'Share photos and videos with friends',
    permissions: ['CAMERA', 'MICROPHONE', 'STORAGE', 'LOCATION', 'CONTACTS'],
    size: '85 MB',
    screenshots: []
  },
  {
    id: 'whatsapp',
    name: 'WhatsApp',
    icon: 'message-circle',
    category: 'Communication',
    trustLevel: 'medium',
    rating: 4.2,
    downloads: '5B+',
    description: 'Simple. Reliable. Private.',
    permissions: ['CONTACTS', 'MICROPHONE', 'CAMERA', 'STORAGE'],
    size: '45 MB',
    screenshots: []
  },
  {
    id: 'spotify',
    name: 'Spotify',
    icon: 'music',
    category: 'Music',
    trustLevel: 'high',
    rating: 4.3,
    downloads: '1B+',
    description: 'Music and podcasts',
    permissions: ['STORAGE', 'MICROPHONE'],
    size: '25 MB',
    screenshots: []
  },
  {
    id: 'tiktok',
    name: 'TikTok',
    icon: 'video',
    category: 'Entertainment',
    trustLevel: 'low',
    rating: 4.1,
    downloads: '3B+',
    description: 'Short-form video platform',
    permissions: ['CAMERA', 'MICROPHONE', 'STORAGE', 'LOCATION', 'CONTACTS'],
    size: '120 MB',
    screenshots: []
  }
];

interface AppStoreProps {
  onNavigate?: (screen: string) => void;
}

export function AppStore({ onNavigate }: AppStoreProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedApp, setSelectedApp] = useState<AppStoreApp | null>(null);
  const [installingApp, setInstallingApp] = useState<string | null>(null);
  const [currentPermissionIndex, setCurrentPermissionIndex] = useState(0);
  const [showPermissionDialog, setShowPermissionDialog] = useState(false);
  const [installProgress, setInstallProgress] = useState(0);
  const [systemNotification, setSystemNotification] = useState<{
    show: boolean;
    message: string;
    type: 'protected' | 'blocked' | 'allowed';
  }>({ show: false, message: '', type: 'allowed' });

  const filteredApps = MOCK_APPS.filter(app => 
    app.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    app.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleInstallApp = async (app: AppStoreApp) => {
    setInstallingApp(app.id);
    setSelectedApp(app);
    setCurrentPermissionIndex(0);
    setInstallProgress(0);

    // Simulate download progress
    const downloadInterval = setInterval(() => {
      setInstallProgress(prev => {
        if (prev >= 100) {
          clearInterval(downloadInterval);
          // Start permission requests after download
          setTimeout(() => {
            setShowPermissionDialog(true);
          }, 500);
          return 100;
        }
        return prev + 10;
      });
    }, 200);
  };

  const handleAllowPermission = async () => {
    if (!selectedApp) return;
    
    setShowPermissionDialog(false);
    
    const currentPermission = selectedApp.permissions[currentPermissionIndex];
    
    // Show system notification
    setSystemNotification({
      show: true,
      message: 'Protected by VDC',
      type: 'protected'
    });
    
    // Process permission through UISkinModule
    const uiSkinModule = UISkinModule.getInstance();
    try {
      await uiSkinModule.requestPermission(selectedApp, currentPermission);
      
      // Move to next permission or complete installation
      setTimeout(() => {
        if (currentPermissionIndex < selectedApp.permissions.length - 1) {
          setCurrentPermissionIndex(prev => prev + 1);
          setShowPermissionDialog(true);
        } else {
          // Installation complete
          setInstallingApp(null);
          setSelectedApp(null);
          setCurrentPermissionIndex(0);
        }
      }, 1500);
    } catch (error) {
      console.error('Permission error:', error);
    }
  };

  const handleDenyPermission = () => {
    if (!selectedApp) return;
    
    setShowPermissionDialog(false);
    
    // Show blocked notification
    setSystemNotification({
      show: true,
      message: 'Blocked by VDC',
      type: 'blocked'
    });
    
    // Continue with next permission or complete
    setTimeout(() => {
      if (currentPermissionIndex < selectedApp.permissions.length - 1) {
        setCurrentPermissionIndex(prev => prev + 1);
        setShowPermissionDialog(true);
      } else {
        // Installation complete
        setInstallingApp(null);
        setSelectedApp(null);
        setCurrentPermissionIndex(0);
      }
    }, 1500);
  };

  return (
    <div className="h-full bg-gradient-to-b from-background to-os-surface/30 p-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-light text-foreground">App Store</h1>
          <p className="text-sm text-muted-foreground">Discover amazing apps</p>
        </div>
        <Button variant="ghost" size="icon" onClick={() => onNavigate?.('homescreen')}>
          <Icon name="x" size={20} />
        </Button>
      </div>

      {/* Search */}
      <div className="relative mb-6">
        <Icon name="search" className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={16} />
        <Input
          placeholder="Search apps..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10 bg-os-surface/50 border-border/40"
        />
      </div>

      {/* App List */}
      <div className="space-y-4 pb-20">
        {filteredApps.map((app) => (
          <Card key={app.id} className="bg-os-surface/70 border-border/40 p-4">
            <div className="flex items-start space-x-4">
              {/* App Icon */}
              <div className="w-16 h-16 rounded-2xl bg-os-surface-elevated border border-border flex items-center justify-center">
                <Icon name={app.icon} size={24} className="text-muted-foreground" />
              </div>

              {/* App Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h3 className="font-medium text-foreground text-sm">{app.name}</h3>
                    <p className="text-xs text-muted-foreground">{app.category}</p>
                  </div>
                  <Badge 
                    variant="outline" 
                    className={cn("text-xs", {
                      "border-red-500/50 text-red-400": app.trustLevel === 'low',
                      "border-yellow-500/50 text-yellow-400": app.trustLevel === 'medium',
                      "border-green-500/50 text-green-400": app.trustLevel === 'high'
                    })}
                  >
                    {app.trustLevel} trust
                  </Badge>
                </div>

                <p className="text-xs text-muted-foreground mb-3 line-clamp-2">
                  {app.description}
                </p>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                    <div className="flex items-center space-x-1">
                      <Icon name="star" size={12} className="text-yellow-400 fill-current" />
                      <span>{app.rating}</span>
                    </div>
                    <span>{app.downloads}</span>
                    <span>{app.size}</span>
                  </div>

                  {installingApp === app.id ? (
                    <div className="flex items-center space-x-2">
                      {installProgress < 100 ? (
                        <>
                          <div className="w-20 h-2 bg-os-surface rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-shield-accent transition-all duration-200"
                              style={{ width: `${installProgress}%` }}
                            />
                          </div>
                          <span className="text-xs text-muted-foreground">{installProgress}%</span>
                        </>
                      ) : (
                        <>
                          <Icon name="loader" className="animate-spin text-shield-accent" size={16} />
                          <span className="text-xs text-shield-accent">Installing...</span>
                        </>
                      )}
                    </div>
                  ) : (
                    <Button 
                      size="sm" 
                      onClick={() => handleInstallApp(app)}
                      className="bg-shield/20 text-shield-accent border border-shield/30 hover:bg-shield/30"
                    >
                      <Icon name="download" size={14} className="mr-1" />
                      Install
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* OS Permission Dialog with VDC Integration */}
      <OSPermissionDialog
        open={showPermissionDialog}
        onOpenChange={setShowPermissionDialog}
        app={selectedApp}
        permissionType={selectedApp?.permissions[currentPermissionIndex] || null}
        onAllow={handleAllowPermission}
        onDeny={handleDenyPermission}
      />

      {/* VDC System Notification */}
      <VDCSystemNotification
        show={systemNotification.show}
        message={systemNotification.message}
        type={systemNotification.type}
        onComplete={() => setSystemNotification(prev => ({ ...prev, show: false }))}
      />
    </div>
  );
}

export default AppStore;