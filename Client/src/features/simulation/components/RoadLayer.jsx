import React, { memo } from 'react';
import TrafficLight from './TrafficLight';
import Vehicle from './Vehicle';
import RainEffect from './RainEffect';

const RoadBackdrop = memo(() => (
  <>
    {/* N-S ROAD (Wider 320px) */}
    <div className="absolute left-1/2 -translate-x-1/2 w-80 h-full bg-mono-800/90 border-x border-mono-700/70">
      <div className="absolute left-1/2 h-full border-l-2 border-mono-300/20" />
      <div className="absolute left-1/4 h-full border-l border-dashed border-mono-400/20" />
      <div className="absolute right-1/4 h-full border-l border-dashed border-mono-400/20" />

      {/* STOP LINES at 25% */}
      <div className="absolute top-[25%] w-full h-4 bg-mono-300/10" />
      <div className="absolute bottom-[25%] w-full h-4 bg-mono-300/10" />
    </div>

    {/* E-W ROAD (Wider 320px) */}
    <div className="absolute top-1/2 -translate-y-1/2 h-80 w-full bg-mono-800/90 border-y border-mono-700/70">
      <div className="absolute top-1/2 w-full border-t-2 border-mono-300/20" />
      <div className="absolute top-1/4 w-full border-t border-dashed border-mono-400/20" />
      <div className="absolute bottom-1/4 w-full border-t border-dashed border-mono-400/20" />

      {/* STOP LINES at 25% */}
      <div className="absolute left-[25%] h-full w-4 bg-mono-300/10" />
      <div className="absolute right-[25%] h-full w-4 bg-mono-300/10" />
    </div>

    {/* INTERSECTION BOX */}
    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-mono-800/90 z-0" />
  </>
));

const RoadLayer = ({ roads, lightState, weather, speedFactor }) => {
  const northLight = lightState === 'N_GREEN' ? 'GREEN' : lightState === 'N_YELLOW' ? 'YELLOW' : 'RED';
  const southLight = lightState === 'S_GREEN' ? 'GREEN' : lightState === 'S_YELLOW' ? 'YELLOW' : 'RED';
  const eastLight = lightState === 'E_GREEN' ? 'GREEN' : lightState === 'E_YELLOW' ? 'YELLOW' : 'RED';
  const westLight = lightState === 'W_GREEN' ? 'GREEN' : lightState === 'W_YELLOW' ? 'YELLOW' : 'RED';

  return (
    <div className="relative aspect-square w-[min(78vw,780px)] bg-mono-900 rounded-[28px] border border-mono-700/70 shadow-soft overflow-hidden asphalt inset-shadow">
      {weather === 'rain' && <RainEffect />}

      <RoadBackdrop />

      {/* LIGHTS */}
      {/* North-South Lights */}
      <div className="absolute top-[24%] left-[24%] z-40"><TrafficLight state={southLight} /></div>
      <div className="absolute bottom-[24%] right-[24%] z-40"><TrafficLight state={northLight} /></div>

      {/* East-West Lights */}
      <div className="absolute top-[24%] right-[24%] z-40"><TrafficLight state={westLight} /></div>
      <div className="absolute bottom-[24%] left-[24%] z-40"><TrafficLight state={eastLight} /></div>

      {/* CARS */}
      <div className="absolute inset-0 z-10">
        {Object.entries(roads).map(([, lanes]) =>
          lanes.map((cars) =>
            cars.map((c) => (
              <Vehicle
                key={c.id}
                data={c}
                speedFactor={speedFactor}
              />
            ))
          )
        )}
      </div>
    </div>
  );
};

export default memo(RoadLayer);
