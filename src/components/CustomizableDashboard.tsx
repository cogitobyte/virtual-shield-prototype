
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Icon } from '@/components/Icon';
import RealTimePrivacyDashboard from './RealTimePrivacyDashboard';

interface DashboardWidget {
  id: string;
  title: string;
  icon: string;
  enabled: boolean;
  component: React.ReactNode;
  description: string;
}

export function CustomizableDashboard() {
  const [availableWidgets, setAvailableWidgets] = useState<DashboardWidget[]>([
    {
      id: 'real-time',
      title: 'Real-Time Monitor',
      icon: 'activity',
      enabled: true,
      description: 'View permission access in real-time',
      component: <RealTimePrivacyDashboard />
    },
    {
      id: 'privacy-score',
      title: 'Privacy Score',
      icon: 'shield-check',
      enabled: true,
      description: 'See your overall privacy protection score',
      component: (
        <div className="p-4 space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="font-medium">Your Privacy Score</h3>
            <span className="text-2xl font-bold text-shield">87%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div className="bg-shield h-2.5 rounded-full" style={{ width: '87%' }}></div>
          </div>
          <p className="text-sm text-muted-foreground">
            Your privacy is well-protected. 2 permissions could use review.
          </p>
        </div>
      )
    },
    {
      id: 'app-access',
      title: 'App Access Logs',
      icon: 'list',
      enabled: true,
      description: 'See which apps accessed your data recently',
      component: (
        <div className="p-4 space-y-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <span className="mr-2">📱</span>
                <span className="font-medium">Social Media App</span>
              </div>
              <span className="text-xs text-muted-foreground">3 min ago</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <span className="mr-2">🔍</span>
                <span className="font-medium">Search App</span>
              </div>
              <span className="text-xs text-muted-foreground">15 min ago</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <span className="mr-2">🗺️</span>
                <span className="font-medium">Maps App</span>
              </div>
              <span className="text-xs text-muted-foreground">1 hour ago</span>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'permission-toggles',
      title: 'Quick Permission Toggles',
      icon: 'sliders-horizontal',
      enabled: true,
      description: 'Quickly toggle common permissions',
      component: (
        <div className="p-4 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Icon name="map-pin" className="mr-2 h-4 w-4 text-shield" />
              <span>Location</span>
            </div>
            <Switch id="location" />
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Icon name="camera" className="mr-2 h-4 w-4 text-shield" />
              <span>Camera</span>
            </div>
            <Switch id="camera" defaultChecked />
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Icon name="mic" className="mr-2 h-4 w-4 text-shield" />
              <span>Microphone</span>
            </div>
            <Switch id="microphone" />
          </div>
        </div>
      )
    },
    {
      id: 'usage-alerts',
      title: 'Usage Alerts',
      icon: 'bell',
      enabled: false,
      description: 'Get notifications when apps use your data',
      component: (
        <div className="p-4 space-y-4">
          <div className="text-center py-3">
            <Icon name="bell" className="mx-auto h-8 w-8 text-muted-foreground" />
            <p className="mt-2 text-sm text-muted-foreground">No recent alerts</p>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm">Alert sensitivity</span>
            <div className="flex items-center space-x-2">
              <span className="text-xs">Low</span>
              <Switch id="alert-level" defaultChecked />
              <span className="text-xs">High</span>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'shield-stats',
      title: 'Shield Stats',
      icon: 'bar-chart-4',
      enabled: false,
      description: 'View Virtual Shield protection statistics',
      component: (
        <div className="p-4 space-y-4">
          <div className="grid grid-cols-2 gap-2 text-center">
            <div className="bg-shield/10 p-3 rounded-lg">
              <div className="text-2xl font-bold text-shield-dark">24</div>
              <div className="text-xs text-muted-foreground">Requests Blocked</div>
            </div>
            <div className="bg-shield/10 p-3 rounded-lg">
              <div className="text-2xl font-bold text-shield-dark">18</div>
              <div className="text-xs text-muted-foreground">Data Protected</div>
            </div>
            <div className="bg-shield/10 p-3 rounded-lg">
              <div className="text-2xl font-bold text-shield-dark">5</div>
              <div className="text-xs text-muted-foreground">Apps Managed</div>
            </div>
            <div className="bg-shield/10 p-3 rounded-lg">
              <div className="text-2xl font-bold text-shield-dark">3</div>
              <div className="text-xs text-muted-foreground">Days Active</div>
            </div>
          </div>
        </div>
      )
    }
  ]);

  const [activeWidgets, setActiveWidgets] = useState<string[]>(
    availableWidgets.filter(w => w.enabled).map(w => w.id)
  );
  
  const [isDragging, setIsDragging] = useState(false);
  const [draggedWidget, setDraggedWidget] = useState<string | null>(null);
  const [isCustomizing, setIsCustomizing] = useState(false);

  const handleDragStart = (widgetId: string) => {
    setIsDragging(true);
    setDraggedWidget(widgetId);
  };

  const handleDragEnd = () => {
    setIsDragging(false);
    setDraggedWidget(null);
  };

  const handleDrop = (targetWidgetId: string) => {
    if (!draggedWidget || draggedWidget === targetWidgetId) return;
    
    const newActiveWidgets = [...activeWidgets];
    const draggedIndex = newActiveWidgets.indexOf(draggedWidget);
    const targetIndex = newActiveWidgets.indexOf(targetWidgetId);
    
    newActiveWidgets.splice(draggedIndex, 1);
    newActiveWidgets.splice(targetIndex, 0, draggedWidget);
    
    setActiveWidgets(newActiveWidgets);
  };
  
  const toggleWidget = (widgetId: string, enabled: boolean) => {
    const updatedWidgets = [...availableWidgets].map(widget => 
      widget.id === widgetId ? { ...widget, enabled } : widget
    );
    
    setAvailableWidgets(updatedWidgets);
    
    if (enabled) {
      setActiveWidgets(prev => [...prev, widgetId]);
    } else {
      setActiveWidgets(prev => prev.filter(id => id !== widgetId));
    }
  };

  return (
    <div className="space-y-6 py-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Privacy Dashboard</h3>
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={() => setIsCustomizing(!isCustomizing)}
          className="group"
        >
          <motion.div
            animate={isCustomizing ? { rotate: 180 } : { rotate: 0 }}
            transition={{ duration: 0.3 }}
            className="inline-flex items-center"
          >
            <Icon name="settings" className="h-4 w-4 mr-2 group-hover:animate-spin" />
            {isCustomizing ? 'Done' : 'Customize'}
          </motion.div>
        </Button>
      </div>
      
      {isCustomizing ? (
        <Card className="p-4">
          <h4 className="font-medium mb-4">Customize Dashboard</h4>
          <div className="space-y-4">
            {availableWidgets.map(widget => (
              <div key={widget.id} className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="h-8 w-8 rounded-md bg-shield/20 flex items-center justify-center mr-3">
                    <Icon name={widget.icon as any} className="h-4 w-4 text-shield-dark" />
                  </div>
                  <div>
                    <p className="font-medium text-sm">{widget.title}</p>
                    <p className="text-xs text-muted-foreground">{widget.description}</p>
                  </div>
                </div>
                <Switch 
                  id={`widget-toggle-${widget.id}`}
                  checked={widget.enabled}
                  onCheckedChange={(checked) => toggleWidget(widget.id, checked)}
                />
              </div>
            ))}
          </div>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {activeWidgets.map(widgetId => {
            const widget = availableWidgets.find(w => w.id === widgetId);
            if (!widget) return null;
            
            return (
              <motion.div
                key={widget.id}
                layoutId={widget.id}
                draggable={true}
                onDragStart={() => handleDragStart(widget.id)}
                onDragOver={(e) => e.preventDefault()}
                onDrop={() => handleDrop(widget.id)}
                onDragEnd={handleDragEnd}
                whileDrag={{ scale: 1.05, zIndex: 10, boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)" }}
                className={`cursor-grab active:cursor-grabbing ${isDragging && draggedWidget === widget.id ? 'opacity-50' : ''} ${widget.id === 'real-time' ? 'md:col-span-2' : ''}`}
              >
                <Card className="overflow-hidden">
                  {widget.id !== 'real-time' && (
                    <div className="bg-shield/10 p-3 flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="h-6 w-6 rounded-md bg-shield/20 flex items-center justify-center mr-2">
                          <Icon name={widget.icon as any} className="h-3 w-3 text-shield-dark" />
                        </div>
                        <h4 className="font-medium text-sm">{widget.title}</h4>
                      </div>
                      <div className="flex items-center gap-1">
                        <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                          <Icon name="more-horizontal" className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  )}
                  {widget.component}
                </Card>
              </motion.div>
            );
          })}
        </div>
      )}
      
      {activeWidgets.length === 0 && !isCustomizing && (
        <div className="text-center py-8 border border-dashed border-gray-300 rounded-lg">
          <Icon name="layout-dashboard" className="h-10 w-10 text-gray-400 mx-auto mb-3" />
          <h3 className="font-medium text-lg">No widgets enabled</h3>
          <p className="text-muted-foreground mb-4">Click Customize to add privacy widgets to your dashboard</p>
          <Button onClick={() => setIsCustomizing(true)}>Customize Dashboard</Button>
        </div>
      )}
    </div>
  );
}

export default CustomizableDashboard;
