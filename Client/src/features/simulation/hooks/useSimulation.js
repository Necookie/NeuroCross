import { useCallback, useEffect, useState } from 'react';

import { API_URL } from '../../../config';
import { DEFAULT_PARAMS, createDefaultData } from '../constants';

const toJson = (value) => JSON.stringify(value);

export const useSimulation = () => {
  const [data, setData] = useState(createDefaultData);
  const [params, setParams] = useState(DEFAULT_PARAMS);
  const [running, setRunning] = useState(false);
  const [simSpeed, setSimSpeed] = useState(1.0);
  const [hasConnected, setHasConnected] = useState(false);

  useEffect(() => {
    if (!running) {
      setHasConnected(false);
      return undefined;
    }

    let active = true;
    let timeoutId;
    let controller;

    const tick = async () => {
      if (!active || !running) return;
      controller = new AbortController();
      try {
        const res = await fetch(`${API_URL}/step`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: toJson(params),
          signal: controller.signal
        });
        if (!res.ok) {
          throw new Error(`Backend error ${res.status}`);
        }
        const payload = await res.json();
        if (active) {
          setData(payload);
          setHasConnected(true);
        }
      } catch (err) {
        if (err.name !== 'AbortError') {
          console.error('Backend error:', err);
        }
      }

      if (active && running) {
        const tickMs = Math.max(30, 100 / simSpeed);
        timeoutId = setTimeout(tick, tickMs);
      }
    };

    tick();

    return () => {
      active = false;
      if (controller) controller.abort();
      clearTimeout(timeoutId);
    };
  }, [running, params, simSpeed]);

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
