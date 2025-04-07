
import { useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { LogEntry } from '@/modules/types';
import PermissionHandler from '@/modules/PermissionHandler';
import { formatDistanceToNow } from 'date-fns';
import { Icon } from '@/components/Icon';

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
                    <div className="w-10 h-10 rounded-full flex items-center justify-center bg-shield-dark mr-3">
                      <Icon 
                        name={log.status === 'GRANTED' ? 'check' : 'x'} 
                        className={`h-5 w-5 ${log.status === 'GRANTED' ? 'text-green-400' : 'text-destructive'}`} 
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
                          variant={log.status === 'GRANTED' ? 'outline' : 'destructive'}
                          className={log.status === 'GRANTED' ? 'border-green-500 text-green-400' : ''}
                        >
                          {log.status}
                        </Badge>
                        <span className="ml-2 text-muted-foreground">
                          {log.permissionType.replace('_', ' ')}
                        </span>
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
