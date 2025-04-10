
import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { PermissionResponse, RiskLevel } from '@/modules/types';
import { Icon } from '@/components/Icon';
import { formatDistanceToNow } from 'date-fns';

interface PermissionResultProps {
  result: PermissionResponse | null;
  permissionType: string | null;
}

export function PermissionResult({ result, permissionType }: PermissionResultProps) {
  const [isProcessing, setIsProcessing] = useState(false);
  
  useEffect(() => {
    if (result) {
      setIsProcessing(true);
      const timer = setTimeout(() => {
        setIsProcessing(false);
      }, 1000);
      
      return () => clearTimeout(timer);
    }
  }, [result]);
  
  // Risk level colors and labels
  const getRiskInfo = (level?: RiskLevel) => {
    switch (level) {
      case 'LOW':
        return { color: 'bg-green-400/20 text-green-400 border-green-400/30', label: 'Low Risk' };
      case 'MEDIUM':
        return { color: 'bg-amber-400/20 text-amber-400 border-amber-400/30', label: 'Medium Risk' };
      case 'HIGH':
        return { color: 'bg-orange-400/20 text-orange-400 border-orange-400/30', label: 'High Risk' };
      case 'CRITICAL':
        return { color: 'bg-red-400/20 text-red-400 border-red-400/30', label: 'Critical Risk' };
      default:
        return { color: 'bg-slate-400/20 text-slate-400 border-slate-400/30', label: 'Unknown Risk' };
    }
  };
  
  if (!result) {
    return (
      <Card className="border border-shield-dark/20 min-h-[300px] flex items-center justify-center">
        <CardContent className="text-center text-muted-foreground">
          <div className="flex flex-col items-center justify-center">
            <Icon name="shield" className="h-16 w-16 mb-4 text-shield-light/40" />
            <p>No permission requests made yet</p>
            <p className="text-sm">Select an app and permission to request</p>
          </div>
        </CardContent>
      </Card>
    );
  }
  
  // Get risk info
  const riskInfo = result.riskLevel ? getRiskInfo(result.riskLevel) : null;
  
  return (
    <Card className="border border-shield-dark/20">
      <CardContent className="pt-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">Permission Response</h3>
          <div className="text-xs text-muted-foreground">
            {result.timestamp && formatDistanceToNow(new Date(result.timestamp), { addSuffix: true })}
          </div>
        </div>
        
        <div className="flex items-center justify-between mb-3">
          <Alert 
            className={`flex-1 mb-0 ${result.granted 
              ? 'border-green-500/20 bg-green-500/10 text-green-400' 
              : 'border-destructive/20 bg-destructive/10 text-destructive'}`}
          >
            <Icon name={result.granted ? "check-circle" : "x-circle"} className="h-4 w-4" />
            <AlertTitle className="ml-2">
              {result.granted ? 'Permission Granted' : 'Permission Denied'}
            </AlertTitle>
            <AlertDescription className="ml-6 text-sm">
              {result.message}
            </AlertDescription>
          </Alert>
          
          {riskInfo && result.riskScore !== undefined && (
            <Badge 
              variant="outline" 
              className={`ml-3 py-2 px-3 ${riskInfo.color}`}
            >
              <div className="flex flex-col items-center">
                <span className="text-lg font-bold">{result.riskScore}</span>
                <span className="text-xs">{riskInfo.label}</span>
              </div>
            </Badge>
          )}
        </div>
        
        {result.granted && result.data && (
          <div className={`transition-opacity duration-500 ${isProcessing ? 'opacity-50' : 'opacity-100'}`}>
            <div className="flex items-center mb-2">
              <div 
                className={`h-2 w-2 rounded-full ${isProcessing ? 'bg-green-400 animate-pulse-opacity' : 'bg-green-400'}`}
              />
              <h4 className="font-medium ml-2">Generated Virtual Data</h4>
            </div>
            
            <div className={`relative border border-shield-dark/20 rounded-md ${isProcessing ? 'process-animation' : ''}`}>
              <ScrollArea className="h-[240px] rounded-md">
                <div className="p-3 text-sm">
                  {Array.isArray(result.data) ? (
                    result.data.map((item, index) => (
                      <div key={item.id || index} className="mb-3">
                        <div className="font-mono bg-shield-dark/30 p-2 rounded-md overflow-x-auto">
                          <pre className="text-xs">{JSON.stringify(item, null, 2)}</pre>
                        </div>
                        {index < result.data.length - 1 && <Separator className="my-3" />}
                      </div>
                    ))
                  ) : (
                    <div className="font-mono bg-shield-dark/30 p-2 rounded-md overflow-x-auto">
                      <pre className="text-xs">{JSON.stringify(result.data, null, 2)}</pre>
                    </div>
                  )}
                </div>
              </ScrollArea>
              
              {isProcessing && (
                Array.from({ length: 5 }).map((_, i) => (
                  <div 
                    key={i}
                    className="data-packet"
                    style={{
                      left: `${Math.random() * 100}%`,
                      top: `${Math.random() * 100}%`,
                      animationDelay: `${Math.random() * 1}s`,
                      animationDuration: `${1 + Math.random() * 1.5}s`
                    }}
                  />
                ))
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export default PermissionResult;
