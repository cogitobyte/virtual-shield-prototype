
import React from 'react';
import * as LucideIcons from 'lucide-react';

type IconProps = {
  name: string;
  className?: string;
  size?: number;
  strokeWidth?: number;
  onClick?: () => void;
};

export const Icon: React.FC<IconProps> = ({ 
  name, 
  className = '', 
  size = 24, 
  strokeWidth = 2,
  onClick 
}) => {
  // Convert kebab-case or snake_case to camelCase
  const formattedName = name
    .replace(/[-_]([a-z])/g, (_, letter) => letter.toUpperCase())
    .replace(/^\w/, c => c.toUpperCase());
  
  // @ts-ignore - dynamically access the icon
  const LucideIcon = LucideIcons[formattedName] || LucideIcons.HelpCircle;
  
  return (
    <LucideIcon 
      className={className} 
      size={size} 
      strokeWidth={strokeWidth}
      onClick={onClick}
    />
  );
};

export default Icon;
