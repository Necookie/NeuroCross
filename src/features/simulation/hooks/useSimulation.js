import { useCallback, useEffect, useState, useRef, useMemo } from 'react';

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
  const [data, setData] = useState(() => createDefaultData());
  const [params, setParams] = useState(DEFAULT_PARAMS);
  const [running, setRunning] = useState(false);
  const [simSpeed, setSimSpeed] = useState(1.0);
  const [hasConnected, setHasConnected] = useState(false);
  const [selectedVehicleId, setSelectedVehicleId] = useState(null);

  const simRef = useRef(createSimForType(DEFAULT_PARAMS.intersectionType));
  const timeoutRef = useRef(null);
  const paramsRef = useRef(params);
  const simSpeedRef = useRef(simSpeed);
  const hasConnectedRef = useRef(false);

  // Keep refs in sync with state so the tick loop always reads fresh values.
  useEffect(() => {
    paramsRef.current = params;
    simSpeedRef.current = simSpeed;
  }, [params, simSpeed]);

  // Handle intersection type change
  const setIntersectionType = useCallback((newType) => {
    setParams((prev) => ({ ...prev, intersectionType: newType }));
    simRef.current = createSimForType(newType);
    setData(createDefaultData());
    setSelectedVehicleId(null);
  }, []);

  const stepOnce = useCallback(() => {
    try {
      if (!hasConnectedRef.current) {
        hasConnectedRef.current = true;
        setHasConnected(true);
      }
      const result = simRef.current.step(paramsRef.current);
      setData(result);
    } catch (err) {
      console.error('Simulation step error:', err);
    }
  }, []);

  const dispatchInterceptor = useCallback(() => {
    if (simRef.current && typeof simRef.current.dispatchInterceptor === 'function') {
      const dispatched = simRef.current.dispatchInterceptor();
      if (dispatched) {
        const result = simRef.current.getState ? simRef.current.getState() : null;
        if (result) setData(result);
      }
      return dispatched;
    }
    return false;
  }, []);

  useEffect(() => {
    if (!running) {
      clearTimeout(timeoutRef.current);
      return undefined;
    }

    let active = true;
    const tick = () => {
      if (!active || !running) return;

      try {
        if (!hasConnectedRef.current) {
          hasConnectedRef.current = true;
          setHasConnected(true);
        }
        const result = simRef.current.step(paramsRef.current);
        setData(result);
      } catch (err) {
        console.error('Simulation error:', err);
      }

      const tickMs = Math.max(16, 50 / simSpeedRef.current);
      timeoutRef.current = setTimeout(tick, tickMs);
    };

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
    setSelectedVehicleId(null);
    setData(createDefaultData());
  }, []);

  // Find currently selected vehicle if any
  const selectedVehicle = useMemo(() => {
    if (!selectedVehicleId || !data?.intersections) return null;
    for (const ix of data.intersections) {
      if (!ix.roads) continue;
      for (const lanes of Object.values(ix.roads)) {
        for (const lane of lanes) {
          for (const car of lane) {
            if (car.id === selectedVehicleId) {
              return car;
            }
          }
        }
      }
    }
    return null;
  }, [selectedVehicleId, data]);

  return {
    data,
    params,
    setParams,
    setIntersectionType,
    running,
    setRunning,
    simSpeed,
    setSimSpeed,
    hasConnected,
    reset,
    stepOnce,
    dispatchInterceptor,
    selectedVehicleId,
    setSelectedVehicleId,
    selectedVehicle,
  };
};

