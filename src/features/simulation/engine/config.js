// src/features/simulation/engine/config.js
export const ROAD_LENGTH = 400;
export const STOP_LINE = 100;
export const INTERSECTION_EXIT = 280;
export const SAFE_HEADWAY = 1.8;
export const MIN_GAP = 14.0;
export const ACCEL_MAX = 3.8;
export const DECEL_COMF = 3.2;
export const DECEL_MAX = 6.5; // Emergency deceleration limit

// Wet-road driving model: lower tire grip means weaker braking/accel authority,
// a lower comfortable top speed, and drivers leaving more following distance.
export const RAIN_BRAKE_GRIP = 0.58;     // multiplier on braking deceleration
export const RAIN_ACCEL_GRIP = 0.75;     // multiplier on positive acceleration
export const RAIN_SPEED_FACTOR = 0.82;   // multiplier on each vehicle's cruising speed cap
export const RAIN_HEADWAY_FACTOR = 1.35; // multiplier on desired time headway

// Roundabout yield-at-entry model (no traffic signals - entering traffic
// yields to anyone already circulating within this angular window).
export const ROUNDABOUT_YIELD_WINDOW_DEG = 32;
export const ROUNDABOUT_MIN_RING_GAP_DEG = 12;

// Dual-intersection canvas: 2:1 landscape (1600 x 800 virtual units)
export const CANVAS_W = 1600;
export const CANVAS_H = 800;
// Center X of each intersection in the canvas
export const INT_CENTERS = [400, 1200];

// Vehicle Physical Specs
// len: physical vehicle length in sim units (1 unit ~ 2px)
// v_max: peak cruising velocity (km/h scale)
// accel_rate: acceleration agility multiplier
// mass_kg: vehicle curb weight for inertia calculations
// prob: default spawn probability distribution
export const VEHICLE_SPECS = {
    coupe: { len: 17, v_max: 72, accel_rate: 1.25, mass_kg: 1650, prob: 0.22, name: 'M-Coupe' },
    sedan: { len: 19, v_max: 64, accel_rate: 1.10, mass_kg: 1980, prob: 0.25, name: 'Gran Sedan' },
    suv: { len: 20, v_max: 58, accel_rate: 0.95, mass_kg: 2450, prob: 0.20, name: 'M-SAV' },
    prototype: { len: 18, v_max: 82, accel_rate: 1.45, mass_kg: 1350, prob: 0.08, name: 'GT Prototype' },
    van: { len: 22, v_max: 48, accel_rate: 0.85, mass_kg: 2600, prob: 0.10, name: 'Transporter' },
    truck: { len: 34, v_max: 38, accel_rate: 0.60, mass_kg: 14000, prob: 0.05, name: 'Heavy Hauler' },
    bus: { len: 32, v_max: 36, accel_rate: 0.55, mass_kg: 12500, prob: 0.04, name: 'Transit Bus' },
    interceptor: { len: 18, v_max: 88, accel_rate: 1.60, mass_kg: 1780, prob: 0.01, name: 'M-Interceptor' },
    bike: { len: 11, v_max: 75, accel_rate: 1.30, mass_kg: 220, prob: 0.05, name: 'Sportbike' },
};

