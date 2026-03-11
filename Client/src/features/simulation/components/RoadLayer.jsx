import React, { memo } from 'react';
import TrafficLight from './TrafficLight';
import Vehicle from './Vehicle';
import RainEffect from './RainEffect';

// --- Road backdrop for two connected intersections in a 2:1 landscape box ---
// Canvas: 1600×800 virtual units
// Int 0 center: 25% x, 50% y   |   Int 1 center: 75% x, 50% y
// Intersection boxes: 20% width × 40% height
// N-S roads: 20% width, full height at each intersection
// E-W road: full width, 40% height

const RoadBackdrop = memo(() => (
  <>
    {/* E-W ROAD — full width, 40% height, centered vertically */}
    <div className="absolute top-1/2 -translate-y-1/2 w-full bg-mono-800/90 border-y border-mono-700/70" style={{ height: '40%' }}>
      <div className="absolute top-1/2 w-full border-t-2 border-mono-300/20" />
      <div className="absolute top-[28%] w-full border-t border-dashed border-mono-400/20" />
      <div className="absolute bottom-[28%] w-full border-t border-dashed border-mono-400/20" />
    </div>

    {/* N-S ROAD at Int 0 (center at 25%) */}
    <div className="absolute h-full bg-mono-800/90 border-x border-mono-700/70" style={{ left: '15%', width: '20%' }}>
      <div className="absolute left-1/2 h-full border-l-2 border-mono-300/20" />
      <div className="absolute left-[28%] h-full border-l border-dashed border-mono-400/20" />
      <div className="absolute right-[28%] h-full border-l border-dashed border-mono-400/20" />
      <div className="absolute w-full h-1 bg-mono-300/20" style={{ top: '30%' }} />
      <div className="absolute w-full h-1 bg-mono-300/20" style={{ bottom: '30%' }} />
    </div>

    {/* N-S ROAD at Int 1 (center at 75%) */}
    <div className="absolute h-full bg-mono-800/90 border-x border-mono-700/70" style={{ left: '65%', width: '20%' }}>
      <div className="absolute left-1/2 h-full border-l-2 border-mono-300/20" />
      <div className="absolute left-[28%] h-full border-l border-dashed border-mono-400/20" />
      <div className="absolute right-[28%] h-full border-l border-dashed border-mono-400/20" />
      <div className="absolute w-full h-1 bg-mono-300/20" style={{ top: '30%' }} />
      <div className="absolute w-full h-1 bg-mono-300/20" style={{ bottom: '30%' }} />
    </div>

    {/* INTERSECTION BOXES */}
    <div className="absolute bg-mono-800/90 z-0" style={{ left: '15%', top: '30%', width: '20%', height: '40%' }} />
    <div className="absolute bg-mono-800/90 z-0" style={{ left: '65%', top: '30%', width: '20%', height: '40%' }} />

    {/* E-W stop lines at each intersection edge */}
    <div className="absolute bg-mono-300/20 z-[1]" style={{ left: '15%', top: '30%', width: '1px', height: '40%' }} />
    <div className="absolute bg-mono-300/20 z-[1]" style={{ left: '35%', top: '30%', width: '1px', height: '40%' }} />
    <div className="absolute bg-mono-300/20 z-[1]" style={{ left: '65%', top: '30%', width: '1px', height: '40%' }} />
    <div className="absolute bg-mono-300/20 z-[1]" style={{ left: '85%', top: '30%', width: '1px', height: '40%' }} />

    {/* Intersection labels */}
    <div className="absolute z-30 text-[9px] uppercase tracking-[0.25em] text-mono-500/60 font-semibold" style={{ left: '25%', top: '72%', transform: 'translateX(-50%)' }}>
      Intersection A
    </div>
    <div className="absolute z-30 text-[9px] uppercase tracking-[0.25em] text-mono-500/60 font-semibold" style={{ left: '75%', top: '72%', transform: 'translateX(-50%)' }}>
      Intersection B
    </div>
  </>
));

function getLightColor(lightState, dir) {
  const prefix = dir.charAt(0).toUpperCase();
  if (lightState === `${prefix}_GREEN`) return 'GREEN';
  if (lightState === `${prefix}_YELLOW`) return 'YELLOW';
  return 'RED';
}

const RoadLayer = ({ data, weather, speedFactor }) => {
  const { intersections } = data;
  const int0 = intersections[0];
  const int1 = intersections[1];

  return (
    <div className="relative w-full bg-mono-900 rounded-[20px] border border-mono-700/70 shadow-soft overflow-hidden asphalt inset-shadow" style={{ aspectRatio: '2 / 1' }}>
      {weather === 'rain' && <RainEffect />}

      <RoadBackdrop />

      {/* TRAFFIC LIGHTS — Int 0 corners */}
      <div className="absolute z-40" style={{ top: '28%', left: '14%' }}>
        <TrafficLight state={getLightColor(int0.light_state, 'south')} />
      </div>
      <div className="absolute z-40" style={{ top: '28%', left: '35%' }}>
        <TrafficLight state={getLightColor(int0.light_state, 'west')} />
      </div>
      <div className="absolute z-40" style={{ bottom: '28%', left: '35%' }}>
        <TrafficLight state={getLightColor(int0.light_state, 'north')} />
      </div>
      <div className="absolute z-40" style={{ bottom: '28%', left: '14%' }}>
        <TrafficLight state={getLightColor(int0.light_state, 'east')} />
      </div>

      {/* TRAFFIC LIGHTS — Int 1 corners */}
      <div className="absolute z-40" style={{ top: '28%', left: '64%' }}>
        <TrafficLight state={getLightColor(int1.light_state, 'south')} />
      </div>
      <div className="absolute z-40" style={{ top: '28%', left: '85%' }}>
        <TrafficLight state={getLightColor(int1.light_state, 'west')} />
      </div>
      <div className="absolute z-40" style={{ bottom: '28%', left: '85%' }}>
        <TrafficLight state={getLightColor(int1.light_state, 'north')} />
      </div>
      <div className="absolute z-40" style={{ bottom: '28%', left: '64%' }}>
        <TrafficLight state={getLightColor(int1.light_state, 'east')} />
      </div>

      {/* VEHICLES — all from both intersections */}
      <div className="absolute inset-0 z-10">
        {intersections.map((ix) =>
          Object.values(ix.roads).map((lanes) =>
            lanes.map((cars) =>
              cars.map((c) => (
                <Vehicle key={c.id} data={c} speedFactor={speedFactor} />
              ))
            )
          )
        )}
      </div>
    </div>
  );
};

export default memo(RoadLayer);
