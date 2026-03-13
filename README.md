# NeuroCross

NeuroCross is a browser-based traffic simulation sandbox built with React and Vite. It runs a custom vehicle and signal simulation locally in the client and renders an interactive control desk for exploring traffic flow under different layouts, timing modes, and environmental conditions.

## Current Features

- Three simulation layouts:
  - `cross`: a dual-intersection corridor rendered side by side
  - `roundabout`: a single roundabout layout
  - `tintersection`: a single T-junction layout
- Two signal timing modes:
  - `smart`: advances phases with clearance checks
  - `fixed`: uses fixed timing windows
- Weather switching:
  - `sunny`
  - `rain`, which lowers friction and reduces spawn rates
- Live flow controls for north/south and east/west arrival rates
- Adjustable simulation speed from `0.5x` to `3.0x`
- Theme switching for `dark`, `light`, `coffee`, and `candy`
- Live metrics for throughput, average speed, and incidents
- In-browser simulation loop with no backend dependency for core behavior

## How It Works

The app keeps simulation state in `useSimulation`, selects an engine based on the chosen layout, advances that engine on a timed loop, and renders the returned snapshot.

```text
Controls -> useSimulation -> layout-specific engine -> state snapshot -> RoadLayer + metrics UI
```

Current engines:

- `DualIntersectionSim` for the corridor-style cross layout
- `RoundaboutSim` for the roundabout layout
- `TIntersectionSim` for the T-junction layout

Each engine tracks:

- Per-road vehicle queues
- Light state and phase timing
- Throughput and average speed metrics
- Weather-adjusted motion behavior

## UI Surface

The control desk currently includes:

- Weather toggle
- Timing mode toggle
- Color theme selector
- Intersection type selector
- Flow input sliders for north/south and east/west traffic
- Simulation speed slider
- Start / pause control
- Reset control
- Metric cards for throughput, average speed, and incidents
- Header status pills showing current layout, mode, and running state

## Tech Stack

- React 19
- Vite 7
- Tailwind CSS
- Framer Motion
- Lucide React
- Custom simulation engine in `Client/src/features/simulation/engine`

## Project Structure

- `Client/` - application source
- `Client/src/App.jsx` - app shell and layout wiring
- `Client/src/features/simulation/hooks/useSimulation.js` - simulation lifecycle and tick loop
- `Client/src/features/simulation/components/` - controls, road rendering, traffic lights, vehicles, and effects
- `Client/src/features/simulation/engine/` - layout-specific simulation engines and vehicle behavior
- `Documentation/` - project documentation assets

## Local Development

Requirements:

- Node.js
- npm

Run locally:

```powershell
cd Client
npm install
npm run dev
```

Default Vite dev server: `http://localhost:5173`

Build for production:

```powershell
cd Client
npm run build
```

Preview the production build:

```powershell
cd Client
npm run preview
```

## Metrics

- `throughput`: vehicles that successfully leave the simulated road network
- `avg_speed`: average speed of active vehicles in the current tick
- `accidents`: exposed in the UI, but still effectively a placeholder metric in the current engines

## Current Limitations

- Incident tracking is not meaningfully implemented yet
- There is no persistence for scenarios, runs, or metrics
- There are no automated test scripts defined in `Client/package.json` yet

