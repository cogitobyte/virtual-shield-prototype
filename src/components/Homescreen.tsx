import React, { useState } from 'react';
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from '@/components/ui/resizable';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Icon } from '@/components/Icon';

const AnalogClock = () => {
  const [time, setTime] = useState(new Date());

  React.useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const hours = time.getHours() % 12;
  const minutes = time.getMinutes();
  const seconds = time.getSeconds();

  const hourAngle = (hours * 30) + (minutes * 0.5);
  const minuteAngle = minutes * 6;
  const secondAngle = seconds * 6;

  return (
    <Card className="bg-muted/20 border-muted p-6 h-full flex items-center justify-center">
      <div className="relative w-32 h-32">
        <svg className="w-full h-full" viewBox="0 0 120 120">
          {/* Clock face */}
          <circle
            cx="60"
            cy="60"
            r="58"
            fill="transparent"
            stroke="hsl(var(--muted-foreground))"
            strokeWidth="2"
          />
          
          {/* Hour markers */}
          {[...Array(12)].map((_, i) => (
            <line
              key={i}
              x1="60"
              y1="10"
              x2="60"
              y2="20"
              stroke="hsl(var(--muted-foreground))"
              strokeWidth="2"
              transform={`rotate(${i * 30} 60 60)`}
            />
          ))}
          
          {/* Hour hand */}
          <line
            x1="60"
            y1="60"
            x2="60"
            y2="35"
            stroke="hsl(var(--foreground))"
            strokeWidth="3"
            strokeLinecap="round"
            transform={`rotate(${hourAngle} 60 60)`}
          />
          
          {/* Minute hand */}
          <line
            x1="60"
            y1="60"
            x2="60"
            y2="20"
            stroke="hsl(var(--foreground))"
            strokeWidth="2"
            strokeLinecap="round"
            transform={`rotate(${minuteAngle} 60 60)`}
          />
          
          {/* Second hand */}
          <line
            x1="60"
            y1="60"
            x2="60"
            y2="15"
            stroke="hsl(var(--muted-foreground))"
            strokeWidth="1"
            strokeLinecap="round"
            transform={`rotate(${secondAngle} 60 60)`}
          />
          
          {/* Center dot */}
          <circle
            cx="60"
            cy="60"
            r="3"
            fill="hsl(var(--foreground))"
          />
        </svg>
        
        <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 text-sm text-muted-foreground font-mono">
          {time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </div>
      </div>
    </Card>
  );
};

const WeatherWidget = () => {
  const [weather] = useState({
    temperature: 72,
    condition: 'Partly Cloudy',
    humidity: 65,
    windSpeed: 8
  });

  return (
    <Card className="bg-muted/20 border-muted p-6 h-full">
      <div className="flex flex-col h-full justify-between">
        <div className="flex items-center justify-between mb-4">
          <Icon name="cloud" className="text-muted-foreground" size={24} />
          <span className="text-sm text-muted-foreground">Weather</span>
        </div>
        
        <div className="text-center">
          <div className="text-3xl font-bold text-foreground mb-2">
            {weather.temperature}°
          </div>
          <div className="text-sm text-muted-foreground mb-4">
            {weather.condition}
          </div>
        </div>
        
        <div className="space-y-2 text-xs text-muted-foreground">
          <div className="flex justify-between">
            <span>Humidity</span>
            <span>{weather.humidity}%</span>
          </div>
          <div className="flex justify-between">
            <span>Wind</span>
            <span>{weather.windSpeed} mph</span>
          </div>
        </div>
      </div>
    </Card>
  );
};

const QuickActions = () => {
  const actions = [
    { name: 'wifi', label: 'WiFi' },
    { name: 'bluetooth', label: 'Bluetooth' },
    { name: 'battery', label: 'Battery' },
    { name: 'settings', label: 'Settings' },
    { name: 'camera', label: 'Camera' },
    { name: 'phone', label: 'Phone' }
  ];

  return (
    <Card className="bg-muted/20 border-muted p-6 h-full">
      <div className="mb-4">
        <span className="text-sm text-muted-foreground">Quick Actions</span>
      </div>
      
      <div className="grid grid-cols-3 gap-4">
        {actions.map((action) => (
          <Button
            key={action.name}
            variant="ghost"
            size="sm"
            className="h-12 w-12 p-0 hover:bg-muted/40 border border-muted-foreground/20"
          >
            <Icon name={action.name} size={20} className="text-muted-foreground" />
          </Button>
        ))}
      </div>
      
      <div className="grid grid-cols-3 gap-1 mt-2 text-xs text-muted-foreground">
        {actions.map((action) => (
          <div key={`${action.name}-label`} className="text-center truncate">
            {action.label}
          </div>
        ))}
      </div>
    </Card>
  );
};

export const Homescreen = () => {
  return (
    <div className="h-full bg-background p-4">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-foreground mb-2">Home</h1>
        <p className="text-sm text-muted-foreground">Customize your widgets</p>
      </div>
      
      <ResizablePanelGroup direction="horizontal" className="h-96 rounded-lg border border-muted">
        <ResizablePanel defaultSize={35} minSize={25}>
          <div className="h-full p-2">
            <AnalogClock />
          </div>
        </ResizablePanel>
        
        <ResizableHandle withHandle />
        
        <ResizablePanel defaultSize={35} minSize={25}>
          <div className="h-full p-2">
            <WeatherWidget />
          </div>
        </ResizablePanel>
        
        <ResizableHandle withHandle />
        
        <ResizablePanel defaultSize={30} minSize={25}>
          <div className="h-full p-2">
            <QuickActions />
          </div>
        </ResizablePanel>
      </ResizablePanelGroup>
      
      <div className="mt-4 text-xs text-muted-foreground text-center">
        Drag the handles to resize widgets
      </div>
    </div>
  );
};

export default Homescreen;