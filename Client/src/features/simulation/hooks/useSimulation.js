import { useCallback, useEffect, useState, useRef } from 'react';

import { IntersectionSim } from '../engine/IntersectionSim';
import { DEFAULT_PARAMS, createDefaultData, INTERSECTION_COUNT } from '../constants';

const createSims = () => Array.from({ length: INTERSECTION_COUNT }, () => new IntersectionSim());

export const useSimulation = () => {
  const [data, setData] = useState(createDefaultData);
  const [params, setParams] = useState(DEFAULT_PARAMS);
  const [running, setRunning] = useState(false);
  const [simSpeed, setSimSpeed] = useState(1.0);
  const [hasConnected, setHasConnected] = useState(false);

  const simRef = useRef(createSims());
  const timeoutRef = useRef(null);
  const paramsRef = useRef(params);
  const simSpeedRef = useRef(simSpeed);
  const hasConnectedRef = useRef(false);

  // Keep refs in sync with state so the tick loop always reads fresh values.
  useEffect(() => {
    paramsRef.current = params;
    simSpeedRef.current = simSpeed;
  }, [params, simSpeed]);

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
        // Run a local step across all intersection instances
        const result = simRef.current.map(sim => sim.step(paramsRef.current));
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
    simRef.current = createSims();
    hasConnectedRef.current = false;
    setHasConnected(false);
    setData(createDefaultData());
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
