import React, { memo } from 'react';
import TrafficLight from './TrafficLight';
import Vehicle from './Vehicle';
import RainEffect from './RainEffect';

const SingleCrossBackdrop = memo(() => (
  <>
    <div className="absolute top-1/2 left-0 -translate-y-1/2 w-full bg-mono-800/90 border-y border-mono-700/70" style={{ height: '40%' }}>
      <div className="absolute top-1/2 w-full border-t-2 border-mono-300/20" />
      <div className="absolute top-[25%] w-full border-t border-dashed border-mono-400/20" />
      <div className="absolute bottom-[25%] w-full border-t border-dashed border-mono-400/20" />
    </div>

    <div className="absolute h-full bg-mono-800/90 border-x border-mono-700/70" style={{ left: '40%', width: '20%' }}>
      <div className="absolute left-1/2 h-full border-l-2 border-mono-300/20" />
      <div className="absolute left-[25%] h-full border-l border-dashed border-mono-400/20" />
      <div className="absolute right-[25%] h-full border-l border-dashed border-mono-400/20" />
      <div className="absolute w-full h-px bg-mono-300/20" style={{ top: '30%' }} />
      <div className="absolute w-full h-px bg-mono-300/20" style={{ bottom: '30%' }} />
    </div>

    <div className="absolute bg-mono-800/95 z-0" style={{ left: '40%', top: '30%', width: '20%', height: '40%' }} />

    <div className="absolute bg-mono-200/30 z-[2]" style={{ left: '40%', top: '30%', width: '2px', height: '40%' }} />
    <div className="absolute bg-mono-200/30 z-[2]" style={{ left: '60%', top: '30%', width: '2px', height: '40%' }} />
    <div className="absolute bg-mono-200/30 z-[2]" style={{ left: '0%', top: '30%', width: '40%', height: '2px' }} />
    <div className="absolute bg-mono-200/30 z-[2]" style={{ left: '60%', top: '30%', width: '40%', height: '2px' }} />
    <div className="absolute bg-mono-200/30 z-[2]" style={{ left: '0%', top: '70%', width: '40%', height: '2px' }} />
    <div className="absolute bg-mono-200/30 z-[2]" style={{ left: '60%', top: '70%', width: '40%', height: '2px' }} />

    <div className="absolute z-[3] bg-[repeating-linear-gradient(90deg,rgba(255,255,255,0.88)_0_8px,transparent_8px_14px)]" style={{ left: '34%', top: '30.6%', width: '6%', height: '4%' }} />
    <div className="absolute z-[3] bg-[repeating-linear-gradient(90deg,rgba(255,255,255,0.88)_0_8px,transparent_8px_14px)]" style={{ left: '60%', top: '30.6%', width: '6%', height: '4%' }} />
    <div className="absolute z-[3] bg-[repeating-linear-gradient(90deg,rgba(255,255,255,0.88)_0_8px,transparent_8px_14px)]" style={{ left: '34%', top: '65.4%', width: '6%', height: '4%' }} />
    <div className="absolute z-[3] bg-[repeating-linear-gradient(90deg,rgba(255,255,255,0.88)_0_8px,transparent_8px_14px)]" style={{ left: '60%', top: '65.4%', width: '6%', height: '4%' }} />

    <div className="absolute z-[3] bg-[repeating-linear-gradient(180deg,rgba(255,255,255,0.88)_0_8px,transparent_8px_14px)]" style={{ left: '40.6%', top: '22%', width: '4%', height: '8%' }} />
    <div className="absolute z-[3] bg-[repeating-linear-gradient(180deg,rgba(255,255,255,0.88)_0_8px,transparent_8px_14px)]" style={{ left: '55.4%', top: '22%', width: '4%', height: '8%' }} />
    <div className="absolute z-[3] bg-[repeating-linear-gradient(180deg,rgba(255,255,255,0.88)_0_8px,transparent_8px_14px)]" style={{ left: '40.6%', top: '70%', width: '4%', height: '8%' }} />
    <div className="absolute z-[3] bg-[repeating-linear-gradient(180deg,rgba(255,255,255,0.88)_0_8px,transparent_8px_14px)]" style={{ left: '55.4%', top: '70%', width: '4%', height: '8%' }} />

    <div className="absolute z-30 text-[9px] uppercase tracking-[0.25em] text-mono-500/60 font-semibold" style={{ left: '50%', top: '72%', transform: 'translateX(-50%)' }}>
      4-way Intersection
    </div>
  </>
));

