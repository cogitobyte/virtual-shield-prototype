
import { useEffect, useState } from 'react';

interface DataPacket {
  id: number;
  top: number;
  left: number;
  size: number;
}

interface FloatingShieldIconProps {
  onClick?: () => void;
}

export function FloatingShieldIcon({ onClick }: FloatingShieldIconProps) {
  const [dataPackets, setDataPackets] = useState<Array<DataPacket>>([]);

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
    <>
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
    </>
  );
}

export default FloatingShieldIcon;
