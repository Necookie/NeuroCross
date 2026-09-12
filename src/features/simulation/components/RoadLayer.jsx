import React, { memo } from 'react';
import TrafficLight from './TrafficLight';
import Vehicle from './Vehicle';
import RainEffect from './RainEffect';

const CROSS_VERTICAL_ROAD_WIDTH = 24;
const CROSS_HORIZONTAL_ROAD_HEIGHT = 48;
const CROSS_ROAD_OFFSET_X = (100 - CROSS_VERTICAL_ROAD_WIDTH) / 2;
const CROSS_ROAD_OFFSET_Y = (100 - CROSS_HORIZONTAL_ROAD_HEIGHT) / 2;
const CROSS_LANE_DASH_LEFT = CROSS_ROAD_OFFSET_X + (CROSS_VERTICAL_ROAD_WIDTH * 0.25);
const CROSS_LANE_DASH_RIGHT = CROSS_ROAD_OFFSET_X + (CROSS_VERTICAL_ROAD_WIDTH * 0.75);
const CROSS_INTERSECTION_RIGHT = CROSS_ROAD_OFFSET_X + CROSS_VERTICAL_ROAD_WIDTH;
const CROSS_INTERSECTION_BOTTOM = CROSS_ROAD_OFFSET_Y + CROSS_HORIZONTAL_ROAD_HEIGHT;

// Motorsport Curb Rumble Strip (Alternating M-Blue / White or Red / White)
const CurbStripe = ({ style, horizontal = false }) => (
  <div
    className={`absolute z-[4] pointer-events-none ${
      horizontal
        ? 'bg-[repeating-linear-gradient(90deg,#0066b1_0_8px,#ffffff_8px_16px,#e22718_16px_24px)]'
        : 'bg-[repeating-linear-gradient(180deg,#0066b1_0_8px,#ffffff_8px_16px,#e22718_16px_24px)]'
    } shadow-sm opacity-90`}
    style={style}
  />
);

// Painted Lane Arrow (Turn Left, Straight, Turn Right)
const LaneArrow = ({ type = 'straight', style }) => (
  <div
    className="absolute z-[3] pointer-events-none opacity-40 text-white flex items-center justify-center font-black"
    style={style}
  >
    <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
      {type === 'straight' && (
        <path d="M 12 2 L 6 8 L 10 8 L 10 22 L 14 22 L 14 8 L 18 8 Z" />
      )}
      {type === 'left' && (
        <path d="M 2 12 L 8 6 L 8 10 L 16 10 Q 20 10 20 14 L 20 22 L 17 22 L 17 14 Q 17 13 14 13 L 8 13 L 8 18 Z" />
      )}
      {type === 'right' && (
        <path d="M 22 12 L 16 6 L 16 10 L 8 10 Q 4 10 4 14 L 4 22 L 7 22 L 7 14 Q 7 13 10 13 L 16 13 L 16 18 Z" />
      )}
    </svg>
  </div>
);

