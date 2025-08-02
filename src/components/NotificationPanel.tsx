import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Icon } from '@/components/Icon';
import { cn } from '@/lib/utils';

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

export const NotificationPanel: React.FC<NotificationPanelProps> = ({ isOpen, onClose }) => {
  const [toggles, setToggles] = useState<QuickToggle[]>([
    { id: 'wifi', icon: 'wifi', label: 'WiFi', active: true },
    { id: 'bluetooth', icon: 'bluetooth', label: 'Bluetooth', active: false },
    { id: 'flashlight', icon: 'flashlight', label: 'Torch', active: false },
    { id: 'wallet', icon: 'credit-card', label: 'Wallet', active: true },
    { id: 'do-not-disturb', icon: 'moon', label: 'Do Not Disturb', active: false },
    { id: 'auto-rotate', icon: 'rotate-3d', label: 'Auto-rotate', active: true },
  ]);

  const [notifications] = useState<Notification[]>([
    {
      id: '1',
      appIcon: 'shield',
      appName: 'Virtual Shield',
      title: 'Permission Request Blocked',
      message: 'Camera access denied for SocialApp',
      time: '2 min ago'
    },
    {
      id: '2',
      appIcon: 'message-circle',
      appName: 'Messages',
      title: 'New message',
      message: 'Hey, are you free tonight?',
      time: '5 min ago'
    }
  ]);

  const handleToggle = (id: string) => {
    setToggles(prev => prev.map(toggle => 
      toggle.id === id ? { ...toggle, active: !toggle.active } : toggle
    ));
  };

  const dismissNotification = (id: string) => {
    // In real implementation, this would remove the notification
    console.log('Dismiss notification:', id);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/40 animate-fade-in">
      <div 
        className="absolute inset-0" 
        onClick={onClose}
      />
      
      <div className="relative bg-background border-b border-muted animate-slide-in-down">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-muted/20">
          <div className="text-sm text-muted-foreground">
            14:22 Mon, 10 Jul
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <Icon name="wifi" size={16} />
            <Icon name="battery" size={16} />
            <span className="text-sm font-mono">73%</span>
          </div>
        </div>

        {/* Quick Settings Toggles */}
        <div className="p-6">
          <div className="grid grid-cols-3 gap-4 mb-6">
            {toggles.map((toggle) => (
              <Button
                key={toggle.id}
                variant="ghost"
                className={cn(
                  "h-20 w-full flex flex-col items-center justify-center gap-2 rounded-xl border-2 transition-all",
                  toggle.active 
                    ? "bg-muted border-muted-foreground text-foreground" 
                    : "bg-muted/20 border-muted-foreground/20 text-muted-foreground hover:bg-muted/40"
                )}
                onClick={() => handleToggle(toggle.id)}
              >
                <Icon 
                  name={toggle.icon} 
                  size={24} 
                  className={toggle.active ? "text-foreground" : "text-muted-foreground"}
                />
                <span className="text-xs font-medium">{toggle.label}</span>
              </Button>
            ))}
          </div>

          {/* Brightness Slider */}
          <Card className="bg-muted/20 border-muted p-4 mb-6">
            <div className="flex items-center gap-3">
              <Icon name="sun" size={20} className="text-muted-foreground" />
              <div className="flex-1 h-2 bg-muted-foreground/20 rounded-full">
                <div className="h-full w-3/4 bg-foreground rounded-full relative">
                  <div className="absolute right-0 top-1/2 -translate-y-1/2 w-4 h-4 bg-foreground rounded-full border-2 border-background"></div>
                </div>
              </div>
              <Icon name="sun" size={24} className="text-foreground" />
            </div>
          </Card>
        </div>

        {/* Notifications */}
        <div className="px-6 pb-6">
          <h3 className="text-sm font-medium text-muted-foreground mb-4">Notifications</h3>
          <div className="space-y-3">
            {notifications.map((notification) => (
              <Card key={notification.id} className="bg-muted/20 border-muted p-4">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-muted rounded-lg flex items-center justify-center">
                    <Icon 
                      name={notification.appIcon} 
                      size={16} 
                      className="text-muted-foreground" 
                    />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-medium text-foreground">
                        {notification.appName}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {notification.time}
                      </span>
                    </div>
                    <p className="text-sm text-foreground font-medium mb-1">
                      {notification.title}
                    </p>
                    <p className="text-sm text-muted-foreground truncate">
                      {notification.message}
                    </p>
                  </div>
                  
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0 text-muted-foreground hover:text-foreground"
                    onClick={() => dismissNotification(notification.id)}
                  >
                    <Icon name="x" size={16} />
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotificationPanel;