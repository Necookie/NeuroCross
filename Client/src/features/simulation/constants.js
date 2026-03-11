export const INTERSECTION_COUNT = 2;

export const DEFAULT_PARAMS = {
  arrival_rate_ns: 0.8,
  arrival_rate_ew: 0.4,
  mode: 'smart',
  weather: 'sunny',
  theme: 'light'
};

const createSingleDefaultData = () => ({
  roads: { north: [[], [], []], south: [[], [], []], east: [[], [], []], west: [[], [], []] },
  light_state: 'N_GREEN',
  metrics: { accidents: 0, avg_speed: 0, throughput: 0 }
});

export const createDefaultData = () =>
  Array.from({ length: INTERSECTION_COUNT }, createSingleDefaultData);
