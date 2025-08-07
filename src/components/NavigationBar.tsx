import React from 'react';
import { Icon } from './Icon';
import { Button } from '@/components/ui/button';
import { OSScreen } from './PhoneOS';

interface NavigationBarProps {
  currentScreen: OSScreen;
  onNavigate: (screen: OSScreen) => void;
}

export function NavigationBar({ currentScreen, onNavigate }: NavigationBarProps) {
  const navItems = [
    { id: 'homescreen' as OSScreen, icon: 'home', label: 'Home' },
    { id: 'dashboard' as OSScreen, icon: 'shield', label: 'Shield' },
    { id: 'app-drawer' as OSScreen, icon: 'grid3x3', label: 'Apps' },
    { id: 'settings' as OSScreen, icon: 'settings', label: 'Settings' }
  ];

  return (
    <div className="absolute bottom-0 left-0 right-0 h-16 bg-os-surface border-t border-border px-2 flex items-center justify-around">
      {navItems.map((item) => (
        <Button
          key={item.id}
          variant="ghost"
          size="sm"
          className={`flex flex-col items-center justify-center h-12 w-16 space-y-1 rounded-xl transition-colors ${
            currentScreen === item.id
              ? 'bg-os-surface-elevated text-nav-active'
              : 'text-nav-inactive hover:text-foreground hover:bg-os-surface-elevated/50'
          }`}
          onClick={() => onNavigate(item.id)}
        >
          <Icon 
            name={item.icon} 
            className={`h-5 w-5 ${
              item.id === 'dashboard' && currentScreen === item.id 
                ? 'text-shield-accent' 
                : ''
            }`} 
          />
          <span className="text-[10px] font-medium">{item.label}</span>
        </Button>
      ))}
    </div>
  );
}

export default NavigationBar;