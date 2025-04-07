
import { PermissionType, App, PermissionRequest } from './types';

class AIModule {
  private static instance: AIModule;
  private requestCounts: Map<string, Map<PermissionType, { count: number, lastRequest: Date }>> = new Map();
  private suspiciousThreshold = 5; // Number of requests within timeframe to consider suspicious
  private timeframe = 60000; // 1 minute in milliseconds
  
  private constructor() {}
  
  public static getInstance(): AIModule {
    if (!AIModule.instance) {
      AIModule.instance = new AIModule();
    }
    return AIModule.instance;
  }
  
  /**
   * Validates if a permission request is legitimate based on app trust and request patterns
   */
  public validateRequest(app: App, permissionType: PermissionType): 
    { valid: boolean; reason: string } {
    
    // Step 1: Check if app is trusted
    if (!app.trusted) {
      return {
        valid: false,
        reason: `App '${app.name}' is not trusted to access ${permissionType.replace('_', ' ').toLowerCase()}`
      };
    }
    
    // Step 2: Check for suspicious request patterns
    const isSuspicious = this.detectSuspiciousPattern(app.id, permissionType);
    if (isSuspicious.suspicious) {
      return {
        valid: false,
        reason: isSuspicious.reason
      };
    }
    
    // Step 3: Update request count for monitoring
    this.recordRequest(app.id, permissionType);
    
    return {
      valid: true,
      reason: `Request for ${permissionType.replace('_', ' ').toLowerCase()} by '${app.name}' validated`
    };
  }
  
  /**
   * Records a permission request for frequency monitoring
   */
  private recordRequest(appId: string, permissionType: PermissionType): void {
    const now = new Date();
    
    // Get or create app request tracking
    if (!this.requestCounts.has(appId)) {
      this.requestCounts.set(appId, new Map());
    }
    
    const appRequests = this.requestCounts.get(appId)!;
    
    // Get or create permission type tracking
    if (!appRequests.has(permissionType)) {
      appRequests.set(permissionType, { count: 0, lastRequest: now });
    }
    
    const permissionData = appRequests.get(permissionType)!;
    
    // Reset count if outside timeframe
    if (now.getTime() - permissionData.lastRequest.getTime() > this.timeframe) {
      permissionData.count = 0;
    }
    
    // Increment count and update last request time
    permissionData.count += 1;
    permissionData.lastRequest = now;
  }
  
  /**
   * Detects if there's a suspicious pattern in permission requests
   */
  private detectSuspiciousPattern(appId: string, permissionType: PermissionType): 
    { suspicious: boolean; reason: string } {
    
    const now = new Date();
    
    // No previous requests found
    if (!this.requestCounts.has(appId) || !this.requestCounts.get(appId)!.has(permissionType)) {
      return { suspicious: false, reason: '' };
    }
    
    const permissionData = this.requestCounts.get(appId)!.get(permissionType)!;
    
    // Check if within timeframe
    if (now.getTime() - permissionData.lastRequest.getTime() <= this.timeframe) {
      // Check if count exceeds threshold
      if (permissionData.count >= this.suspiciousThreshold) {
        return {
          suspicious: true,
          reason: `Suspicious pattern detected: Too many ${permissionType.replace('_', ' ').toLowerCase()} requests in a short period`
        };
      }
    }
    
    return { suspicious: false, reason: '' };
  }
  
  /**
   * Analyzes a sequence of requests to detect potential data harvesting or misuse
   */
  public analyzeRequestSequence(requests: PermissionRequest[], appId: string): 
    { suspicious: boolean; reason: string } {
    
    // Filter requests for the specific app
    const appRequests = requests.filter(req => req.appId === appId);
    
    // Not enough data to analyze
    if (appRequests.length < 3) {
      return { suspicious: false, reason: '' };
    }
    
    // Check if app is requesting multiple sensitive permissions in quick succession
    const sensitivePermissions: PermissionType[] = ['CALL_LOGS', 'MESSAGES', 'CONTACTS', 'LOCATION'];
    const recentRequests = appRequests
      .filter(req => sensitivePermissions.includes(req.permissionType))
      .filter(req => {
        const now = new Date();
        return now.getTime() - req.timestamp.getTime() <= 5 * 60 * 1000; // 5 minutes
      });
    
    // If app requested 3 or more sensitive permissions in quick succession
    if (new Set(recentRequests.map(req => req.permissionType)).size >= 3) {
      return {
        suspicious: true,
        reason: 'App is requesting multiple sensitive permissions in quick succession'
      };
    }
    
    return { suspicious: false, reason: '' };
  }
}

export default AIModule;
