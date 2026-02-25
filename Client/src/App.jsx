import React from 'react';

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

  const toggleRunning = () => setRunning((prev) => !prev);

  return (
    <div className="min-h-screen bg-gradient-to-br from-mono-950 via-mono-900 to-mono-950 text-mono-100 font-sans px-6 py-8">
      <div className="max-w-6xl mx-auto space-y-8">
        <StatusHeader mode={params.mode} running={running} />

        <div className="grid gap-8 lg:grid-cols-[320px_1fr] items-start">
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
              roads={data.roads}
              lightState={data.light_state}
              weather={params.weather}
              speedFactor={simSpeed}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
