import React from 'react';

/**
 * Top-down vector vehicle silhouettes with clean automotive styling.
 * Uses crisp hex tones so rendering does not break on missing CSS variables.
 */

export const Car = ({ color, className }) => (
  <svg viewBox="0 0 44 22" className={className}>
    {/* Body */}
    <rect x="2" y="1" width="40" height="20" rx="3" fill={color} stroke="#111111" strokeWidth="1" />
    {/* Windshield */}
    <path d="M 28 3 L 33 5 L 33 17 L 28 19 Z" fill="#14181d" opacity="0.85" />
    {/* Rear window */}
    <rect x="10" y="4" width="4" height="14" rx="1" fill="#14181d" opacity="0.75" />
    {/* Roof */}
    <rect x="14" y="4" width="14" height="14" rx="1" fill={color} filter="brightness(0.92)" />
    {/* Headlights */}
    <rect x="41" y="2" width="2" height="4" rx="0.5" fill="#ffffff" />
    <rect x="41" y="16" width="2" height="4" rx="0.5" fill="#ffffff" />
    {/* Taillights */}
    <rect x="1" y="2" width="1.5" height="4" fill="#e22718" />
    <rect x="1" y="16" width="1.5" height="4" fill="#e22718" />
  </svg>
);

export const Suv = ({ color, className }) => (
  <svg viewBox="0 0 48 24" className={className}>
    {/* Body */}
    <rect x="1" y="1" width="46" height="22" rx="2" fill={color} stroke="#111111" strokeWidth="1" />
    {/* Windshield */}
    <path d="M 32 3 L 37 5 L 37 19 L 32 21 Z" fill="#14181d" opacity="0.85" />
    {/* Sunroof / Roof rack */}
    <rect x="14" y="4" width="16" height="16" rx="1" fill="#222222" opacity="0.3" stroke="#ffffff" strokeWidth="0.5" strokeOpacity="0.2" />
    {/* Rear window */}
    <rect x="6" y="4" width="4" height="16" rx="1" fill="#14181d" opacity="0.75" />
    {/* Headlights */}
    <rect x="46" y="2" width="2" height="5" rx="0.5" fill="#ffffff" />
    <rect x="46" y="17" width="2" height="5" rx="0.5" fill="#ffffff" />
    {/* Taillights */}
    <rect x="0" y="2" width="2" height="5" fill="#e22718" />
    <rect x="0" y="17" width="2" height="5" fill="#e22718" />
  </svg>
);

export const Jeepney = ({ color, className }) => (
  <svg viewBox="0 0 54 22" className={className}>
    <rect x="1" y="2" width="52" height="18" rx="1" fill={color} stroke="#111111" strokeWidth="1" />
    {/* Silver Roof Rack */}
    <rect x="4" y="3" width="36" height="16" fill="#777777" opacity="0.4" stroke="#ffffff" strokeWidth="0.5" strokeOpacity="0.3" />
    {/* Windshield */}
    <rect x="41" y="4" width="4" height="14" rx="0.5" fill="#14181d" opacity="0.85" />
    {/* Hood */}
    <rect x="46" y="3" width="7" height="16" rx="1" fill={color} />
    {/* Headlights */}
    <rect x="52" y="3" width="1.5" height="4" fill="#ffffff" />
    <rect x="52" y="15" width="1.5" height="4" fill="#ffffff" />
    {/* Taillights */}
    <rect x="0" y="3" width="1.5" height="4" fill="#e22718" />
    <rect x="0" y="15" width="1.5" height="4" fill="#e22718" />
  </svg>
);

export const Bus = ({ color, className }) => (
  <svg viewBox="0 0 80 26" className={className}>
    <rect x="1" y="1" width="78" height="24" rx="2" fill={color} stroke="#111111" strokeWidth="1" />
    {/* Large Windshield */}
    <path d="M 66 3 L 75 5 L 75 21 L 66 23 Z" fill="#14181d" opacity="0.85" />
    {/* Passenger Windows */}
    <rect x="8" y="3" width="54" height="20" rx="1" fill="#1e2329" opacity="0.5" />
    {/* Roof ventilation */}
    <rect x="24" y="6" width="24" height="14" rx="1" fill={color} filter="brightness(0.9)" />
    {/* Headlights */}
    <rect x="78" y="2" width="2" height="6" fill="#ffffff" />
    <rect x="78" y="18" width="2" height="6" fill="#ffffff" />
    {/* Taillights */}
    <rect x="0" y="2" width="2" height="6" fill="#e22718" />
    <rect x="0" y="18" width="2" height="6" fill="#e22718" />
  </svg>
);