const RoundaboutBackdrop = memo(() => (
  <>
    <div className="absolute bg-mono-800/90 border-y border-mono-700/70" style={{ left: '19.5%', top: '0%', width: '11%', height: '34%' }} />
    <div className="absolute bg-mono-800/90 border-y border-mono-700/70" style={{ left: '19.5%', top: '66%', width: '11%', height: '34%' }} />
    <div className="absolute bg-mono-800/90 border-x border-mono-700/70" style={{ left: '0%', top: '44.5%', width: '19%', height: '11%' }} />
    <div className="absolute bg-mono-800/90 border-x border-mono-700/70" style={{ left: '33%', top: '44.5%', width: '34%', height: '11%' }} />

    <div className="absolute bg-mono-800/90 border-y border-mono-700/70" style={{ left: '69.5%', top: '0%', width: '11%', height: '34%' }} />
    <div className="absolute bg-mono-800/90 border-y border-mono-700/70" style={{ left: '69.5%', top: '66%', width: '11%', height: '34%' }} />
    <div className="absolute bg-mono-800/90 border-x border-mono-700/70" style={{ left: '81%', top: '44.5%', width: '19%', height: '11%' }} />

    <div className="absolute z-[2] rounded-full border-[20px] border-mono-800/95 bg-transparent" style={{ left: '25%', top: '50%', width: '29%', aspectRatio: '1 / 1', transform: 'translate(-50%, -50%)' }} />
    <div className="absolute z-[2] rounded-full border-[20px] border-mono-800/95 bg-transparent" style={{ left: '75%', top: '50%', width: '29%', aspectRatio: '1 / 1', transform: 'translate(-50%, -50%)' }} />

    <div className="absolute z-[1] rounded-full border border-mono-300/25 bg-mono-800/90" style={{ left: '25%', top: '50%', width: '10%', aspectRatio: '1 / 1', transform: 'translate(-50%, -50%)' }} />
    <div className="absolute z-[1] rounded-full border border-mono-300/25 bg-mono-800/90" style={{ left: '75%', top: '50%', width: '10%', aspectRatio: '1 / 1', transform: 'translate(-50%, -50%)' }} />

    <div className="absolute z-[3] border-t border-dashed border-mono-400/20" style={{ left: '20.5%', top: '17%', width: '9%' }} />
    <div className="absolute z-[3] border-t border-dashed border-mono-400/20" style={{ left: '20.5%', top: '83%', width: '9%' }} />
    <div className="absolute z-[3] border-l border-dashed border-mono-400/20" style={{ left: '9.5%', top: '44.5%', height: '11%' }} />
    <div className="absolute z-[3] border-l border-dashed border-mono-400/20" style={{ left: '50%', top: '44.5%', height: '11%' }} />
    <div className="absolute z-[3] border-t border-dashed border-mono-400/20" style={{ left: '70.5%', top: '17%', width: '9%' }} />
    <div className="absolute z-[3] border-t border-dashed border-mono-400/20" style={{ left: '70.5%', top: '83%', width: '9%' }} />
    <div className="absolute z-[3] border-l border-dashed border-mono-400/20" style={{ left: '90.5%', top: '44.5%', height: '11%' }} />

    <div className="absolute z-30 text-[9px] uppercase tracking-[0.25em] text-mono-500/60 font-semibold" style={{ left: '25%', top: '72%', transform: 'translateX(-50%)' }}>
      Roundabout A
    </div>
    <div className="absolute z-30 text-[9px] uppercase tracking-[0.25em] text-mono-500/60 font-semibold" style={{ left: '75%', top: '72%', transform: 'translateX(-50%)' }}>
      Roundabout B
    </div>
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
  const leftCapWidth = (100 - capSize) / 2;

  return (
    <>
      <div className="absolute bg-mono-800/90 border-y border-mono-700/70" style={{ left: `${roadOffsetX}%`, top: '0%', width: `${verticalRoadWidth}%`, height: '100%' }} />
      <div className="absolute bg-mono-800/90 border-x border-mono-700/70" style={{ left: '0%', top: `${roadOffsetY}%`, width: '100%', height: `${horizontalRoadHeight}%` }} />

      <div className="absolute z-[3] border-l border-dashed border-mono-400/20" style={{ left: `${verticalLaneDashLeft}%`, top: '0%', height: '100%' }} />
      <div className="absolute z-[3] border-l border-dashed border-mono-400/20" style={{ left: `${verticalLaneDashRight}%`, top: '0%', height: '100%' }} />

      <div className="absolute z-[3] border-t border-dashed border-mono-400/20" style={{ left: '0%', top: `${horizontalLaneDashTop}%`, width: '100%' }} />
      <div className="absolute z-[3] border-t border-dashed border-mono-400/20" style={{ left: '0%', top: `${horizontalLaneDashBottom}%`, width: '100%' }} />

      <div className="absolute z-[1] rounded-full bg-mono-800/90 border border-mono-700/70" style={{ left: '50%', top: '50%', width: `${capSize}%`, aspectRatio: '1 / 1', transform: 'translate(-50%, -50%)' }} />
      <div className="absolute z-[3] rounded-full border-2 border-dashed border-mono-300/35" style={{ left: '50%', top: '50%', width: '29%', aspectRatio: '1 / 1', transform: 'translate(-50%, -50%)' }} />
      <div className="absolute z-[3] rounded-full border border-dashed border-mono-300/30" style={{ left: '50%', top: '50%', width: '24%', aspectRatio: '1 / 1', transform: 'translate(-50%, -50%)' }} />
      <div className="absolute z-[2] rounded-full border border-mono-300/25 bg-mono-900/95" style={{ left: '50%', top: '50%', width: '16%', aspectRatio: '1 / 1', transform: 'translate(-50%, -50%)' }} />

      <div className="absolute z-[3] border-t border-dashed border-mono-400/20" style={{ left: '45.5%', top: '17%', width: '9%' }} />
      <div className="absolute z-[3] border-t border-dashed border-mono-400/20" style={{ left: '45.5%', top: '83%', width: '9%' }} />
      <div className="absolute z-[3] border-l border-dashed border-mono-400/20" style={{ left: '17%', top: `${roadOffsetY}%`, height: `${horizontalRoadHeight}%` }} />
      <div className="absolute z-[3] border-l border-dashed border-mono-400/20" style={{ left: '83%', top: `${roadOffsetY}%`, height: `${horizontalRoadHeight}%` }} />

      <div className="absolute z-30 text-[9px] uppercase tracking-[0.25em] text-mono-500/60 font-semibold" style={{ left: '50%', top: '72%', transform: 'translateX(-50%)' }}>
        Roundabout
      </div>
    </>
  );
});

