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

const SingleCrossBackdrop = memo(() => (
  <>
    {/* Horizontal Road */}
    <div 
      className="absolute top-1/2 left-0 -translate-y-1/2 w-full bg-[#181818] border-y border-[#333333]" 
      style={{ height: `${CROSS_HORIZONTAL_ROAD_HEIGHT}%` }}
    >
      <div className="absolute top-1/2 w-full border-t border-white/30" />
      <div className="absolute top-[25%] w-full border-t border-dashed border-white/20" />
      <div className="absolute bottom-[25%] w-full border-t border-dashed border-white/20" />
    </div>

    {/* Vertical Road */}
    <div 
      className="absolute h-full bg-[#181818] border-x border-[#333333]" 
      style={{ left: `${CROSS_ROAD_OFFSET_X}%`, width: `${CROSS_VERTICAL_ROAD_WIDTH}%` }}
    >
      <div className="absolute left-1/2 h-full border-l border-white/30" />
      <div className="absolute h-full border-l border-dashed border-white/20" style={{ left: `${((CROSS_LANE_DASH_LEFT - CROSS_ROAD_OFFSET_X) / CROSS_VERTICAL_ROAD_WIDTH) * 100}%` }} />
      <div className="absolute h-full border-l border-dashed border-white/20" style={{ left: `${((CROSS_LANE_DASH_RIGHT - CROSS_ROAD_OFFSET_X) / CROSS_VERTICAL_ROAD_WIDTH) * 100}%` }} />
    </div>

    {/* Intersection Box */}
    <div 
      className="absolute bg-[#181818] z-0" 
      style={{ left: `${CROSS_ROAD_OFFSET_X}%`, top: `${CROSS_ROAD_OFFSET_Y}%`, width: `${CROSS_VERTICAL_ROAD_WIDTH}%`, height: `${CROSS_HORIZONTAL_ROAD_HEIGHT}%` }} 
    />

    {/* Stop Lines */}
    <div className="absolute bg-white/70 z-[2]" style={{ left: `${CROSS_ROAD_OFFSET_X}%`, top: `${CROSS_ROAD_OFFSET_Y}%`, width: '3px', height: `${CROSS_HORIZONTAL_ROAD_HEIGHT}%` }} />
    <div className="absolute bg-white/70 z-[2]" style={{ left: `${CROSS_INTERSECTION_RIGHT}%`, top: `${CROSS_ROAD_OFFSET_Y}%`, width: '3px', height: `${CROSS_HORIZONTAL_ROAD_HEIGHT}%` }} />
    <div className="absolute bg-white/70 z-[2]" style={{ left: '0%', top: `${CROSS_ROAD_OFFSET_Y}%`, width: `${CROSS_ROAD_OFFSET_X}%`, height: '3px' }} />
    <div className="absolute bg-white/70 z-[2]" style={{ left: `${CROSS_INTERSECTION_RIGHT}%`, top: `${CROSS_ROAD_OFFSET_Y}%`, width: `${CROSS_ROAD_OFFSET_X}%`, height: '3px' }} />
    <div className="absolute bg-white/70 z-[2]" style={{ left: '0%', top: `${CROSS_INTERSECTION_BOTTOM}%`, width: `${CROSS_ROAD_OFFSET_X}%`, height: '3px' }} />
    <div className="absolute bg-white/70 z-[2]" style={{ left: `${CROSS_INTERSECTION_RIGHT}%`, top: `${CROSS_INTERSECTION_BOTTOM}%`, width: `${CROSS_ROAD_OFFSET_X}%`, height: '3px' }} />

    {/* Crosswalk Zebra Markings */}
    <div className="absolute z-[3] bg-[repeating-linear-gradient(90deg,rgba(255,255,255,0.7)_0_6px,transparent_6px_12px)]" style={{ left: '31%', top: '26.6%', width: '7%', height: '4.8%' }} />
    <div className="absolute z-[3] bg-[repeating-linear-gradient(90deg,rgba(255,255,255,0.7)_0_6px,transparent_6px_12px)]" style={{ left: '62%', top: '26.6%', width: '7%', height: '4.8%' }} />
    <div className="absolute z-[3] bg-[repeating-linear-gradient(90deg,rgba(255,255,255,0.7)_0_6px,transparent_6px_12px)]" style={{ left: '31%', top: '68.6%', width: '7%', height: '4.8%' }} />
    <div className="absolute z-[3] bg-[repeating-linear-gradient(90deg,rgba(255,255,255,0.7)_0_6px,transparent_6px_12px)]" style={{ left: '62%', top: '68.6%', width: '7%', height: '4.8%' }} />

    <div className="absolute z-[3] bg-[repeating-linear-gradient(180deg,rgba(255,255,255,0.7)_0_6px,transparent_6px_12px)]" style={{ left: '38.6%', top: '18%', width: '4.8%', height: '8%' }} />
    <div className="absolute z-[3] bg-[repeating-linear-gradient(180deg,rgba(255,255,255,0.7)_0_6px,transparent_6px_12px)]" style={{ left: '56.6%', top: '18%', width: '4.8%', height: '8%' }} />
    <div className="absolute z-[3] bg-[repeating-linear-gradient(180deg,rgba(255,255,255,0.7)_0_6px,transparent_6px_12px)]" style={{ left: '38.6%', top: '74%', width: '4.8%', height: '8%' }} />
    <div className="absolute z-[3] bg-[repeating-linear-gradient(180deg,rgba(255,255,255,0.7)_0_6px,transparent_6px_12px)]" style={{ left: '56.6%', top: '74%', width: '4.8%', height: '8%' }} />
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
      <div className="absolute bg-[#181818] border-y border-[#333333]" style={{ left: `${roadOffsetX}%`, top: '0%', width: `${verticalRoadWidth}%`, height: '100%' }} />
      <div className="absolute bg-[#181818] border-x border-[#333333]" style={{ left: '0%', top: `${roadOffsetY}%`, width: '100%', height: `${horizontalRoadHeight}%` }} />

      <div className="absolute z-[3] border-l border-dashed border-white/20" style={{ left: `${verticalLaneDashLeft}%`, top: '0%', height: '100%' }} />
      <div className="absolute z-[3] border-l border-dashed border-white/20" style={{ left: `${verticalLaneDashRight}%`, top: '0%', height: '100%' }} />

      <div className="absolute z-[3] border-t border-dashed border-white/20" style={{ left: '0%', top: `${horizontalLaneDashTop}%`, width: '100%' }} />
      <div className="absolute z-[3] border-t border-dashed border-white/20" style={{ left: '0%', top: `${horizontalLaneDashBottom}%`, width: '100%' }} />

      {/* Roundabout Ring */}
      <div className="absolute z-[1] rounded-full bg-[#181818] border border-[#333333]" style={{ left: '50%', top: '50%', width: `${capSize}%`, aspectRatio: '1 / 1', transform: 'translate(-50%, -50%)' }} />
      <div className="absolute z-[3] rounded-full border border-dashed border-white/30" style={{ left: '50%', top: '50%', width: '27%', aspectRatio: '1 / 1', transform: 'translate(-50%, -50%)' }} />
      
      {/* Center Island */}
      <div className="absolute z-[2] rounded-full border border-[#444444] bg-[#0d0d0d]" style={{ left: '50%', top: '50%', width: '16%', aspectRatio: '1 / 1', transform: 'translate(-50%, -50%)' }}>
        <div className="w-full h-full rounded-full border border-[#222222] flex items-center justify-center">
          <div className="w-3 h-3 rounded-full bg-[#1c69d4]/30 border border-[#1c69d4]" />
        </div>
      </div>
    </>
  );
});

