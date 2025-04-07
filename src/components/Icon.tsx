
import React from 'react';
import * as LucideIcons from 'lucide-react';

type IconProps = {
  name: string;
  className?: string;
  size?: number;
};

export const Icon: React.FC<IconProps> = ({ name, className = '', size = 24 }) => {
  // @ts-ignore - dynamically access the icon
  const LucideIcon = LucideIcons[name.charAt(0).toUpperCase() + name.slice(1)] || LucideIcons.HelpCircle;
  
  return <LucideIcon className={className} size={size} />;
};

export default Icon;
