import React, { memo } from 'react';

/**
 * Eco Botanical Tricolor Stripe Divider Component
 * Nature-Forward signature: Deep Forest Pine (#0f3d28) -> Vivid Leaf Green (#16a34a) -> Sprout Lime (#84cc16)
 * Used sparingly for brand identity moments, header dividers, and telemetry chrome.
 */
const MStripeDivider = ({ className = '' }) => (
  <div className={`h-1 w-full flex overflow-hidden shrink-0 ${className}`} aria-hidden="true">
    <div className="flex-1 bg-[#0f3d28]" />
    <div className="flex-1 bg-[#16a34a]" />
    <div className="flex-1 bg-[#84cc16]" />
  </div>
);

export default memo(MStripeDivider);