const TIntersectionBackdrop = memo(() => (
  <>
    <div className="absolute bg-mono-800/90 border-y border-mono-700/70" style={{ left: '0%', top: '25%', width: '100%', height: '30%' }}>
      <div className="absolute top-1/2 w-full border-t-2 border-mono-300/20" />
      <div className="absolute top-[28%] w-full border-t border-dashed border-mono-400/20" />
      <div className="absolute bottom-[28%] w-full border-t border-dashed border-mono-400/20" />
    </div>

    <div className="absolute bg-mono-800/90 border-x border-mono-700/70" style={{ left: '40%', top: '40%', width: '20%', height: '60%' }}>
      <div className="absolute left-1/2 h-full border-l-2 border-mono-300/20" />
      <div className="absolute left-[28%] h-full border-l border-dashed border-mono-400/20" />
      <div className="absolute right-[28%] h-full border-l border-dashed border-mono-400/20" />
    </div>

    <div className="absolute bg-mono-800/90 z-0" style={{ left: '40%', top: '25%', width: '20%', height: '15%' }} />

    <div className="absolute bg-mono-300/20 z-[1]" style={{ left: '40%', top: '25%', width: '1px', height: '15%' }} />
    <div className="absolute bg-mono-300/20 z-[1]" style={{ left: '60%', top: '25%', width: '1px', height: '15%' }} />

    <div className="absolute z-30 text-[9px] uppercase tracking-[0.25em] text-mono-500/60 font-semibold" style={{ left: '50%', top: '84%', transform: 'translateX(-50%)' }}>
      T-Intersection
    </div>
  </>
));

