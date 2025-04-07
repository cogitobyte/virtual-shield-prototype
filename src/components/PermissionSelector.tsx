
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PERMISSION_DESCRIPTIONS } from '@/modules/MockData';
import { PermissionType } from '@/modules/types';
import { Icon } from '@/components/Icon';

interface PermissionSelectorProps {
  onSelectPermission: (permission: PermissionType) => void;
  isLoading: boolean;
}

export function PermissionSelector({ onSelectPermission, isLoading }: PermissionSelectorProps) {
  const permissions = Object.entries(PERMISSION_DESCRIPTIONS) as [PermissionType, { title: string; description: string; icon: string }][];
  
  return (
    <Card className="border border-shield-dark/20">
      <CardContent className="pt-6">
        <h3 className="text-lg font-semibold mb-4">Request Permission</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {permissions.map(([permission, details]) => (
            <Button
              key={permission}
              variant="outline"
              className="h-auto py-3 justify-start border-shield-dark/20 hover:border-shield hover:bg-shield/5"
              disabled={isLoading}
              onClick={() => onSelectPermission(permission)}
            >
              <div className="flex items-center">
                <div className="h-10 w-10 rounded-full bg-shield flex items-center justify-center">
                  <Icon name={details.icon} className="h-5 w-5 text-white" />
                </div>
                <div className="ml-3 text-left">
                  <div className="font-medium">{details.title}</div>
                  <div className="text-xs text-muted-foreground">{details.description}</div>
                </div>
              </div>
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

export default PermissionSelector;
