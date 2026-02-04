import React from 'react';
export const Sedan = ({ color, className }) => (
  <svg viewBox="0 0 40 20" className={className}>
    <rect x="0" y="0" width="40" height="20" rx="4" fill={color} />
    <rect x="28" y="2" width="8" height="16" fill="#000" opacity="0.3" />
    <path d="M 38 2 L 40 4 M 38 18 L 40 16" stroke="#fef08a" strokeWidth="2" />
  </svg>
);
export const Truck = ({ color, className }) => (
  <svg viewBox="0 0 60 22" className={className}>
    <rect x="0" y="0" width="40" height="22" rx="1" fill="#94a3b8" />
    <rect x="42" y="1" width="18" height="20" rx="2" fill={color} />
  </svg>
);