const SingleCrossBackdrop = memo(() => (
  <>
    {/* High-Performance Dark Asphalt Floor */}
    {/* Horizontal Road */}
    <div
      className="absolute top-1/2 left-0 -translate-y-1/2 w-full bg-[#11141a] border-y border-[#2b2b2b]"
      style={{ height: `${CROSS_HORIZONTAL_ROAD_HEIGHT}%` }}
    >
      <div className="absolute top-1/2 w-full border-t border-white/40" />
      <div className="absolute top-[25%] w-full border-t border-dashed border-white/20" />
      <div className="absolute bottom-[25%] w-full border-t border-dashed border-white/20" />

      {/* Directional Painted Chevrons */}
      <LaneArrow type="straight" style={{ top: '12%', left: '16%', transform: 'rotate(90deg)' }} />
      <LaneArrow type="right" style={{ top: '35%', left: '16%', transform: 'rotate(90deg)' }} />
      <LaneArrow type="straight" style={{ top: '60%', right: '16%', transform: 'rotate(-90deg)' }} />
      <LaneArrow type="left" style={{ top: '82%', right: '16%', transform: 'rotate(-90deg)' }} />
    </div>

    {/* Vertical Road */}
    <div
      className="absolute h-full bg-[#11141a] border-x border-[#2b2b2b]"
      style={{ left: `${CROSS_ROAD_OFFSET_X}%`, width: `${CROSS_VERTICAL_ROAD_WIDTH}%` }}
    >
      <div className="absolute left-1/2 h-full border-l border-white/40" />
      <div
        className="absolute h-full border-l border-dashed border-white/20"
        style={{ left: `${((CROSS_LANE_DASH_LEFT - CROSS_ROAD_OFFSET_X) / CROSS_VERTICAL_ROAD_WIDTH) * 100}%` }}
      />
      <div
        className="absolute h-full border-l border-dashed border-white/20"
        style={{ left: `${((CROSS_LANE_DASH_RIGHT - CROSS_ROAD_OFFSET_X) / CROSS_VERTICAL_ROAD_WIDTH) * 100}%` }}
      />

      {/* Directional Painted Chevrons Vertical */}
      <LaneArrow type="straight" style={{ top: '10%', left: '15%', transform: 'rotate(180deg)' }} />
      <LaneArrow type="left" style={{ top: '10%', right: '15%', transform: 'rotate(180deg)' }} />
      <LaneArrow type="straight" style={{ bottom: '10%', right: '15%', transform: 'rotate(0deg)' }} />
      <LaneArrow type="right" style={{ bottom: '10%', left: '15%', transform: 'rotate(0deg)' }} />
    </div>

    {/* Intersection Box */}
    <div
      className="absolute bg-[#0f1218] z-0"
      style={{
        left: `${CROSS_ROAD_OFFSET_X}%`,
        top: `${CROSS_ROAD_OFFSET_Y}%`,
        width: `${CROSS_VERTICAL_ROAD_WIDTH}%`,
        height: `${CROSS_HORIZONTAL_ROAD_HEIGHT}%`,
      }}
    />

    {/* Motorsport Corner Curbs */}
    <CurbStripe horizontal style={{ left: `${CROSS_ROAD_OFFSET_X - 6}%`, top: `${CROSS_ROAD_OFFSET_Y - 2}%`, width: '6%', height: '4px' }} />
    <CurbStripe horizontal style={{ left: `${CROSS_INTERSECTION_RIGHT}%`, top: `${CROSS_ROAD_OFFSET_Y - 2}%`, width: '6%', height: '4px' }} />
    <CurbStripe horizontal style={{ left: `${CROSS_ROAD_OFFSET_X - 6}%`, top: `${CROSS_INTERSECTION_BOTTOM}%`, width: '6%', height: '4px' }} />
    <CurbStripe horizontal style={{ left: `${CROSS_INTERSECTION_RIGHT}%`, top: `${CROSS_INTERSECTION_BOTTOM}%`, width: '6%', height: '4px' }} />

    {/* Stop Lines */}
    <div className="absolute bg-white/90 z-[2] shadow-[0_0_2px_#ffffff]" style={{ left: `${CROSS_ROAD_OFFSET_X}%`, top: `${CROSS_ROAD_OFFSET_Y}%`, width: '3px', height: `${CROSS_HORIZONTAL_ROAD_HEIGHT}%` }} />
    <div className="absolute bg-white/90 z-[2] shadow-[0_0_2px_#ffffff]" style={{ left: `${CROSS_INTERSECTION_RIGHT}%`, top: `${CROSS_ROAD_OFFSET_Y}%`, width: '3px', height: `${CROSS_HORIZONTAL_ROAD_HEIGHT}%` }} />
    <div className="absolute bg-white/90 z-[2] shadow-[0_0_2px_#ffffff]" style={{ left: '0%', top: `${CROSS_ROAD_OFFSET_Y}%`, width: `${CROSS_ROAD_OFFSET_X}%`, height: '3px' }} />
    <div className="absolute bg-white/90 z-[2] shadow-[0_0_2px_#ffffff]" style={{ left: `${CROSS_INTERSECTION_RIGHT}%`, top: `${CROSS_ROAD_OFFSET_Y}%`, width: `${CROSS_ROAD_OFFSET_X}%`, height: '3px' }} />
    <div className="absolute bg-white/90 z-[2] shadow-[0_0_2px_#ffffff]" style={{ left: '0%', top: `${CROSS_INTERSECTION_BOTTOM}%`, width: `${CROSS_ROAD_OFFSET_X}%`, height: '3px' }} />
    <div className="absolute bg-white/90 z-[2] shadow-[0_0_2px_#ffffff]" style={{ left: `${CROSS_INTERSECTION_RIGHT}%`, top: `${CROSS_INTERSECTION_BOTTOM}%`, width: `${CROSS_ROAD_OFFSET_X}%`, height: '3px' }} />

    {/* Crosswalk Zebra Markings */}
    <div className="absolute z-[3] bg-[repeating-linear-gradient(90deg,rgba(255,255,255,0.7)_0_6px,transparent_6px_14px)]" style={{ left: '30%', top: '26.6%', width: '7.5%', height: '4.8%' }} />
    <div className="absolute z-[3] bg-[repeating-linear-gradient(90deg,rgba(255,255,255,0.7)_0_6px,transparent_6px_14px)]" style={{ left: '62.5%', top: '26.6%', width: '7.5%', height: '4.8%' }} />
    <div className="absolute z-[3] bg-[repeating-linear-gradient(90deg,rgba(255,255,255,0.7)_0_6px,transparent_6px_14px)]" style={{ left: '30%', top: '68.6%', width: '7.5%', height: '4.8%' }} />
    <div className="absolute z-[3] bg-[repeating-linear-gradient(90deg,rgba(255,255,255,0.7)_0_6px,transparent_6px_14px)]" style={{ left: '62.5%', top: '68.6%', width: '7.5%', height: '4.8%' }} />

    <div className="absolute z-[3] bg-[repeating-linear-gradient(180deg,rgba(255,255,255,0.7)_0_6px,transparent_6px_14px)]" style={{ left: '38.6%', top: '17%', width: '4.8%', height: '8.5%' }} />
    <div className="absolute z-[3] bg-[repeating-linear-gradient(180deg,rgba(255,255,255,0.7)_0_6px,transparent_6px_14px)]" style={{ left: '56.6%', top: '17%', width: '4.8%', height: '8.5%' }} />
    <div className="absolute z-[3] bg-[repeating-linear-gradient(180deg,rgba(255,255,255,0.7)_0_6px,transparent_6px_14px)]" style={{ left: '38.6%', top: '74.5%', width: '4.8%', height: '8.5%' }} />
    <div className="absolute z-[3] bg-[repeating-linear-gradient(180deg,rgba(255,255,255,0.7)_0_6px,transparent_6px_14px)]" style={{ left: '56.6%', top: '74.5%', width: '4.8%', height: '8.5%' }} />
  </>
));

