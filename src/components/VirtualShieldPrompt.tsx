
import React from 'react';
import { 
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogAction,
  AlertDialogCancel
} from "@/components/ui/alert-dialog";
import { Icon } from '@/components/Icon';

interface VirtualShieldPromptProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onOpenDashboard: () => void;
  isFloatingMode?: boolean;
}

const VirtualShieldPrompt = ({ 
  open, 
  onOpenChange, 
  onOpenDashboard,
  isFloatingMode = false
}: VirtualShieldPromptProps) => {
  // For floating icon mode
  if (isFloatingMode) {
    return (
      <div 
        className={`fixed bottom-10 right-10 z-50 cursor-pointer transition-all duration-500 ${open ? 'scale-100 opacity-100' : 'scale-0 opacity-0'}`}
        onClick={onOpenDashboard}
        title="Open Virtual Shield Dashboard"
      >
        <div className="h-16 w-16 bg-shield rounded-full flex items-center justify-center shadow-lg hover:bg-shield-accent transition-colors">
          <div className="h-12 w-12 bg-shield/80 rounded-full flex items-center justify-center absolute animate-ping opacity-75" />
          <Icon name="shield" className="h-8 w-8 text-white" />
        </div>
      </div>
    );
  }
  
  // Standard dialog mode
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="bg-gradient-to-b from-shield-dark to-background rounded-lg border border-shield-dark/30">
        <AlertDialogHeader>
          <div className="h-12 w-12 bg-shield/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <Icon name="shield" className="h-6 w-6 text-shield-accent" />
          </div>
          <AlertDialogTitle className="text-xl text-center text-white">
            Privacy Protected
          </AlertDialogTitle>
          <AlertDialogDescription className="text-center text-gray-300 mt-2">
            Virtual Shield can provide simulated data to this app while keeping your real information private. Would you like to try it?
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="flex flex-col space-y-2 sm:space-y-0">
          <AlertDialogAction
            onClick={onOpenDashboard}
            className="w-full bg-shield hover:bg-shield-accent text-white"
          >
            Open Virtual Shield
          </AlertDialogAction>
          <AlertDialogCancel className="w-full bg-transparent border border-gray-600 text-gray-300 hover:bg-gray-800">
            Cancel
          </AlertDialogCancel>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default VirtualShieldPrompt;
