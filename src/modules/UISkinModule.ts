
import { App, PermissionType, PermissionRequest, PermissionResponse } from './types';
import PermissionHandler from './PermissionHandler';

class UISkinModule {
  private static instance: UISkinModule;
  private permissionHandler: PermissionHandler;
  
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
   * Intercepts and processes a permission request from an app
   */
  public async requestPermission(
    app: App,
    permissionType: PermissionType
  ): Promise<PermissionResponse> {
    console.log(`UISkinModule: Intercepted permission request for ${permissionType} from app ${app.name}`);
    
    // Forward the request to the Permission Handler
    const response = await this.permissionHandler.handlePermissionRequest(app, permissionType);
    
    console.log(`UISkinModule: Processed response: ${response.granted ? 'GRANTED' : 'DENIED'} - ${response.message}`);
    
    return response;
  }
}

export default UISkinModule;
