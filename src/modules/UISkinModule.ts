
import { App, PermissionType, PermissionRequest, PermissionResponse } from './types';
import PermissionHandler from './PermissionHandler';

// Define app categories and their required permissions
const APP_PERMISSION_MAP: Record<string, PermissionType[]> = {
  'social': ['CONTACTS', 'MESSAGES'],
  'communication': ['CONTACTS', 'MESSAGES', 'CALL_LOGS'],
  'navigation': ['LOCATION'],
  'photography': ['FILE_ACCESS'],
  'productivity': ['FILE_ACCESS', 'CONTACTS'],
  'gaming': [],
  'utility': []
};

class UISkinModule {
  private static instance: UISkinModule;
  private permissionHandler: PermissionHandler;
  private pendingConfirmations: Map<string, { 
    resolve: (value: boolean) => void,
    app: App,
    permissionType: PermissionType
  }> = new Map();
  
  private constructor() {
    this.permissionHandler = PermissionHandler.getInstance();
  }
  
  public static getInstance(): UISkinModule {
    if (!UISkinModule.instance) {
      UISkinModule.instance = new UISkinModule();
    }
    return UISkinModule.instance;
  }
  
  /**
   * Checks if a permission is necessary for an app based on its category
   */
  private isPermissionSuspicious(app: App, permissionType: PermissionType): boolean {
    // Get the category of the app (simplified for demo)
    const appCategory = app.id.includes('photo') ? 'photography' : 
                        app.id.includes('map') ? 'navigation' :
                        app.id.includes('call') || app.id.includes('message') ? 'communication' :
                        app.id.includes('social') ? 'social' :
                        app.id.includes('game') ? 'gaming' :
                        app.id.includes('doc') || app.id.includes('note') ? 'productivity' : 
                        'utility';
    
    // Check if the requested permission is in the list of expected permissions for this app category
    const expectedPermissions = APP_PERMISSION_MAP[appCategory] || [];
    return !expectedPermissions.includes(permissionType);
  }
  
  /**
   * Creates a confirmation request that can be handled by the UI
   */
  public createConfirmationRequest(app: App, permissionType: PermissionType): Promise<boolean> {
    return new Promise((resolve) => {
      const requestId = `confirm-${Date.now()}`;
      this.pendingConfirmations.set(requestId, { resolve, app, permissionType });
      
      // This will be picked up by an event listener in the UI
      const event = new CustomEvent('permission-confirmation-required', { 
        detail: { requestId, app, permissionType } 
      });
      window.dispatchEvent(event);
      
      // Auto-deny after 20 seconds if no user input
      setTimeout(() => {
        if (this.pendingConfirmations.has(requestId)) {
          this.respondToConfirmation(requestId, false);
        }
      }, 20000);
    });
  }
  
  /**
   * Resolves a pending confirmation
   */
  public respondToConfirmation(requestId: string, approved: boolean): void {
    const pendingConfirmation = this.pendingConfirmations.get(requestId);
    if (pendingConfirmation) {
      pendingConfirmation.resolve(approved);
      this.pendingConfirmations.delete(requestId);
    }
  }
  
  /**
   * Get all pending confirmation requests
   */
  public getPendingConfirmations(): Map<string, { app: App, permissionType: PermissionType }> {
    const result = new Map<string, { app: App, permissionType: PermissionType }>();
    
    this.pendingConfirmations.forEach((value, key) => {
      result.set(key, { app: value.app, permissionType: value.permissionType });
    });
    
    return result;
  }
  
  /**
   * Intercepts and processes a permission request from an app
   */
  public async requestPermission(
    app: App,
    permissionType: PermissionType
  ): Promise<PermissionResponse> {
    console.log(`UISkinModule: Intercepted permission request for ${permissionType} from app ${app.name}`);
    
    // Check if this permission is suspicious for this type of app
    const isSuspicious = this.isPermissionSuspicious(app, permissionType);
    
    if (isSuspicious) {
      console.log(`UISkinModule: Suspicious permission request detected! Asking for user confirmation.`);
      
      // Ask for user confirmation
      const userApproved = await this.createConfirmationRequest(app, permissionType);
      
      if (!userApproved) {
        // User denied the suspicious request
        return {
          requestId: `denied-${Date.now()}`,
          timestamp: new Date(),
          granted: false,
          data: null,
          message: "Permission denied by user due to suspicious request pattern."
        };
      }
    }
    
    // Forward the request to the Permission Handler
    const response = await this.permissionHandler.handlePermissionRequest(app, permissionType);
    
    console.log(`UISkinModule: Processed response: ${response.granted ? 'GRANTED' : 'DENIED'} - ${response.message}`);
    
    return response;
  }
}

export default UISkinModule;