const TIntersectionBackdrop = memo(() => (
  <>
    {/* Main Horizontal Road */}
    <div className="absolute bg-[#181818] border-y border-[#333333]" style={{ left: '0%', top: '25%', width: '100%', height: '30%' }}>
      <div className="absolute top-1/2 w-full border-t border-white/30" />
      <div className="absolute top-[28%] w-full border-t border-dashed border-white/20" />
      <div className="absolute bottom-[28%] w-full border-t border-dashed border-white/20" />
    </div>

    {/* Stem Road (South) */}
    <div className="absolute bg-[#181818] border-x border-[#333333]" style={{ left: '40%', top: '40%', width: '20%', height: '60%' }}>
      <div className="absolute left-1/2 h-full border-l border-white/30" />
      <div className="absolute h-full border-l border-dashed border-white/20" style={{ left: '28%' }} />
      <div className="absolute h-full border-l border-dashed border-white/20" style={{ left: '72%' }} />
    </div>

    {/* Intersection Box */}
    <div className="absolute bg-[#181818] z-0" style={{ left: '40%', top: '25%', width: '20%', height: '30%' }} />

    {/* Stop Lines */}
    <div className="absolute bg-white/70 z-[2]" style={{ left: '40%', top: '25%', width: '3px', height: '30%' }} />
    <div className="absolute bg-white/70 z-[2]" style={{ left: '60%', top: '25%', width: '3px', height: '30%' }} />
    <div className="absolute bg-white/70 z-[2]" style={{ left: '40%', top: '55%', width: '20%', height: '3px' }} />
  </>
));

const DIRECTION_CODE = { north: 'N', south: 'S', east: 'E', west: 'W' };

// `light_state` comes in two shapes from the engine:
//  - a fixed-phase FSM code like "N_GREEN" / "S_YELLOW" / "E_ALL_RED"
//    (signalized cross / T-junction intersections), or
//  - a per-direction map like { north: 'GREEN', south: 'RED', ... }
//    (the roundabout's live yield indicator, which has no signal cycle).
const getLightColor = (lightState, dir) => {
  if (!lightState) return 'RED';

  if (typeof lightState === 'object') {
    return lightState[dir] || 'RED';
  }

  const sepIdx = lightState.indexOf('_');
  if (sepIdx === -1) return 'RED';

  const activeCode = lightState.slice(0, sepIdx);
  const phase = lightState.slice(sepIdx + 1); // 'GREEN' | 'YELLOW' | 'ALL_RED'
  if (phase === 'ALL_RED') return 'RED';
  return DIRECTION_CODE[dir] === activeCode ? phase : 'RED';
};

const RoadLayer = ({
  data,
  weather,
  speedFactor,
  intersectionType = 'cross'
}) => {
  const intersections = data?.intersections || [];
  const int0 = intersections[0] || { light_state: {} };

  const isSingleRoundabout = intersectionType === 'roundabout';
  const isTIntersection = intersectionType === 'tintersection';
  const isSingleCross = intersectionType === 'cross';

  return (
    <div 
      className="relative w-full bg-[#111111] rounded-none border border-[#2a2a2a] overflow-hidden shadow-2xl" 
      style={{ aspectRatio: '2 / 1' }}
    >
      {weather === 'rain' && <RainEffect />}

      {intersectionType === 'roundabout' ? (
        <SingleRoundaboutBackdrop />
      ) : isTIntersection ? (
        <TIntersectionBackdrop />
      ) : (
        <SingleCrossBackdrop />
      )}

      {/* Traffic Signals */}
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

      {/* Vehicle Fleet */}
      <div className="absolute inset-0 z-10 pointer-events-none">
        {((isSingleRoundabout || isTIntersection || isSingleCross) ? intersections.slice(0, 1) : intersections).map((ix) =>
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
