import React from 'react';

/**
 * High-performance automotive vector vehicle silhouettes.
 * Designed according to NeuroCross Design System:
 * Confident aerodynamic silhouettes, crisp automotive styling,
 * laser daytime running lights (DRL), active LED brake lights, and carbon detailing.
 */

// 1. High-Performance Sports Coupe (BMW M4 / M8 GT inspired)
export const Coupe = ({ color = '#f5f5f5', className = '', brakeIntensity = 0 }) => (
  <svg viewBox="0 0 52 24" className={className}>
    {/* Body Shadow */}
    <rect x="2" y="1" width="48" height="22" rx="2" fill="#000000" opacity="0.4" />
    {/* Main Chassis Body */}
    <path
      d="M 6 4 L 38 4 Q 46 4 49 8 L 50 12 L 49 16 Q 46 20 38 20 L 6 20 Q 2 20 2 16 L 2 8 Q 2 4 6 4 Z"
      fill={color}
      stroke="#14181f"
      strokeWidth="0.8"
    />
    {/* Front Splitter & Air Intakes */}
    <rect x="49" y="5" width="2" height="14" rx="0.5" fill="#14181f" />
    <path d="M 44 8 L 48 8 L 47 16 L 44 16 Z" fill="#0a0d12" />
    {/* Sculpted Hood & Power Dome */}
    <path d="M 34 6 L 43 7 L 43 17 L 34 18 Z" fill="#000000" opacity="0.12" />
    <line x1="33" y1="12" x2="44" y2="12" stroke="#ffffff" strokeWidth="0.4" opacity="0.4" />
    {/* Aerodynamic Windshield */}
    <path d="M 28 5 L 34 7 L 34 17 L 28 19 Z" fill="#0c1117" />
    {/* Carbon-Fiber Roof */}
    <rect x="14" y="5.5" width="14" height="13" rx="1" fill="#1a1e24" />
    <line x1="14" y1="12" x2="28" y2="12" stroke="#2c333d" strokeWidth="0.8" />
    {/* Rear Window & Lip Spoiler */}
    <path d="M 9 6.5 L 14 6 L 14 18 L 9 17.5 Z" fill="#0c1117" />
    <rect x="3" y="6" width="2" height="12" rx="0.5" fill="#11151c" />
    {/* Twin Laser DRL Headlights */}
    <rect x="47" y="4.5" width="3" height="2.5" rx="0.5" fill="#ffffff" />
    <rect x="47" y="17" width="3" height="2.5" rx="0.5" fill="#ffffff" />
    {/* LED Taillights (with brake intensity bloom) */}
    <rect
      x="1.5"
      y="4.5"
      width="2"
      height="3"
      rx="0.5"
      fill="#e22718"
      style={{ filter: brakeIntensity > 0.4 ? 'drop-shadow(0 0 4px #e22718)' : 'none' }}
    />
    <rect
      x="1.5"
      y="16.5"
      width="2"
      height="3"
      rx="0.5"
      fill="#e22718"
      style={{ filter: brakeIntensity > 0.4 ? 'drop-shadow(0 0 4px #e22718)' : 'none' }}
    />
    {/* Side Mirrors */}
    <rect x="32" y="2.5" width="2.5" height="1.5" rx="0.5" fill={color} stroke="#111" strokeWidth="0.5" />
    <rect x="32" y="20" width="2.5" height="1.5" rx="0.5" fill={color} stroke="#111" strokeWidth="0.5" />
  </svg>
);

