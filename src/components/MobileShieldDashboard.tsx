import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Icon } from '@/components/Icon';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';

interface MobileShieldDashboardProps {
  onNavigate?: (screen: string) => void;
}

export function MobileShieldDashboard({ onNavigate }: MobileShieldDashboardProps) {
  const [shieldEnabled, setShieldEnabled] = useState(true);
  const [autoBlock, setAutoBlock] = useState(true);

  const protectionStats = {
    blockedToday: 47,
    dataSaved: '2.3 MB',
    appsProtected: 12,
    threatsBlocked: 5
  };

  const recentActivity = [
    { app: 'Instagram', action: 'Location blocked', time: '2 min ago', type: 'blocked' },
    { app: 'TikTok', action: 'Contacts protected', time: '15 min ago', type: 'protected' },
    { app: 'WhatsApp', action: 'Microphone allowed', time: '1 hr ago', type: 'allowed' },
    { app: 'Spotify', action: 'Storage protected', time: '2 hr ago', type: 'protected' }
  ];

  return (
    <div className="h-full bg-gradient-to-b from-background to-os-surface/30 p-4 pb-20">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-2xl bg-shield/20 border border-shield/30 flex items-center justify-center">
            <Icon name="shield" className="text-shield-accent" size={20} />
          </div>
          <div>
            <h1 className="text-xl font-medium text-foreground">Virtual Shield</h1>
            <p className="text-xs text-muted-foreground">Privacy Protection Active</p>
          </div>
        </div>
        <Button variant="ghost" size="icon" onClick={() => onNavigate?.('homescreen')}>
          <Icon name="x" size={20} />
        </Button>
      </div>

      {/* Shield Status */}
      <Card className="bg-shield/10 border-shield/30 p-4 mb-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className={`w-3 h-3 rounded-full ${shieldEnabled ? 'bg-green-400' : 'bg-red-400'}`} />
            <span className="font-medium text-foreground">
              {shieldEnabled ? 'Protection Active' : 'Protection Disabled'}
            </span>
          </div>
          <Switch checked={shieldEnabled} onCheckedChange={setShieldEnabled} />
        </div>
        
        <div className="text-xs text-muted-foreground mb-3">
          Your data is being protected with virtual substitutes
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center">
            <div className="text-lg font-light text-shield-accent">{protectionStats.blockedToday}</div>
            <div className="text-xs text-muted-foreground">Blocked Today</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-light text-shield-accent">{protectionStats.dataSaved}</div>
            <div className="text-xs text-muted-foreground">Data Saved</div>
          </div>
        </div>
      </Card>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 gap-3 mb-6">
        <Card className="bg-os-surface/70 border-border/40 p-4 text-center">
          <div className="text-xl font-light text-foreground mb-1">{protectionStats.appsProtected}</div>
          <div className="text-xs text-muted-foreground">Apps Protected</div>
        </Card>
        <Card className="bg-os-surface/70 border-border/40 p-4 text-center">
          <div className="text-xl font-light text-foreground mb-1">{protectionStats.threatsBlocked}</div>
          <div className="text-xs text-muted-foreground">Threats Blocked</div>
        </Card>
      </div>

      {/* Settings */}
      <Card className="bg-os-surface/70 border-border/40 p-4 mb-6">
        <h3 className="font-medium text-foreground mb-4">Protection Settings</h3>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm text-foreground">Auto-block suspicious apps</div>
              <div className="text-xs text-muted-foreground">Automatically deny risky permissions</div>
            </div>
            <Switch checked={autoBlock} onCheckedChange={setAutoBlock} />
          </div>
          
          <Separator />
          
          <Button variant="ghost" className="w-full justify-between p-0 h-auto">
            <div className="text-left">
              <div className="text-sm text-foreground">Manage Protected Data</div>
              <div className="text-xs text-muted-foreground">Configure virtual data profiles</div>
            </div>
            <Icon name="chevron-right" size={16} className="text-muted-foreground" />
          </Button>
          
          <Separator />
          
          <Button variant="ghost" className="w-full justify-between p-0 h-auto">
            <div className="text-left">
              <div className="text-sm text-foreground">App Permissions</div>
              <div className="text-xs text-muted-foreground">Review and edit app access</div>
            </div>
            <Icon name="chevron-right" size={16} className="text-muted-foreground" />
          </Button>
        </div>
      </Card>

      {/* Recent Activity */}
      <Card className="bg-os-surface/70 border-border/40 p-4">
        <h3 className="font-medium text-foreground mb-4">Recent Activity</h3>
        
        <div className="space-y-3">
          {recentActivity.map((activity, index) => (
            <div key={index} className="flex items-center space-x-3">
              <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${
                activity.type === 'blocked' ? 'bg-red-500/20' :
                activity.type === 'protected' ? 'bg-shield/20' :
                'bg-green-500/20'
              }`}>
                <Icon 
                  name={
                    activity.type === 'blocked' ? 'shield-x' :
                    activity.type === 'protected' ? 'shield-check' :
                    'check'
                  } 
                  size={14} 
                  className={
                    activity.type === 'blocked' ? 'text-red-400' :
                    activity.type === 'protected' ? 'text-shield-accent' :
                    'text-green-400'
                  }
                />
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="text-sm text-foreground">{activity.app}</div>
                <div className="text-xs text-muted-foreground">{activity.action}</div>
              </div>
              
              <div className="text-xs text-muted-foreground">{activity.time}</div>
            </div>
          ))}
        </div>
        
        <Button variant="ghost" size="sm" className="w-full mt-4 text-muted-foreground">
          View All Activity
        </Button>
      </Card>
    </div>
  );
}

export default MobileShieldDashboard;