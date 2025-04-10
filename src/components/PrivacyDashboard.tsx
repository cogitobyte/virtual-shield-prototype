
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from '@/components/ui/badge';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { PrivacySummary, PermissionType } from '@/modules/types';
import PermissionHandler from '@/modules/PermissionHandler';
import { calculateOverallPrivacyScore } from '@/modules/PrivacySummaryModule';
import { Icon } from '@/components/Icon';
import { formatDistanceToNow } from 'date-fns';

// Types for chart data
interface PermissionStat {
  name: string;
  granted: number;
  simulated: number;
  denied: number;
}

interface AppStat {
  name: string;
  score: number;
  color: string;
}

export function PrivacyDashboard() {
  const [privacySummary, setPrivacySummary] = useState<PrivacySummary[]>([]);
  const [overallScore, setOverallScore] = useState<number>(100);
  const [permissionStats, setPermissionStats] = useState<PermissionStat[]>([]);
  const [appStats, setAppStats] = useState<AppStat[]>([]);
  
  // Translation map for permission types to friendly names
  const permissionNames: Record<PermissionType, string> = {
    'LOCATION': 'Location',
    'CONTACTS': 'Contacts',
    'CALL_LOGS': 'Call Logs',
    'MESSAGES': 'Messages',
    'FILE_ACCESS': 'Files'
  };
  
  // Colors for risk levels
  const riskColors = {
    low: '#4ade80',     // green-400
    medium: '#facc15',  // yellow-400
    high: '#fb923c',    // orange-400
    critical: '#f87171', // red-400
  };
  
  // Setup data listeners
  useEffect(() => {
    const permissionHandler = PermissionHandler.getInstance();
    
    const handleSummaryUpdate = (summary: PrivacySummary[]) => {
      setPrivacySummary(summary);
      
      // Calculate overall privacy score
      const score = calculateOverallPrivacyScore(summary);
      setOverallScore(score);
      
      // Process permission statistics
      const permStats: PermissionStat[] = [];
      const permCounts: Record<PermissionType, { granted: number; simulated: number; denied: number }> = {
        'LOCATION': { granted: 0, simulated: 0, denied: 0 },
        'CONTACTS': { granted: 0, simulated: 0, denied: 0 },
        'CALL_LOGS': { granted: 0, simulated: 0, denied: 0 },
        'MESSAGES': { granted: 0, simulated: 0, denied: 0 },
        'FILE_ACCESS': { granted: 0, simulated: 0, denied: 0 }
      };
      
      summary.forEach(app => {
        Object.entries(app.permissionsCounts).forEach(([perm, counts]) => {
          const permType = perm as PermissionType;
          permCounts[permType].granted += counts.granted;
          permCounts[permType].simulated += counts.simulated;
          permCounts[permType].denied += counts.denied;
        });
      });
      
      Object.entries(permCounts).forEach(([perm, counts]) => {
        permStats.push({
          name: permissionNames[perm as PermissionType],
          granted: counts.granted,
          simulated: counts.simulated,
          denied: counts.denied
        });
      });
      
      setPermissionStats(permStats);
      
      // Process app statistics
      const apps: AppStat[] = summary.map(app => {
        let color;
        if (app.riskScore < 30) color = riskColors.low;
        else if (app.riskScore < 50) color = riskColors.medium;
        else if (app.riskScore < 70) color = riskColors.high;
        else color = riskColors.critical;
        
        return {
          name: app.appName,
          score: app.riskScore,
          color
        };
      });
      
      setAppStats(apps);
    };
    
    permissionHandler.addPrivacySummaryListener('privacy-dashboard', handleSummaryUpdate);
    
    return () => {
      permissionHandler.removePrivacySummaryListener('privacy-dashboard');
    };
  }, []);
  
  // Get risk level text and color
  const getRiskLevelInfo = (score: number): { text: string; color: string } => {
    if (score >= 80) return { text: 'Excellent', color: riskColors.low };
    if (score >= 60) return { text: 'Good', color: riskColors.medium };
    if (score >= 40) return { text: 'Fair', color: riskColors.high };
    return { text: 'Poor', color: riskColors.critical };
  };
  
  const riskInfo = getRiskLevelInfo(overallScore);
  
  return (
    <Card className="border border-shield-dark/20">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-semibold flex items-center">
          <Icon name="shield" className="h-5 w-5 mr-2 text-shield-light" />
          Privacy Summary Dashboard
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Overall Privacy Score */}
        <div className="space-y-1">
          <div className="flex justify-between items-center">
            <div className="text-sm font-medium">Privacy Protection Score</div>
            <Badge 
              variant="outline" 
              className={`font-semibold`}
              style={{ backgroundColor: `${riskInfo.color}20`, color: riskInfo.color, borderColor: `${riskInfo.color}40` }}
            >
              {riskInfo.text}
            </Badge>
          </div>
          <Progress value={overallScore} className="h-2" />
          <div className="flex justify-between text-xs text-muted-foreground pt-1">
            <span>High Risk</span>
            <span>Protected</span>
          </div>
        </div>
        
        <Tabs defaultValue="permissions" className="space-y-4">
          <TabsList className="grid grid-cols-2">
            <TabsTrigger value="permissions" className="data-[state=active]:bg-shield data-[state=active]:text-white">
              <Icon name="lock" className="h-4 w-4 mr-2" />
              Permissions Summary
            </TabsTrigger>
            <TabsTrigger value="apps" className="data-[state=active]:bg-shield data-[state=active]:text-white">
              <Icon name="smartphone" className="h-4 w-4 mr-2" />
              App Privacy Scores
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="permissions">
            <Card className="border-shield-dark/20">
              <CardContent className="p-4">
                <div className="h-[250px] w-full">
                  {permissionStats.length > 0 ? (
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={permissionStats}
                        margin={{ top: 10, right: 10, left: 0, bottom: 20 }}
                        barGap={2}
                        barSize={16}
                      >
                        <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.1} />
                        <XAxis 
                          dataKey="name" 
                          tick={{ fontSize: 12 }} 
                          axisLine={{ opacity: 0.2 }}
                          tickLine={false}
                          angle={-45}
                          textAnchor="end"
                          height={50}
                        />
                        <YAxis 
                          axisLine={{ opacity: 0.2 }} 
                          tickLine={false}
                          tick={{ fontSize: 12 }}
                          width={30}
                        />
                        <Tooltip
                          contentStyle={{ 
                            backgroundColor: 'rgba(10, 10, 15, 0.9)', 
                            border: '1px solid rgba(127, 127, 127, 0.2)',
                            borderRadius: '6px'
                          }}
                          cursor={{ opacity: 0.2 }}
                        />
                        <Bar dataKey="granted" name="Real Access" stackId="a" fill={riskColors.critical} />
                        <Bar dataKey="simulated" name="Virtualized" stackId="a" fill={riskColors.low} />
                        <Bar dataKey="denied" name="Denied" stackId="a" fill={riskColors.medium} />
                      </BarChart>
                    </ResponsiveContainer>
                  ) : (
                    <div className="h-full flex flex-col items-center justify-center">
                      <Icon name="bar-chart-4" className="h-12 w-12 text-shield-light/30 mb-2" />
                      <div className="text-muted-foreground">No permission data to display</div>
                    </div>
                  )}
                </div>
                
                <div className="flex justify-center items-center gap-4 mt-4">
                  <div className="flex items-center">
                    <div className="w-3 h-3 rounded-full mr-1" style={{ backgroundColor: riskColors.critical }}></div>
                    <span className="text-xs">Real Access</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-3 h-3 rounded-full mr-1" style={{ backgroundColor: riskColors.low }}></div>
                    <span className="text-xs">Virtualized</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-3 h-3 rounded-full mr-1" style={{ backgroundColor: riskColors.medium }}></div>
                    <span className="text-xs">Denied</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="apps">
            <Card className="border-shield-dark/20">
              <CardContent className="p-4 flex flex-col items-center">
                <div className="h-[250px] w-full">
                  {appStats.length > 0 ? (
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={appStats}
                        margin={{ top: 20, right: 10, left: 10, bottom: 30 }}
                        layout="vertical"
                        barSize={15}
                      >
                        <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} opacity={0.1} />
                        <XAxis 
                          type="number" 
                          domain={[0, 100]} 
                          axisLine={{ opacity: 0.2 }}
                          tickLine={false}
                          tick={{ fontSize: 12 }}
                        />
                        <YAxis 
                          type="category"
                          dataKey="name" 
                          axisLine={{ opacity: 0.2 }}
                          tickLine={false}
                          tick={{ fontSize: 12 }}
                          width={100}
                        />
                        <Tooltip
                          formatter={(value) => [`${value} risk points`, 'Risk Score']}
                          contentStyle={{ 
                            backgroundColor: 'rgba(10, 10, 15, 0.9)', 
                            border: '1px solid rgba(127, 127, 127, 0.2)',
                            borderRadius: '6px'
                          }}
                          cursor={{ opacity: 0.2 }}
                        />
                        <Bar dataKey="score" name="Risk Score">
                          {appStats.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  ) : (
                    <div className="h-full flex flex-col items-center justify-center">
                      <Icon name="bar-chart-3" className="h-12 w-12 text-shield-light/30 mb-2" />
                      <div className="text-muted-foreground">No app data to display</div>
                    </div>
                  )}
                </div>
                
                <div className="flex justify-center items-center gap-4 mt-2">
                  <div className="flex items-center">
                    <div className="w-3 h-3 rounded-full mr-1" style={{ backgroundColor: riskColors.low }}></div>
                    <span className="text-xs">Low Risk</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-3 h-3 rounded-full mr-1" style={{ backgroundColor: riskColors.medium }}></div>
                    <span className="text-xs">Medium Risk</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-3 h-3 rounded-full mr-1" style={{ backgroundColor: riskColors.high }}></div>
                    <span className="text-xs">High Risk</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-3 h-3 rounded-full mr-1" style={{ backgroundColor: riskColors.critical }}></div>
                    <span className="text-xs">Critical Risk</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
        
        {/* Recent App Activity */}
        <div>
          <h3 className="text-sm font-medium mb-3">Recent App Activity</h3>
          {privacySummary.length > 0 ? (
            <div className="space-y-3">
              {privacySummary.slice(0, 3).map(app => (
                <div key={app.appId} className="flex items-center justify-between bg-shield-dark/10 p-2 rounded-md">
                  <div className="flex items-center">
                    <div className="w-8 h-8 rounded-md bg-shield-dark/20 flex items-center justify-center">
                      <Icon name="smartphone" className="h-4 w-4 text-shield-light" />
                    </div>
                    <div className="ml-3">
                      <div className="text-sm font-medium">{app.appName}</div>
                      <div className="text-xs text-muted-foreground">
                        Last activity: {formatDistanceToNow(new Date(app.lastAccess), { addSuffix: true })}
                      </div>
                    </div>
                  </div>
                  <Badge 
                    variant="outline"
                    className={`text-xs`} 
                    style={{ 
                      backgroundColor: app.riskScore < 30 ? `${riskColors.low}20` : 
                                      app.riskScore < 50 ? `${riskColors.medium}20` : 
                                      app.riskScore < 70 ? `${riskColors.high}20` : 
                                      `${riskColors.critical}20`,
                      color: app.riskScore < 30 ? riskColors.low : 
                            app.riskScore < 50 ? riskColors.medium : 
                            app.riskScore < 70 ? riskColors.high : 
                            riskColors.critical,
                      borderColor: app.riskScore < 30 ? `${riskColors.low}40` : 
                                  app.riskScore < 50 ? `${riskColors.medium}40` : 
                                  app.riskScore < 70 ? `${riskColors.high}40` : 
                                  `${riskColors.critical}40`
                    }}
                  >
                    {app.riskScore} risk points
                  </Badge>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-3 text-muted-foreground">
              No app activity recorded yet
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

export default PrivacyDashboard;
