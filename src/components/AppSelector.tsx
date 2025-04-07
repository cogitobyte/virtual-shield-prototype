
import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { MOCK_APPS } from '@/modules/MockData';
import { App } from '@/modules/types';
import { Icon } from '@/components/Icon';

interface AppSelectorProps {
  selectedApp: App | null;
  onSelectApp: (app: App) => void;
}

export function AppSelector({ selectedApp, onSelectApp }: AppSelectorProps) {
  return (
    <Card className="border border-shield-dark/20">
      <CardContent className="pt-6">
        <h3 className="text-lg font-semibold mb-4">Select Application</h3>
        <RadioGroup className="grid grid-cols-1 gap-3">
          {MOCK_APPS.map((app) => (
            <div key={app.id} className="flex items-center">
              <RadioGroupItem 
                value={app.id} 
                id={`app-${app.id}`}
                checked={selectedApp?.id === app.id}
                onClick={() => onSelectApp(app)}
              />
              <Label 
                htmlFor={`app-${app.id}`}
                className="flex items-center flex-1 cursor-pointer p-2 rounded-md hover:bg-shield-accent/10"
              >
                <div className="h-10 w-10 rounded-full bg-shield flex items-center justify-center">
                  <Icon name={app.icon} className="h-5 w-5 text-white" />
                </div>
                <div className="ml-3 flex-1">
                  <span className="font-medium">{app.name}</span>
                  <Badge 
                    variant={app.trusted ? "outline" : "destructive"}
                    className={`ml-2 ${app.trusted ? 'border-shield text-shield' : ''}`}
                  >
                    {app.trusted ? 'Trusted' : 'Untrusted'}
                  </Badge>
                </div>
              </Label>
            </div>
          ))}
        </RadioGroup>
      </CardContent>
    </Card>
  );
}

export default AppSelector;