export const Bike = ({ color, className }) => (
  <svg viewBox="0 0 22 12" className={className}>
    {/* Frame and tires */}
    <rect x="1" y="4" width="5" height="4" rx="1" fill="#111111" />
    <rect x="16" y="4" width="5" height="4" rx="1" fill="#111111" />
    <rect x="5" y="5" width="12" height="2" fill="#555555" />
    {/* Cyclist */}
    <circle cx="11" cy="6" r="3.5" fill={color} />
    <circle cx="12" cy="6" r="2" fill="#222222" />
  </svg>
);

export const Van = ({ color, className }) => (
  <svg viewBox="0 0 60 26" className={className}>
    <rect x="1" y="2" width="58" height="22" rx="2" fill={color} stroke="#111111" strokeWidth="1" />
    <path d="M 44 4 L 52 6 L 52 20 L 44 22 Z" fill="#14181d" opacity="0.85" />
    <rect x="10" y="4" width="30" height="18" rx="1" fill="#1e2329" opacity="0.4" />
    <rect x="58" y="3" width="2" height="5" fill="#ffffff" />
    <rect x="58" y="18" width="2" height="5" fill="#ffffff" />
  </svg>
);

export const Taxi = ({ color, className }) => (
  <svg viewBox="0 0 46 22" className={className}>
    <rect x="1" y="2" width="44" height="18" rx="3" fill="#f4b400" stroke="#111111" strokeWidth="1" />
    {/* Taxi Roof Sign */}
    <rect x="18" y="1" width="10" height="4" rx="0.5" fill="#ffffff" stroke="#111111" strokeWidth="0.5" />
    <path d="M 30 4 L 36 6 L 36 16 L 30 18 Z" fill="#14181d" opacity="0.85" />
    <rect x="10" y="4" width="4" height="14" fill="#14181d" opacity="0.75" />
    <rect x="44" y="3" width="2" height="4" fill="#ffffff" />
    <rect x="44" y="15" width="2" height="4" fill="#ffffff" />
  </svg>
);

export const Pickup = ({ color, className }) => (
  <svg viewBox="0 0 54 22" className={className}>
    <rect x="1" y="2" width="52" height="18" rx="2" fill={color} stroke="#111111" strokeWidth="1" />
    {/* Open bed */}
    <rect x="3" y="4" width="22" height="14" rx="1" fill="#1a1a1a" stroke="#111111" strokeWidth="0.5" />
    {/* Cab Windshield */}
    <path d="M 38 4 L 46 6 L 46 16 L 38 18 Z" fill="#14181d" opacity="0.85" />
    <rect x="52" y="3" width="2" height="4" fill="#ffffff" />
    <rect x="52" y="15" width="2" height="4" fill="#ffffff" />
  </svg>
);

export const Scooter = ({ color, className }) => (
  <svg viewBox="0 0 24 12" className={className}>
    <rect x="2" y="5" width="4" height="2" fill="#111111" />
    <rect x="18" y="5" width="4" height="2" fill="#111111" />
    <rect x="6" y="5" width="12" height="2" fill="#444444" />
    <circle cx="12" cy="6" r="3" fill={color} />
  </svg>
);

export const Truck = ({ color, className }) => (
  <svg viewBox="0 0 70 24" className={className}>
    {/* Cargo Container */}
    <rect x="1" y="1" width="48" height="22" rx="1" fill="#262626" stroke="#111111" strokeWidth="1" />
    <line x1="12" y1="2" x2="12" y2="22" stroke="#111111" strokeWidth="1" />
    <line x1="25" y1="2" x2="25" y2="22" stroke="#111111" strokeWidth="1" />
    <line x1="38" y1="2" x2="38" y2="22" stroke="#111111" strokeWidth="1" />
    {/* Cab */}
    <rect x="51" y="2" width="17" height="20" rx="2" fill={color} stroke="#111111" strokeWidth="1" />
    <path d="M 60 4 L 66 5 L 66 19 L 60 20 Z" fill="#14181d" opacity="0.85" />
    <rect x="67" y="2" width="2" height="5" fill="#ffffff" />
    <rect x="67" y="17" width="2" height="5" fill="#ffffff" />
  </svg>
);
