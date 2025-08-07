import React from 'react';
import { Icon } from './Icon';

interface StatusBarProps {
  onTap: () => void;
  isVDCActive: boolean;
  batteryLevel: number;
  signalStrength: number;
}

export function StatusBar({ onTap, isVDCActive, batteryLevel, signalStrength }: StatusBarProps) {
  const currentTime = new Date().toLocaleTimeString([], { 
    hour: '2-digit', 
    minute: '2-digit',
    hour12: false 
  });

  const getBatteryIcon = () => {
    if (batteryLevel > 75) return 'battery';
    if (batteryLevel > 50) return 'battery';
    if (batteryLevel > 25) return 'battery';
    return 'batteryLow';
  };

  const getSignalBars = () => {
    return Array.from({ length: 4 }, (_, i) => (
      <div
        key={i}
        className={`w-1 rounded-sm ${
          i < signalStrength 
            ? 'bg-status-indicator' 
            : 'bg-status-indicator/30'
        }`}
        style={{ height: `${4 + i * 2}px` }}
      />
    ));
  };

  return (
    <div 
      className="absolute top-0 left-0 right-0 h-10 px-4 bg-status-bar backdrop-blur-md flex justify-between items-center text-xs text-status-indicator z-50 cursor-pointer"
      onClick={onTap}
    >
      {/* Left side - Time and VDC status */}
      <div className="flex items-center space-x-3">
        <span className="font-mono font-medium">{currentTime}</span>
        {isVDCActive && (
          <div className="flex items-center space-x-1">
            <Icon name="shield" className="h-3 w-3 text-shield-accent" />
            <span className="text-[10px] text-shield-accent">VDC</span>
          </div>
        )}
      </div>
      
      {/* Right side - System indicators */}
      <div className="flex items-center space-x-3">
        {/* Signal strength */}
        <div className="flex items-end space-x-0.5 h-3">
          {getSignalBars()}
        </div>
        
        {/* WiFi */}
        <Icon name="wifi" className="h-3 w-3" />
        
        {/* Battery */}
        <div className="flex items-center space-x-1">
          <Icon name={getBatteryIcon()} className="h-3 w-3" />
          <span className="text-[10px] font-mono">{batteryLevel}%</span>
        </div>
      </div>
    </div>
  );
}

export default StatusBar;