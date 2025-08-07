import React, { useState } from 'react';
import { Icon } from './Icon';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { OSScreen } from './PhoneOS';

interface AppDrawerProps {
  onNavigate: (screen: OSScreen) => void;
}

interface AppIcon {
  id: string;
  name: string;
  icon: string;
  category: 'system' | 'communication' | 'productivity' | 'entertainment' | 'security';
  action?: () => void;
}

export function AppDrawer({ onNavigate }: AppDrawerProps) {
  const [searchQuery, setSearchQuery] = useState('');

  const apps: AppIcon[] = [
    { id: 'homescreen', name: 'Home', icon: 'home', category: 'system', action: () => onNavigate('homescreen') },
    { id: 'vdc-dashboard', name: 'Virtual Shield', icon: 'shield', category: 'security', action: () => onNavigate('dashboard') },
    { id: 'settings', name: 'Settings', icon: 'settings', category: 'system', action: () => onNavigate('settings') },
    { id: 'phone', name: 'Phone', icon: 'phone', category: 'communication' },
    { id: 'messages', name: 'Messages', icon: 'messageSquare', category: 'communication' },
    { id: 'contacts', name: 'Contacts', icon: 'users', category: 'communication' },
    { id: 'camera', name: 'Camera', icon: 'camera', category: 'entertainment' },
    { id: 'gallery', name: 'Gallery', icon: 'image', category: 'entertainment' },
    { id: 'files', name: 'Files', icon: 'folder', category: 'productivity' },
    { id: 'calculator', name: 'Calculator', icon: 'calculator', category: 'productivity' },
    { id: 'clock', name: 'Clock', icon: 'clock', category: 'productivity' },
    { id: 'weather', name: 'Weather', icon: 'cloud', category: 'productivity' },
    { id: 'maps', name: 'Maps', icon: 'map', category: 'productivity' },
    { id: 'browser', name: 'Browser', icon: 'globe', category: 'productivity' },
    { id: 'music', name: 'Music', icon: 'music', category: 'entertainment' },
    { id: 'calendar', name: 'Calendar', icon: 'calendar', category: 'productivity' },
    { id: 'notes', name: 'Notes', icon: 'fileText', category: 'productivity' },
    { id: 'email', name: 'Email', icon: 'mail', category: 'communication' },
    { id: 'store', name: 'App Store', icon: 'download', category: 'system' },
    { id: 'backup', name: 'Backup', icon: 'harddrive', category: 'system' }
  ];

  const filteredApps = apps.filter(app =>
    app.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getIconColor = (category: string) => {
    switch (category) {
      case 'security': return 'text-shield-accent';
      case 'system': return 'text-primary';
      case 'communication': return 'text-muted-foreground';
      case 'productivity': return 'text-muted-foreground';
      case 'entertainment': return 'text-muted-foreground';
      default: return 'text-muted-foreground';
    }
  };

  return (
    <div className="h-full bg-background p-4">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-foreground mb-4">Apps</h1>
        
        {/* Search */}
        <div className="relative">
          <Icon name="search" className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search apps..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 bg-os-surface border-border"
          />
        </div>
      </div>

      {/* App Grid */}
      <ScrollArea className="h-[calc(100%-120px)]">
        <div className="grid grid-cols-4 gap-6">
          {filteredApps.map((app) => (
            <Button
              key={app.id}
              variant="ghost"
              className="h-20 w-full flex flex-col items-center justify-center space-y-2 p-2 hover:bg-os-surface-elevated rounded-xl"
              onClick={app.action}
            >
              <div className="w-12 h-12 rounded-xl bg-os-surface flex items-center justify-center border border-border/20">
                <Icon 
                  name={app.icon} 
                  className={`h-6 w-6 ${getIconColor(app.category)}`} 
                />
              </div>
              <span className="text-xs text-foreground font-medium leading-tight text-center">
                {app.name}
              </span>
            </Button>
          ))}
        </div>

        {/* No results */}
        {filteredApps.length === 0 && (
          <div className="text-center py-12">
            <Icon name="search" className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">No apps found</p>
          </div>
        )}
      </ScrollArea>

      {/* Quick access hint */}
      <div className="absolute bottom-20 left-4 right-4 text-center">
        <p className="text-xs text-muted-foreground">
          Swipe up from bottom edge or tap Apps to access
        </p>
      </div>
    </div>
  );
}

export default AppDrawer;