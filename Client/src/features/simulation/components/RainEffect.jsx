import React, { memo, useState } from 'react';

const RainEffect = () => {
  const [drops] = useState(() =>
    Array.from({ length: 100 }).map((_, i) => ({
      id: i,
      left: `${Math.random() * 100}%`,
      animationDuration: `${0.5 + Math.random() * 0.5}s`,
      animationDelay: `${Math.random() * 2}s`,
      opacity: 0.3 + Math.random() * 0.4
    }))
  );

  return (
    <div className="absolute inset-0 z-50 pointer-events-none overflow-hidden">
      {/* Dark overlay for rain */}
      <div className="absolute inset-0 bg-mono-900/40 backdrop-blur-[1px]"></div>
      
      {/* Raindrops */}
      {drops.map((drop) => (
        <div
          key={drop.id}
          className="absolute top-[-20px] w-[2px] h-[20px] bg-mono-200/40 rounded-full"
          style={{
            left: drop.left,
            opacity: drop.opacity,
            animation: `fall ${drop.animationDuration} linear infinite`,
            animationDelay: drop.animationDelay,
          }}
        />
      ))}
      
      {/* CSS Animation for falling rain */}
      <style>{`
        @keyframes fall {
          0% {
            transform: translateY(-20px) rotate(15deg);
          }
          100% {
            transform: translateY(120%) rotate(15deg);
          }
        }
      `}</style>
    </div>
  );
};

export default memo(RainEffect);
