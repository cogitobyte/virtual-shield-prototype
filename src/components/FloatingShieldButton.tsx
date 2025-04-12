
import { useState } from 'react';
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Icon } from '@/components/Icon';
import { FloatingShieldIcon } from './FloatingShieldIcon';
import Dashboard from './Dashboard';

export function FloatingShieldButton() {
  const [isShieldOpen, setIsShieldOpen] = useState(false);

  return (
    <>
      {/* Floating Shield Button */}
      <Button 
        onClick={() => setIsShieldOpen(true)}
        className="fixed bottom-6 right-6 h-16 w-16 rounded-full bg-gradient-to-br from-shield to-shield-dark z-50 shadow-lg hover:shadow-xl transition-all duration-300 border-4 border-white/20"
        aria-label="Open Virtual Shield"
      >
        <div className="absolute inset-0 rounded-full overflow-hidden">
          <FloatingShieldIcon />
        </div>
        <Icon name="shield" className="h-8 w-8 text-white z-10 relative" />
      </Button>

      {/* Virtual Shield UI Sheet */}
      <Sheet open={isShieldOpen} onOpenChange={setIsShieldOpen}>
        <SheetContent side="bottom" className="h-[95vh] p-0 rounded-t-xl">
          <Dashboard />
        </SheetContent>
      </Sheet>
    </>
  );
}

export default FloatingShieldButton;
