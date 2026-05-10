import React, { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

import RoadLayer from './features/simulation/components/RoadLayer';
import ControlsPanel from './features/simulation/components/ControlsPanel';
import StatusHeader from './features/simulation/components/StatusHeader';
import LoadingScreen from './features/simulation/components/LoadingScreen';
import { useSimulation } from './features/simulation/hooks/useSimulation';

export default function App() {
  const [isLoading, setIsLoading] = useState(true);

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
    // 4.5 seconds loading screen
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 4500);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    document.body.className = params.theme && params.theme !== 'dark'
      ? `theme-${params.theme}`
      : '';
  }, [params.theme]);

  const toggleRunning = () => setRunning((prev) => !prev);

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.3,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 40 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { type: "spring", stiffness: 60, damping: 15 }
    }
  };

  return (
    <>
      <AnimatePresence>
        {isLoading && <LoadingScreen key="loading" />}
      </AnimatePresence>

      <div className="min-h-screen bg-gradient-to-br from-mono-950 via-mono-900 to-mono-950 text-mono-100 font-sans px-6 py-8 transition-colors duration-700 ease-in-out overflow-hidden">
        <motion.div 
          className="max-w-[1400px] mx-auto space-y-8"
          variants={containerVariants}
          initial="hidden"
          animate={isLoading ? "hidden" : "visible"}
        >
          <motion.div variants={itemVariants}>
            <StatusHeader mode={params.mode} running={running} intersectionType={params.intersectionType} />
          </motion.div>

          <div className="grid gap-8 lg:grid-cols-[280px_1fr] items-start">
            <motion.div variants={itemVariants}>
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
            </motion.div>

            <motion.div variants={itemVariants} className="flex items-center justify-center">
              <RoadLayer
                data={data}
                weather={params.weather}
                speedFactor={simSpeed}
                intersectionType={params.intersectionType}
              />
            </motion.div>
          </div>
        </motion.div>
      </div>
    </>
  );
}
