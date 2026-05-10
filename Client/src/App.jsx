import React, { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

import RoadLayer from './features/simulation/components/RoadLayer';
import ControlsPanel from './features/simulation/components/ControlsPanel';
import StatusHeader from './features/simulation/components/StatusHeader';
import LoadingScreen from './features/simulation/components/LoadingScreen';
import { useSimulation } from './features/simulation/hooks/useSimulation';

export default function App() {
  const [phase, setPhase] = useState('loading'); // 'loading' -> 'welcome' -> 'ready'

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
    // 4.0 seconds for loading screen
    const t1 = setTimeout(() => {
      setPhase('welcome');
    }, 4000);

    // Give welcome screen 2.5s (includes crossfade time)
    const t2 = setTimeout(() => {
      setPhase('ready');
    }, 6500);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
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
        delayChildren: 0.5 // small delay to let welcome screen fade out
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
      <AnimatePresence mode="wait">
        {phase === 'loading' && <LoadingScreen key="loading" />}
        
        {phase === 'welcome' && (
          <motion.div 
            key="welcome"
            className="fixed inset-0 z-50 flex items-center justify-center bg-mono-950"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.05, filter: "blur(10px)", transition: { duration: 0.8, ease: "easeInOut" } }}
            transition={{ duration: 1, ease: "easeOut" }}
          >
            <h2 
              className="text-4xl md:text-6xl font-light tracking-[0.15em] text-mono-200"
              style={{ fontFamily: "'Outfit', sans-serif" }}
            >
              Welcome to <span className="font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-300 drop-shadow-[0_0_15px_rgba(56,189,248,0.4)]">NeuroCross</span>
            </h2>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="min-h-screen bg-gradient-to-br from-mono-950 via-mono-900 to-mono-950 text-mono-100 font-sans px-6 py-8 transition-colors duration-700 ease-in-out overflow-hidden">
        <motion.div 
          className="max-w-[1400px] mx-auto space-y-8"
          variants={containerVariants}
          initial="hidden"
          animate={phase === 'ready' ? "visible" : "hidden"}
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
