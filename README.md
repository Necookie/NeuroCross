# NeuroCross

Realtime traffic intersection simulation with a React + Vite control desk UI and a fully in-browser physics engine.

**What It Does**
- Simulates a four-way, two-lane intersection with adaptive traffic light phases and vehicle dynamics.
- Runs the full simulation loop in the browser (no backend required).
- Renders vehicle motion, lane geometry, signal states, and weather effects in a glassy UI.

**Tech Stack**
- **Frontend**: React 19, Vite 7, Tailwind CSS, Framer Motion, Lucide icons
- **Simulation**: Custom JS engine (`Client/src/features/simulation/engine`)
- **Styling**: Tailwind + CSS variables (`Client/src/index.css`)

**Architecture**
- The UI owns the sim loop via `useSimulation`.
- Each tick advances an `IntersectionSim` instance and renders its JSON snapshot.

```
UI Controls -> useSimulation -> IntersectionSim.step(params) -> Render snapshot
```

**Simulation Model Highlights**
- **Vehicle dynamics** use an IDM-style model with acceleration, deceleration, and safe headway.
- **Traffic signals** run an N/S/E/W state machine with all-red clearance and smart vs fixed timing.
- **Weather** affects friction (rain lowers traction) and reduces spawn rates by 20%.
- **Routes** include straight, left, and right turns with Bezier-curve geometry.

**System Requirements**
- Node.js + npm
- A modern browser with good Canvas/CSS support

**Running Locally**
1. Install and run the client
```powershell
cd Client
npm install
npm run dev
```
Vite dev server runs on `http://localhost:5173` by default.

**Build and Preview**
- `npm run build` generates a production build in `Client/dist`.
- `npm run preview` serves the build locally.

**Controls**
- **Weather**: `sunny` or `rain`
- **Mode**: `smart` or `fixed` (smart waits for a clear intersection before switching)
- **Arrival Rates**: sliders for north/south and east/west spawns
- **Simulation Speed**: scales tick rate and animation speed
- **Theme**: `light`, `dark`, `coffee`, `candy`
- **Run / Reset**: start, pause, and reset the sim loop

**Simulation Loop**
- Tick interval: `tickMs = max(16, 100 / simSpeed)` (capped at ~60 FPS)
- `dt = 0.1` seconds per physics step

**Traffic Signal Phases**
- `N_GREEN` -> `N_YELLOW` -> `N_ALL_RED` -> `S_GREEN` -> `S_YELLOW` -> `S_ALL_RED` -> `E_GREEN` -> `E_YELLOW` -> `E_ALL_RED` -> `W_GREEN` -> `W_YELLOW` -> `W_ALL_RED`
- Smart mode advances out of all-red when the intersection clears or after a timeout.

**Metrics**
- `throughput`: count of vehicles that exit the road length
- `avg_speed`: average speed across active vehicles in a tick
- `accidents`: currently static (placeholder)

**Project Structure**
- `Client/src/App.jsx` — UI layout, theme application
- `Client/src/features/simulation/hooks/useSimulation.js` — sim loop + state
- `Client/src/features/simulation/engine/IntersectionSim.js` — core sim
- `Client/src/features/simulation/engine/VehicleAgent.js` — vehicle dynamics
- `Client/src/features/simulation/components` — rendering primitives
- `Client/src/index.css` — palettes + utility styles

**Key Constants**
- `ROAD_LENGTH = 400`, `STOP_LINE = 100`, `INTERSECTION_EXIT = 280`
- `ACCEL_MAX = 3.0`, `DECEL_COMF = 2.5`, `SAFE_HEADWAY = 2.0`
- Two lanes per direction with left/right turning routes

**Known Limitations**
- `accidents` is not computed yet.
- No persistence layer for metrics or runs.

**PRD Feature Checklist**
- [ ] Provide PRD text so this checklist can be populated with the required feature set.
