
import { 
  PermissionType, 
  App, 
  PermissionRequest, 
  PermissionResponse, 
  LogEntry 
} from './types';
import VirtualRAM from './VirtualRAM';
import AIModule from './AIModule';

class PermissionHandler {
  private static instance: PermissionHandler;
  private virtualRAM: VirtualRAM;
  private aiModule: AIModule;
  private logs: LogEntry[] = [];
  private requests: PermissionRequest[] = [];
  private listeners: Map<string, (logs: LogEntry[]) => void> = new Map();
  
  private constructor() {
    this.virtualRAM = VirtualRAM.getInstance();
    this.aiModule = AIModule.getInstance();
  }
  
  public static getInstance(): PermissionHandler {
    if (!PermissionHandler.instance) {
      PermissionHandler.instance = new PermissionHandler();
    }
    return PermissionHandler.instance;
  }
  
  /**
   * Processes a permission request from an app
   */
  public async handlePermissionRequest(
    app: App, 
    permissionType: PermissionType
  ): Promise<PermissionResponse> {
    const requestId = this.generateId();
    const timestamp = new Date();
    
    // Create the request object
    const request: PermissionRequest = {
      id: requestId,
      timestamp,
      appId: app.id,
      permissionType,
      status: 'PENDING'
    };
    
    // Store the request for later analysis
    this.requests.push(request);
    
    // Validate the request with the AI Module
    const validation = this.aiModule.validateRequest(app, permissionType);
    
    let response: PermissionResponse;
    
    if (validation.valid) {
      // Request is valid, generate data
      const data = this.virtualRAM.getData(permissionType);
      
      // Update request status
      request.status = 'GRANTED';
      
      // Create response
      response = {
        requestId,
        timestamp: new Date(),
        granted: true,
        data,
        message: validation.reason
      };
      
      // Log the granted permission
      this.logPermission({
        id: this.generateId(),
        timestamp: new Date(),
        requestId,
        appId: app.id,
        appName: app.name,
        permissionType,
        status: 'GRANTED',
        data,
        message: validation.reason
      });
    } else {
      // Request is invalid
      request.status = 'DENIED';
      
      // Create response
      response = {
        requestId,
        timestamp: new Date(),
        granted: false,
        data: null,
        message: validation.reason
      };
      
      // Log the denied permission
      this.logPermission({
        id: this.generateId(),
        timestamp: new Date(),
        requestId,
        appId: app.id,
        appName: app.name,
        permissionType,
        status: 'DENIED',
        data: null,
        message: validation.reason
      });
    }
    
    // Analyze the sequence of requests to detect potential misuse
    // This is just a simulated delay for realism
    await new Promise(resolve => setTimeout(resolve, 200));
    
    return response;
  }
  
  /**
   * Logs a permission request/response
   */
  private logPermission(log: LogEntry): void {
    this.logs.unshift(log); // Add to beginning for newest first
    
    // Keep log size manageable (keep last 100 entries)
    if (this.logs.length > 100) {
      this.logs = this.logs.slice(0, 100);
    }
    
    // Notify all listeners
    this.notifyLogListeners();
  }
  
  /**
   * Log simulated data access when permission is denied but dummy data is provided
   */
  public logSimulatedDataAccess(app: App, permissionType: PermissionType, simulatedData: any): void {
    const logEntry: LogEntry = {
      id: this.generateId(),
      timestamp: new Date(),
      requestId: `simulated-${Date.now()}`,
      appId: app.id,
      appName: app.name,
      permissionType,
      status: 'SIMULATED', // Now this is a valid status in our types
      data: simulatedData,
      message: "Permission denied by user, but simulated data provided to maintain app functionality."
    };
    
    this.logPermission(logEntry);
  }
  
  /**
   * Generates a unique ID
   */
  private generateId(): string {
    return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
  }
  
  /**
   * Gets all permission logs
   */
  public getLogs(): LogEntry[] {
    return [...this.logs];
  }
  
  /**
   * Registers a listener for log updates
   */
  public addLogListener(id: string, callback: (logs: LogEntry[]) => void): void {
    this.listeners.set(id, callback);
  }
  
  /**
   * Removes a log listener
   */
  public removeLogListener(id: string): void {
    this.listeners.delete(id);
  }
  
  /**
   * Notifies all log listeners of updates
   */
  private notifyLogListeners(): void {
    const logs = this.getLogs();
    this.listeners.forEach(callback => {
      callback(logs);
    });
  }
}

export default PermissionHandler;