// 2. Executive Gran Sedan (BMW i7 / M5 Gran Turismo)
export const Sedan = ({ color = '#f5f5f5', className = '', brakeIntensity = 0 }) => (
  <svg viewBox="0 0 58 24" className={className}>
    <rect x="2" y="1" width="54" height="22" rx="2" fill="#000000" opacity="0.35" />
    {/* Sleek Extended Body */}
    <path
      d="M 5 4 L 46 4 Q 53 4 55 8 L 56 12 L 55 16 Q 53 20 46 20 L 5 20 Q 2 20 2 16 L 2 8 Q 2 4 5 4 Z"
      fill={color}
      stroke="#14181f"
      strokeWidth="0.8"
    />
    {/* Front Grille & Aero Hood */}
    <rect x="55" y="6" width="1.5" height="12" rx="0.5" fill="#14181f" />
    <path d="M 40 6 L 50 7 L 50 17 L 40 18 Z" fill="#000000" opacity="0.1" />
    {/* Windshield */}
    <path d="M 33 5 L 40 6.5 L 40 17.5 L 33 19 Z" fill="#0c1117" />
    {/* Panoramic Glass Roof */}
    <rect x="18" y="5.5" width="15" height="13" rx="0.5" fill="#141a22" stroke="#222a36" strokeWidth="0.5" />
    {/* Rear Window & Hofmeister Kink Greenhouse */}
    <path d="M 11 6.5 L 18 5.5 L 18 18.5 L 11 17.5 Z" fill="#0c1117" />
    <rect x="4" y="6" width="4" height="12" rx="0.5" fill={color} />
    {/* Signature Headlights */}
    <rect x="53" y="4.5" width="3" height="2.5" rx="0.5" fill="#ffffff" />
    <rect x="53" y="17" width="3" height="2.5" rx="0.5" fill="#ffffff" />
    {/* Taillights */}
    <rect
      x="1.5"
      y="4.5"
      width="2"
      height="3.5"
      rx="0.5"
      fill="#e22718"
      style={{ filter: brakeIntensity > 0.4 ? 'drop-shadow(0 0 4px #e22718)' : 'none' }}
    />
    <rect
      x="1.5"
      y="16"
      width="2"
      height="3.5"
      rx="0.5"
      fill="#e22718"
      style={{ filter: brakeIntensity > 0.4 ? 'drop-shadow(0 0 4px #e22718)' : 'none' }}
    />
    {/* Mirrors */}
    <rect x="38" y="2" width="2.5" height="1.5" rx="0.5" fill={color} stroke="#111" strokeWidth="0.5" />
    <rect x="38" y="20.5" width="2.5" height="1.5" rx="0.5" fill={color} stroke="#111" strokeWidth="0.5" />
  </svg>
);

// 3. High-Performance Sport Activity Vehicle / SUV (BMW X5 M / XM)
export const Suv = ({ color = '#f5f5f5', className = '', brakeIntensity = 0 }) => (
  <svg viewBox="0 0 56 26" className={className}>
    <rect x="2" y="1" width="52" height="24" rx="3" fill="#000000" opacity="0.35" />
    {/* Wide Stance Muscular Body */}
    <rect x="2" y="2.5" width="51" height="21" rx="3" fill={color} stroke="#14181f" strokeWidth="0.8" />
    {/* Wheel Arch Flares */}
    <rect x="10" y="1.5" width="10" height="1.5" rx="0.5" fill="#14181f" />
    <rect x="10" y="23" width="10" height="1.5" rx="0.5" fill="#14181f" />
    <rect x="38" y="1.5" width="10" height="1.5" rx="0.5" fill="#14181f" />
    <rect x="38" y="23" width="10" height="1.5" rx="0.5" fill="#14181f" />
    {/* Windshield */}
    <path d="M 36 4.5 L 43 6 L 43 20 L 36 21.5 Z" fill="#0c1117" />
    {/* Dual Panoramic Sunroof & Roof Rails */}
    <rect x="18" y="5.5" width="17" height="15" rx="1" fill="#121820" stroke="#252d3a" strokeWidth="0.5" />
    <line x1="16" y1="4.5" x2="38" y2="4.5" stroke="#7e7e7e" strokeWidth="0.8" />
    <line x1="16" y1="21.5" x2="38" y2="21.5" stroke="#7e7e7e" strokeWidth="0.8" />
    {/* Rear Window */}
    <rect x="8" y="5.5" width="5" height="15" rx="0.5" fill="#0c1117" />
    {/* Headlights */}
    <rect x="51" y="4" width="2.5" height="3.5" rx="0.5" fill="#ffffff" />
    <rect x="51" y="18.5" width="2.5" height="3.5" rx="0.5" fill="#ffffff" />
    {/* Taillights */}
    <rect
      x="1"
      y="3.5"
      width="2"
      height="4"
      rx="0.5"
      fill="#e22718"
      style={{ filter: brakeIntensity > 0.4 ? 'drop-shadow(0 0 4px #e22718)' : 'none' }}
    />
    <rect
      x="1"
      y="18.5"
      width="2"
      height="4"
      rx="0.5"
      fill="#e22718"
      style={{ filter: brakeIntensity > 0.4 ? 'drop-shadow(0 0 4px #e22718)' : 'none' }}
    />
  </svg>
);