const SingleRoundaboutBackdrop = memo(() => {
  const canvasAspect = 2;
  const verticalRoadWidth = 16;
  const horizontalRoadHeight = verticalRoadWidth * canvasAspect;
  const roadOffsetX = (100 - verticalRoadWidth) / 2;
  const roadOffsetY = (100 - horizontalRoadHeight) / 2;
  const verticalLaneDashLeft = roadOffsetX + (verticalRoadWidth * 0.28);
  const verticalLaneDashRight = roadOffsetX + (verticalRoadWidth * 0.72);
  const horizontalLaneDashTop = roadOffsetY + (horizontalRoadHeight * 0.28);
  const horizontalLaneDashBottom = roadOffsetY + (horizontalRoadHeight * 0.72);
  const capSize = 34;

  return (
    <>
      <div className="absolute bg-[#11141a] border-y border-[#2b2b2b]" style={{ left: `${roadOffsetX}%`, top: '0%', width: `${verticalRoadWidth}%`, height: '100%' }} />
      <div className="absolute bg-[#11141a] border-x border-[#2b2b2b]" style={{ left: '0%', top: `${roadOffsetY}%`, width: '100%', height: `${horizontalRoadHeight}%` }} />

      <div className="absolute z-[3] border-l border-dashed border-white/20" style={{ left: `${verticalLaneDashLeft}%`, top: '0%', height: '100%' }} />
      <div className="absolute z-[3] border-l border-dashed border-white/20" style={{ left: `${verticalLaneDashRight}%`, top: '0%', height: '100%' }} />

      <div className="absolute z-[3] border-t border-dashed border-white/20" style={{ left: '0%', top: `${horizontalLaneDashTop}%`, width: '100%' }} />
      <div className="absolute z-[3] border-t border-dashed border-white/20" style={{ left: '0%', top: `${horizontalLaneDashBottom}%`, width: '100%' }} />

      {/* Roundabout Ring */}
      <div className="absolute z-[1] rounded-full bg-[#11141a] border border-[#333333] shadow-inner" style={{ left: '50%', top: '50%', width: `${capSize}%`, aspectRatio: '1 / 1', transform: 'translate(-50%, -50%)' }} />
      <div className="absolute z-[3] rounded-full border border-dashed border-white/30" style={{ left: '50%', top: '50%', width: '26%', aspectRatio: '1 / 1', transform: 'translate(-50%, -50%)' }} />

      {/* High-Tech Center Island with M-Tricolor Core Ring */}
      <div className="absolute z-[2] rounded-full border border-[#3c3c3c] bg-[#07090c] shadow-2xl" style={{ left: '50%', top: '50%', width: '16%', aspectRatio: '1 / 1', transform: 'translate(-50%, -50%)' }}>
        <div className="w-full h-full rounded-full border border-[#222222] flex items-center justify-center relative overflow-hidden">
          {/* Concentric telemetry rings */}
          <div className="w-16 h-16 rounded-full border border-white/10 flex items-center justify-center">
            <div className="w-10 h-10 rounded-full border border-[#1c69d4]/40 flex items-center justify-center">
              <div className="w-4 h-4 rounded-full bg-[#0066b1] border border-white/80 animate-pulse shadow-[0_0_8px_#0066b1]" />
            </div>
          </div>
          {/* M-Stripe Accents on Island */}
          <div className="absolute bottom-1 w-8 h-1 flex rounded-none overflow-hidden">
            <div className="flex-1 bg-[#0066b1]" />
            <div className="flex-1 bg-[#1c69d4]" />
            <div className="flex-1 bg-[#e22718]" />
          </div>
        </div>
      </div>
    </>
  );
});

