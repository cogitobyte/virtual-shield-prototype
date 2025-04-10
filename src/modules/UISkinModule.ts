import { App, PermissionType, PermissionRequest, PermissionResponse } from './types';
import PermissionHandler from './PermissionHandler';
import VirtualRAM from './VirtualRAM';
import AppRequirementsModule from './AppRequirementsModule';

class UISkinModule {
  private static instance: UISkinModule;
  private permissionHandler: PermissionHandler;
  private virtualRAM: VirtualRAM;
  private appRequirements: AppRequirementsModule;
  private pendingConfirmations: Map<string, { 
    resolve: (value: boolean) => void,
    app: App,
    permissionType: PermissionType
  }> = new Map();
  
  private constructor() {
    this.permissionHandler = PermissionHandler.getInstance();
    this.virtualRAM = VirtualRAM.getInstance();
    this.appRequirements = AppRequirementsModule.getInstance();
  }
  
  public static getInstance(): UISkinModule {
    if (!UISkinModule.instance) {
      UISkinModule.instance = new UISkinModule();
    }
    return UISkinModule.instance;
  }
  
  /**
   * Checks if a permission is suspicious for an app based on its category
   */
  private isPermissionSuspicious(app: App, permissionType: PermissionType): boolean {
    return this.appRequirements.isPermissionSuspicious(app, permissionType);
  }
  
  /**
   * Generates a contextual warning message for a permission request
   */
  private generateWarningMessage(app: App, permissionType: PermissionType): string {
    return this.appRequirements.generateWarningMessage(app, permissionType);
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
    const appCategory = this.appRequirements.getAppCategory(app);
    console.log(`UISkinModule: App categorized as ${appCategory.name}`);
    
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
    } else {
      console.log(`UISkinModule: Permission ${permissionType} is ${this.appRequirements.isPermissionRequired(app, permissionType) ? 'required' : 'optional'} for this app type.`);
    }
    
    // Forward the request to the Permission Handler
    const response = await this.permissionHandler.handlePermissionRequest(app, permissionType);
    
    console.log(`UISkinModule: Processed response: ${response.granted ? 'GRANTED' : 'DENIED'} - ${response.message}`);
    
    return response;
  }
}

export default UISkinModule;
