import React, { memo } from 'react';
import { motion } from 'framer-motion';
import TrafficLight from './TrafficLight';
import Vehicle from './Vehicle';
import RainEffect from './RainEffect';

const ZEBRA_H = 'repeating-linear-gradient(90deg, rgba(255,255,255,0.13) 0px, rgba(255,255,255,0.13) 10px, transparent 10px, transparent 20px)';
const ZEBRA_V = 'repeating-linear-gradient(0deg, rgba(255,255,255,0.13) 0px, rgba(255,255,255,0.13) 10px, transparent 10px, transparent 20px)';

// Tiny person silhouette SVG (head + body)
const PersonIcon = () => (
  <svg width="7" height="13" viewBox="0 0 7 13" fill="currentColor">
    <circle cx="3.5" cy="2.5" r="2.2" />
    <rect x="1" y="5.5" width="5" height="7" rx="1.5" />
  </svg>
);

// Card showing 3 waiting people — fades in/out based on `visible` prop.
// posStyle must include top/bottom/left/right AND a CSS transform for centering.
const WaitingCard = memo(({ posStyle, visible }) => (
  <div className="absolute z-30 pointer-events-none select-none" style={posStyle}>
    <motion.div
      animate={{ opacity: visible ? 1 : 0, scale: visible ? 1 : 0.8 }}
      transition={{ duration: 0.3 }}
      className="flex gap-px items-end text-white/70 bg-mono-950/65 border border-mono-600/40 rounded-md px-1.5 py-1"
    >
      <PersonIcon />
      <PersonIcon />
      <PersonIcon />
    </motion.div>
  </div>
));

// Animated pedestrian dot that walks across the crossing strip.
const PedestrianFigure = memo(({ side }) => {
  const horiz = side === 'north' || side === 'south';
  return (
    <motion.div
      className="absolute w-2 h-2 rounded-full bg-white/80 shadow-sm"
      initial={horiz ? { left: '5%', top: '20%' } : { top: '5%', left: '20%' }}
      animate={horiz ? { left: ['5%', '95%'] } : { top: ['5%', '95%'] }}
      transition={{ duration: 5.5, repeat: Infinity, ease: 'linear', repeatDelay: 0.8 }}
    />
  );
});

// Zebra crossing strip with a walk/stop signal dot and pedestrian figure.
const PedestrianCrossing = memo(({ side, canWalk }) => {
  const horiz = side === 'north' || side === 'south';
  const base = horiz
    ? 'absolute left-1/2 -translate-x-1/2 h-5 z-30'
    : 'absolute top-1/2 -translate-y-1/2 w-5 z-30';
  const posStyle = {
    north: { top: '26%' },
    south: { bottom: '26%' },
    east:  { right: '26%' },
    west:  { left: '26%' },
  }[side];
  const signalEdge = {
    north: 'top-0.5 right-0.5',
    south: 'bottom-0.5 left-0.5',
    east:  'top-0.5 right-0.5',
    west:  'bottom-0.5 left-0.5',
  }[side];
  return (
    <div
      className={base}
      style={{ ...posStyle, background: horiz ? ZEBRA_H : ZEBRA_V, ...(horiz ? { width: '40%' } : { height: '40%' }) }}
    >
      {/* Walk/Stop signal dot */}
      <div
        className={`absolute w-3 h-3 rounded-full transition-colors duration-300 ${signalEdge} ${
          canWalk
            ? 'bg-green-400 shadow-[0_0_7px_rgba(74,222,128,0.85)]'
            : 'bg-red-500 shadow-[0_0_5px_rgba(239,68,68,0.65)]'
        }`}
      />
      {canWalk && <PedestrianFigure side={side} />}
    </div>
  );
});

