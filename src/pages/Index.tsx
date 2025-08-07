import React, { useState } from 'react';
import { useIsMobile } from '@/hooks/use-mobile';
import { PhoneOS } from '@/components/PhoneOS';
import { Icon } from '@/components/Icon';

const Index = () => {
  const [showPhoneOS, setShowPhoneOS] = useState(false);
  const isMobile = useIsMobile();

  const handleContinueToOS = () => {
    setShowPhoneOS(true);
  };

  // Mobile view: Direct phone OS
  if (isMobile) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-os-surface to-background">
        <PhoneOS />
      </div>
    );
  }

  // Desktop view: Landing page or phone OS based on state
  if (showPhoneOS) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-os-surface to-background flex items-center justify-center p-8">
        <div className="w-[400px] h-[700px] bg-gradient-to-br from-os-surface via-background to-os-surface rounded-3xl border border-border shadow-2xl overflow-hidden">
          <PhoneOS />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-os-surface to-background overflow-hidden">
      <div className="relative min-h-screen flex items-center justify-center">
        
        {/* Background elements */}
        <div className="absolute inset-0 overflow-hidden">
          {/* Monochrome grid pattern */}
          <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:60px_60px] animate-pulse-opacity"></div>
          
          {/* Floating geometric shapes */}
          <div className="absolute top-20 left-20 w-3 h-3 border border-muted-foreground/20 rotate-45 animate-bounce"></div>
          <div className="absolute top-40 right-32 w-2 h-2 bg-muted-foreground/10 rounded-full animate-bounce" style={{ animationDelay: '1s' }}></div>
          <div className="absolute bottom-32 left-16 w-4 h-4 border border-muted-foreground/15 rounded-full animate-bounce" style={{ animationDelay: '2s' }}></div>
          <div className="absolute bottom-20 right-20 w-2 h-6 bg-muted-foreground/10 animate-bounce" style={{ animationDelay: '0.5s' }}></div>
        </div>

        <div className="relative z-10 max-w-4xl mx-auto px-8 text-center">
          
          {/* Main heading */}
          <div className="mb-12">
            <div className="flex items-center justify-center mb-6">
              <Icon name="shield" className="h-16 w-16 text-shield-accent mr-4" />
              <h1 className="text-6xl font-light bg-gradient-to-r from-foreground via-muted-foreground to-foreground bg-clip-text text-transparent">
                Virtual Shield OS
              </h1>
            </div>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed font-light">
              Experience a complete phone OS with revolutionary privacy protection built at the system level. 
              Virtual data creation keeps your real information safe while maintaining full app functionality.
            </p>
          </div>

          {/* Feature highlights */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            <div className="p-8 rounded-2xl bg-os-surface border border-border backdrop-blur-sm">
              <Icon name="smartphone" className="h-8 w-8 text-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium text-foreground mb-2">Complete OS Experience</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                Full phone interface with homescreen, apps, settings, and notifications
              </p>
            </div>
            <div className="p-8 rounded-2xl bg-os-surface border border-border backdrop-blur-sm">
              <Icon name="shield" className="h-8 w-8 text-shield-accent mx-auto mb-4" />
              <h3 className="text-lg font-medium text-foreground mb-2">OS-Level Privacy</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                Virtual Shield integrated directly into the operating system
              </p>
            </div>
            <div className="p-8 rounded-2xl bg-os-surface border border-border backdrop-blur-sm">
              <Icon name="palette" className="h-8 w-8 text-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium text-foreground mb-2">Minimalist Design</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                Clean monochrome interface focusing on usability and elegance
              </p>
            </div>
          </div>

          {/* CTA Button */}
          <button 
            onClick={handleContinueToOS}
            className="group relative px-12 py-4 bg-accent text-accent-foreground font-medium text-lg rounded-2xl border border-border hover:bg-accent/90 transition-all duration-300 transform hover:scale-105 shadow-lg"
          >
            <span className="relative z-10 flex items-center">
              Experience Virtual Shield OS
              <Icon name="arrowRight" className="ml-3 h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </span>
          </button>

          <p className="text-muted-foreground text-sm mt-6 font-light">
            The future of mobile privacy and user experience
          </p>
        </div>
      </div>
    </div>
  );
};

export default Index;