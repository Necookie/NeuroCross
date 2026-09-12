import React, { memo } from 'react';
import { RotateCcw } from 'lucide-react';
import MStripeDivider from '../../../components/ui/MStripeDivider';

const LAYOUT_TABS = [
  { id: 'cross', label: '4-WAY CORRIDOR' },
  { id: 'roundabout', label: 'ROUNDABOUT RING' },
  { id: 'tintersection', label: 'T-JUNCTION' },
];

const StatusHeader = ({
  mode,
  running,
  intersectionType = 'cross',
  weather = 'sunny',
  onSelectLayout,
  onReset,
}) => {
  return (
    <header className="sticky top-0 z-50 bg-[#ffffff]/95 backdrop-blur-md border-b border-[#d1ded5]">
      {/* Signature 4px Eco Botanical Brand Stripe */}
      <MStripeDivider />

      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Left: Brand Wordmark & Engineering Badge */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="flex items-center gap-2">
            <span className="text-xl sm:text-2xl font-black uppercase tracking-tight text-[#0f3d28] m-0">
              NEUROCROSS
            </span>
            <span className="hidden sm:inline-block text-[9px] font-bold uppercase tracking-[1.5px] px-2 py-0.5 bg-[#ebf2ec] text-[#0f3d28] border border-[#d1ded5]">
              ECO SIM LAB
            </span>
          </div>
        </div>

        {/* Center: Category Tabs for Layout Switcher */}
        <nav className="hidden md:flex items-center gap-6" aria-label="Intersection Layouts">
          {LAYOUT_TABS.map((tab) => {
            const isActive = (intersectionType || 'cross') === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => onSelectLayout?.(tab.id)}
                className={`relative py-5 text-xs font-bold uppercase tracking-[1.5px] transition-colors duration-150 ${
                  isActive ? 'text-[#0f3d28]' : 'text-[#5d7567] hover:text-[#0f3d28]'
                }`}
              >
                {tab.label}
                {isActive && (
                  <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#0f3d28]" />
                )}
              </button>
            );
          })}
        </nav>

        {/* Right: Live Telemetry Status Chips */}
        <div className="flex items-center gap-2 shrink-0">
          {/* Weather Tag */}
          <div className="hidden lg:flex items-center bg-[#ffffff] border border-[#d1ded5] px-2.5 py-1 text-[10px] font-bold uppercase tracking-[1.5px] text-[#283e32] shadow-sm">
            <span className="text-[#5d7567] mr-1.5">ATMOSPHERE:</span>
            {weather === 'rain' ? 'WET (0.6μ)' : weather === 'night' ? 'NIGHT' : 'SUNNY (1.0μ)'}
          </div>

          {/* Mode Tag */}
          <div className="hidden sm:flex items-center bg-[#ffffff] border border-[#d1ded5] px-2.5 py-1 text-[10px] font-bold uppercase tracking-[1.5px] text-[#283e32] shadow-sm">
            <span className="text-[#5d7567] mr-1.5">TIMING:</span>
            {mode === 'smart' ? 'ADAPTIVE AI' : 'FIXED'}
          </div>

          {/* Running Status Badge */}
          <div
            className={`border px-3 py-1 text-[11px] font-bold uppercase tracking-[1.5px] flex items-center gap-2 shadow-sm ${
              running
                ? 'bg-[#ffffff] border-[#d1ded5] text-[#0f3d28]'
                : 'bg-[#ffffff] border-[#d1ded5] text-[#5d7567]'
            }`}
          >
            <span
              className={`inline-block w-2 h-2 rounded-full ${
                running ? 'bg-[#16a34a] shadow-[0_0_8px_#16a34a]' : 'bg-[#dc2626]'
              }`}
            />
            <span>{running ? 'RUNNING' : 'PAUSED'}</span>
          </div>

          {/* Quick Reset */}
          {onReset && (
            <button
              onClick={onReset}
              title="Reset Network"
              className="h-7 px-2.5 flex items-center gap-1.5 bg-[#ffffff] text-[#283e32] border border-[#d1ded5] hover:border-[#0f3d28] hover:text-[#0f3d28] text-[10px] font-bold uppercase tracking-[1px] transition-colors shadow-sm"
            >
              <RotateCcw size={12} />
              <span className="hidden xl:inline">RESET</span>
            </button>
          )}
        </div>
      </div>

      {/* Mobile Layout Switcher Bar */}
      <div className="md:hidden flex border-t border-[#d1ded5] px-4 overflow-x-auto bg-[#ffffff]">
        {LAYOUT_TABS.map((tab) => {
          const isActive = (intersectionType || 'cross') === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onSelectLayout?.(tab.id)}
              className={`relative py-3 px-3 text-[10px] font-bold uppercase tracking-[1.5px] whitespace-nowrap transition-colors duration-150 ${
                isActive ? 'text-[#0f3d28]' : 'text-[#5d7567]'
              }`}
            >
              {tab.label}
              {isActive && (
                <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#0f3d28]" />
              )}
            </button>
          );
        })}
      </div>
    </header>
  );
};

export default memo(StatusHeader);
