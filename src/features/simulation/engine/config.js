// src/features/simulation/engine/config.js
export const ROAD_LENGTH = 400;
export const STOP_LINE = 100;
export const INTERSECTION_EXIT = 280;
export const SAFE_HEADWAY = 2.0;
export const MIN_GAP = 12.0;
export const ACCEL_MAX = 3.0;
export const DECEL_COMF = 2.5;

// Wet-road driving model: lower tire grip means weaker braking/accel authority,
// a lower comfortable top speed, and drivers leaving more following distance.
export const RAIN_BRAKE_GRIP = 0.6;      // multiplier on braking deceleration
export const RAIN_ACCEL_GRIP = 0.8;      // multiplier on positive acceleration
export const RAIN_SPEED_FACTOR = 0.85;   // multiplier on each vehicle's cruising speed cap
export const RAIN_HEADWAY_FACTOR = 1.3;  // multiplier on desired time headway

// Roundabout yield-at-entry model (no traffic signals - entering traffic
// yields to anyone already circulating within this angular window).
export const ROUNDABOUT_YIELD_WINDOW_DEG = 30;
export const ROUNDABOUT_MIN_RING_GAP_DEG = 11;

// Dual-intersection canvas: 2:1 landscape (1600 x 800 virtual units)
export const CANVAS_W = 1600;
export const CANVAS_H = 800;
// Center X of each intersection in the canvas
export const INT_CENTERS = [400, 1200];

// Vehicle Specs (Lengths updated to match visual pixel sizes: 1 unit = 2px)
export const VEHICLE_SPECS = {
    car: { len: 16, v_max: 60, prob: 0.45 },
    suv: { len: 18, v_max: 55, prob: 0.25 },
    truck: { len: 32, v_max: 40, prob: 0.10 },
    bus: { len: 28, v_max: 35, prob: 0.05 },
    jeepney: { len: 20, v_max: 45, prob: 0.10 },
    bike: { len: 10, v_max: 70, prob: 0.05 },
};