// 4. GT Prototype / Hypercar (BMW M Hybrid V8 Le Mans Prototype)
export const Prototype = ({ color = '#0066b1', className = '', brakeIntensity = 0 }) => (
  <svg viewBox="0 0 54 26" className={className}>
    {/* Aerodynamic Carbon Underfloor Diffuser */}
    <rect x="1" y="2" width="52" height="22" rx="1" fill="#0a0c10" />
    {/* Extended Front Splitter */}
    <path d="M 48 3 L 53 6 L 53 20 L 48 23 Z" fill="#14181f" stroke="#000" strokeWidth="0.5" />
    {/* Cockpit Canopy */}
    <path d="M 22 7 Q 34 6 38 8 L 38 18 Q 34 20 22 19 Z" fill="#090d14" stroke="#0066b1" strokeWidth="0.8" />
    {/* Shark Fin Dorsal Spine */}
    <rect x="8" y="12" width="24" height="2" fill="#e22718" />
    {/* Wide Rear Wing with Endplates */}
    <rect x="2" y="2" width="3.5" height="22" rx="0.5" fill="#1c69d4" />
    <rect x="1" y="1" width="5" height="2" fill="#e22718" />
    <rect x="1" y="23" width="5" height="2" fill="#e22718" />
    {/* Side Pod Radiator Inlets */}
    <rect x="24" y="3.5" width="12" height="3" fill={color} />
    <rect x="24" y="19.5" width="12" height="3" fill={color} />
    {/* High-output LED clusters */}
    <rect x="51" y="5" width="2.5" height="2" fill="#ffffff" />
    <rect x="51" y="19" width="2.5" height="2" fill="#ffffff" />
    <rect
      x="1"
      y="4"
      width="2"
      height="3"
      fill="#e22718"
      style={{ filter: brakeIntensity > 0.4 ? 'drop-shadow(0 0 4px #e22718)' : 'none' }}
    />
    <rect
      x="1"
      y="19"
      width="2"
      height="3"
      fill="#e22718"
      style={{ filter: brakeIntensity > 0.4 ? 'drop-shadow(0 0 4px #e22718)' : 'none' }}
    />
  </svg>
);

