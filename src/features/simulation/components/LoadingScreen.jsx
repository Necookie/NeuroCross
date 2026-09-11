import React from 'react';
import { motion } from 'framer-motion';
import MStripeDivider from '../../../components/ui/MStripeDivider';

/**
 * LoadingScreen - BMW M High-Performance aesthetic:
 * Pure black canvas (#000000), confident uppercase 700/900 display typography,
 * signature 4px tricolor stripe, engineered telemetry status.
 */
export default function LoadingScreen() {
  return (
    <motion.div
      className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#000000] overflow-hidden text-white"
      initial={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 1.02, transition: { duration: 0.6, ease: "easeInOut" } }}
    >
      {/* Top Brand Header */}
      <motion.div 
        className="text-center space-y-4 z-20 max-w-xl px-6"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
      >
        <div className="flex items-center justify-center gap-2 mb-2">
          <span className="text-[11px] font-bold uppercase tracking-[2px] text-[#7e7e7e]">
            SYSTEM DIAGNOSTICS
          </span>
          <span className="h-1 w-1 bg-[#e22718]" />
          <span className="text-[11px] font-bold uppercase tracking-[1.5px] text-[#0066b1]">
            NEUROCROSS TELEMETRY
          </span>
        </div>

        <h1 className="text-5xl md:text-7xl font-black uppercase tracking-tight text-white m-0">
          NEUROCROSS
        </h1>

        {/* 4px M Tricolor Divider */}
        <div className="w-36 mx-auto py-2">
          <MStripeDivider />
        </div>

        <motion.p 
          className="text-[#bbbbbb] text-xs uppercase tracking-[2px] font-medium"
          animate={{ opacity: [0.4, 1, 0.4] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
        >
          INITIALIZING SIMULATION CORE // REALTIME TELEMETRY MATRIX
        </motion.p>
      </motion.div>

      {/* Engineered Track & Vehicle Runner */}
      <div className="w-full max-w-3xl px-6 mt-12">
        <div className="relative h-14 bg-[#0d0d0d] border-y border-[#3c3c3c] flex items-center overflow-hidden">
          {/* Dashed Lane Divider */}
          <div className="absolute left-0 right-0 h-px bg-[repeating-linear-gradient(90deg,transparent,transparent_16px,rgba(255,255,255,0.25)_16px,rgba(255,255,255,0.25)_48px)]" />

          {/* Precision Machined Vehicle Silhouette */}
          <motion.div
            className="absolute left-[-80px] h-6 w-16 bg-[#1a1a1a] border border-white flex items-center justify-end px-1"
            initial={{ x: "-10vw" }}
            animate={{ x: "65vw" }}
            transition={{
              duration: 2.2,
              ease: "linear",
              repeat: Infinity,
            }}
          >
            {/* White Xenon Headlight Beam */}
            <div className="w-1 h-3 bg-white shadow-[0_0_8px_#ffffff]" />
          </motion.div>
        </div>

        <div className="flex justify-between items-center mt-3 text-[10px] uppercase font-bold tracking-[1.5px] text-[#7e7e7e]">
          <span>STATUS: ALL SENSORS CALIBRATED</span>
          <span>PLATFORM: ACTIVE</span>
        </div>
      </div>
    </motion.div>
  );
}
