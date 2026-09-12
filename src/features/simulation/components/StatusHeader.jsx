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
    <header className="sticky top-0 z-50 bg-[#000000] border-b border-[#262626]">
      {/* Signature 4px Tricolor Brand Stripe */}
      <MStripeDivider />

      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Left: Brand Wordmark & Engineering Badge */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="flex items-center gap-2">
            <span className="text-xl sm:text-2xl font-black uppercase tracking-tight text-white m-0">
              NEUROCROSS
            </span>
            <span className="hidden sm:inline-block text-[9px] font-bold uppercase tracking-[1.5px] px-1.5 py-0.5 bg-[#1a1a1a] text-[#bbbbbb] border border-[#3c3c3c]">
              M SIM LAB
            </span>
          </div>
        </div>

        {/* Center: Category Tabs for Layout Switcher (design.md category-tab) */}
        <nav className="hidden md:flex items-center gap-6" aria-label="Intersection Layouts">
          {LAYOUT_TABS.map((tab) => {
            const isActive = (intersectionType || 'cross') === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => onSelectLayout?.(tab.id)}
                className={`relative py-5 text-xs font-bold uppercase tracking-[1.5px] transition-colors duration-150 ${
                  isActive ? 'text-white' : 'text-[#7e7e7e] hover:text-[#bbbbbb]'
                }`}
              >
                {tab.label}
                {isActive && (
                  <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-white" />
                )}
              </button>
            );
          })}
        </nav>

        {/* Right: Live Telemetry Status Chips */}
        <div className="flex items-center gap-2 shrink-0">
          {/* Weather Tag */}
          <div className="hidden lg:flex items-center bg-[#0d0d0d] border border-[#3c3c3c] px-2.5 py-1 text-[10px] font-bold uppercase tracking-[1.5px] text-[#bbbbbb]">
            <span className="text-[#7e7e7e] mr-1.5">ATMOSPHERE:</span>
            {weather === 'rain' ? 'WET (0.6μ)' : weather === 'night' ? 'NIGHT' : 'DRY (1.0μ)'}
          </div>

          {/* Mode Tag */}
          <div className="hidden sm:flex items-center bg-[#0d0d0d] border border-[#3c3c3c] px-2.5 py-1 text-[10px] font-bold uppercase tracking-[1.5px] text-[#bbbbbb]">
            <span className="text-[#7e7e7e] mr-1.5">TIMING:</span>
            {mode === 'smart' ? 'ADAPTIVE AI' : 'FIXED'}
          </div>

          {/* Running Status Badge */}
          <div
            className={`border px-3 py-1 text-[11px] font-bold uppercase tracking-[1.5px] flex items-center gap-2 ${
              running
                ? 'bg-[#0d0d0d] border-white/40 text-white'
                : 'bg-[#0d0d0d] border-[#3c3c3c] text-[#7e7e7e]'
            }`}
          >
            <span
              className={`inline-block w-2 h-2 rounded-full ${
                running ? 'bg-[#0fa336] shadow-[0_0_8px_#0fa336]' : 'bg-[#e22718]'
              }`}
            />
            <span>{running ? 'RUNNING' : 'PAUSED'}</span>
          </div>

          {/* Quick Reset */}
          {onReset && (
            <button
              onClick={onReset}
              title="Reset Network"
              className="h-7 px-2.5 flex items-center gap-1.5 bg-[#0d0d0d] text-[#bbbbbb] border border-[#3c3c3c] hover:border-white hover:text-white text-[10px] font-bold uppercase tracking-[1px] transition-colors"
            >
              <RotateCcw size={12} />
              <span className="hidden xl:inline">RESET</span>
            </button>
          )}
        </div>
      </div>

      {/* Mobile Layout Switcher Bar */}
      <div className="md:hidden flex border-t border-[#262626] px-4 overflow-x-auto">
        {LAYOUT_TABS.map((tab) => {
          const isActive = (intersectionType || 'cross') === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onSelectLayout?.(tab.id)}
              className={`relative py-3 px-3 text-[10px] font-bold uppercase tracking-[1.5px] whitespace-nowrap transition-colors duration-150 ${
                isActive ? 'text-white' : 'text-[#7e7e7e]'
              }`}
            >
              {tab.label}
              {isActive && (
                <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-white" />
              )}
            </button>
          );
        })}
      </div>
    </header>
  );
};

export default memo(StatusHeader);