// 5. Emergency M-Interceptor / Safety Pace Car (With Active M-Blue & M-Red Strobe Lightbar)
export const Interceptor = ({ color = '#000000', className = '', brakeIntensity = 0 }) => (
  <svg viewBox="0 0 54 24" className={className}>
    {/* Dark Carbon Chassis */}
    <path
      d="M 5 4 L 42 4 Q 48 4 51 8 L 52 12 L 51 16 Q 48 20 42 20 L 5 20 Q 2 20 2 16 L 2 8 Q 2 4 5 4 Z"
      fill={color || '#0d0d0d'}
      stroke="#3c3c3c"
      strokeWidth="1"
    />
    {/* M Tricolor Livery Bands */}
    <rect x="12" y="3.5" width="3" height="17" fill="#0066b1" />
    <rect x="15" y="3.5" width="3" height="17" fill="#1c69d4" />
    <rect x="18" y="3.5" width="3" height="17" fill="#e22718" />
    {/* Windshield */}
    <path d="M 30 5 L 37 7 L 37 17 L 30 19 Z" fill="#0a0e14" />
    {/* ROOFTOP EMERGENCY LIGHTBAR (Flashing M-Blue & M-Red) */}
    <rect x="22" y="6" width="7" height="12" rx="1.5" fill="#1a1a1a" stroke="#ffffff" strokeWidth="0.5" />
    {/* Blue Strobe Lens */}
    <rect x="23" y="7" width="5" height="4" rx="0.5" fill="#1c69d4" className="animate-pulse" style={{ filter: 'drop-shadow(0 0 6px #1c69d4)' }} />
    {/* Red Strobe Lens */}
    <rect x="23" y="13" width="5" height="4" rx="0.5" fill="#e22718" className="animate-pulse" style={{ filter: 'drop-shadow(0 0 6px #e22718)' }} />
    {/* Dual High-Beam Laser Headlights */}
    <rect x="49" y="4" width="3" height="3" rx="0.5" fill="#ffffff" style={{ filter: 'drop-shadow(0 0 5px #ffffff)' }} />
    <rect x="49" y="17" width="3" height="3" rx="0.5" fill="#ffffff" style={{ filter: 'drop-shadow(0 0 5px #ffffff)' }} />
    {/* Taillights */}
    <rect
      x="1"
      y="4.5"
      width="2"
      height="3"
      fill="#e22718"
      style={{ filter: brakeIntensity > 0.4 ? 'drop-shadow(0 0 4px #e22718)' : 'none' }}
    />
    <rect
      x="1"
      y="16.5"
      width="2"
      height="3"
      fill="#e22718"
      style={{ filter: brakeIntensity > 0.4 ? 'drop-shadow(0 0 4px #e22718)' : 'none' }}
    />
  </svg>
);

// 6. Modern Commercial Transporter / Crew Van
export const Van = ({ color = '#f5f5f5', className = '', brakeIntensity = 0 }) => (
  <svg viewBox="0 0 64 26" className={className}>
    <rect x="2" y="2" width="60" height="22" rx="2" fill={color} stroke="#14181f" strokeWidth="0.8" />
    {/* Windshield */}
    <path d="M 48 4 L 56 6 L 56 20 L 48 22 Z" fill="#0c1117" />
    {/* Side Cargo Windows & Panel Seams */}
    <rect x="12" y="4.5" width="32" height="17" rx="1" fill="#141a22" opacity="0.4" />
    <line x1="30" y1="3" x2="30" y2="23" stroke="#111" strokeWidth="0.6" />
    {/* Headlights */}
    <rect x="60" y="3" width="2" height="5" fill="#ffffff" />
    <rect x="60" y="18" width="2" height="5" fill="#ffffff" />
    {/* Taillights */}
    <rect
      x="1"
      y="3"
      width="2"
      height="5"
      fill="#e22718"
      style={{ filter: brakeIntensity > 0.4 ? 'drop-shadow(0 0 4px #e22718)' : 'none' }}
    />
    <rect
      x="1"
      y="18"
      width="2"
      height="5"
      fill="#e22718"
      style={{ filter: brakeIntensity > 0.4 ? 'drop-shadow(0 0 4px #e22718)' : 'none' }}
    />
  </svg>
);