const TIntersectionBackdrop = memo(() => (
  <>
    {/* Main Horizontal Highway Road */}
    <div className="absolute bg-[#11141a] border-y border-[#2b2b2b]" style={{ left: '0%', top: '25%', width: '100%', height: '30%' }}>
      <div className="absolute top-1/2 w-full border-t border-white/40" />
      <div className="absolute top-[28%] w-full border-t border-dashed border-white/20" />
      <div className="absolute bottom-[28%] w-full border-t border-dashed border-white/20" />

      <LaneArrow type="straight" style={{ top: '15%', left: '20%', transform: 'rotate(90deg)' }} />
      <LaneArrow type="right" style={{ top: '40%', left: '30%', transform: 'rotate(90deg)' }} />
      <LaneArrow type="left" style={{ top: '65%', right: '30%', transform: 'rotate(-90deg)' }} />
      <LaneArrow type="straight" style={{ top: '80%', right: '20%', transform: 'rotate(-90deg)' }} />
    </div>

    {/* Stem Road (South) */}
    <div className="absolute bg-[#11141a] border-x border-[#2b2b2b]" style={{ left: '40%', top: '40%', width: '20%', height: '60%' }}>
      <div className="absolute left-1/2 h-full border-l border-white/40" />
      <div className="absolute h-full border-l border-dashed border-white/20" style={{ left: '28%' }} />
      <div className="absolute h-full border-l border-dashed border-white/20" style={{ left: '72%' }} />

      <LaneArrow type="left" style={{ bottom: '15%', left: '15%', transform: 'rotate(0deg)' }} />
      <LaneArrow type="right" style={{ bottom: '15%', right: '15%', transform: 'rotate(0deg)' }} />
    </div>

    {/* Intersection Box */}
    <div className="absolute bg-[#0f1218] z-0" style={{ left: '40%', top: '25%', width: '20%', height: '30%' }} />

    {/* Stop Lines */}
    <div className="absolute bg-white/90 z-[2]" style={{ left: '40%', top: '25%', width: '3px', height: '30%' }} />
    <div className="absolute bg-white/90 z-[2]" style={{ left: '60%', top: '25%', width: '3px', height: '30%' }} />
    <div className="absolute bg-white/90 z-[2]" style={{ left: '40%', top: '55%', width: '20%', height: '3px' }} />
  </>
));

const DIRECTION_CODE = { north: 'N', south: 'S', east: 'E', west: 'W' };

const getLightColor = (lightState, dir) => {
  if (!lightState) return 'RED';

  if (typeof lightState === 'object') {
    return lightState[dir] || 'RED';
  }

  const sepIdx = lightState.indexOf('_');
  if (sepIdx === -1) return 'RED';

  const activeCode = lightState.slice(0, sepIdx);
  const phase = lightState.slice(sepIdx + 1);
  if (phase === 'ALL_RED') return 'RED';
  return DIRECTION_CODE[dir] === activeCode ? phase : 'RED';
};

