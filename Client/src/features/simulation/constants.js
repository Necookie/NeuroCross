export const DEFAULT_PARAMS = {
  arrival_rate_ns: 0.8,
  arrival_rate_ew: 0.4,
  mode: 'smart',
  weather: 'sunny',
  intersectionType: 'cross',
  theme: 'light'
};

export const createDefaultData = (intersectionType = 'cross') => {
  const count = (intersectionType === 'roundabout' || intersectionType === 'tintersection') ? 1 : 2;

  return {
    intersections: Array.from({ length: count }, () => ({
      roads: { north: [[], []], south: [[], []], east: [[], []], west: [[], []] },
      light_state: 'N_GREEN'
    })),
    metrics: { accidents: 0, avg_speed: 0, throughput: 0 }
  };
};
