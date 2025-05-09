import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Icon } from '@/components/Icon';
import { PermissionType, App } from '@/modules/types';
import { toast } from '@/components/ui/use-toast';

interface PermissionEvent {
  id: string;
  timestamp: Date;
  app: {
    name: string;
    icon: string;
  };
  permissionType: PermissionType;
  granted: boolean;
  isVirtual: boolean;
}

interface AppPermissionStats {
  appName: string;
  appIcon: string;
  permissionCounts: {
    real: number;
    virtual: number;
    denied: number;
  };
}

export function RealTimePrivacyDashboard() {
  const [events, setEvents] = useState<PermissionEvent[]>([]);
  const [stats, setStats] = useState<AppPermissionStats[]>([]);
  const [activeTab, setActiveTab] = useState<'live' | 'stats'>('live');
  const [isSimulating, setIsSimulating] = useState(false);
  
  // Apps for simulation
  const demoApps = [
    { name: "Social Media App", icon: "📱" },
    { name: "Navigation App", icon: "🗺️" },
    { name: "Fitness Tracker", icon: "🏃" },
    { name: "Messaging App", icon: "💬" },
    { name: "Shopping App", icon: "🛒" }
  ];
  
  // Permission types for simulation
  const permissionTypes: PermissionType[] = [
    "LOCATION", "CONTACTS", "CALL_LOGS", "MESSAGES", "FILE_ACCESS"
  ];
  
  // Permission type to icon mapping
  const permissionIcons: Record<PermissionType, string> = {
    "LOCATION": "map-pin",
    "CONTACTS": "users",
    "CALL_LOGS": "phone",
    "MESSAGES": "message-square",
    "FILE_ACCESS": "file"
  };

  // Start simulation on component mount
  useEffect(() => {
    startSimulation();
    
    return () => {
      setIsSimulating(false);
    };
  }, []);
  
  // Update stats whenever events change
  useEffect(() => {
    if (events.length === 0) return;
    
    const appStats: Record<string, AppPermissionStats> = {};
    
    events.forEach(event => {
      const appName = event.app.name;
      
      if (!appStats[appName]) {
        appStats[appName] = {
          appName,
          appIcon: event.app.icon,
          permissionCounts: {
            real: 0,
            virtual: 0,
            denied: 0
          }
        };
      }
      
      if (!event.granted) {
        appStats[appName].permissionCounts.denied += 1;
      } else if (event.isVirtual) {
        appStats[appName].permissionCounts.virtual += 1;
      } else {
        appStats[appName].permissionCounts.real += 1;
      }
    });
    
    setStats(Object.values(appStats));
  }, [events]);

  // Start generating simulated events
  const startSimulation = () => {
    setIsSimulating(true);
    
    const interval = setInterval(() => {
      if (!isSimulating) {
        clearInterval(interval);
        return;
      }
      
      generateRandomEvent();
    }, Math.random() * 3000 + 2000); // Random interval between 2-5 seconds
    
    return () => clearInterval(interval);
  };
  
  // Generate a random permission event
  const generateRandomEvent = () => {
    const randomApp = demoApps[Math.floor(Math.random() * demoApps.length)];
    const randomPermission = permissionTypes[Math.floor(Math.random() * permissionTypes.length)];
    const isGranted = Math.random() > 0.3; // 70% chance of being granted
    const isVirtual = isGranted && Math.random() > 0.4; // 60% of granted are virtual
    
    const newEvent: PermissionEvent = {
      id: `event-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date(),
      app: randomApp,
      permissionType: randomPermission,
      granted: isGranted,
      isVirtual: isVirtual
    };
    
    setEvents(prev => {
      const newEvents = [newEvent, ...prev];
      // Keep only the last 20 events
      return newEvents.slice(0, 20);
    });
    
    // Show toast for important events
    if (Math.random() > 0.7) {
      const toastType = !isGranted ? 'denied' : isVirtual ? 'virtual' : 'granted';
      
      if (toastType === 'denied') {
        toast({
          title: `${randomPermission} Access Denied`,
          description: `${randomApp.name} was prevented from accessing your ${randomPermission.toLowerCase()}`,
          variant: "destructive"
        });
      } else if (toastType === 'virtual') {
        toast({
          title: `Virtual Shield Active`,
          description: `${randomApp.name} received virtual ${randomPermission.toLowerCase()} data`,
        });
      }
    }
  };
  
  // Format relative time for events
  const getTimeAgo = (date: Date) => {
    const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);
    
    if (seconds < 60) return `${seconds}s ago`;
    if (seconds < 3600) return `${Math.floor(seconds/60)}m ago`;
    return `${Math.floor(seconds/3600)}h ago`;
  };
  
  // Get color for permission type
  const getPermissionColor = (permissionType: PermissionType): string => {
    switch(permissionType) {
      case "LOCATION": return "bg-blue-500";
      case "CONTACTS": return "bg-purple-500";
      case "CALL_LOGS": return "bg-green-500";
      case "MESSAGES": return "bg-yellow-500";
      case "FILE_ACCESS": return "bg-red-500";
      default: return "bg-gray-500";
    }
  };
  
  return (
    <Card className="border-shield/20 overflow-hidden">
      <CardHeader className="bg-shield/5 pb-2">
        <div className="flex justify-between items-center">
          <CardTitle className="text-lg font-semibold flex items-center">
            <div className="relative mr-2">
              <Icon name="activity" className="h-5 w-5 text-shield" />
              <motion.div
                className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full"
                animate={{ 
                  opacity: [1, 0.5, 1],
                  scale: [1, 1.2, 1]
                }}
                transition={{ 
                  duration: 2,
                  repeat: Infinity,
                  repeatType: "reverse"
                }}
              />
            </div>
            Real-Time Privacy Monitor
          </CardTitle>
          
          <div className="flex space-x-1 bg-gray-100 rounded-lg p-0.5">
            <Button 
              size="sm" 
              variant="ghost"
              className={`${activeTab === 'live' ? 'bg-white shadow-sm' : 'bg-transparent'} text-xs px-3 rounded-md`}
              onClick={() => setActiveTab('live')}
            >
              <Icon name="activity" className="h-3 w-3 mr-1" />
              Live Feed
            </Button>
            <Button 
              size="sm" 
              variant="ghost"
              className={`${activeTab === 'stats' ? 'bg-white shadow-sm' : 'bg-transparent'} text-xs px-3 rounded-md`}
              onClick={() => setActiveTab('stats')}
            >
              <Icon name="bar-chart-4" className="h-3 w-3 mr-1" />
              Statistics
            </Button>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="p-0">
        <AnimatePresence mode="wait">
          {activeTab === 'live' ? (
            <motion.div
              key="live-feed"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.2 }}
              className="max-h-96 overflow-y-auto p-4 space-y-3"
            >
              {events.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <Icon name="loader" className="h-8 w-8 mx-auto mb-2 animate-spin" />
                  <p>Monitoring app permissions...</p>
                </div>
              ) : (
                <AnimatePresence>
                  {events.map((event, index) => (
                    <motion.div
                      key={event.id}
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.2, delay: index === 0 ? 0.1 : 0 }}
                      className={`flex items-center p-3 rounded-lg border ${
                        !event.granted ? 'bg-red-50 border-red-100' : 
                        event.isVirtual ? 'bg-shield/5 border-shield/20' :
                        'bg-white border-gray-100'
                      }`}
                    >
                      <div className="flex-shrink-0 mr-3">
                        <span className="text-xl">{event.app.icon}</span>
                      </div>
                      
                      <div className="flex-grow">
                        <div className="flex justify-between items-start">
                          <span className="font-medium">{event.app.name}</span>
                          <span className="text-xs text-muted-foreground">{getTimeAgo(event.timestamp)}</span>
                        </div>
                        
                        <div className="flex items-center mt-1">
                          <div className={`h-5 w-5 rounded-full ${getPermissionColor(event.permissionType)} flex items-center justify-center mr-1`}>
                            <Icon name={permissionIcons[event.permissionType] as any} className="h-3 w-3 text-white" />
                          </div>
                          <span className="text-xs">{event.permissionType}</span>
                          
                          {!event.granted && (
                            <Badge variant="outline" className="ml-2 text-xs bg-red-50 text-red-700 border-red-200">
                              Denied
                            </Badge>
                          )}
                          
                          {event.granted && event.isVirtual && (
                            <Badge variant="outline" className="ml-2 text-xs bg-shield/10 text-shield border-shield/20">
                              Virtual
                            </Badge>
                          )}
                          
                          {event.granted && !event.isVirtual && (
                            <Badge variant="outline" className="ml-2 text-xs bg-blue-50 text-blue-700 border-blue-200">
                              Granted
                            </Badge>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              )}
            </motion.div>
          ) : (
            <motion.div
              key="stats-view"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
              className="p-4"
            >
              {stats.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <p>No statistics available yet</p>
                </div>
              ) : (
                <div className="space-y-4">
                  <h3 className="text-sm font-medium">App Permission Activity</h3>
                  
                  {stats.map((app, index) => (
                    <motion.div
                      key={app.appName}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="bg-white p-3 rounded-lg border border-gray-100"
                    >
                      <div className="flex justify-between items-center mb-2">
                        <div className="flex items-center">
                          <span className="text-xl mr-2">{app.appIcon}</span>
                          <span className="font-medium">{app.appName}</span>
                        </div>
                        <span className="text-xs bg-gray-100 px-2 py-1 rounded-full">
                          {app.permissionCounts.real + app.permissionCounts.virtual + app.permissionCounts.denied} requests
                        </span>
                      </div>
                      
                      <div className="flex space-x-2">
                        {app.permissionCounts.real > 0 && (
                          <div className="flex-1 bg-blue-50 rounded-md p-2 text-center">
                            <div className="text-lg font-bold text-blue-700">{app.permissionCounts.real}</div>
                            <div className="text-xs text-blue-600">Real Access</div>
                          </div>
                        )}
                        
                        {app.permissionCounts.virtual > 0 && (
                          <div className="flex-1 bg-shield/10 rounded-md p-2 text-center">
                            <div className="text-lg font-bold text-shield">{app.permissionCounts.virtual}</div>
                            <div className="text-xs text-shield-dark">Virtual</div>
                          </div>
                        )}
                        
                        {app.permissionCounts.denied > 0 && (
                          <div className="flex-1 bg-red-50 rounded-md p-2 text-center">
                            <div className="text-lg font-bold text-red-700">{app.permissionCounts.denied}</div>
                            <div className="text-xs text-red-600">Denied</div>
                          </div>
                        )}
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
              
              <div className="mt-4 border-t pt-4">
                <div className="flex justify-between items-center text-sm">
                  <span>Total Privacy Events:</span>
                  <span className="font-bold">{events.length}</span>
                </div>
                
                <div className="flex justify-between items-center text-sm mt-2">
                  <span>Virtualized Requests:</span>
                  <span className="font-bold text-shield">
                    {events.filter(e => e.granted && e.isVirtual).length}
                  </span>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        
        <motion.div
          className="flex items-center justify-between px-4 py-3 border-t border-gray-100 bg-gray-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <div className="flex items-center">
            <motion.div
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ 
                duration: 2,
                repeat: Infinity,
                repeatType: "reverse"
              }}
              className="h-2 w-2 bg-green-500 rounded-full mr-2"
            />
            <span className="text-xs text-muted-foreground">Live monitoring active</span>
          </div>
          
          <Button variant="ghost" size="sm" className="text-xs">
            Clear History
          </Button>
        </motion.div>
      </CardContent>
    </Card>
  );
}

export default RealTimePrivacyDashboard;
