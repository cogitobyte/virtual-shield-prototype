
import React, { useState, useEffect } from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Icon } from '@/components/Icon';
import { PermissionType } from '@/modules/types';
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "@/components/ui/use-toast";

interface PermissionLessonProps {
  onComplete: () => void;
}

interface PermissionDetail {
  id: string;
  title: string;
  description: string;
  icon: string;
  type: PermissionType;
  risks: string[];
  benefits: string[];
  bestPractices: string[];
  explored: boolean;
}

export function InteractivePermissionLearning({ onComplete }: PermissionLessonProps) {
  const [activePermission, setActivePermission] = useState<string | null>(null);
  const [detailView, setDetailView] = useState<'overview' | 'risks' | 'benefits' | 'practices'>('overview');
  const [progress, setProgress] = useState(0);
  const [permissions, setPermissions] = useState<PermissionDetail[]>([
    {
      id: "location",
      title: "Location",
      description: "Apps can track where you are, either precisely or approximately",
      icon: "map-pin",
      type: "LOCATION",
      risks: [
        "Apps can track your movements throughout the day",
        "Location history can reveal personal routines",
        "Some apps collect location even when not in use"
      ],
      benefits: [
        "Get directions and navigation assistance",
        "Find nearby services and businesses",
        "Receive localized content and information"
      ],
      bestPractices: [
        "Only allow while using the app",
        "Review which apps have location access regularly",
        "Use approximate location when precise isn't needed"
      ],
      explored: false
    },
    {
      id: "contacts",
      title: "Contacts",
      description: "Apps can read your contact list, including names, numbers, and emails",
      icon: "users",
      type: "CONTACTS",
      risks: [
        "Apps may upload your entire contact list to servers",
        "Your contacts' information is shared without their consent",
        "Data might be used for marketing or sold to third parties"
      ],
      benefits: [
        "Easily connect with friends using the same app",
        "Sync contacts across devices",
        "Auto-complete contact information when messaging"
      ],
      bestPractices: [
        "Only grant access to social and communication apps",
        "Check privacy policy for how contacts are stored",
        "Regularly review and revoke unnecessary access"
      ],
      explored: false
    },
    {
      id: "camera",
      title: "Camera",
      description: "Apps can take photos, record video, and access your camera roll",
      icon: "camera",
      type: "FILE_ACCESS",
      risks: [
        "Apps could potentially access the camera without clear indication",
        "Photos might contain sensitive information or metadata",
        "Images may be analyzed for personal data or behavior patterns"
      ],
      benefits: [
        "Take and share photos/videos within apps",
        "Use visual features like QR code scanning",
        "Apply filters and effects to camera content"
      ],
      bestPractices: [
        "Only grant camera access when actively using it",
        "Cover camera when not in use for sensitive situations",
        "Review app permissions after updating apps"
      ],
      explored: false
    },
    {
      id: "microphone",
      title: "Microphone",
      description: "Apps can record audio from your device microphone",
      icon: "mic",
      type: "FILE_ACCESS",
      risks: [
        "Apps could potentially record conversations without clear indication",
        "Voice data might be processed to learn about your interests",
        "Audio could capture sensitive information in the background"
      ],
      benefits: [
        "Voice messaging and calling features",
        "Voice commands and dictation",
        "Audio recording for notes or content creation"
      ],
      bestPractices: [
        "Only grant microphone access when actively using it",
        "Check for microphone indicator when in use",
        "Review which apps have microphone access regularly"
      ],
      explored: false
    }
  ]);

  // Calculate progress when permissions are explored
  useEffect(() => {
    const exploredCount = permissions.filter(p => p.explored).length;
    const newProgress = Math.round((exploredCount / permissions.length) * 100);
    setProgress(newProgress);
    
    // Show toast for progress milestones
    if (newProgress === 25) {
      toast({
        title: "25% Complete!",
        description: "You're learning about important privacy permissions.",
      });
    } else if (newProgress === 50) {
      toast({
        title: "Halfway There!",
        description: "Keep exploring to learn more about privacy protection.",
      });
    } else if (newProgress === 100) {
      toast({
        title: "Learning Complete!",
        description: "Great job exploring all permission types!",
      });
      // Auto-advance after a short delay
      setTimeout(() => {
        onComplete();
      }, 2000);
    }
  }, [permissions, onComplete]);

  const handlePermissionSelect = (id: string) => {
    setActivePermission(id);
    setDetailView('overview');
    
    // Mark as explored
    if (!permissions.find(p => p.id === id)?.explored) {
      setPermissions(prev => 
        prev.map(p => p.id === id ? {...p, explored: true} : p)
      );
    }
  };

  const handleBackToGrid = () => {
    setActivePermission(null);
  };

  return (
    <div className="space-y-6 pt-2">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium flex items-center">
          <Icon name="shield-check" className="mr-2 h-5 w-5 text-shield" />
          Privacy Permission Explorer
        </h3>
        
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-muted-foreground">{progress}% completed</span>
          <div className="h-2 w-24 bg-gray-200 rounded-full overflow-hidden">
            <motion.div 
              className="h-full bg-shield"
              initial={{ width: '0%' }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
        </div>
      </div>
      
      <AnimatePresence mode="wait">
        {activePermission ? (
          <motion.div
            key="permission-detail"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            {/* Permission Detail View */}
            <Card className="overflow-hidden border-shield-light/20">
              {/* Header with back button */}
              <div className="bg-shield-light/10 p-4 flex items-center justify-between">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={handleBackToGrid} 
                  className="flex items-center text-shield"
                >
                  <Icon name="arrow-left" className="h-4 w-4 mr-1" />
                  Back to all
                </Button>
                
                <div className="flex space-x-1">
                  <motion.div
                    className={`w-2 h-2 rounded-full ${detailView === 'overview' ? 'bg-shield' : 'bg-gray-300'}`}
                    animate={{ scale: detailView === 'overview' ? 1.2 : 1 }}
                  />
                  <motion.div
                    className={`w-2 h-2 rounded-full ${detailView === 'risks' ? 'bg-shield' : 'bg-gray-300'}`}
                    animate={{ scale: detailView === 'risks' ? 1.2 : 1 }}
                  />
                  <motion.div
                    className={`w-2 h-2 rounded-full ${detailView === 'benefits' ? 'bg-shield' : 'bg-gray-300'}`}
                    animate={{ scale: detailView === 'benefits' ? 1.2 : 1 }}
                  />
                  <motion.div
                    className={`w-2 h-2 rounded-full ${detailView === 'practices' ? 'bg-shield' : 'bg-gray-300'}`}
                    animate={{ scale: detailView === 'practices' ? 1.2 : 1 }}
                  />
                </div>
              </div>
              
              {/* Content */}
              {permissions.filter(p => p.id === activePermission).map((permission) => (
                <div key={permission.id} className="p-5">
                  <div className="flex items-center mb-4">
                    <div className="h-12 w-12 rounded-full bg-shield-light/20 flex items-center justify-center mr-3">
                      <Icon name={permission.icon as any} className="h-6 w-6 text-shield" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold">{permission.title} Permission</h3>
                      <p className="text-muted-foreground">{permission.description}</p>
                    </div>
                  </div>
                  
                  <AnimatePresence mode="wait">
                    {detailView === 'overview' && (
                      <motion.div
                        key="overview"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="space-y-4"
                      >
                        <p>Tap to explore different aspects of {permission.title} permissions:</p>
                        
                        <div className="grid grid-cols-3 gap-3">
                          <motion.div 
                            className="bg-red-50 rounded-lg p-4 text-center cursor-pointer border border-red-100"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => setDetailView('risks')}
                          >
                            <Icon name="shield-alert" className="h-8 w-8 text-red-500 mx-auto mb-2" />
                            <span className="font-medium text-red-700">Risks</span>
                          </motion.div>
                          
                          <motion.div 
                            className="bg-green-50 rounded-lg p-4 text-center cursor-pointer border border-green-100"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => setDetailView('benefits')}
                          >
                            <Icon name="check" className="h-8 w-8 text-green-500 mx-auto mb-2" />
                            <span className="font-medium text-green-700">Benefits</span>
                          </motion.div>
                          
                          <motion.div 
                            className="bg-blue-50 rounded-lg p-4 text-center cursor-pointer border border-blue-100"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => setDetailView('practices')}
                          >
                            <Icon name="info" className="h-8 w-8 text-blue-500 mx-auto mb-2" />
                            <span className="font-medium text-blue-700">Best Practices</span>
                          </motion.div>
                        </div>
                      </motion.div>
                    )}
                    
                    {detailView === 'risks' && (
                      <motion.div
                        key="risks"
                        initial={{ opacity: 0, x: 50 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -50 }}
                        transition={{ duration: 0.2 }}
                        className="space-y-4"
                      >
                        <h4 className="font-bold text-red-700 flex items-center">
                          <Icon name="shield-alert" className="h-5 w-5 mr-2" />
                          Potential Risks
                        </h4>
                        
                        <ul className="space-y-3">
                          {permission.risks.map((risk, idx) => (
                            <motion.li 
                              key={idx}
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: idx * 0.1 }}
                              className="flex items-start"
                            >
                              <Icon name="alert-triangle" className="h-5 w-5 text-red-500 mr-2 flex-shrink-0 mt-0.5" />
                              <span>{risk}</span>
                            </motion.li>
                          ))}
                        </ul>
                        
                        <Button onClick={() => setDetailView('overview')} variant="ghost" className="mt-2">
                          <Icon name="arrow-left" className="h-4 w-4 mr-2" />
                          Back
                        </Button>
                      </motion.div>
                    )}
                    
                    {detailView === 'benefits' && (
                      <motion.div
                        key="benefits"
                        initial={{ opacity: 0, x: 50 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -50 }}
                        transition={{ duration: 0.2 }}
                        className="space-y-4"
                      >
                        <h4 className="font-bold text-green-700 flex items-center">
                          <Icon name="check" className="h-5 w-5 mr-2" />
                          Potential Benefits
                        </h4>
                        
                        <ul className="space-y-3">
                          {permission.benefits.map((benefit, idx) => (
                            <motion.li 
                              key={idx}
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: idx * 0.1 }}
                              className="flex items-start"
                            >
                              <Icon name="check-circle" className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                              <span>{benefit}</span>
                            </motion.li>
                          ))}
                        </ul>
                        
                        <Button onClick={() => setDetailView('overview')} variant="ghost" className="mt-2">
                          <Icon name="arrow-left" className="h-4 w-4 mr-2" />
                          Back
                        </Button>
                      </motion.div>
                    )}
                    
                    {detailView === 'practices' && (
                      <motion.div
                        key="practices"
                        initial={{ opacity: 0, x: 50 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -50 }}
                        transition={{ duration: 0.2 }}
                        className="space-y-4"
                      >
                        <h4 className="font-bold text-blue-700 flex items-center">
                          <Icon name="info" className="h-5 w-5 mr-2" />
                          Best Practices
                        </h4>
                        
                        <ul className="space-y-3">
                          {permission.bestPractices.map((practice, idx) => (
                            <motion.li 
                              key={idx}
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: idx * 0.1 }}
                              className="flex items-start"
                            >
                              <Icon name="check" className="h-5 w-5 text-blue-500 mr-2 flex-shrink-0 mt-0.5" />
                              <span>{practice}</span>
                            </motion.li>
                          ))}
                        </ul>
                        
                        <Button onClick={() => setDetailView('overview')} variant="ghost" className="mt-2">
                          <Icon name="arrow-left" className="h-4 w-4 mr-2" />
                          Back
                        </Button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}
            </Card>
          </motion.div>
        ) : (
          <motion.div
            key="permission-grid"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            {/* Permission Grid View */}
            <div className="grid grid-cols-2 gap-4">
              {permissions.map((permission) => (
                <motion.div
                  key={permission.id}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handlePermissionSelect(permission.id)}
                  className={`cursor-pointer rounded-lg p-4 border transition-all relative overflow-hidden ${
                    permission.explored 
                      ? 'border-shield bg-shield/5' 
                      : 'border-gray-200 bg-white hover:border-shield-light/50'
                  }`}
                >
                  {permission.explored && (
                    <motion.div 
                      className="absolute top-2 right-2 bg-shield-light text-white rounded-full p-1"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: 'spring', stiffness: 500, damping: 20 }}
                    >
                      <Icon name="check" className="h-3 w-3" />
                    </motion.div>
                  )}
                  
                  <div className="flex flex-col items-center text-center space-y-3 py-2">
                    <div className={`h-16 w-16 rounded-full flex items-center justify-center ${
                      permission.explored ? 'bg-shield-light/20' : 'bg-gray-100'
                    }`}>
                      <Icon 
                        name={permission.icon as any} 
                        className={`h-8 w-8 ${
                          permission.explored ? 'text-shield' : 'text-gray-500'
                        }`} 
                      />
                    </div>
                    <div>
                      <h4 className="font-bold">{permission.title}</h4>
                      <p className="text-sm text-muted-foreground line-clamp-2">{permission.description}</p>
                    </div>
                    <Button 
                      variant={permission.explored ? "outline" : "default"}
                      size="sm" 
                      className={permission.explored ? "border-shield text-shield" : "bg-shield"}>
                      {permission.explored ? "View Again" : "Explore"}
                    </Button>
                  </div>
                </motion.div>
              ))}
            </div>
            
            <div className="mt-6 text-center">
              <Button onClick={onComplete} variant="outline" className="w-full sm:w-auto">
                {progress === 100 ? "Complete Learning" : "Skip to Next Section"}
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default InteractivePermissionLearning;
