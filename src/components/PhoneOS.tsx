import React, { useState, useEffect } from 'react';
import { StatusBar } from './StatusBar';
import { Homescreen } from './Homescreen';
import { NotificationPanel } from './NotificationPanel';
import { AppDrawer } from './AppDrawer';
import { SettingsScreen } from './SettingsScreen';
import { Dashboard } from './Dashboard';
import { NavigationBar } from './NavigationBar';
import { AppStore } from './AppStore';
import { MobileShieldDashboard } from './MobileShieldDashboard';
import { cn } from '@/lib/utils';

export type OSScreen = 'homescreen' | 'dashboard' | 'settings' | 'app-drawer' | 'app-store' | 'shield-dashboard';

interface PhoneOSState {
  currentScreen: OSScreen;
  showNotificationPanel: boolean;
  isVDCActive: boolean;
  batteryLevel: number;
  signalStrength: number;
}

export function PhoneOS() {
  const [osState, setOSState] = useState<PhoneOSState>({
    currentScreen: 'homescreen',
    showNotificationPanel: false,
    isVDCActive: true,
    batteryLevel: 85,
    signalStrength: 4
  });

  // Handle status bar tap to show notifications
  const handleStatusBarTap = () => {
    setOSState(prev => ({
      ...prev,
      showNotificationPanel: !prev.showNotificationPanel
    }));
  };

  // Handle screen navigation
  const navigateToScreen = (screen: OSScreen) => {
    setOSState(prev => ({
      ...prev,
      currentScreen: screen,
      showNotificationPanel: false
    }));
  };

  // Handle swipe gestures (simplified)
  useEffect(() => {
    let startY: number;
    
    const handleTouchStart = (e: TouchEvent) => {
      startY = e.touches[0].clientY;
    };
    
    const handleTouchEnd = (e: TouchEvent) => {
      const endY = e.changedTouches[0].clientY;
      const diff = startY - endY;
      
      // Swipe down from top for notifications
      if (diff < -100 && startY < 100) {
        setOSState(prev => ({ ...prev, showNotificationPanel: true }));
      }
      
      // Swipe up from bottom for app drawer
      if (diff > 100 && startY > window.innerHeight - 100) {
        setOSState(prev => ({ ...prev, currentScreen: 'app-drawer' }));
      }
    };
    
    document.addEventListener('touchstart', handleTouchStart);
    document.addEventListener('touchend', handleTouchEnd);
    
    return () => {
      document.removeEventListener('touchstart', handleTouchStart);
      document.removeEventListener('touchend', handleTouchEnd);
    };
  }, []);

  const renderCurrentScreen = () => {
    switch (osState.currentScreen) {
      case 'homescreen':
        return <Homescreen onNavigate={navigateToScreen} />;
      case 'dashboard':
        return <Dashboard />;
      case 'settings':
        return <SettingsScreen onNavigate={navigateToScreen} />;
      case 'app-drawer':
        return <AppDrawer onNavigate={navigateToScreen} />;
      case 'app-store':
        return <AppStore onNavigate={navigateToScreen} />;
      case 'shield-dashboard':
        return <MobileShieldDashboard onNavigate={navigateToScreen} />;
      default:
        return <Homescreen onNavigate={navigateToScreen} />;
    }
  };

  return (
    <div className="relative w-full h-full bg-background overflow-hidden">
      {/* Status Bar */}
      <StatusBar 
        onTap={handleStatusBarTap}
        isVDCActive={osState.isVDCActive}
        batteryLevel={osState.batteryLevel}
        signalStrength={osState.signalStrength}
      />
      
      {/* Main Screen Content */}
      <div className={cn(
        "absolute inset-0 pt-10 pb-16 transition-transform duration-300",
        osState.showNotificationPanel && "transform translate-y-4 scale-95"
      )}>
        {renderCurrentScreen()}
      </div>
      
      {/* Notification Panel Overlay */}
      {osState.showNotificationPanel && (
        <div className="absolute inset-0 z-40">
          <div 
            className="absolute inset-0 bg-os-overlay backdrop-blur-sm"
            onClick={() => setOSState(prev => ({ ...prev, showNotificationPanel: false }))}
          />
          <div className="absolute top-10 left-4 right-4">
            <NotificationPanel 
              isOpen={osState.showNotificationPanel}
              onClose={() => setOSState(prev => ({ ...prev, showNotificationPanel: false }))}
            />
          </div>
        </div>
      )}
      
      {/* Bottom Navigation */}
      <NavigationBar 
        currentScreen={osState.currentScreen}
        onNavigate={navigateToScreen}
      />
    </div>
  );
}

export default PhoneOS;