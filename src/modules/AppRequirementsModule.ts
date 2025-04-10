
import { App, PermissionType } from './types';

// Define app categories and their required permissions
export interface AppCategory {
  name: string;
  requiredPermissions: PermissionType[];
  optionalPermissions: PermissionType[];
  description: string;
}

// Comprehensive mapping of app categories to their permission requirements
export const APP_CATEGORIES: Record<string, AppCategory> = {
  'navigation': {
    name: 'Navigation',
    requiredPermissions: ['LOCATION'],
    optionalPermissions: ['CONTACTS', 'FILE_ACCESS'],
    description: 'Maps, GPS, and location-based services'
  },
  'photography': {
    name: 'Photography',
    requiredPermissions: ['FILE_ACCESS'],
    optionalPermissions: ['LOCATION'],
    description: 'Camera apps, photo editors, and image galleries'
  },
  'communication': {
    name: 'Communication',
    requiredPermissions: ['CONTACTS'],
    optionalPermissions: ['CALL_LOGS', 'MESSAGES', 'LOCATION'],
    description: 'Messaging, calling, and video conferencing apps'
  },
  'social': {
    name: 'Social',
    requiredPermissions: ['CONTACTS'],
    optionalPermissions: ['LOCATION', 'FILE_ACCESS', 'MESSAGES'],
    description: 'Social media and networking platforms'
  },
  'productivity': {
    name: 'Productivity',
    requiredPermissions: ['FILE_ACCESS'],
    optionalPermissions: ['CONTACTS'],
    description: 'Document editors, note-taking, and office applications'
  },
  'gaming': {
    name: 'Gaming',
    requiredPermissions: [],
    optionalPermissions: ['LOCATION', 'CONTACTS'],
    description: 'Games and interactive entertainment'
  },
  'utility': {
    name: 'Utility',
    requiredPermissions: [],
    optionalPermissions: ['FILE_ACCESS'],
    description: 'Tools, calculators, and system utilities'
  },
  'health': {
    name: 'Health & Fitness',
    requiredPermissions: [],
    optionalPermissions: ['LOCATION'],
    description: 'Health monitoring, fitness tracking, and wellness apps'
  },
  'finance': {
    name: 'Finance',
    requiredPermissions: [],
    optionalPermissions: ['CONTACTS'],
    description: 'Banking, payment, and financial management apps'
  },
  'education': {
    name: 'Education',
    requiredPermissions: [],
    optionalPermissions: ['FILE_ACCESS'],
    description: 'Learning platforms, educational content, and study aids'
  },
  'shopping': {
    name: 'Shopping',
    requiredPermissions: [],
    optionalPermissions: ['LOCATION', 'CONTACTS'],
    description: 'E-commerce and retail applications'
  },
  'travel': {
    name: 'Travel',
    requiredPermissions: [],
    optionalPermissions: ['LOCATION', 'CONTACTS'],
    description: 'Travel booking, itinerary planning, and tourism apps'
  }
};

// App name and ID keywords to help identify app categories
const CATEGORY_KEYWORDS: Record<string, string[]> = {
  'navigation': ['map', 'navigator', 'gps', 'location', 'direction', 'route', 'navigation'],
  'photography': ['photo', 'camera', 'image', 'editor', 'gallery', 'filter', 'pic'],
  'communication': ['call', 'message', 'chat', 'dialer', 'phone', 'contact', 'sms', 'email', 'mail'],
  'social': ['social', 'connect', 'friend', 'follow', 'share', 'post', 'network'],
  'productivity': ['doc', 'note', 'office', 'productivity', 'sheet', 'slide', 'work', 'task', 'calendar'],
  'gaming': ['game', 'play', 'arcade', 'puzzle', 'strategy', 'sport', 'racing'],
  'utility': ['tool', 'utility', 'scan', 'convert', 'calculator', 'browser', 'search'],
  'health': ['health', 'fitness', 'workout', 'exercise', 'diet', 'medical', 'track'],
  'finance': ['bank', 'finance', 'money', 'payment', 'wallet', 'budget', 'invest'],
  'education': ['learn', 'edu', 'study', 'course', 'school', 'teach', 'training'],
  'shopping': ['shop', 'store', 'buy', 'cart', 'purchase', 'order', 'retail'],
  'travel': ['travel', 'trip', 'flight', 'hotel', 'booking', 'vacation', 'tour']
};

