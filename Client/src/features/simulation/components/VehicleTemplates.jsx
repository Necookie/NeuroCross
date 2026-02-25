import React from 'react';

export const Car = ({ color, className }) => (
  <svg viewBox="0 0 44 22" className={`drop-shadow-md ${className}`}>
    <rect
      x="2"
      y="1"
      width="40"
      height="20"
      rx="4"
      fill={color}
      style={{ stroke: 'hsl(var(--mono-950) / 0.35)' }}
    />
    <path d="M 30 2 L 30 20 L 36 18 L 36 4 Z" fill="hsl(var(--mono-900))" />
    <path d="M 40 3 L 43 5 L 43 2 Z" fill="hsl(var(--mono-200))" opacity="0.5" />
    <path d="M 40 19 L 43 17 L 43 20 Z" fill="hsl(var(--mono-200))" opacity="0.5" />
  </svg>
);

export const Suv = ({ color, className }) => (
  <svg viewBox="0 0 48 24" className={`drop-shadow-md ${className}`}>
    <rect x="0" y="0" width="48" height="24" rx="2" fill={color} />
    <rect x="32" y="2" width="6" height="20" fill="hsl(var(--mono-900))" />
    <rect x="10" y="2" width="18" height="20" fill="hsl(var(--mono-900))" opacity="0.4" />
  </svg>
);

export const Jeepney = ({ color, className }) => (
  <svg viewBox="0 0 50 22" className={`drop-shadow-lg ${className}`}>
    <rect x="0" y="2" width="50" height="18" rx="1" fill={color} style={{ stroke: 'hsl(var(--mono-700) / 0.6)' }} />
    <rect x="2" y="4" width="30" height="14" fill="hsl(var(--mono-950))" opacity="0.35" />
    <path d="M 38 0 L 50 2 L 50 20 L 38 22 Z" fill="hsl(var(--mono-600))" />
  </svg>
);

export const Bus = ({ color, className }) => (
  <svg viewBox="0 0 80 26" className={`drop-shadow-xl ${className}`}>
    <rect x="0" y="0" width="80" height="26" rx="3" fill={color} />
    <rect x="65" y="2" width="12" height="22" fill="hsl(var(--mono-900))" />
    <line x1="10" y1="2" x2="60" y2="2" stroke="hsl(var(--mono-100))" strokeOpacity="0.25" strokeWidth="2" strokeDasharray="5 5" />
    <line x1="10" y1="24" x2="60" y2="24" stroke="hsl(var(--mono-100))" strokeOpacity="0.25" strokeWidth="2" strokeDasharray="5 5" />
  </svg>
);

export const Bike = ({ color, className }) => (
  <svg viewBox="0 0 20 10" className={`drop-shadow-sm ${className}`}>
    <rect x="5" y="4" width="10" height="2" fill="hsl(var(--mono-700))" />
    <circle cx="4" cy="5" r="3" fill="hsl(var(--mono-950))" />
    <circle cx="16" cy="5" r="3" fill="hsl(var(--mono-950))" />
    <circle cx="10" cy="5" r="3" fill={color} />
  </svg>
);

export const Van = ({ color, className }) => (
  <svg viewBox="0 0 60 26" className={`drop-shadow-md ${className}`}>
    <rect x="0" y="4" width="58" height="18" rx="3" fill={color} />
    <rect x="36" y="6" width="18" height="14" fill="hsl(var(--mono-900))" opacity="0.45" />
    <rect x="6" y="6" width="22" height="14" fill="hsl(var(--mono-900))" opacity="0.2" />
  </svg>
);

export const Taxi = ({ color, className }) => (
  <svg viewBox="0 0 46 22" className={`drop-shadow-md ${className}`}>
    <rect x="2" y="4" width="42" height="16" rx="4" fill={color} />
    <rect x="18" y="2" width="10" height="4" rx="1" fill="hsl(var(--mono-100))" opacity="0.3" />
    <rect x="8" y="6" width="20" height="10" fill="hsl(var(--mono-900))" opacity="0.35" />
  </svg>
);

export const Pickup = ({ color, className }) => (
  <svg viewBox="0 0 54 22" className={`drop-shadow-md ${className}`}>
    <rect x="0" y="6" width="34" height="14" rx="3" fill={color} />
    <rect x="34" y="8" width="18" height="10" rx="2" fill="hsl(var(--mono-700))" />
    <rect x="6" y="8" width="16" height="8" fill="hsl(var(--mono-900))" opacity="0.3" />
  </svg>
);

export const Scooter = ({ color, className }) => (
  <svg viewBox="0 0 24 12" className={`drop-shadow-sm ${className}`}>
    <rect x="6" y="5" width="10" height="2" fill="hsl(var(--mono-700))" />
    <circle cx="6" cy="8" r="3" fill="hsl(var(--mono-950))" />
    <circle cx="18" cy="8" r="3" fill="hsl(var(--mono-950))" />
    <circle cx="12" cy="5" r="2" fill={color} />
  </svg>
);

export const Truck = ({ color, className }) => (
  <svg viewBox="0 0 70 24" className={`drop-shadow-xl ${className}`}>
    <rect x="0" y="0" width="48" height="24" rx="2" fill="hsl(var(--mono-500))" />
    <rect x="52" y="1" width="16" height="22" rx="2" fill={color} />
  </svg>
);
