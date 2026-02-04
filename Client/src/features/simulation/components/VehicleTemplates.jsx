import React from 'react';

export const Car = ({ color, className }) => (
  <svg viewBox="0 0 44 22" className={`drop-shadow-md ${className}`}>
    <rect x="2" y="1" width="40" height="20" rx="4" fill={color} stroke="rgba(0,0,0,0.2)" />
    <path d="M 30 2 L 30 20 L 36 18 L 36 4 Z" fill="#1e293b" />
    <path d="M 40 3 L 43 5 L 43 2 Z" fill="#fef08a" className="animate-pulse" />
    <path d="M 40 19 L 43 17 L 43 20 Z" fill="#fef08a" className="animate-pulse" />
  </svg>
);

export const Suv = ({ color, className }) => (
  <svg viewBox="0 0 48 24" className={`drop-shadow-md ${className}`}>
    <rect x="0" y="0" width="48" height="24" rx="2" fill={color} />
    <rect x="32" y="2" width="6" height="20" fill="#1e293b" />
    <rect x="10" y="2" width="18" height="20" fill="#1e293b" opacity="0.5" />
  </svg>
);

export const Jeepney = ({ className }) => (
  <svg viewBox="0 0 50 22" className={`drop-shadow-lg ${className}`}>
    <rect x="0" y="2" width="50" height="18" rx="1" fill="#facc15" stroke="#b45309" strokeWidth="2" />
    <rect x="2" y="4" width="30" height="14" fill="#000" opacity="0.2" />
    <path d="M 38 0 L 50 2 L 50 20 L 38 22 Z" fill="#e11d48" />
  </svg>
);

export const Bus = ({ color, className }) => (
  <svg viewBox="0 0 80 26" className={`drop-shadow-xl ${className}`}>
    <rect x="0" y="0" width="80" height="26" rx="3" fill="#3b82f6" />
    <rect x="65" y="2" width="12" height="22" fill="#1e293b" />
    <line x1="10" y1="2" x2="60" y2="2" stroke="#fff" strokeWidth="2" strokeDasharray="5 5" />
    <line x1="10" y1="24" x2="60" y2="24" stroke="#fff" strokeWidth="2" strokeDasharray="5 5" />
  </svg>
);

export const Bike = ({ className }) => (
  <svg viewBox="0 0 20 10" className={`drop-shadow-sm ${className}`}>
    <rect x="5" y="4" width="10" height="2" fill="#475569" />
    <circle cx="4" cy="5" r="3" fill="#000" />
    <circle cx="16" cy="5" r="3" fill="#000" />
    <circle cx="10" cy="5" r="3" fill="#ef4444" />
  </svg>
);

export const Truck = ({ color, className }) => (
  <svg viewBox="0 0 70 24" className={`drop-shadow-xl ${className}`}>
    <rect x="0" y="0" width="48" height="24" rx="2" fill="#94a3b8" />
    <rect x="52" y="1" width="16" height="22" rx="2" fill={color} />
  </svg>
);