
import { useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { LogEntry } from '@/modules/types';
import PermissionHandler from '@/modules/PermissionHandler';
import { formatDistanceToNow } from 'date-fns';
import { Icon } from '@/components/Icon';
import { 
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from '@/components/ui/button';

export function PermissionLog() {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  
  useEffect(() => {
    const permissionHandler = PermissionHandler.getInstance();
    
    // Load initial logs
    setLogs(permissionHandler.getLogs());
    
    // Register for log updates
    const listenerId = 'log-component';
    permissionHandler.addLogListener(listenerId, (updatedLogs) => {
      setLogs(updatedLogs);
    });
    
    // Cleanup
    return () => {
      permissionHandler.removeLogListener(listenerId);
    };
  }, []);
  
  return (
    <Card className="border border-shield-dark/20">
      <CardContent className="pt-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">Permission Activity Log</h3>
          <Badge variant="outline" className="border-shield-accent text-shield-accent">
            <Icon name="activity" className="h-3 w-3 mr-1" />
            {logs.length} Events
          </Badge>
        </div>
        
        <ScrollArea className="h-[400px] rounded-md">
          {logs.length === 0 ? (
            <div className="text-center py-10">
              <div className="flex flex-col items-center">
                <Icon name="clipboard-list" className="h-12 w-12 text-shield-light/40 mb-2" />
                <div className="text-muted-foreground">No permission requests logged yet</div>
              </div>
            </div>
          ) : (
            <div className="space-y-4 px-1">
              {logs.map((log, index) => (
                <div key={log.id} className="text-sm">
                  <div className="flex items-start">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center bg-shield-dark mr-3 ${
                      log.status === 'SIMULATED' ? 'bg-shield-accent/20' : ''
                    }`}>
                      <Icon 
                        name={
                          log.status === 'GRANTED' ? 'check' : 
                          log.status === 'SIMULATED' ? 'shield' : 'x'
                        } 
                        className={`h-5 w-5 ${
                          log.status === 'GRANTED' ? 'text-green-400' : 
                          log.status === 'SIMULATED' ? 'text-shield-accent' : 'text-destructive'
                        }`} 
                      />
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <div className="font-medium">{log.appName}</div>
                        <div className="text-xs text-muted-foreground">
                          {formatDistanceToNow(new Date(log.timestamp), { addSuffix: true })}
                        </div>
                      </div>
                      
                      <div className="flex items-center mt-1">
                        <Badge 
                          variant={
                            log.status === 'GRANTED' ? 'outline' : 
                            log.status === 'SIMULATED' ? 'secondary' : 'destructive'
                          }
                          className={
                            log.status === 'GRANTED' ? 'border-green-500 text-green-400' : 
                            log.status === 'SIMULATED' ? 'bg-shield-accent/20 text-shield-accent border-shield-accent/30' : ''
                          }
                        >
                          {log.status}
                        </Badge>
                        <span className="ml-2 text-muted-foreground">
                          {log.permissionType.replace('_', ' ')}
                        </span>
                        
                        {log.status === 'SIMULATED' && log.data && (
                          <Popover>
                            <PopoverTrigger asChild>
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                className="ml-2 h-6 p-1 text-shield-accent"
                              >
                                <Icon name="eye" className="h-3.5 w-3.5" />
                                <span className="ml-1 text-xs">View Simulated Data</span>
                              </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-80 bg-shield-dark text-shield-light border-shield-accent/30">
                              <div className="space-y-2">
                                <h4 className="font-semibold text-shield-accent flex items-center">
                                  <Icon name="shield" className="h-4 w-4 mr-1" />
                                  Simulated Data
                                </h4>
                                <p className="text-xs text-shield-light/70 mb-2">
                                  This data was generated to protect your privacy while allowing the app to function.
                                </p>
                                <div className="max-h-[200px] overflow-y-auto rounded border border-shield-accent/20 bg-black/30 p-2">
                                  <pre className="text-xs">{JSON.stringify(log.data, null, 2)}</pre>
                                </div>
                              </div>
                            </PopoverContent>
                          </Popover>
                        )}
                      </div>
                      
                      <div className="mt-1 text-xs text-muted-foreground">
                        {log.message}
                      </div>
                    </div>
                  </div>
                  
                  {index < logs.length - 1 && <Separator className="my-4" />}
                </div>
              ))}
            </div>
          )}
        </ScrollArea>
      </CardContent>
    </Card>
  );
}

export default PermissionLog;
