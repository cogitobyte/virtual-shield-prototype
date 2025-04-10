
import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Icon } from '@/components/Icon';
import { DataFlowPath, PermissionType } from '@/modules/types';

interface DataFlowVisualizationProps {
  dataPaths?: DataFlowPath[];
  permissionType: PermissionType | null;
}

export function DataFlowVisualization({ dataPaths, permissionType }: DataFlowVisualizationProps) {
  const [paths, setPaths] = useState<DataFlowPath[]>([]);
  const [animationState, setAnimationState] = useState<Record<number, boolean>>({});
  
  useEffect(() => {
    if (dataPaths && dataPaths.length > 0) {
      setPaths(dataPaths);
      
      // Set up animations
      const animationStates: Record<number, boolean> = {};
      dataPaths.forEach((_, index) => {
        animationStates[index] = false;
      });
      
      // Start sequential animations
      let delay = 0;
      dataPaths.forEach((_, index) => {
        setTimeout(() => {
          setAnimationState(prev => ({ ...prev, [index]: true }));
        }, delay);
        delay += 700; // Stagger animations
      });
    } else {
      setPaths([]);
    }
  }, [dataPaths]);
  
  if (!permissionType || paths.length === 0) {
    return null;
  }
  
  const permissionName = {
    'CALL_LOGS': 'Call Logs',
    'MESSAGES': 'Messages',
    'FILE_ACCESS': 'File Access',
    'CONTACTS': 'Contacts',
    'LOCATION': 'Location'
  }[permissionType];
  
  return (
    <Card className="border border-shield-dark/20">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-semibold flex items-center">
          <Icon name="git-branch" className="h-4 w-4 mr-2 text-shield-light" />
          Data Flow Visualization
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="text-xs text-muted-foreground mb-2">
          Showing how {permissionName} data flows through the system
        </div>
        
        <div className="relative py-2">
          {paths.map((path, index) => (
            <div 
              key={index} 
              className={`flex items-center mb-4 transition-opacity duration-500 ease-in-out ${
                animationState[index] ? 'opacity-100' : 'opacity-0'
              }`}
            >
              <div className="flex flex-col items-center w-24 z-10">
                <div className="w-16 h-16 rounded-full border-2 border-shield-dark/40 bg-shield-dark/20 flex items-center justify-center">
                  <Icon 
                    name={path.source === 'Device' ? 'smartphone' : path.source === 'Virtual Shield' ? 'shield' : 'app-window'} 
                    className="h-8 w-8 text-shield-light"
                  />
                </div>
                <div className="text-xs font-medium mt-1">{path.source}</div>
              </div>
              
              <div className={`flex-1 relative ${animationState[index] ? 'data-flow-line' : ''}`}>
                <div className="absolute inset-0 flex items-center justify-center">
                  <Badge 
                    variant="outline" 
                    className={`text-xs ${path.isVirtual ? 'bg-green-500/10 text-green-400 border-green-500/30' : 'bg-orange-500/10 text-orange-400 border-orange-500/30'}`}
                  >
                    {path.isVirtual ? 'Virtual Data' : 'Data Request'}
                  </Badge>
                </div>
                
                {animationState[index] && (
                  <div className="data-packet-flow">
                    <div className="data-packet"></div>
                    <div className="data-packet"></div>
                    <div className="data-packet"></div>
                  </div>
                )}
              </div>
              
              <div className="flex flex-col items-center w-24 z-10">
                <div className="w-16 h-16 rounded-full border-2 border-shield-dark/40 bg-shield-dark/20 flex items-center justify-center">
                  <Icon 
                    name={path.destination === 'Device' ? 'smartphone' : path.destination === 'Virtual Shield' ? 'shield' : 'app-window'} 
                    className="h-8 w-8 text-shield-light"
                  />
                </div>
                <div className="text-xs font-medium mt-1">{path.destination}</div>
              </div>
            </div>
          ))}
        </div>
        
        {/* Legend */}
        <div className="flex justify-center space-x-4 text-xs pt-2">
          <div className="flex items-center">
            <div className="w-3 h-3 rounded-full bg-orange-400 mr-1"></div>
            <span>Real Data Request</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 rounded-full bg-green-400 mr-1"></div>
            <span>Virtualized Data</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default DataFlowVisualization;
