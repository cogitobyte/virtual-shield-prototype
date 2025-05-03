
import Dashboard from '@/components/Dashboard';
import PhoneFrame from '@/components/PhoneFrame';
import { Icon } from '@/components/Icon';
import { useIsMobile } from '@/hooks/use-mobile';
import { useState } from 'react';

const Index = () => {
  const isMobile = useIsMobile();
  const [showDashboard, setShowDashboard] = useState(false);
  
  const handleContinueToShield = () => {
    setShowDashboard(true);
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black overflow-x-hidden">
      {isMobile ? (
        // Mobile view - just show the dashboard directly
        <div className="pt-4 px-4 pb-20">
          <PhoneFrame>
            <Dashboard />
          </PhoneFrame>
        </div>
      ) : (
        // Desktop view - show landing page with tablet mockup or dashboard
        showDashboard ? (
          <div className="pt-4 px-4 pb-20 flex justify-center items-center min-h-screen">
            <PhoneFrame>
              <Dashboard />
            </PhoneFrame>
          </div>
        ) : (
          <div className="container mx-auto flex flex-col lg:flex-row items-center justify-center p-4 lg:p-8 min-h-screen">
            <div className="mb-12 lg:mb-0 lg:w-1/4 max-w-sm">
              <div className="space-y-3 mb-8">
                <div className="inline-flex items-center px-3 py-1 rounded-full bg-shield/10 border border-shield/20 text-shield-light text-sm">
                  <Icon name="shield" className="h-4 w-4 mr-2" />
                  Privacy Protection System
                </div>
                
                <h1 className="text-4xl lg:text-5xl font-bold mb-4 bg-gradient-to-r from-shield-light via-shield-accent to-shield-secondary bg-clip-text text-transparent">
                  Virtual Data Creation
                </h1>
                
                <h2 className="text-xl lg:text-2xl mb-6 text-gray-400">
                  Satisfy App Permissions Without Compromising Privacy
                </h2>
              </div>
              
              <div className="space-y-6 text-gray-300">
                <p className="text-lg">
                  This prototype demonstrates a revolutionary approach to mobile privacy. Instead of 
                  sharing your real data with apps, our system creates realistic virtual data that 
                  keeps your apps working while protecting your personal information.
                </p>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-shield-dark/30 rounded-lg p-4 border border-shield-dark group hover:bg-shield-dark/40 transition-all duration-300">
                    <div className="flex space-x-3 mb-2">
                      <div className="h-8 w-8 bg-shield/20 rounded-lg flex items-center justify-center group-hover:bg-shield/30 transition-colors">
                        <Icon name="shield" className="h-5 w-5 text-shield-accent" />
                      </div>
                      <h3 className="text-lg font-semibold text-shield-accent">Privacy Protection</h3>
                    </div>
                    <p className="text-sm leading-relaxed">Shields your actual data from potential misuse by apps while providing realistic alternatives.</p>
                  </div>
                  
                  <div className="bg-shield-dark/30 rounded-lg p-4 border border-shield-dark group hover:bg-shield-dark/40 transition-all duration-300">
                    <div className="flex space-x-3 mb-2">
                      <div className="h-8 w-8 bg-shield/20 rounded-lg flex items-center justify-center group-hover:bg-shield/30 transition-colors">
                        <Icon name="brain" className="h-5 w-5 text-shield-accent" />
                      </div>
                      <h3 className="text-lg font-semibold text-shield-accent">AI Validation</h3>
                    </div>
                    <p className="text-sm leading-relaxed">Intelligent system that detects suspicious permission patterns and validates legitimate requests.</p>
                  </div>
                </div>
                
                <button 
                  onClick={handleContinueToShield}
                  className="w-full py-3 bg-shield text-white rounded-lg flex items-center justify-center space-x-2 hover:bg-shield-accent transition-colors"
                >
                  <span>Continue to Shield</span>
                  <Icon name="arrow-right" className="h-5 w-5" />
                </button>
              </div>
            </div>
            
            <div className="relative lg:w-3/4 flex justify-center">
              <div className="absolute -top-20 -left-20 h-60 w-60 bg-shield-accent/10 rounded-full blur-3xl"></div>
              <div className="absolute -bottom-20 -right-20 h-80 w-80 bg-shield/10 rounded-full blur-3xl"></div>
              
              <div className="relative z-10">
                <div className="absolute -top-6 -right-6 h-12 w-12 rounded-full bg-shield-accent/30 animate-pulse"></div>
                <div className="absolute -bottom-6 -left-6 h-12 w-12 rounded-full bg-shield-light/30 animate-pulse delay-700"></div>
                <PhoneFrame>
                  <Dashboard />
                </PhoneFrame>
              </div>
            </div>
          </div>
        )
      )}
    </div>
  );
};

export default Index;
