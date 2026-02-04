import React from 'react';

export const Sedan = ({ color, className }) => (
  <svg viewBox="0 0 44 22" className={`drop-shadow-lg ${className}`}>
    {/* Chassis */}
    <rect x="2" y="1" width="40" height="20" rx="4" fill={color} stroke="rgba(0,0,0,0.2)" strokeWidth="1" />
    
    {/* Windshield (Dark tint) */}
    <path d="M 30 2 L 30 20 L 36 18 L 36 4 Z" fill="#1e293b" />
    {/* Rear Window */}
    <path d="M 12 3 L 12 19 L 8 18 L 8 4 Z" fill="#1e293b" />
    
    {/* Headlights (Yellow glow) */}
    <path d="M 40 3 L 43 5 L 43 2 L 40 3 Z" fill="#fef08a" className="animate-pulse" />
    <path d="M 40 19 L 43 17 L 43 20 L 40 19 Z" fill="#fef08a" className="animate-pulse" />
  </svg>
);

export const Truck = ({ color, className }) => (
  <svg viewBox="0 0 70 24" className={`drop-shadow-xl ${className}`}>
    {/* Trailer (Long Grey Block) */}
    <rect x="0" y="0" width="48" height="24" rx="2" fill="#94a3b8" stroke="#475569" strokeWidth="1"/>
    <line x1="12" y1="2" x2="12" y2="22" stroke="#64748b" strokeWidth="2" strokeDasharray="4 2" />
    
    {/* Connector */}
    <rect x="48" y="8" width="4" height="8" fill="#475569" />
    
    {/* Cab (Colored Head) */}
    <path d="M 52 1 H 68 A 2 2 0 0 1 70 3 V 21 A 2 2 0 0 1 68 23 H 52 V 1 Z" fill={color} />
    
    {/* Windshield */}
    <rect x="58" y="2" width="6" height="20" fill="#1e293b" />
  </svg>
);