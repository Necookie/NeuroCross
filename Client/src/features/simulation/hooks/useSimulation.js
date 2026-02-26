import { useCallback, useEffect, useState, useRef } from 'react';

import { IntersectionSim } from '../engine/IntersectionSim';
import { DEFAULT_PARAMS, createDefaultData } from '../constants';

const toJson = (value) => JSON.stringify(value);

export const useSimulation = () => {
  const [data, setData] = useState(createDefaultData);
  const [params, setParams] = useState(DEFAULT_PARAMS);
  const [running, setRunning] = useState(false);
  const [simSpeed, setSimSpeed] = useState(1.0);
  const [hasConnected, setHasConnected] = useState(false);

  const simRef = useRef(new IntersectionSim());
  const timeoutRef = useRef(null);
  const paramsRef = useRef(params);
  const simSpeedRef = useRef(simSpeed);

  // Keep refs in sync with state
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
    setHasConnected(true); // Always immediately 'connected' because it's local

    // Function to schedule the next tick
    const tick = () => {
      if (!active || !running) return;

      try {
        // Run a local step
        const result = simRef.current.step(paramsRef.current);
        setData(result);
      } catch (err) {
        console.error('Simulation error:', err);
      }

      // Schedule next tick based on speed
      const tickMs = Math.max(16, 100 / simSpeedRef.current); // Allow up to ~60FPS
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
    simRef.current = new IntersectionSim();
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
