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

  return (
    <div className="min-h-screen bg-gradient-to-br from-mono-950 via-mono-900 to-mono-950 text-mono-100 font-sans px-6 py-8 transition-colors duration-700 ease-in-out">
      <div className="max-w-[1400px] mx-auto space-y-8">
        <StatusHeader mode={params.mode} running={running} intersectionType={params.intersectionType} />

        <div className="grid gap-8 lg:grid-cols-[280px_1fr] items-start">
          <ControlsPanel
            params={params}
            setParams={setParams}
            simSpeed={simSpeed}
            setSimSpeed={setSimSpeed}
            data={data}
            running={running}
            hasConnected={hasConnected}
            onToggleRunning={toggleRunning}
            onReset={reset}
          />

          <div className="flex items-center justify-center">
            <RoadLayer
              data={data}
              weather={params.weather}
              speedFactor={simSpeed}
              intersectionType={params.intersectionType}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
