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
    <Card className="bg-os-surface/60 border-border/30 p-4 h-full flex items-center justify-center backdrop-blur-sm">
      <div className="relative w-28 h-28">
        <svg className="w-full h-full" viewBox="0 0 120 120">
          {/* Clock face */}
          <circle
            cx="60"
            cy="60"
            r="56"
            fill="transparent"
            stroke="hsl(var(--border))"
            strokeWidth="1"
          />
          
          {/* Hour markers */}
          {[...Array(12)].map((_, i) => (
            <line
              key={i}
              x1="60"
              y1="8"
              x2="60"
              y2="16"
              stroke="hsl(var(--muted-foreground))"
              strokeWidth={i % 3 === 0 ? "2" : "1"}
              transform={`rotate(${i * 30} 60 60)`}
            />
          ))}
          
          {/* Hour hand */}
          <line
            x1="60"
            y1="60"
            x2="60"
            y2="38"
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
            y2="22"
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
            y2="18"
            stroke="hsl(var(--muted-foreground))"
            strokeWidth="1"
            strokeLinecap="round"
            transform={`rotate(${secondAngle} 60 60)`}
          />
          
          {/* Center dot */}
          <circle
            cx="60"
            cy="60"
            r="2"
            fill="hsl(var(--foreground))"
          />
        </svg>
        
        <div className="absolute -bottom-5 left-1/2 transform -translate-x-1/2 text-xs text-muted-foreground font-mono">
          {time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </div>
      </div>
    </Card>
  );
};

const WeatherWidget = () => {
  const [weather] = useState({
    temperature: 72,
    condition: 'Clear',
    humidity: 65,
    windSpeed: 8
  });

  return (
    <Card className="bg-os-surface/60 border-border/30 p-4 h-full backdrop-blur-sm">
      <div className="flex flex-col h-full justify-between">
        <div className="flex items-center justify-between mb-3">
          <Icon name="sun" className="text-muted-foreground" size={20} />
          <span className="text-xs text-muted-foreground">Weather</span>
        </div>
        
        <div className="text-center">
          <div className="text-2xl font-light text-foreground mb-1">
            {weather.temperature}°
          </div>
          <div className="text-xs text-muted-foreground mb-3">
            {weather.condition}
          </div>
        </div>
        
        <div className="space-y-1 text-xs text-muted-foreground">
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
    { name: 'flashlight', label: 'Light' },
    { name: 'settings', label: 'Settings' },
    { name: 'airplane', label: 'Flight' },
    { name: 'shield', label: 'Shield' }
  ];

  return (
    <Card className="bg-os-surface/60 border-border/30 p-4 h-full backdrop-blur-sm">
      <div className="mb-3">
        <span className="text-xs text-muted-foreground">Quick Toggles</span>
      </div>
      
      <div className="grid grid-cols-2 gap-2">
        {actions.map((action) => (
          <Button
            key={action.name}
            variant="ghost"
            size="sm"
            className="h-8 w-full p-0 hover:bg-os-surface-elevated border border-border/20 rounded-lg"
          >
            <Icon 
              name={action.name} 
              size={14} 
              className={`${action.name === 'shield' ? 'text-shield-accent' : 'text-muted-foreground'}`} 
            />
          </Button>
        ))}
      </div>
      
      <div className="grid grid-cols-2 gap-1 mt-1 text-[10px] text-muted-foreground">
        {actions.map((action) => (
          <div key={`${action.name}-label`} className="text-center truncate">
            {action.label}
          </div>
        ))}
      </div>
    </Card>
  );
};

interface HomescreenProps {
  onNavigate?: (screen: string) => void;
}

export const Homescreen = ({ onNavigate }: HomescreenProps = {}) => {
  const currentTime = new Date().toLocaleTimeString([], { 
    hour: '2-digit', 
    minute: '2-digit',
    hour12: true 
  });
  
  const currentDate = new Date().toLocaleDateString([], { 
    weekday: 'long',
    month: 'long', 
    day: 'numeric' 
  });

  return (
    <div className="h-full bg-gradient-to-br from-background via-background to-os-surface p-6">
      {/* Welcome Header */}
      <div className="mb-8 text-center">
        <div className="text-4xl font-light text-foreground mb-1 font-mono">
          {currentTime}
        </div>
        <div className="text-sm text-muted-foreground">
          {currentDate}
        </div>
      </div>
      
      {/* Widget Panels */}
      <ResizablePanelGroup direction="horizontal" className="h-80 rounded-2xl border border-border bg-os-surface/30 backdrop-blur-sm">
        <ResizablePanel defaultSize={35} minSize={25}>
          <div className="h-full p-3">
            <AnalogClock />
          </div>
        </ResizablePanel>
        
        <ResizableHandle withHandle className="w-1 bg-border hover:bg-border/80" />
        
        <ResizablePanel defaultSize={35} minSize={25}>
          <div className="h-full p-3">
            <WeatherWidget />
          </div>
        </ResizablePanel>
        
        <ResizableHandle withHandle className="w-1 bg-border hover:bg-border/80" />
        
        <ResizablePanel defaultSize={30} minSize={25}>
          <div className="h-full p-3">
            <QuickActions />
          </div>
        </ResizablePanel>
      </ResizablePanelGroup>
      
      {/* Quick Access Apps */}
      <div className="mt-8 mb-6">
        <div className="flex justify-center space-x-6">
          {[
            { name: 'shield', label: 'Shield', action: () => onNavigate?.('dashboard') },
            { name: 'phone', label: 'Phone' },
            { name: 'messageSquare', label: 'Messages' },
            { name: 'camera', label: 'Camera' }
          ].map((app) => (
            <button
              key={app.name}
              onClick={app.action}
              className="flex flex-col items-center space-y-2 p-3 rounded-2xl hover:bg-os-surface-elevated transition-colors group"
            >
              <div className="w-14 h-14 rounded-2xl bg-os-surface border border-border flex items-center justify-center group-hover:scale-105 transition-transform">
                <Icon 
                  name={app.name} 
                  className={`h-7 w-7 ${app.name === 'shield' ? 'text-shield-accent' : 'text-muted-foreground'}`} 
                />
              </div>
              <span className="text-xs text-muted-foreground font-medium">
                {app.label}
              </span>
            </button>
          ))}
        </div>
      </div>
      
      <div className="text-xs text-muted-foreground text-center">
        Drag widget handles to resize • Swipe up for apps
      </div>
    </div>
  );
};

export default Homescreen;