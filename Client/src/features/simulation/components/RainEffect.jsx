import React, { memo, useMemo } from 'react';

const RainEffect = () => {
  // Deterministic pseudo-random generator to keep render pure and stable.
  const rand = (seed) => {
    let t = seed + 0x6d2b79f5;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };

  const drops = useMemo(() => (
    Array.from({ length: 100 }).map((_, i) => {
      const s = i * 4;
      return {
        id: i,
        left: `${rand(s + 1) * 100}%`,
        animationDuration: `${0.5 + rand(s + 2) * 0.5}s`,
        animationDelay: `${rand(s + 3) * 2}s`,
        opacity: 0.3 + rand(s + 4) * 0.4
      };
    })
  ), []);

  return (
    <div className="absolute inset-0 z-50 pointer-events-none overflow-hidden">
      {/* Dark overlay for rain */}
      <div className="absolute inset-0 bg-mono-900/40 backdrop-blur-[1px]"></div>
      
      {/* Raindrops */}
      {drops.map((drop) => (
        <div
          key={drop.id}
          className="absolute top-[-20px] w-[2px] h-[20px] bg-mono-200/40 rounded-full rain-drop"
          style={{
            left: drop.left,
            opacity: drop.opacity,
            animationDuration: drop.animationDuration,
            animationDelay: drop.animationDelay
          }}
        />
      ))}
    </div>
  );
};

export default memo(RainEffect);
