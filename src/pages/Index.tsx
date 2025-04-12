
import Dashboard from '@/components/Dashboard';
import PhoneFrame from '@/components/PhoneFrame';
import { Icon } from '@/components/Icon';
import { useIsMobile } from '@/hooks/use-mobile';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent } from "@/components/ui/sheet";

const Index = () => {
  const isMobile = useIsMobile();
  const [showShield, setShowShield] = useState(false);
  
  const handleContinueToShield = () => {
    setShowShield(true);
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#1E2A44] to-black overflow-x-hidden relative">
      {/* Futuristic background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        {/* Dynamic flowing wave pattern */}
        <div className="absolute -top-[10%] right-0 left-0 h-[50%] w-full bg-[#1E2A44]/30 blur-[100px] rounded-full transform rotate-12 animate-pulse-opacity"></div>
        <div className="absolute top-[30%] -right-[10%] h-[40%] w-[70%] bg-[#4A90E2]/10 blur-[80px] rounded-full animate-pulse-opacity" style={{animationDelay: '1s'}}></div>
        
        {/* Centered shield with glow */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
          <div className="relative">
            <div className="absolute inset-0 bg-[#4A90E2]/30 blur-[30px] rounded-full"></div>
            <Icon name="shield" className="h-[300px] w-[300px] text-[#4A90E2]/10" />
          </div>
        </div>
        
        {/* Scattered glowing orbs */}
        <div className="absolute top-[20%] left-[15%] h-4 w-4 rounded-full bg-[#4A90E2]/40 blur-sm animate-pulse-opacity" style={{animationDelay: '0.5s'}}></div>
        <div className="absolute top-[70%] left-[80%] h-6 w-6 rounded-full bg-[#4A90E2]/40 blur-sm animate-pulse-opacity" style={{animationDelay: '1.2s'}}></div>
        <div className="absolute top-[30%] left-[75%] h-3 w-3 rounded-full bg-[#FFD700]/40 blur-sm animate-pulse-opacity" style={{animationDelay: '2s'}}></div>
        <div className="absolute top-[85%] left-[30%] h-5 w-5 rounded-full bg-[#4A90E2]/30 blur-sm animate-pulse-opacity" style={{animationDelay: '1.5s'}}></div>
        <div className="absolute top-[40%] left-[10%] h-3 w-3 rounded-full bg-[#FFD700]/40 blur-sm animate-pulse-opacity" style={{animationDelay: '0.7s'}}></div>
      </div>
      
      {isMobile ? (
        // Mobile view - just show the tablet directly
        <div className="pt-4 px-4 pb-20 relative z-10">
          <PhoneFrame>
            {showShield ? <Dashboard /> : null}
          </PhoneFrame>
        </div>
      ) : (
        // Desktop view - show landing page with tablet mockup
        <div className="container mx-auto flex flex-col lg:flex-row items-center justify-center p-4 lg:p-8 min-h-screen relative z-10">
          <div className="mb-12 lg:mb-0 lg:w-1/4 max-w-sm relative">
            {/* Gold highlight accent */}
            <div className="absolute -left-5 top-0 h-20 w-1 bg-gradient-to-b from-[#FFD700]/0 via-[#FFD700] to-[#FFD700]/0"></div>
            
            <div className="space-y-3 mb-8">
              <div className="inline-flex items-center px-3 py-1 rounded-full bg-[#4A90E2]/10 border border-[#4A90E2]/20 text-[#4A90E2] text-sm">
                <Icon name="shieldCheck" className="h-4 w-4 mr-2" />
                Privacy Protection System
              </div>
              
              <h1 className="text-4xl lg:text-5xl font-bold mb-4 bg-gradient-to-r from-[#4A90E2] via-white to-[#4A90E2]/80 bg-clip-text text-transparent">
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
                <div className="bg-[#1E2A44]/60 rounded-lg p-4 border border-[#4A90E2]/20 group hover:bg-[#1E2A44]/80 transition-all duration-300 backdrop-blur-sm">
                  <div className="flex space-x-3 mb-2">
                    <div className="h-8 w-8 bg-[#4A90E2]/20 rounded-lg flex items-center justify-center group-hover:bg-[#4A90E2]/30 transition-colors">
                      <Icon name="shield" className="h-5 w-5 text-[#4A90E2]" />
                    </div>
                    <h3 className="text-lg font-semibold text-[#4A90E2]">Privacy Protection</h3>
                  </div>
                  <p className="text-sm leading-relaxed">Shields your actual data from potential misuse by apps while providing realistic alternatives.</p>
                </div>
                
                <div className="bg-[#1E2A44]/60 rounded-lg p-4 border border-[#4A90E2]/20 group hover:bg-[#1E2A44]/80 transition-all duration-300 backdrop-blur-sm">
                  <div className="flex space-x-3 mb-2">
                    <div className="h-8 w-8 bg-[#4A90E2]/20 rounded-lg flex items-center justify-center group-hover:bg-[#4A90E2]/30 transition-colors">
                      <Icon name="brain" className="h-5 w-5 text-[#4A90E2]" />
                    </div>
                    <h3 className="text-lg font-semibold text-[#4A90E2]">AI Validation</h3>
                  </div>
                  <p className="text-sm leading-relaxed">Intelligent system that detects suspicious permission patterns and validates legitimate requests.</p>
                </div>
              </div>
              
              <Button 
                onClick={handleContinueToShield}
                className="w-full bg-gradient-to-r from-[#4A90E2] to-[#1E2A44] hover:from-[#5AA0F2] hover:to-[#2E3A54] transition-colors border border-[#4A90E2]/50 relative overflow-hidden group"
              >
                <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-[#FFD700]/20 to-transparent -translate-x-full group-hover:animate-shimmer"></span>
                <span className="relative flex items-center justify-center">
                  Continue to Shield
                  <Icon name="chevronRight" className="ml-2 h-4 w-4" />
                </span>
              </Button>
            </div>
          </div>
          
          <div className="relative lg:w-3/4 flex justify-center">
            <div className="absolute -top-20 -left-20 h-60 w-60 bg-[#4A90E2]/10 rounded-full blur-3xl"></div>
            <div className="absolute -bottom-20 -right-20 h-80 w-80 bg-[#4A90E2]/10 rounded-full blur-3xl"></div>
            
            <div className="relative z-10">
              <div className="absolute -top-6 -right-6 h-12 w-12 rounded-full bg-[#FFD700]/20 animate-pulse"></div>
              <div className="absolute -bottom-6 -left-6 h-12 w-12 rounded-full bg-[#4A90E2]/30 animate-pulse delay-700"></div>
              <PhoneFrame>
                {showShield && <Dashboard />}
              </PhoneFrame>
            </div>
          </div>
        </div>
      )}
      
      {/* Allow opening the Shield via button in mobile view */}
      {isMobile && (
        <Sheet open={showShield} onOpenChange={setShowShield}>
          <SheetContent side="bottom" className="h-[95vh] p-0 rounded-t-xl">
            <Dashboard />
          </SheetContent>
        </Sheet>
      )}
    </div>
  );
};

export default Index;