class AppRequirementsModule {
  private static instance: AppRequirementsModule;
  
  private constructor() {}
  
  public static getInstance(): AppRequirementsModule {
    if (!AppRequirementsModule.instance) {
      AppRequirementsModule.instance = new AppRequirementsModule();
    }
    return AppRequirementsModule.instance;
  }
  
  /**
   * Analyzes an app and determines its likely category
   */
  public categorizeApp(app: App): string {
    // Normalize app name and ID for keyword matching
    const appText = (app.name + ' ' + app.id).toLowerCase();
    
    // Score each category based on keyword matches
    const scores: Record<string, number> = {};
    
    Object.entries(CATEGORY_KEYWORDS).forEach(([category, keywords]) => {
      scores[category] = 0;
      
      keywords.forEach(keyword => {
        if (appText.includes(keyword.toLowerCase())) {
          scores[category] += 1;
        }
      });
    });
    
    // Find the category with the highest score
    let bestCategory = 'utility'; // Default category
    let highestScore = 0;
    
    Object.entries(scores).forEach(([category, score]) => {
      if (score > highestScore) {
        highestScore = score;
        bestCategory = category;
      }
    });
    
    return bestCategory;
  }
  
  /**
   * Determines if a permission is required for the app to function
   */
  public isPermissionRequired(app: App, permissionType: PermissionType): boolean {
    const category = this.categorizeApp(app);
    const appCategory = APP_CATEGORIES[category];
    
    return appCategory.requiredPermissions.includes(permissionType);
  }
  
  /**
   * Determines if a permission is optional but reasonable for the app
   */
  public isPermissionOptional(app: App, permissionType: PermissionType): boolean {
    const category = this.categorizeApp(app);
    const appCategory = APP_CATEGORIES[category];
    
    return appCategory.optionalPermissions.includes(permissionType);
  }
  
  /**
   * Determines if a permission is suspicious for this app
   */
  public isPermissionSuspicious(app: App, permissionType: PermissionType): boolean {
    return !this.isPermissionRequired(app, permissionType) && 
           !this.isPermissionOptional(app, permissionType);
  }
  
  /**
   * Gets the app's category data
   */
  public getAppCategory(app: App): AppCategory {
    const categoryKey = this.categorizeApp(app);
    return APP_CATEGORIES[categoryKey];
  }
  
  /**
   * Generates a contextual warning message for a permission request
   */
  public generateWarningMessage(app: App, permissionType: PermissionType): string {
    const appCategory = this.getAppCategory(app);
    
    if (this.isPermissionRequired(app, permissionType)) {
      // This shouldn't happen as required permissions shouldn't trigger warnings
      return `This ${appCategory.name.toLowerCase()} app requires this permission to function properly.`;
    }
    
    if (this.isPermissionOptional(app, permissionType)) {
      return `This ${appCategory.name.toLowerCase()} app may use this permission for additional features, but it's not strictly required.`;
    }
    
    // Custom messages for suspicious permission requests
    switch (permissionType) {
      case 'LOCATION':
        return `This ${appCategory.name.toLowerCase()} app doesn't typically need location data to function properly. Sharing your location may allow the app to track your movements.`;
      case 'CONTACTS':
        return `This ${appCategory.name.toLowerCase()} app doesn't normally require access to your contacts. Granting this permission could expose your personal network.`;
      case 'FILE_ACCESS':
        return `This ${appCategory.name.toLowerCase()} app doesn't typically need access to your files. Granting this permission could allow access to your personal documents and media.`;
      case 'CALL_LOGS':
        return `This ${appCategory.name.toLowerCase()} app doesn't usually need your call history. Granting this permission could expose your communication patterns.`;
      case 'MESSAGES':
        return `This ${appCategory.name.toLowerCase()} app doesn't typically need access to your messages. Granting this permission could compromise private conversations.`;
      default:
        return `This permission request is unusual for this type of app. Granting it could potentially expose your data.`;
    }
  }
}

export default AppRequirementsModule;