// 7. Heavy Hauler / Freight Truck (Cab-over + Aerodynamic Container)
export const Truck = ({ color = '#f5f5f5', className = '', brakeIntensity = 0 }) => (
  <svg viewBox="0 0 86 26" className={className}>
    {/* Trailer Cargo Box */}
    <rect x="2" y="2" width="56" height="22" rx="1.5" fill="#1c2129" stroke="#11141a" strokeWidth="1" />
    <line x1="16" y1="3" x2="16" y2="23" stroke="#2d3542" strokeWidth="1" />
    <line x1="30" y1="3" x2="30" y2="23" stroke="#2d3542" strokeWidth="1" />
    <line x1="44" y1="3" x2="44" y2="23" stroke="#2d3542" strokeWidth="1" />
    {/* Cab Fifth-Wheel Hitch Gap */}
    <rect x="58" y="8" width="4" height="10" fill="#0c0e12" />
    {/* Cab Chassis */}
    <rect x="62" y="2" width="21" height="22" rx="2" fill={color} stroke="#11141a" strokeWidth="1" />
    {/* Large Truck Windshield */}
    <path d="M 72 4 L 81 5 L 81 21 L 72 22 Z" fill="#0c1117" />
    {/* Dual Headlights */}
    <rect x="81.5" y="2.5" width="2.5" height="5.5" fill="#ffffff" />
    <rect x="81.5" y="18" width="2.5" height="5.5" fill="#ffffff" />
    {/* Rear Multi-Axle Taillights */}
    <rect
      x="0.5"
      y="3"
      width="2"
      height="5"
      fill="#e22718"
      style={{ filter: brakeIntensity > 0.4 ? 'drop-shadow(0 0 4px #e22718)' : 'none' }}
    />
    <rect
      x="0.5"
      y="18"
      width="2"
      height="5"
      fill="#e22718"
      style={{ filter: brakeIntensity > 0.4 ? 'drop-shadow(0 0 4px #e22718)' : 'none' }}
    />
  </svg>
);

// 8. Autonomous City Transit Bus
export const Bus = ({ color = '#0066b1', className = '', brakeIntensity = 0 }) => (
  <svg viewBox="0 0 88 26" className={className}>
    <rect x="2" y="2" width="84" height="22" rx="2" fill={color} stroke="#14181f" strokeWidth="0.8" />
    {/* Panoramic Wrap-around Glass */}
    <rect x="10" y="3.5" width="62" height="19" rx="1" fill="#10161f" />
    <path d="M 74 3.5 L 83 5.5 L 83 20.5 L 74 22.5 Z" fill="#0c1117" />
    {/* Rooftop Climate & Battery Unit */}
    <rect x="28" y="6" width="30" height="14" rx="1" fill="#1c222b" stroke="#333d4d" strokeWidth="0.5" />
    {/* LED Destination Header */}
    <rect x="82" y="9" width="2" height="8" fill="#f4b400" />
    {/* Front Lights */}
    <rect x="84" y="3" width="2" height="6" fill="#ffffff" />
    <rect x="84" y="17" width="2" height="6" fill="#ffffff" />
    {/* Taillights */}
    <rect
      x="1"
      y="3"
      width="2"
      height="6"
      fill="#e22718"
      style={{ filter: brakeIntensity > 0.4 ? 'drop-shadow(0 0 4px #e22718)' : 'none' }}
    />
    <rect
      x="1"
      y="17"
      width="2"
      height="6"
      fill="#e22718"
      style={{ filter: brakeIntensity > 0.4 ? 'drop-shadow(0 0 4px #e22718)' : 'none' }}
    />
  </svg>
);

// 9. Urban Sportbike / Motorcycle
export const Bike = ({ color = '#e22718', className = '', brakeIntensity = 0 }) => (
  <svg viewBox="0 0 28 14" className={className}>
    {/* Front & Rear Performance Tires */}
    <rect x="1" y="4.5" width="6" height="5" rx="1" fill="#0d0d0d" />
    <rect x="20" y="4.5" width="6" height="5" rx="1" fill="#0d0d0d" />
    <line x1="6" y1="7" x2="21" y2="7" stroke="#444d5a" strokeWidth="2.5" />
    {/* Motorcycle Body Fairing */}
    <path d="M 10 5 L 18 5 L 17 9 L 10 9 Z" fill={color} />
    {/* Helmet & Visor */}
    <circle cx="14" cy="7" r="3.5" fill="#1c1f26" />
    <rect x="15" y="6" width="2" height="2" fill="#ffffff" />
    {/* Taillight */}
    <rect
      x="0.5"
      y="5.5"
      width="1.5"
      height="3"
      fill="#e22718"
      style={{ filter: brakeIntensity > 0.4 ? 'drop-shadow(0 0 4px #e22718)' : 'none' }}
    />
  </svg>
);

// Backwards-compatible aliases
export const Car = Coupe;
export const Jeepney = Van;
export const Taxi = Sedan;
export const Pickup = Suv;
export const Scooter = Bike;

