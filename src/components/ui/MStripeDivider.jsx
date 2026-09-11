import React, { memo } from 'react';

/**
 * M-Stripe Divider Component
 * Signature 4px tricolor stripe: M Blue Light (#0066b1) -> M Blue Dark (#1c69d4) -> M Red (#e22718)
 * Used sparingly for brand identity moments, header dividers, and telemetry chrome.
 */
const MStripeDivider = ({ className = '' }) => (
  <div className={`h-1 w-full flex overflow-hidden shrink-0 ${className}`} aria-hidden="true">
    <div className="flex-1 bg-[#0066b1]" />
    <div className="flex-1 bg-[#1c69d4]" />
    <div className="flex-1 bg-[#e22718]" />
  </div>
);

export default memo(MStripeDivider);
