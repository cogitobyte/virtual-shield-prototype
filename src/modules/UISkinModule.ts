import { App, PermissionType, PermissionRequest, PermissionResponse } from './types';
import PermissionHandler from './PermissionHandler';
import VirtualRAM from './VirtualRAM';

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
  private virtualRAM: VirtualRAM;
  private pendingConfirmations: Map<string, { 
    resolve: (value: boolean) => void,
    app: App,
    permissionType: PermissionType
  }> = new Map();
  
  private constructor() {
    this.permissionHandler = PermissionHandler.getInstance();
    this.virtualRAM = VirtualRAM.getInstance();
  }
  
  public static getInstance(): UISkinModule {
    if (!UISkinModule.instance) {
      UISkinModule.instance = new UISkinModule();
    }
    return UISkinModule.instance;
  }
  
  /**
   * Determines the app category based on its ID and name
   */
  private getAppCategory(app: App): string {
    if (app.id.includes('map') || app.name.toLowerCase().includes('map') || 
        app.name.toLowerCase().includes('navigator') || app.name.toLowerCase().includes('gps')) {
      return 'navigation';
    } else if (app.id.includes('photo') || app.name.toLowerCase().includes('photo') || 
               app.name.toLowerCase().includes('camera') || app.name.toLowerCase().includes('image') ||
               app.name.toLowerCase().includes('editor')) {
      return 'photography';
    } else if (app.id.includes('call') || app.id.includes('message') || 
               app.name.toLowerCase().includes('call') || app.name.toLowerCase().includes('message') ||
               app.name.toLowerCase().includes('chat') || app.name.toLowerCase().includes('dialer')) {
      return 'communication';
    } else if (app.id.includes('social') || app.name.toLowerCase().includes('social') ||
              app.name.toLowerCase().includes('connect')) {
      return 'social';
    } else if (app.id.includes('game') || app.name.toLowerCase().includes('game') ||
              app.name.toLowerCase().includes('play')) {
      return 'gaming';
    } else if (app.id.includes('doc') || app.id.includes('note') || 
              app.name.toLowerCase().includes('doc') || app.name.toLowerCase().includes('note') ||
              app.name.toLowerCase().includes('office') || app.name.toLowerCase().includes('productivity')) {
      return 'productivity';
    } else {
      return 'utility';
    }
  }
  
  /**
   * Checks if a permission is necessary for an app based on its category
   */
  private isPermissionSuspicious(app: App, permissionType: PermissionType): boolean {
    // Get the category of the app
    const appCategory = this.getAppCategory(app);
    
    // Check if the requested permission is in the list of expected permissions for this app category
    const expectedPermissions = APP_PERMISSION_MAP[appCategory] || [];
    return !expectedPermissions.includes(permissionType);
  }
  
  /**
   * Generates a contextual warning message for a permission request
   */
  private generateWarningMessage(app: App, permissionType: PermissionType): string {
    // Get the app category
    const appCategory = this.getAppCategory(app);
    
    // Generate context-appropriate warning message
    if (permissionType === 'LOCATION' && appCategory !== 'navigation') {
      return `This ${appCategory} app doesn't typically need location data to function properly. Sharing your location may allow the app to track your movements.`;
    } else if (permissionType === 'CONTACTS' && !['social', 'communication', 'productivity'].includes(appCategory)) {
      return `This ${appCategory} app doesn't normally require access to your contacts. Granting this permission could expose your personal network.`;
    } else if (permissionType === 'FILE_ACCESS' && !['photography', 'productivity'].includes(appCategory)) {
      return `This ${appCategory} app doesn't typically need access to your files. Granting this permission could allow access to your personal documents and media.`;
    } else if (permissionType === 'CALL_LOGS' && appCategory !== 'communication') {
      return `This ${appCategory} app doesn't usually need your call history. Granting this permission could expose your communication patterns.`;
    } else if (permissionType === 'MESSAGES' && !['social', 'communication'].includes(appCategory)) {
      return `This ${appCategory} app doesn't typically need access to your messages. Granting this permission could compromise private conversations.`;
    }
    
    // Default warning
    return `This permission request is unusual for this type of app. Granting it could potentially expose your data.`;
  }
  
  /**
   * Creates a confirmation request that can be handled by the UI
   */
  public createConfirmationRequest(app: App, permissionType: PermissionType): Promise<boolean> {
    return new Promise((resolve) => {
      const requestId = `confirm-${Date.now()}`;
      this.pendingConfirmations.set(requestId, { resolve, app, permissionType });
      
      // Generate contextual warning message
      const warningMessage = this.generateWarningMessage(app, permissionType);
      
      // This will be picked up by an event listener in the UI
      const event = new CustomEvent('permission-confirmation-required', { 
        detail: { requestId, app, permissionType, warningMessage } 
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
   * Generate dummy data for denied permissions
   */
  private generateDummyResponseData(app: App, permissionType: PermissionType): PermissionResponse {
    // Generate fake data using VirtualRAM
    const dummyData = this.virtualRAM.generateData(permissionType, 3);
    
    // Create a response with simulated data
    const response: PermissionResponse = {
      requestId: `dummy-${Date.now()}`,
      timestamp: new Date(),
      granted: true, // We pretend it was granted
      data: dummyData,
      message: "Permission granted with simulated data. Your privacy is protected."
    };
    
    // Log the simulated data to the activity log
    this.permissionHandler.logSimulatedDataAccess(app, permissionType, dummyData);
    
    return response;
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
        // User denied the suspicious request, but we'll provide dummy data
        console.log(`UISkinModule: User denied permission. Generating dummy data.`);
        return this.generateDummyResponseData(app, permissionType);
      }
    }
    
    // Forward the request to the Permission Handler
    const response = await this.permissionHandler.handlePermissionRequest(app, permissionType);
    
    console.log(`UISkinModule: Processed response: ${response.granted ? 'GRANTED' : 'DENIED'} - ${response.message}`);
    
    return response;
  }
}

export default UISkinModule;
