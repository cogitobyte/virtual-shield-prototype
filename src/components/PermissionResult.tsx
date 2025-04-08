
import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { PermissionResponse } from '@/modules/types';
import { Icon } from '@/components/Icon';
import { formatDistanceToNow } from 'date-fns';

interface PermissionResultProps {
  result: PermissionResponse | null;
  permissionType: string | null;
}

export function PermissionResult({ result, permissionType }: PermissionResultProps) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [autoScroll, setAutoScroll] = useState(true);
  
  useEffect(() => {
    if (result) {
      setIsProcessing(true);
      const timer = setTimeout(() => {
        setIsProcessing(false);
      }, 1000);
      
      return () => clearTimeout(timer);
    }
  }, [result]);
  
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
  
  return (
    <Card className="border border-shield-dark/20">
      <CardContent className="pt-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">Permission Response</h3>
          <div className="text-xs text-muted-foreground">
            {result.timestamp && formatDistanceToNow(new Date(result.timestamp), { addSuffix: true })}
          </div>
        </div>
        
        <Alert 
          className={`mb-4 ${result.granted 
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
        
        {result.granted && result.data && (
          <div className={`transition-opacity duration-500 ${isProcessing ? 'opacity-50' : 'opacity-100'}`}>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <div 
                  className={`h-2 w-2 rounded-full ${isProcessing ? 'bg-green-400 animate-pulse-opacity' : 'bg-green-400'}`}
                />
                <h4 className="font-medium">Generated Virtual Data</h4>
              </div>
              <Button 
                variant="outline" 
                size="sm" 
                className="text-xs flex items-center gap-1 bg-shield-light/10 hover:bg-shield-light/20 border-shield-light/30"
                onClick={() => setAutoScroll(!autoScroll)}
              >
                <Icon name={autoScroll ? "mouse-pointer-click" : "mouse"} className="h-3 w-3" />
                {autoScroll ? "Auto-Scroll: On" : "Auto-Scroll: Off"}
              </Button>
            </div>
            
            <div className={`relative border border-shield-dark/20 rounded-md ${isProcessing ? 'process-animation' : ''}`}>
              <div className="bg-shield-dark/10 px-3 py-2 rounded-t-md flex justify-between items-center border-b border-shield-dark/20">
                <span className="text-xs font-medium text-shield-light">Scroll Controls</span>
                <Button 
                  variant="ghost" 
                  size="sm"
                  className="h-6 text-xs text-shield-light hover:text-shield-accent flex items-center gap-1"
                  onClick={() => {
                    const scrollContainer = document.querySelector('.scroll-content');
                    if (scrollContainer) {
                      scrollContainer.scrollTo({ top: 0, behavior: 'smooth' });
                    }
                  }}
                >
                  <Icon name="chevrons-up" className="h-3 w-3" />
                  Scroll to top
                </Button>
              </div>
            
              <ScrollArea className={`h-[240px] rounded-b-md ${autoScroll ? 'overflow-auto' : ''}`}>
                <div className="p-3 text-sm scroll-content">
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
              
              <div className="bg-shield-dark/10 px-3 py-2 rounded-b-md flex justify-between items-center border-t border-shield-dark/20">
                <span className="text-xs text-shield-light/70">Use scroll controls to navigate data</span>
                <Button 
                  variant="ghost" 
                  size="sm"
                  className="h-6 text-xs text-shield-light hover:text-shield-accent flex items-center gap-1"
                  onClick={() => {
                    const scrollContainer = document.querySelector('.scroll-content');
                    if (scrollContainer) {
                      scrollContainer.scrollTo({ top: scrollContainer.scrollHeight, behavior: 'smooth' });
                    }
                  }}
                >
                  <Icon name="chevrons-down" className="h-3 w-3" />
                  Scroll to bottom
                </Button>
              </div>
              
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
