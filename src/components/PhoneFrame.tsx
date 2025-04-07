
import { ReactNode } from 'react';

interface PhoneFrameProps {
  children: ReactNode;
}

export function PhoneFrame({ children }: PhoneFrameProps) {
  return (
    <div className="phone-frame">
      <div className="phone-notch"></div>
      <div className="p-2 h-full overflow-auto">
        {children}
      </div>
    </div>
  );
}

export default PhoneFrame;