function getLightColor(lightState, dir) {
  const prefix = dir.charAt(0).toUpperCase();
  if (lightState === `${prefix}_GREEN`) return 'GREEN';
  if (lightState === `${prefix}_YELLOW`) return 'YELLOW';
  return 'RED';
}

const RoadLayer = ({ data, weather, speedFactor, intersectionType = 'cross' }) => {
  const { intersections } = data;
  const emptyIntersection = { light_state: 'N_GREEN', roads: { north: [[], []], south: [[], []], east: [[], []], west: [[], []] } };
  const int0 = intersections[0] || emptyIntersection;
  const isSingleRoundabout = intersectionType === 'roundabout';
  const isTIntersection = intersectionType === 'tintersection';
  const isSingleCross = intersectionType === 'cross';

  return (
    <div className="relative w-full bg-mono-900 rounded-[20px] border border-mono-700/70 shadow-soft overflow-hidden asphalt inset-shadow" style={{ aspectRatio: '2 / 1' }}>
      {weather === 'rain' && <RainEffect />}

      {intersectionType === 'roundabout' ? <SingleRoundaboutBackdrop /> : isTIntersection ? <TIntersectionBackdrop /> : <SingleCrossBackdrop />}

      {isSingleRoundabout ? (
        <>
          <div className="absolute z-40" style={{ top: '4%', left: '62%' }}>
            <TrafficLight state={getLightColor(int0.light_state, 'south')} />
          </div>
          <div className="absolute z-40" style={{ top: '56%', left: '66%' }}>
            <TrafficLight state={getLightColor(int0.light_state, 'west')} />
          </div>
          <div className="absolute z-40" style={{ top: '56%', left: '30%' }}>
            <TrafficLight state={getLightColor(int0.light_state, 'north')} />
          </div>
          <div className="absolute z-40" style={{ top: '4%', left: '36%' }}>
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
          <div className="absolute z-40" style={{ top: '54%', left: '58%' }}>
            <TrafficLight state={getLightColor(int0.light_state, 'north')} />
          </div>
        </>
      ) : (
        <>
          <div className="absolute z-40" style={{ top: '31%', left: '41%' }}>
            <TrafficLight state={getLightColor(int0.light_state, 'south')} />
          </div>
          <div className="absolute z-40" style={{ top: '31%', left: '57%' }}>
            <TrafficLight state={getLightColor(int0.light_state, 'west')} />
          </div>
          <div className="absolute z-40" style={{ bottom: '31%', left: '57%' }}>
            <TrafficLight state={getLightColor(int0.light_state, 'north')} />
          </div>
          <div className="absolute z-40" style={{ bottom: '31%', left: '41%' }}>
            <TrafficLight state={getLightColor(int0.light_state, 'east')} />
          </div>
        </>
      )}

      <div className="absolute inset-0 z-10">
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
