import React, { useEffect } from 'react';

import RoadLayer from './features/simulation/components/RoadLayer';
import ControlsPanel from './features/simulation/components/ControlsPanel';
import StatusHeader from './features/simulation/components/StatusHeader';
import { useSimulation } from './features/simulation/hooks/useSimulation';

function App() {
  const {
    data,
    params,
    setParams,
    running,
    setRunning,
    simSpeed,
    setSimSpeed,
    hasConnected,
    reset
  } = useSimulation();

  useEffect(() => {
    document.body.className = params.theme && params.theme !== 'dark'
      ? `theme-${params.theme}`
      : '';
  }, [params.theme]);

  const toggleRunning = () => setRunning((prev) => !prev);

  // Aggregate metrics across all intersections for the controls panel.
  const aggregatedMetrics = data.reduce(
    (acc, d, i) => ({
      throughput: acc.throughput + d.metrics.throughput,
      avg_speed: acc.avg_speed + d.metrics.avg_speed,
      accidents: acc.accidents + d.metrics.accidents,
      _count: i + 1,
    }),
    { throughput: 0, avg_speed: 0, accidents: 0, _count: 0 }
  );
  aggregatedMetrics.avg_speed = data.length
    ? Math.floor(aggregatedMetrics.avg_speed / data.length)
    : 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-mono-950 via-mono-900 to-mono-950 text-mono-100 font-sans px-6 py-8 transition-colors duration-700 ease-in-out">
      <div className="max-w-6xl mx-auto space-y-8">
        <StatusHeader mode={params.mode} running={running} />

        <div className="grid gap-8 lg:grid-cols-[320px_1fr] items-start">
          <ControlsPanel
            params={params}
            setParams={setParams}
            simSpeed={simSpeed}
            setSimSpeed={setSimSpeed}
            data={{ metrics: aggregatedMetrics }}
            running={running}
            hasConnected={hasConnected}
            onToggleRunning={toggleRunning}
            onReset={reset}
          />

          <div className="grid grid-cols-1 gap-6 xl:grid-cols-2 items-start justify-items-center">
            {data.map((intersectionData, idx) => (
              <div key={idx} className="flex flex-col items-center gap-2 w-full">
                <span className="text-[10px] uppercase tracking-[0.3em] text-mono-400">
                  Intersection {idx + 1}
                </span>
                <RoadLayer
                  roads={intersectionData.roads}
                  lightState={intersectionData.light_state}
                  weather={params.weather}
                  speedFactor={simSpeed}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
