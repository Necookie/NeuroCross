import { useCallback, useEffect, useState, useRef } from 'react';

import { DualIntersectionSim } from '../engine/DualIntersectionSim';
import { RoundaboutSim } from '../engine/RoundaboutSim';
import { TIntersectionSim } from '../engine/TIntersectionSim';
import { DEFAULT_PARAMS, createDefaultData } from '../constants';

const createSimForType = (intersectionType) => {
  if (intersectionType === 'roundabout') {
    return new RoundaboutSim();
  }
  if (intersectionType === 'tintersection') {
    return new TIntersectionSim();
  }
  return new DualIntersectionSim();
};

export const useSimulation = () => {
  const [data, setData] = useState(() => createDefaultData(DEFAULT_PARAMS.intersectionType));
  const [params, setParams] = useState(DEFAULT_PARAMS);
  const [running, setRunning] = useState(false);
  const [simSpeed, setSimSpeed] = useState(1.0);
  const [hasConnected, setHasConnected] = useState(false);

  const simRef = useRef(createSimForType(DEFAULT_PARAMS.intersectionType));
  const timeoutRef = useRef(null);
  const paramsRef = useRef(params);
  const simSpeedRef = useRef(simSpeed);
  const hasConnectedRef = useRef(false);
  const lastIntersectionTypeRef = useRef(params.intersectionType);

  // Keep refs in sync with state so the tick loop always reads fresh values.
  useEffect(() => {
    paramsRef.current = params;
    simSpeedRef.current = simSpeed;
  }, [params, simSpeed]);

  useEffect(() => {
    if (lastIntersectionTypeRef.current === params.intersectionType) return;

    simRef.current = createSimForType(params.intersectionType);
    setData(createDefaultData(params.intersectionType));
    lastIntersectionTypeRef.current = params.intersectionType;
  }, [params.intersectionType]);

  useEffect(() => {
    if (!running) {
      clearTimeout(timeoutRef.current);
      return undefined;
    }

    let active = true;
    // Function to schedule the next tick.
    const tick = () => {
      if (!active || !running) return;

      try {
        if (!hasConnectedRef.current) {
          hasConnectedRef.current = true;
          setHasConnected(true); // Mark connected on first successful tick.
        }
        // Run a local step
        const result = simRef.current.step(paramsRef.current);
        setData(result);
      } catch (err) {
        console.error('Simulation error:', err);
      }

      // Schedule next tick based on speed
      const tickMs = Math.max(16, 100 / simSpeedRef.current); // Cap at ~60FPS.
      timeoutRef.current = setTimeout(tick, tickMs);
    };

    // Kick off loop
    tick();

    return () => {
      active = false;
      clearTimeout(timeoutRef.current);
    };
  }, [running]);

  const reset = useCallback(() => {
    simRef.current = createSimForType(paramsRef.current.intersectionType);
    hasConnectedRef.current = false;
    setHasConnected(false);
    setData(createDefaultData(paramsRef.current.intersectionType));
  }, []);

  return {
    data,
    params,
    setParams,
    running,
    setRunning,
    simSpeed,
    setSimSpeed,
    hasConnected,
    reset
  };
};
