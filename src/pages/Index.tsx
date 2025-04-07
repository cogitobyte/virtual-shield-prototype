
import Dashboard from '@/components/Dashboard';
import PhoneFrame from '@/components/PhoneFrame';

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col lg:flex-row items-center justify-center lg:justify-around p-4 lg:p-8 bg-gradient-to-b from-gray-900 to-black">
      <div className="mb-8 lg:mb-0 lg:w-1/2 max-w-3xl">
        <h1 className="text-4xl lg:text-5xl font-bold mb-4 bg-gradient-to-r from-shield-light via-shield-accent to-shield-secondary bg-clip-text text-transparent">
          Virtual Data Creation
        </h1>
        <h2 className="text-xl lg:text-2xl mb-6 text-gray-400">
          Satisfy App Permissions Without Compromising Privacy
        </h2>
        
        <div className="space-y-6 text-gray-300">
          <p className="text-lg">
            This prototype demonstrates a revolutionary approach to mobile privacy. Instead of 
            sharing your real data with apps, our system creates realistic virtual data that 
            keeps your apps working while protecting your personal information.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-shield-dark/30 rounded-lg p-4 border border-shield-dark">
              <h3 className="text-lg font-semibold mb-2 text-shield-accent">Privacy Protection</h3>
              <p>Shields your actual data from potential misuse by apps while providing realistic alternatives.</p>
            </div>
            
            <div className="bg-shield-dark/30 rounded-lg p-4 border border-shield-dark">
              <h3 className="text-lg font-semibold mb-2 text-shield-accent">AI-Powered Validation</h3>
              <p>Intelligent system that detects suspicious permission patterns and validates legitimate requests.</p>
            </div>
            
            <div className="bg-shield-dark/30 rounded-lg p-4 border border-shield-dark">
              <h3 className="text-lg font-semibold mb-2 text-shield-accent">Realistic Data Generation</h3>
              <p>Creates believable virtual call logs, messages, and more to satisfy app requirements.</p>
            </div>
            
            <div className="bg-shield-dark/30 rounded-lg p-4 border border-shield-dark">
              <h3 className="text-lg font-semibold mb-2 text-shield-accent">Seamless Integration</h3>
              <p>Works behind the scenes without disrupting app functionality or user experience.</p>
            </div>
          </div>
        </div>
      </div>
      
      <div className="relative">
        <div className="absolute -top-4 -left-4 h-40 w-40 bg-shield-accent/20 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-8 -right-8 h-60 w-60 bg-shield/20 rounded-full blur-3xl"></div>
        <PhoneFrame>
          <Dashboard />
        </PhoneFrame>
      </div>
    </div>
  );
};

export default Index;
