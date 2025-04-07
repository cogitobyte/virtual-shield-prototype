
import { ReactNode, useEffect, useState } from 'react';
import { useIsMobile } from '@/hooks/use-mobile';

interface PhoneFrameProps {
  children: ReactNode;
}

export function PhoneFrame({ children }: PhoneFrameProps) {
  const [dataPackets, setDataPackets] = useState<Array<{ id: number; top: number; left: number; size: number }>>([]);
  const isMobile = useIsMobile();

  // Create animating data packets effect
  useEffect(() => {
    const intervalId = setInterval(() => {
      // Add a new data packet
      const newPacket = {
        id: Date.now(),
        top: Math.random() * 100,
        left: Math.random() * 100,
        size: Math.random() * 6 + 4
      };

      setDataPackets(prev => [...prev, newPacket]);

      // Clean up old packets
      setTimeout(() => {
        setDataPackets(prev => prev.filter(packet => packet.id !== newPacket.id));
      }, 2000);
    }, 300);

    return () => clearInterval(intervalId);
  }, []);

  return (
    <div className={`relative ${isMobile ? "w-full" : "w-[300px]"} h-[600px] bg-gradient-to-br from-shield-dark to-black rounded-[36px] border-[10px] border-gray-900 shadow-lg overflow-hidden`}>
      {/* Phone notch */}
      <div className="phone-notch z-10"></div>
      
      {/* Status bar */}
      <div className="absolute top-1 left-0 right-0 h-6 px-6 flex justify-between items-center text-xs text-white z-10">
        <span>9:41</span>
        <div className="flex items-center space-x-1">
          <span className="block h-2.5 w-2.5 rounded-full bg-shield-light"></span>
          <span className="block h-2.5 w-2.5 rounded-full bg-shield-secondary"></span>
          <span className="block h-2.5 w-2.5 rounded-full bg-shield-accent"></span>
        </div>
      </div>
      
      {/* Data packet animations */}
      {dataPackets.map(packet => (
        <div 
          key={packet.id} 
          className="data-packet animate-data-flow" 
          style={{
            top: `${packet.top}%`,
            left: `${packet.left}%`,
            width: `${packet.size}px`,
            height: `${packet.size}px`,
          }}
        />
      ))}
      
      {/* Content */}
      <div className="h-full overflow-auto p-2 pt-7">
        {children}
      </div>
    </div>
  );
}

export default PhoneFrame;