const RoadLayer = ({
  data,
  weather,
  speedFactor,
  intersectionType = 'cross',
  selectedVehicleId = null,
  onSelectVehicle,
}) => {
  const intersections = data?.intersections || [];
  const int0 = intersections[0] || { light_state: {} };

  const isSingleRoundabout = intersectionType === 'roundabout';
  const isTIntersection = intersectionType === 'tintersection';
  const isSingleCross = intersectionType === 'cross';

  return (
    <div
      onClick={() => onSelectVehicle?.(null)}
      className="relative w-full bg-[#08090c] rounded-none border border-[#3c3c3c] overflow-hidden shadow-2xl select-none"
      style={{ aspectRatio: '2 / 1' }}
    >
      {/* Weather atmospheric overlays */}
      {weather === 'rain' && <RainEffect />}
      {weather === 'night' && (
        <div className="absolute inset-0 bg-black/45 pointer-events-none z-30 mix-blend-multiply" />
      )}

      {/* Surface Canvas Backdrops */}
      {intersectionType === 'roundabout' ? (
        <SingleRoundaboutBackdrop />
      ) : isTIntersection ? (
        <TIntersectionBackdrop />
      ) : (
        <SingleCrossBackdrop />
      )}

      {/* Traffic Signals Gantries */}
      {isSingleRoundabout ? (
        <>
          <div className="absolute z-40" style={{ top: '6%', left: '62%' }}>
            <TrafficLight state={getLightColor(int0.light_state, 'south')} />
          </div>
          <div className="absolute z-40" style={{ top: '56%', left: '66%' }}>
            <TrafficLight state={getLightColor(int0.light_state, 'west')} />
          </div>
          <div className="absolute z-40" style={{ top: '56%', left: '30%' }}>
            <TrafficLight state={getLightColor(int0.light_state, 'north')} />
          </div>
          <div className="absolute z-40" style={{ top: '6%', left: '36%' }}>
            <TrafficLight state={getLightColor(int0.light_state, 'east')} />
          </div>
        </>
      ) : isTIntersection ? (
        <>
          <div className="absolute z-40" style={{ top: '24%', left: '38%' }}>
            <TrafficLight state={getLightColor(int0.light_state, 'east')} />
          </div>
          <div className="absolute z-40" style={{ top: '24%', left: '58%' }}>
            <TrafficLight state={getLightColor(int0.light_state, 'west')} />
          </div>
          <div className="absolute z-40" style={{ top: '56%', left: '58%' }}>
            <TrafficLight state={getLightColor(int0.light_state, 'north')} />
          </div>
        </>
      ) : (
        <>
          <div className="absolute z-40" style={{ top: '26%', left: '40%' }}>
            <TrafficLight state={getLightColor(int0.light_state, 'south')} />
          </div>
          <div className="absolute z-40" style={{ top: '26%', left: '58%' }}>
            <TrafficLight state={getLightColor(int0.light_state, 'west')} />
          </div>
          <div className="absolute z-40" style={{ bottom: '26%', left: '58%' }}>
            <TrafficLight state={getLightColor(int0.light_state, 'north')} />
          </div>
          <div className="absolute z-40" style={{ bottom: '26%', left: '40%' }}>
            <TrafficLight state={getLightColor(int0.light_state, 'east')} />
          </div>
        </>
      )}

      {/* High-Fidelity Active Vehicle Fleet */}
      <div className="absolute inset-0 z-20">
        {((isSingleRoundabout || isTIntersection || isSingleCross) ? intersections.slice(0, 1) : intersections).map((ix) =>
          Object.values(ix.roads).map((lanes) =>
            lanes.map((cars) =>
              cars.map((c) => (
                <Vehicle
                  key={c.id}
                  data={c}
                  speedFactor={speedFactor}
                  isSelected={selectedVehicleId === c.id}
                  onSelect={onSelectVehicle}
                />
              ))
            )
          )
        )}
      </div>

      {/* Subtle Corner Telemetry Watermark */}
      <div className="absolute bottom-2 right-3 pointer-events-none text-[9px] font-bold uppercase tracking-[1.5px] text-white/30 z-30 flex items-center gap-1.5">
        <span className="w-1.5 h-1.5 rounded-full bg-[#0066b1]" />
        NEUROCROSS DYNAMICS CORE
      </div>
    </div>
  );
};

export default memo(RoadLayer);

