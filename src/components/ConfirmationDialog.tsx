
import { useEffect, useState } from 'react';
import { 
  AlertDialog, 
  AlertDialogContent, 
  AlertDialogHeader, 
  AlertDialogTitle, 
  AlertDialogDescription, 
  AlertDialogFooter, 
  AlertDialogCancel,
  AlertDialogAction
} from "@/components/ui/alert-dialog";
import { Badge } from '@/components/ui/badge';
import { Icon } from './Icon';
import { App, PermissionType } from '@/modules/types';
import AppRequirementsModule from '@/modules/AppRequirementsModule';
import UISkinModule from '@/modules/UISkinModule';

interface ConfirmationDialogProps {
  open: boolean;
  requestId: string;
  app: App | null;
  permissionType: PermissionType | null;
  warningMessage: string;
  onOpenChange: (open: boolean) => void;
}

export function ConfirmationDialog({ 
  open, 
  requestId, 
  app, 
  permissionType, 
  warningMessage, 
  onOpenChange 
}: ConfirmationDialogProps) {
  const [appCategory, setAppCategory] = useState<string>('');
  
  useEffect(() => {
    if (app) {
      const category = AppRequirementsModule.getInstance().getAppCategory(app);
      setAppCategory(category.name);
    }
  }, [app]);
  
  const handleApprove = () => {
    if (requestId) {
      UISkinModule.getInstance().respondToConfirmation(requestId, true);
      onOpenChange(false);
    }
  };
  
  const handleDeny = () => {
    if (requestId) {
      UISkinModule.getInstance().respondToConfirmation(requestId, false);
      onOpenChange(false);
    }
  };
  
  if (!app || !permissionType) return null;
  
  const permissionName = {
    'CALL_LOGS': 'Call Logs',
    'MESSAGES': 'Messages',
    'FILE_ACCESS': 'File Access',
    'CONTACTS': 'Contacts',
    'LOCATION': 'Location'
  }[permissionType];
  
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="bg-background border-shield-dark/30">
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center">
            <Icon name="alertTriangle" className="h-5 w-5 text-shield-accent mr-2" />
            Suspicious Permission Request
          </AlertDialogTitle>
          <div className="flex items-center gap-2 mb-2">
            <span className="font-semibold text-shield-accent">{app.name}</span> 
            <Badge variant="outline" className="bg-shield-dark/10">{appCategory} App</Badge>
          </div>
          <AlertDialogDescription>
            This app is requesting access to your <span className="font-semibold">{permissionName}</span>. 
            <div className="mt-2 bg-shield-dark/10 p-3 rounded-md text-sm">
              {warningMessage}
            </div>
            <div className="mt-2">
              Would you like to allow this request anyway?
            </div>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={handleDeny}>Deny</AlertDialogCancel>
          <AlertDialogAction onClick={handleApprove} className="bg-shield-accent hover:bg-shield-accent/80">Allow</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

export default ConfirmationDialog;
