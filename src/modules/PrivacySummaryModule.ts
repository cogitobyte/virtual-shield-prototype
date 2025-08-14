
import { LogEntry, PermissionType, PrivacySummary } from './types';

/**
 * Generates privacy summary statistics from logs
 */
export const generatePrivacySummary = (logs: LogEntry[]): PrivacySummary[] => {
  const appSummary = new Map<string, {
    appName: string,
    permissions: Record<PermissionType, {
      granted: number,
      denied: number,
      simulated: number
    }>,
    totalRiskScore: number,
    accessCount: number,
    lastAccess: Date
  }>();
  
  // Process logs to build summary
  logs.forEach(log => {
    // Initialize app summary if not exists
    if (!appSummary.has(log.appId)) {
      appSummary.set(log.appId, {
        appName: log.appName,
        permissions: {
          'CALL_LOGS': { granted: 0, denied: 0, simulated: 0 },
          'MESSAGES': { granted: 0, denied: 0, simulated: 0 },
          'FILE_ACCESS': { granted: 0, denied: 0, simulated: 0 },
          'CONTACTS': { granted: 0, denied: 0, simulated: 0 },
          'LOCATION': { granted: 0, denied: 0, simulated: 0 },
          'CAMERA': { granted: 0, denied: 0, simulated: 0 },
          'MICROPHONE': { granted: 0, denied: 0, simulated: 0 },
          'STORAGE': { granted: 0, denied: 0, simulated: 0 },
          'GENERAL': { granted: 0, denied: 0, simulated: 0 }
        },
        totalRiskScore: 0,
        accessCount: 0,
        lastAccess: log.timestamp
      });
    }
    
    const appData = appSummary.get(log.appId)!;
    
    // Update permission counts
    if (log.status === 'GRANTED') {
      appData.permissions[log.permissionType].granted++;
    } else if (log.status === 'DENIED') {
      appData.permissions[log.permissionType].denied++;
    } else if (log.status === 'SIMULATED') {
      appData.permissions[log.permissionType].simulated++;
    }
    
    // Update risk score
    if (log.riskScore) {
      appData.totalRiskScore += log.riskScore;
      appData.accessCount++;
    }
    
    // Update last access time
    if (log.timestamp > appData.lastAccess) {
      appData.lastAccess = log.timestamp;
    }
    
    // Update the map
    appSummary.set(log.appId, appData);
  });
  
  // Convert to array for output
  const result: PrivacySummary[] = [];
  appSummary.forEach((data, appId) => {
    result.push({
      appId,
      appName: data.appName,
      permissionsCounts: data.permissions,
      riskScore: data.accessCount > 0 ? Math.round(data.totalRiskScore / data.accessCount) : 0,
      lastAccess: data.lastAccess
    });
  });
  
  // Sort by risk score (highest first)
  return result.sort((a, b) => b.riskScore - a.riskScore);
};

/**
 * Calculates overall privacy score for the device based on all app activity
 */
export const calculateOverallPrivacyScore = (summaries: PrivacySummary[]): number => {
  if (summaries.length === 0) return 100; // Perfect score if no app activity
  
  // Weightage factors
  const weights = {
    riskScore: 0.7,
    simulatedRatio: 0.3
  };
  
  // Calculate average risk score
  const totalRiskScore = summaries.reduce((sum, app) => sum + app.riskScore, 0);
  const averageRiskScore = summaries.length > 0 ? totalRiskScore / summaries.length : 0;
  
  // Calculate simulated vs granted ratio
  let totalSimulated = 0;
  let totalReal = 0;
  
  summaries.forEach(app => {
    Object.values(app.permissionsCounts).forEach(counts => {
      totalSimulated += counts.simulated;
      totalReal += counts.granted;
    });
  });
  
  const simulatedRatio = totalReal + totalSimulated > 0 
    ? totalSimulated / (totalReal + totalSimulated) 
    : 1;
  
  // Calculate final score (higher is better)
  // Invert risk score since lower risk is better
  const invertedRiskScore = 100 - Math.min(100, averageRiskScore);
  
  // Combine factors
  const overallScore = (invertedRiskScore * weights.riskScore) + 
                       (simulatedRatio * 100 * weights.simulatedRatio);
  
  // Return rounded score capped between 0-100
  return Math.min(100, Math.max(0, Math.round(overallScore)));
};