const RoadBackdrop = memo(() => (
  <>
    {/* N-S ROAD (40% width, percentage-based) */}
    <div className="absolute left-1/2 -translate-x-1/2 h-full bg-mono-800/90 border-x border-mono-700/70" style={{ width: '40%' }}>
      <div className="absolute left-1/2 h-full border-l-2 border-mono-300/20" />
      <div className="absolute left-[32%] h-full border-l border-dashed border-mono-400/20" />
      <div className="absolute left-[20%] h-full border-l border-dashed border-mono-400/20" />
      <div className="absolute right-[32%] h-full border-l border-dashed border-mono-400/20" />
      <div className="absolute right-[20%] h-full border-l border-dashed border-mono-400/20" />

      {/* STOP LINES at 25% */}
      <div className="absolute top-[25%] w-full h-4 bg-mono-300/10" />
      <div className="absolute bottom-[25%] w-full h-4 bg-mono-300/10" />
    </div>

    {/* E-W ROAD (40% height, percentage-based) */}
    <div className="absolute top-1/2 -translate-y-1/2 w-full bg-mono-800/90 border-y border-mono-700/70" style={{ height: '40%' }}>
      <div className="absolute top-1/2 w-full border-t-2 border-mono-300/20" />
      <div className="absolute top-[32%] w-full border-t border-dashed border-mono-400/20" />
      <div className="absolute top-[20%] w-full border-t border-dashed border-mono-400/20" />
      <div className="absolute bottom-[32%] w-full border-t border-dashed border-mono-400/20" />
      <div className="absolute bottom-[20%] w-full border-t border-dashed border-mono-400/20" />

      {/* STOP LINES at 25% */}
      <div className="absolute left-[25%] h-full w-4 bg-mono-300/10" />
      <div className="absolute right-[25%] h-full w-4 bg-mono-300/10" />
    </div>

    {/* INTERSECTION BOX */}
    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-mono-800/90 z-0" style={{ width: '40%', height: '40%' }} />
  </>
));

const RoadLayer = ({ roads, lightState, weather, speedFactor }) => {
  const northLight = lightState === 'N_GREEN' ? 'GREEN' : lightState === 'N_YELLOW' ? 'YELLOW' : 'RED';
  const southLight = lightState === 'S_GREEN' ? 'GREEN' : lightState === 'S_YELLOW' ? 'YELLOW' : 'RED';
  const eastLight = lightState === 'E_GREEN' ? 'GREEN' : lightState === 'E_YELLOW' ? 'YELLOW' : 'RED';
  const westLight = lightState === 'W_GREEN' ? 'GREEN' : lightState === 'W_YELLOW' ? 'YELLOW' : 'RED';

  // Pedestrians cross perpendicular to moving traffic.
  // N/S crossings span the N-S road → safe to walk only when E-W vehicles have green (N-S traffic stopped).
  // E/W crossings span the E-W road → safe to walk only when N-S vehicles have green (E-W traffic stopped).
  const nsCanWalk = lightState === 'E_GREEN' || lightState === 'W_GREEN';
  const ewCanWalk = lightState === 'N_GREEN' || lightState === 'S_GREEN';

  return (
    <div className="relative aspect-square w-full bg-mono-900 rounded-[20px] border border-mono-700/70 shadow-soft overflow-hidden asphalt inset-shadow">
      {weather === 'rain' && <RainEffect />}

      <RoadBackdrop />

      {/* PEDESTRIAN CROSSINGS */}
      <PedestrianCrossing side="north" canWalk={nsCanWalk} />
      <PedestrianCrossing side="south" canWalk={nsCanWalk} />
      <PedestrianCrossing side="east"  canWalk={ewCanWalk} />
      <PedestrianCrossing side="west"  canWalk={ewCanWalk} />

      {/* WAITING PEDESTRIAN CARDS — sidewalk corners, visible when crossing signal is red */}
      {/* North crossing — left & right sidewalk at top 26% */}
      <WaitingCard posStyle={{ top: '26%', left:  '12%', transform: 'translateY(-50%)' }} visible={!nsCanWalk} />
      <WaitingCard posStyle={{ top: '26%', right: '12%', transform: 'translateY(-50%)' }} visible={!nsCanWalk} />
      {/* South crossing — left & right sidewalk at bottom 26% */}
      <WaitingCard posStyle={{ bottom: '26%', left:  '12%', transform: 'translateY(50%)' }} visible={!nsCanWalk} />
      <WaitingCard posStyle={{ bottom: '26%', right: '12%', transform: 'translateY(50%)' }} visible={!nsCanWalk} />
      {/* East crossing — top & bottom sidewalk at right 26% */}
      <WaitingCard posStyle={{ right: '26%', top:    '12%', transform: 'translateX(50%)' }} visible={!ewCanWalk} />
      <WaitingCard posStyle={{ right: '26%', bottom: '12%', transform: 'translateX(50%)' }} visible={!ewCanWalk} />
      {/* West crossing — top & bottom sidewalk at left 26% */}
      <WaitingCard posStyle={{ left: '26%', top:    '12%', transform: 'translateX(-50%)' }} visible={!ewCanWalk} />
      <WaitingCard posStyle={{ left: '26%', bottom: '12%', transform: 'translateX(-50%)' }} visible={!ewCanWalk} />

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
