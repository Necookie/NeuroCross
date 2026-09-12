import React from 'react';
import { motion } from 'framer-motion';
import MStripeDivider from '../../../components/ui/MStripeDivider';

/**
 * LoadingScreen - Minimalist nature-forward eco splash
 */
const MotionDiv = motion.div;

export default function LoadingScreen() {
  return (
    <MotionDiv
      className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#f4f7f4] overflow-hidden text-[#0f3d28]"
      initial={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 0.35, ease: "easeInOut" } }}
    >
      <div className="text-center space-y-3 max-w-md px-6">
        <h1 className="text-4xl sm:text-5xl font-black uppercase tracking-tight text-[#0f3d28] m-0">
          NEUROCROSS
        </h1>

        <div className="w-24 mx-auto">
          <MStripeDivider />
        </div>

        <p className="text-[#5d7567] text-xs uppercase tracking-[2px] font-bold pt-2">
          Initializing Eco Dynamics Engine...
        </p>
      </div>
    </MotionDiv>
  );
}
