import { useCallback, useEffect, useState, useRef } from 'react';

import { API_URL, WS_URL } from '../../../config';
import { DEFAULT_PARAMS, createDefaultData } from '../constants';

const toJson = (value) => JSON.stringify(value);

export const useSimulation = () => {
  const [data, setData] = useState(createDefaultData);
  const [params, setParams] = useState(DEFAULT_PARAMS);
  const [running, setRunning] = useState(false);
  const [simSpeed, setSimSpeed] = useState(1.0);
  const [hasConnected, setHasConnected] = useState(false);

  const wsRef = useRef(null);
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
      if (wsRef.current) {
        wsRef.current.close();
        wsRef.current = null;
      }
      clearTimeout(timeoutRef.current);
      return undefined;
    }

    let active = true;

    // Function to schedule the next tick
    const scheduleNextTick = () => {
      if (!active || !running) return;
      const tickMs = Math.max(30, 100 / simSpeedRef.current);
      timeoutRef.current = setTimeout(() => {
        if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
          wsRef.current.send(toJson(paramsRef.current));
        }
      }, tickMs);
    };

    // Initialize WebSocket
    if (!wsRef.current || wsRef.current.readyState === WebSocket.CLOSED) {
      setHasConnected(false);
      const ws = new WebSocket(`${WS_URL}/ws/step`);
      wsRef.current = ws;

      ws.onopen = () => {
        if (!active) return;
        setHasConnected(true);
        // Kick off the first step immediately
        ws.send(toJson(paramsRef.current));
      };

      ws.onmessage = (event) => {
        if (!active) return;
        try {
          const payload = JSON.parse(event.data);
          setData(payload);
          scheduleNextTick();
        } catch (err) {
          console.error('Failed to parse WS message:', err);
        }
      };

      ws.onerror = (error) => {
        if (!active) return;
        console.error('WebSocket error:', error);
      };

      ws.onclose = () => {
        if (!active) return;
        setHasConnected(false);
      };
    } else if (wsRef.current.readyState === WebSocket.OPEN) {
      // If we resumed running while WS was open, kick off the loop again
      wsRef.current.send(toJson(paramsRef.current));
    }

    return () => {
      active = false;
      // We don't close the WebSocket here on every params change,
      // it only gets closed when !running (handled at the top of effect)
      clearTimeout(timeoutRef.current);
    };
  }, [running]);

  const reset = useCallback(async () => {
    try {
      await fetch(`${API_URL}/reset`, { method: 'POST' });
      setData(createDefaultData());
    } catch (err) {
      console.error('Backend error on reset:', err);
    }
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
