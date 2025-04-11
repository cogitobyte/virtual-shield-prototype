
import { motion } from 'framer-motion';
import { Icon } from './Icon';
import { Button } from "@/components/ui/button";

interface AppPermissionDialogProps {
  visible: boolean;
  onClose: () => void;
}

export function AppPermissionDialog({ visible, onClose }: AppPermissionDialogProps) {
  if (!visible) return null;
  
  return (
    <div className="absolute inset-0 z-20 bg-black/50 backdrop-blur-sm flex items-center justify-center">
      <motion.div 
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-white rounded-xl p-5 shadow-lg w-[85%] max-w-md"
      >
        <div className="flex items-center mb-4">
          <div className="h-10 w-10 rounded-md bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center">
            <Icon name="instagram" className="h-6 w-6 text-white" />
          </div>
          <div className="ml-3">
            <h3 className="font-medium">Allow Contact Access</h3>
            <p className="text-xs text-muted-foreground">Social Connect wants to access your contacts</p>
          </div>
        </div>
        
        <p className="text-sm mb-4">This permission allows the app to:</p>
        
        <ul className="text-sm space-y-2 mb-6">
          <li className="flex items-start">
            <Icon name="check" className="h-4 w-4 text-green-500 mr-2 mt-0.5" />
            <span>Find friends using your contacts</span>
          </li>
          <li className="flex items-start">
            <Icon name="check" className="h-4 w-4 text-green-500 mr-2 mt-0.5" />
            <span>Suggest people you might know</span>
          </li>
          <li className="flex items-start">
            <Icon name="alert-triangle" className="h-4 w-4 text-amber-500 mr-2 mt-0.5" />
            <span className="text-amber-700">Upload your contacts to their servers</span>
          </li>
        </ul>
        
        <div className="flex justify-end space-x-2">
          <Button variant="secondary" size="sm" onClick={onClose}>
            Don't Allow
          </Button>
          <Button className="bg-blue-500 hover:bg-blue-600 text-white" size="sm" onClick={onClose}>
            OK
          </Button>
        </div>
      </motion.div>
    </div>
  );
}

export default AppPermissionDialog;
