import React, { useState } from 'react';
import { Icon } from './Icon';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { Card } from '@/components/ui/card';
import { OSScreen } from './PhoneOS';

interface SettingsScreenProps {
  onNavigate: (screen: OSScreen) => void;
}

interface SettingItem {
  id: string;
  name: string;
  icon: string;
  description?: string;
  type: 'navigation' | 'toggle' | 'info';
  value?: boolean;
  action?: () => void;
}

interface SettingsSection {
  title: string;
  items: SettingItem[];
}

export function SettingsScreen({ onNavigate }: SettingsScreenProps) {
  const [settings, setSettings] = useState({
    vdcEnabled: true,
    vdcRealTimeProtection: true,
    vdcFloatingIcon: true,
    vdcNotifications: true,
    autoRotate: false,
    darkMode: true,
    hapticFeedback: true,
    locationServices: false,
    bluetooth: true,
    wifi: true
  });

  const updateSetting = (key: string, value: boolean) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const settingsSections: SettingsSection[] = [
    {
      title: "Virtual Data Creator (VDC)",
      items: [
        {
          id: 'vdc-dashboard',
          name: 'Virtual Shield Dashboard',
          icon: 'shield',
          description: 'Manage privacy protection settings',
          type: 'navigation',
          action: () => onNavigate('dashboard')
        },
        {
          id: 'vdc-enabled',
          name: 'Enable Virtual Shield',
          icon: 'shieldCheck',
          description: 'Protect your data with virtual responses',
          type: 'toggle',
          value: settings.vdcEnabled,
          action: () => updateSetting('vdcEnabled', !settings.vdcEnabled)
        },
        {
          id: 'vdc-realtime',
          name: 'Real-time Protection',
          icon: 'zap',
          description: 'Monitor and protect permissions in real-time',
          type: 'toggle',
          value: settings.vdcRealTimeProtection,
          action: () => updateSetting('vdcRealTimeProtection', !settings.vdcRealTimeProtection)
        },
        {
          id: 'vdc-floating',
          name: 'Floating Shield Icon',
          icon: 'eye',
          description: 'Show protection status overlay',
          type: 'toggle',
          value: settings.vdcFloatingIcon,
          action: () => updateSetting('vdcFloatingIcon', !settings.vdcFloatingIcon)
        },
        {
          id: 'vdc-notifications',
          name: 'Privacy Notifications',
          icon: 'bell',
          description: 'Get notified of protection activities',
          type: 'toggle',
          value: settings.vdcNotifications,
          action: () => updateSetting('vdcNotifications', !settings.vdcNotifications)
        }
      ]
    },
    {
      title: "Network & Connectivity",
      items: [
        {
          id: 'wifi',
          name: 'Wi-Fi',
          icon: 'wifi',
          description: 'Connected to Network',
          type: 'toggle',
          value: settings.wifi,
          action: () => updateSetting('wifi', !settings.wifi)
        },
        {
          id: 'bluetooth',
          name: 'Bluetooth',
          icon: 'bluetooth',
          description: 'Discoverable to nearby devices',
          type: 'toggle',
          value: settings.bluetooth,
          action: () => updateSetting('bluetooth', !settings.bluetooth)
        },
        {
          id: 'location',
          name: 'Location Services',
          icon: 'mapPin',
          description: 'Allow apps to access location',
          type: 'toggle',
          value: settings.locationServices,
          action: () => updateSetting('locationServices', !settings.locationServices)
        }
      ]
    },
    {
      title: "Interface",
      items: [
        {
          id: 'dark-mode',
          name: 'Dark Mode',
          icon: 'moon',
          description: 'Use dark theme throughout OS',
          type: 'toggle',
          value: settings.darkMode,
          action: () => updateSetting('darkMode', !settings.darkMode)
        },
        {
          id: 'auto-rotate',
          name: 'Auto-rotate Screen',
          icon: 'rotateClockwise',
          description: 'Rotate screen based on orientation',
          type: 'toggle',
          value: settings.autoRotate,
          action: () => updateSetting('autoRotate', !settings.autoRotate)
        },
        {
          id: 'haptic',
          name: 'Haptic Feedback',
          icon: 'vibrate',
          description: 'Feel vibrations for interactions',
          type: 'toggle',
          value: settings.hapticFeedback,
          action: () => updateSetting('hapticFeedback', !settings.hapticFeedback)
        }
      ]
    },
    {
      title: "Device Info",
      items: [
        {
          id: 'battery',
          name: 'Battery',
          icon: 'battery',
          description: '85% • 4h 12m remaining',
          type: 'info'
        },
        {
          id: 'storage',
          name: 'Storage',
          icon: 'harddrive',
          description: '128 GB • 45 GB available',
          type: 'info'
        },
        {
          id: 'about',
          name: 'About Device',
          icon: 'info',
          description: 'OS version, model, and more',
          type: 'navigation'
        }
      ]
    }
  ];

  const renderSettingItem = (item: SettingItem) => {
    return (
      <Button
        key={item.id}
        variant="ghost"
        className="w-full h-auto p-4 justify-start hover:bg-os-surface-elevated"
        onClick={item.action}
      >
        <div className="flex items-center space-x-4 w-full">
          <div className="w-8 h-8 rounded-lg bg-os-surface flex items-center justify-center border border-border/20">
            <Icon 
              name={item.icon} 
              className={`h-4 w-4 ${item.id.startsWith('vdc') ? 'text-shield-accent' : 'text-muted-foreground'}`} 
            />
          </div>
          
          <div className="flex-1 text-left">
            <p className="font-medium text-foreground">{item.name}</p>
            {item.description && (
              <p className="text-sm text-muted-foreground">{item.description}</p>
            )}
          </div>
          
          <div className="flex items-center space-x-2">
            {item.type === 'toggle' && (
              <Switch 
                checked={item.value} 
                onCheckedChange={() => item.action?.()} 
                className="data-[state=checked]:bg-accent"
              />
            )}
            {item.type === 'navigation' && (
              <Icon name="chevronRight" className="h-4 w-4 text-muted-foreground" />
            )}
          </div>
        </div>
      </Button>
    );
  };

  return (
    <div className="h-full bg-background">
      {/* Header */}
      <div className="px-4 py-6 border-b border-border">
        <h1 className="text-2xl font-bold text-foreground">Settings</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Manage your device and privacy settings
        </p>
      </div>

      {/* Settings Content */}
      <ScrollArea className="h-[calc(100%-100px)]">
        <div className="p-4 space-y-6">
          {settingsSections.map((section, index) => (
            <Card key={section.title} className="bg-os-surface border-border">
              <div className="p-4">
                <h2 className={`text-lg font-semibold mb-4 ${
                  section.title.includes('VDC') ? 'text-shield-accent' : 'text-foreground'
                }`}>
                  {section.title}
                </h2>
                
                <div className="space-y-1">
                  {section.items.map((item, itemIndex) => (
                    <div key={item.id}>
                      {renderSettingItem(item)}
                      {itemIndex < section.items.length - 1 && (
                        <Separator className="my-1 bg-border/50" />
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </Card>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}

export default SettingsScreen;