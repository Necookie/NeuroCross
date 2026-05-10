import React from 'react';
import { motion } from 'framer-motion';

export default function LoadingScreen() {
  return (
    <motion.div
      className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-mono-950 overflow-hidden"
      initial={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 1.05, transition: { duration: 0.8, ease: "easeInOut" } }}
    >
      {/* Title */}
      <motion.div 
        className="absolute top-[20%] text-center space-y-4 z-20"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 0.2 }}
      >
        <h1 className="text-5xl md:text-7xl font-black tracking-[0.2em] text-transparent bg-clip-text bg-gradient-to-r from-accent-400 to-primary-500 drop-shadow-[0_0_15px_rgba(56,189,248,0.5)]">
          NEUROCROSS
        </h1>
        <motion.p 
          className="text-mono-400 text-sm md:text-base tracking-widest uppercase font-medium"
          animate={{ opacity: [0.4, 1, 0.4] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        >
          Initializing Simulation Core...
        </motion.p>
      </motion.div>

      {/* Decorative Road and Car */}
      <div className="absolute top-1/2 left-0 right-0 h-40 -translate-y-1/2 flex items-center justify-center">
        {/* Road background */}
        <div className="absolute inset-0 bg-mono-900/80 shadow-[inset_0_20px_50px_rgba(0,0,0,0.8)] border-y border-mono-800" />
        
        {/* Dashed line */}
        <div className="absolute left-0 right-0 h-1.5 bg-[repeating-linear-gradient(90deg,transparent,transparent_20px,rgba(255,255,255,0.2)_20px,rgba(255,255,255,0.2)_60px)]" />
        
        {/* Animated Car */}
        <motion.div
          className="absolute left-[-100px] h-12 w-24 rounded-lg bg-gradient-to-r from-primary-600 to-accent-500 shadow-[0_0_30px_rgba(56,189,248,0.4)] z-10 flex items-center justify-end px-2"
          initial={{ x: "-100vw" }}
          animate={{ x: "120vw" }}
          transition={{
            duration: 2.5,
            ease: "easeInOut",
            repeat: Infinity,
            repeatDelay: 0.8
          }}
        >
          {/* Headlights glow */}
          <div className="absolute right-0 top-1/2 -translate-y-1/2 w-4 h-8 bg-white/20 blur-md rounded-full" />
          <div className="w-1.5 h-4 bg-white rounded-full shadow-[0_0_15px_2px_rgba(255,255,255,0.9)]" />
        </motion.div>
      </div>

      {/* Grid overlay for aesthetic tech vibe */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none" />

      {/* Bottom glowing accents */}
      <div className="absolute bottom-0 left-0 right-0 h-64 bg-gradient-to-t from-primary-900/10 to-transparent pointer-events-none" />
    </motion.div>
  );
}
