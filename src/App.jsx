import React, { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

import RoadLayer from './features/simulation/components/RoadLayer';
import ControlsPanel from './features/simulation/components/ControlsPanel';
import StatusHeader from './features/simulation/components/StatusHeader';
import LoadingScreen from './features/simulation/components/LoadingScreen';
import MStripeDivider from './components/ui/MStripeDivider';
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
    // 3.0 seconds for loading screen
    const t1 = setTimeout(() => {
      setPhase('welcome');
    }, 3000);

    // Give welcome screen 1.8s
    const t2 = setTimeout(() => {
      setPhase('ready');
    }, 4800);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, []);

  const toggleRunning = () => setRunning((prev) => !prev);

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.4, ease: "easeOut" }
    }
  };

  return (
    <>
      <AnimatePresence mode="wait">
        {phase === 'loading' && <LoadingScreen key="loading" />}
        
        {phase === 'welcome' && (
          <motion.div 
            key="welcome"
            className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#000000]"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, transition: { duration: 0.4, ease: "easeInOut" } }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            <div className="text-center space-y-3">
              <span className="text-xs font-bold uppercase tracking-[3px] text-[#7e7e7e]">
                SYSTEM MATRIX INITIALIZED
              </span>
              <h2 className="text-4xl md:text-6xl font-black uppercase tracking-tight text-white m-0">
                WELCOME TO NEUROCROSS
              </h2>
              <div className="w-32 mx-auto pt-2">
                <MStripeDivider />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="min-h-screen bg-[#000000] text-white font-sans px-4 sm:px-8 py-6 selection:bg-white selection:text-black">
        <motion.div 
          className="max-w-[1440px] mx-auto space-y-6"
          variants={containerVariants}
          initial="hidden"
          animate={phase === 'ready' ? "visible" : "hidden"}
        >
          <motion.div variants={itemVariants}>
            <StatusHeader mode={params.mode} running={running} intersectionType={params.intersectionType} />
          </motion.div>

          <div className="grid gap-6 lg:grid-cols-[320px_1fr] items-start">
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

            <motion.div variants={itemVariants} className="flex flex-col gap-4">
              <RoadLayer
                data={data}
                weather={params.weather}
                speedFactor={simSpeed}
                intersectionType={params.intersectionType}
              />

              {/* Technical Spec Strip underneath RoadLayer */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px] font-bold uppercase tracking-[1.5px] text-[#bbbbbb]">
                <div className="bg-[#0d0d0d] border border-[#3c3c3c] p-3 flex flex-col justify-between">
                  <span className="text-[#7e7e7e]">FRICTION MODEL</span>
                  <span className="text-white mt-1">{params.weather === 'rain' ? 'WET SURF 0.60μ' : 'DRY TARMAC 1.00μ'}</span>
                </div>
                <div className="bg-[#0d0d0d] border border-[#3c3c3c] p-3 flex flex-col justify-between">
                  <span className="text-[#7e7e7e]">LOGIC ENGINE</span>
                  <span className="text-white mt-1">{params.mode === 'smart' ? 'ADAPTIVE CLEARANCE' : 'CYCLIC INTERVAL'}</span>
                </div>
                <div className="bg-[#0d0d0d] border border-[#3c3c3c] p-3 flex flex-col justify-between">
                  <span className="text-[#7e7e7e]">CANVAS ASPECT</span>
                  <span className="text-white mt-1">2.00 : 1.00 ULTRA-WIDE</span>
                </div>
                <div className="bg-[#0d0d0d] border border-[#3c3c3c] p-3 flex flex-col justify-between">
                  <span className="text-[#7e7e7e]">TELEMETRY PIPELINE</span>
                  <span className="text-[#0fa336] mt-1">SYNCHRONIZED (ONLINE)</span>
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </>
  );
}
