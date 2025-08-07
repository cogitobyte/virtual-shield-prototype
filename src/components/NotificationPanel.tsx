import React, { useState } from 'react';
import { Icon } from './Icon';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';

interface QuickToggle {
  id: string;
  icon: string;
  label: string;
  active: boolean;
}

interface Notification {
  id: string;
  appIcon: string;
  appName: string;
  title: string;
  message: string;
  time: string;
}

interface NotificationPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

export function NotificationPanel({ isOpen, onClose }: NotificationPanelProps) {
  const [toggles, setToggles] = useState<QuickToggle[]>([
    { id: 'wifi', icon: 'wifi', label: 'WiFi', active: true },
    { id: 'bluetooth', icon: 'bluetooth', label: 'Bluetooth', active: false },
    { id: 'flashlight', icon: 'flashlight', label: 'Light', active: false },
    { id: 'shield', icon: 'shield', label: 'Shield', active: true },
    { id: 'airplane', icon: 'plane', label: 'Flight', active: false },
    { id: 'dnd', icon: 'moon', label: 'DND', active: false }
  ]);

  const [notifications] = useState<Notification[]>([
    {
      id: '1',
      appIcon: 'shield',
      appName: 'Virtual Shield',
      title: 'Data Protection Active',
      message: 'Virtual responses sent to 3 apps',
      time: '2 min ago'
    },
    {
      id: '2',
      appIcon: 'messageSquare',
      appName: 'Messages',
      title: 'New message from Sarah',
      message: 'Hey, are we still on for dinner tonight?',
      time: '15 min ago'
    },
    {
      id: '3',
      appIcon: 'shieldCheck',
      appName: 'Privacy Center',
      title: 'Weekly Report Ready',
      message: 'Your privacy score improved by 15%',
      time: '1 hour ago'
    }
  ]);

  const handleToggle = (id: string) => {
    setToggles(prev => prev.map(toggle => 
      toggle.id === id ? { ...toggle, active: !toggle.active } : toggle
    ));
  };

  const dismissNotification = (id: string) => {
    console.log('Dismiss notification:', id);
  };

  return (
    <Card className="w-full bg-os-surface-elevated/95 backdrop-blur-xl border-border shadow-2xl rounded-2xl">
      <div className="p-6">
        {/* Header with VDC status */}
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center space-x-3">
            <Icon name="shield" className="w-5 h-5 text-shield-accent" />
            <div>
              <p className="text-sm font-medium text-foreground">Virtual Shield</p>
              <p className="text-xs text-muted-foreground">Protection Active</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 rounded-full bg-shield-accent animate-pulse"></div>
            <span className="text-xs text-shield-accent font-medium">ACTIVE</span>
          </div>
        </div>

        {/* Quick Settings */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          {toggles.map((toggle) => (
            <Button
              key={toggle.id}
              variant="ghost"
              size="sm"
              className={`h-16 flex flex-col items-center justify-center rounded-xl border transition-all ${
                toggle.active
                  ? 'bg-accent text-accent-foreground border-accent shadow-sm'
                  : 'bg-os-surface border-border hover:bg-os-surface-elevated'
              }`}
              onClick={() => handleToggle(toggle.id)}
            >
              <Icon name={toggle.icon} className="w-4 h-4 mb-1" />
              <span className="text-[10px] font-medium">{toggle.label}</span>
            </Button>
          ))}
        </div>

        {/* Brightness Slider */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-3">
            <Icon name="sun" className="w-4 h-4 text-muted-foreground" />
            <span className="text-xs text-muted-foreground font-medium">Brightness</span>
          </div>
          <Slider
            value={[75]}
            max={100}
            step={1}
            className="w-full"
          />
        </div>
        
        <Separator className="my-4 bg-border/50" />

        {/* Notifications */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-foreground">Recent Activity</h3>
            <Badge variant="secondary" className="text-xs bg-os-surface text-muted-foreground">
              {notifications.length}
            </Badge>
          </div>
          
          <ScrollArea className="max-h-72">
            <div className="space-y-3">
              {notifications.map((notification) => (
                <div
                  key={notification.id}
                  className="flex items-start space-x-3 p-4 rounded-xl bg-os-surface border border-border/30 hover:bg-os-surface-elevated transition-colors"
                >
                  <div className={`w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 ${
                    notification.appIcon === 'shield' || notification.appIcon === 'shieldCheck'
                      ? 'bg-shield-accent/20 text-shield-accent'
                      : 'bg-muted text-muted-foreground'
                  }`}>
                    <Icon name={notification.appIcon} className="w-4 h-4" />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <p className="text-xs font-medium text-foreground truncate">
                        {notification.appName}
                      </p>
                      <span className="text-xs text-muted-foreground">
                        {notification.time}
                      </span>
                    </div>
                    <p className="text-sm font-medium text-foreground mb-1">
                      {notification.title}
                    </p>
                    <p className="text-xs text-muted-foreground line-clamp-2">
                      {notification.message}
                    </p>
                  </div>
                  
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-6 h-6 p-0 text-muted-foreground hover:text-foreground rounded-full"
                    onClick={() => dismissNotification(notification.id)}
                  >
                    <Icon name="x" className="w-3 h-3" />
                  </Button>
                </div>
              ))}
            </div>
          </ScrollArea>
        </div>
      </div>
    </Card>
  );
}

export default NotificationPanel;