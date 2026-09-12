import React from 'react';
import { motion } from 'framer-motion';
import MStripeDivider from '../../../components/ui/MStripeDivider';

/**
 * LoadingScreen - Minimalist brand splash
 */
const MotionDiv = motion.div;

export default function LoadingScreen() {
  return (
    <MotionDiv
      className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#000000] overflow-hidden text-white"
      initial={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 0.35, ease: "easeInOut" } }}
    >
      <div className="text-center space-y-3 max-w-md px-6">
        <h1 className="text-4xl sm:text-5xl font-black uppercase tracking-tight text-white m-0">
          NEUROCROSS
        </h1>

        <div className="w-24 mx-auto">
          <MStripeDivider />
        </div>

        <p className="text-[#666666] text-xs uppercase tracking-[2px] font-bold pt-2">
          Initializing Dynamics Engine...
        </p>
      </div>
    </MotionDiv>
  );
}

